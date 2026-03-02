import {
  doc,
  getDoc,
  runTransaction,
  serverTimestamp,
  setDoc,
  collection,
  addDoc,
  query,
  where,
  onSnapshot,
  getDocs,
  documentId,
  updateDoc,
  arrayUnion,
} from "firebase/firestore";

const USER_DEFAULTS = {
  displayName: "",
  email: "",
  photoURL: "",
  username: null,
  streakDays: 0,
  bestStreakDays: 0,
  focusSessionsCompleted: 0,
  focusMinutesCompleted: 0,
  coins: 0,
  earnedTotal: 0,
};

export async function ensureUserProfile(db, user) {
  const userRef = doc(db, "users", user.uid);
  const snap = await getDoc(userRef);
  if (!snap.exists()) {
    await setDoc(userRef, {
      ...USER_DEFAULTS,
      uid: user.uid,
      email: user.email || "",
      displayName: user.displayName || "",
      photoURL: user.photoURL || "",
      createdAt: serverTimestamp(),
      lastSeenAt: serverTimestamp(),
      migratedLocal: false,
    });
  } else {
    await setDoc(
      userRef,
      {
        lastSeenAt: serverTimestamp(),
      },
      { merge: true }
    );
  }
  return userRef;
}

export async function claimUsername(db, uid, rawUsername) {
  const username = rawUsername.trim().toLowerCase();
  if (!/^[a-z0-9_]{3,20}$/.test(username)) {
    throw new Error("Username must be 3-20 chars: a-z, 0-9, _");
  }

  const usernameRef = doc(db, "usernames", username);
  const userRef = doc(db, "users", uid);

  await runTransaction(db, async (tx) => {
    const [usernameSnap, userSnap] = await Promise.all([
      tx.get(usernameRef),
      tx.get(userRef),
    ]);

    if (!userSnap.exists()) throw new Error("User profile missing");
    if (usernameSnap.exists()) throw new Error("Username already taken");

    tx.set(usernameRef, { uid, createdAt: serverTimestamp() });
    tx.update(userRef, { username, updatedAt: serverTimestamp() });
  });
}

export async function sendFriendRequest(db, fromUid, toUid) {
  if (!fromUid || !toUid || fromUid === toUid) return;

  const reqQ = query(
    collection(db, "friendRequests"),
    where("fromUid", "==", fromUid),
    where("toUid", "==", toUid),
    where("status", "==", "pending")
  );
  const existing = await getDocs(reqQ);
  if (!existing.empty) return;

  await addDoc(collection(db, "friendRequests"), {
    fromUid,
    toUid,
    status: "pending",
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
}

export async function updateFriendRequestStatus(db, requestId, status) {
  const ref = doc(db, "friendRequests", requestId);
  await updateDoc(ref, { status, updatedAt: serverTimestamp() });
}

export async function acceptFriendRequest(db, request) {
  await updateFriendRequestStatus(db, request.id, "accepted");

  const aRef = doc(db, "friendships", request.fromUid);
  const bRef = doc(db, "friendships", request.toUid);

  await setDoc(aRef, { friendUids: arrayUnion(request.toUid) }, { merge: true });
  await setDoc(bRef, { friendUids: arrayUnion(request.fromUid) }, { merge: true });
}

export function watchFriendRequests(db, uid, callback) {
  const incomingQ = query(collection(db, "friendRequests"), where("toUid", "==", uid));
  return onSnapshot(incomingQ, (snap) => {
    callback(
      snap.docs.map((d) => ({ id: d.id, ...d.data() }))
    );
  });
}

export function watchFriendships(db, uid, callback) {
  return onSnapshot(doc(db, "friendships", uid), (snap) => {
    const data = snap.data();
    callback(Array.isArray(data?.friendUids) ? data.friendUids : []);
  });
}

export function watchLeaderboardByIds(db, ids, callback) {
  if (!ids.length) {
    callback([]);
    return () => {};
  }
  const limitedIds = ids.slice(0, 10);
  const q = query(collection(db, "users"), where(documentId(), "in", limitedIds));
  return onSnapshot(q, (snap) => {
    const rows = snap.docs
      .map((d) => ({ id: d.id, ...d.data() }))
      .sort((a, b) => (b.streakDays || 0) - (a.streakDays || 0));
    callback(rows);
  });
}

export async function findUserByUsername(db, username) {
  const uname = username.trim().toLowerCase();
  if (!uname) return null;
  const unameRef = doc(db, "usernames", uname);
  const unameSnap = await getDoc(unameRef);
  if (!unameSnap.exists()) return null;
  const { uid } = unameSnap.data();
  const userSnap = await getDoc(doc(db, "users", uid));
  if (!userSnap.exists()) return null;
  return { id: userSnap.id, ...userSnap.data() };
}

export async function findUsersByDisplayPrefix(db, prefix) {
  const p = prefix.trim();
  if (!p) return [];
  const q = query(
    collection(db, "users"),
    where("displayName", ">=", p),
    where("displayName", "<=", `${p}\uf8ff`)
  );
  const snap = await getDocs(q);
  return snap.docs.slice(0, 8).map((d) => ({ id: d.id, ...d.data() }));
}
