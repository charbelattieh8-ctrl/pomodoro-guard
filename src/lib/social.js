import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  query,
  runTransaction,
  serverTimestamp,
  updateDoc,
  where,
} from "firebase/firestore";
import { getFriendshipRef, getUserRef, getUsernameRef, getUsersByIds } from "./firestore";

function toMillis(value) {
  if (!value) return 0;
  if (typeof value?.toMillis === "function") return value.toMillis();
  if (typeof value === "number") return value;
  return 0;
}

export const watchIncomingFriendRequests = (db, uid, cb) => {
  const q = query(collection(db, "friendRequests"), where("toUid", "==", uid));
  return onSnapshot(q, (snap) => {
    const rows = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    rows.sort((a, b) => toMillis(b.createdAt) - toMillis(a.createdAt));
    cb(rows);
  });
};

export const watchOutgoingFriendRequests = (db, uid, cb) => {
  const q = query(collection(db, "friendRequests"), where("fromUid", "==", uid));
  return onSnapshot(q, (snap) => {
    const rows = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    rows.sort((a, b) => toMillis(b.createdAt) - toMillis(a.createdAt));
    cb(rows);
  });
};

export const watchFriendships = (db, uid, cb) =>
  onSnapshot(getFriendshipRef(db, uid), (snap) => {
    const data = snap.data();
    cb(Array.isArray(data?.friendUids) ? data.friendUids : []);
  });

export async function sendFriendRequest(db, fromUid, toUid) {
  if (!fromUid || !toUid || fromUid === toUid) return;
  const fromFriends = await getDoc(getFriendshipRef(db, fromUid));
  const friendUids = Array.isArray(fromFriends.data()?.friendUids) ? fromFriends.data().friendUids : [];
  if (friendUids.includes(toUid)) {
    throw new Error("You are already friends");
  }

  const q = query(
    collection(db, "friendRequests"),
    where("fromUid", "==", fromUid),
    where("toUid", "==", toUid),
    where("status", "==", "pending")
  );
  const existing = await getDocs(q);
  if (!existing.empty) {
    throw new Error("Request already sent");
  }

  await addDoc(collection(db, "friendRequests"), {
    fromUid,
    toUid,
    status: "pending",
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
}

export async function declineFriendRequest(db, requestId) {
  await updateDoc(doc(db, "friendRequests", requestId), {
    status: "declined",
    updatedAt: serverTimestamp(),
  });
}

export async function acceptFriendRequest(db, request) {
  const reqRef = doc(db, "friendRequests", request.id);
  const aRef = getFriendshipRef(db, request.fromUid);
  const bRef = getFriendshipRef(db, request.toUid);

  await runTransaction(db, async (tx) => {
    const reqSnap = await tx.get(reqRef);
    if (!reqSnap.exists()) return;
    const reqData = reqSnap.data();
    if (reqData.status !== "pending") return;

    const [aSnap, bSnap] = await Promise.all([tx.get(aRef), tx.get(bRef)]);
    const aCurrent = Array.isArray(aSnap.data()?.friendUids) ? aSnap.data().friendUids : [];
    const bCurrent = Array.isArray(bSnap.data()?.friendUids) ? bSnap.data().friendUids : [];

    const aNext = Array.from(new Set([...aCurrent, request.toUid]));
    const bNext = Array.from(new Set([...bCurrent, request.fromUid]));

    tx.update(reqRef, { status: "accepted", updatedAt: serverTimestamp() });
    tx.set(aRef, { friendUids: aNext, updatedAt: serverTimestamp() }, { merge: true });
    tx.set(bRef, { friendUids: bNext, updatedAt: serverTimestamp() }, { merge: true });
  });
}

export async function searchUsers(db, term, currentUid) {
  const txt = term.trim().toLowerCase();
  if (!txt) return [];

  const usernameSnap = await getDoc(getUsernameRef(db, txt));
  if (usernameSnap.exists()) {
    const { uid } = usernameSnap.data();
    if (uid !== currentUid) {
      const us = await getDoc(getUserRef(db, uid));
      if (us.exists()) return [{ id: us.id, ...us.data() }];
    }
  }

  const q = query(
    collection(db, "users"),
    where("displayName", ">=", term),
    where("displayName", "<=", `${term}\uf8ff`),
    orderBy("displayName")
  );
  const snap = await getDocs(q);
  return snap.docs
    .map((d) => ({ id: d.id, ...d.data() }))
    .filter((u) => u.id !== currentUid)
    .slice(0, 8);
}

export async function loadFriendsProfiles(db, friendUids) {
  return getUsersByIds(db, friendUids);
}
