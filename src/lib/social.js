import {
  addDoc,
  arrayUnion,
  collection,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  where,
  writeBatch,
} from "firebase/firestore";
import { getFriendshipRef, getUserRef, getUsernameRef, getUsersByIds } from "./firestore";

export const watchIncomingFriendRequests = (db, uid, cb) => {
  const q = query(collection(db, "friendRequests"), where("toUid", "==", uid), orderBy("createdAt", "desc"));
  return onSnapshot(q, (snap) => cb(snap.docs.map((d) => ({ id: d.id, ...d.data() }))));
};

export const watchOutgoingFriendRequests = (db, uid, cb) => {
  const q = query(collection(db, "friendRequests"), where("fromUid", "==", uid), orderBy("createdAt", "desc"));
  return onSnapshot(q, (snap) => cb(snap.docs.map((d) => ({ id: d.id, ...d.data() }))));
};

export const watchFriendships = (db, uid, cb) =>
  onSnapshot(getFriendshipRef(db, uid), (snap) => {
    const data = snap.data();
    cb(Array.isArray(data?.friendUids) ? data.friendUids : []);
  });

export async function sendFriendRequest(db, fromUid, toUid) {
  if (!fromUid || !toUid || fromUid === toUid) return;
  const q = query(
    collection(db, "friendRequests"),
    where("fromUid", "==", fromUid),
    where("toUid", "==", toUid),
    where("status", "==", "pending")
  );
  const existing = await getDocs(q);
  if (!existing.empty) return;

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

  const batch = writeBatch(db);
  batch.update(reqRef, { status: "accepted", updatedAt: serverTimestamp() });
  batch.set(aRef, { friendUids: arrayUnion(request.toUid), updatedAt: serverTimestamp() }, { merge: true });
  batch.set(bRef, { friendUids: arrayUnion(request.fromUid), updatedAt: serverTimestamp() }, { merge: true });
  await batch.commit();
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
