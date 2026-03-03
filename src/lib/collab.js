import {
  addDoc,
  arrayRemove,
  arrayUnion,
  collection,
  doc,
  getDocs,
  limit,
  onSnapshot,
  query,
  runTransaction,
  serverTimestamp,
  deleteDoc,
  updateDoc,
  where,
  increment,
} from "firebase/firestore";

function toMillis(value) {
  if (!value) return 0;
  if (typeof value?.toMillis === "function") return value.toMillis();
  if (typeof value === "number") return value;
  return 0;
}

export function watchMyRooms(db, uid, cb) {
  const q = query(collection(db, "focusRooms"), where("participantUids", "array-contains", uid));
  return onSnapshot(q, (snap) => {
    const rows = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    rows.sort((a, b) => toMillis(b.updatedAt) - toMillis(a.updatedAt));
    cb(rows);
  });
}

export function watchRoom(db, roomId, cb, onError) {
  return onSnapshot(doc(db, "focusRooms", roomId), (snap) => {
    cb(snap.exists() ? { id: snap.id, ...snap.data() } : null);
  }, onError);
}

export async function createFocusRoom(db, { ownerUid, name, durationMinutes, invitedUid }) {
  const participants = invitedUid ? [ownerUid, invitedUid] : [ownerUid];
  const room = {
    ownerUid,
    name: name?.trim() || "Focus Room",
    status: "idle",
    mode: "focus",
    durationMinutes: Number(durationMinutes || 25),
    remainingMs: Number(durationMinutes || 25) * 60 * 1000,
    startedAt: null,
    endsAt: null,
    participantUids: participants,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };
  const ref = await addDoc(collection(db, "focusRooms"), room);
  return ref.id;
}

export async function joinRoom(db, roomId, uid) {
  await updateDoc(doc(db, "focusRooms", roomId), {
    participantUids: arrayUnion(uid),
    updatedAt: serverTimestamp(),
  });
}

export async function leaveRoom(db, roomId, uid) {
  await updateDoc(doc(db, "focusRooms", roomId), {
    participantUids: arrayRemove(uid),
    updatedAt: serverTimestamp(),
  });
}

export async function startRoom(db, roomId) {
  const ref = doc(db, "focusRooms", roomId);
  await runTransaction(db, async (tx) => {
    const snap = await tx.get(ref);
    if (!snap.exists()) return;
    const room = snap.data();
    const durationMs =
      room.status === "paused" && room.remainingMs
        ? Number(room.remainingMs)
        : Number(room.durationMinutes || 25) * 60 * 1000;
    const now = Date.now();
    tx.update(ref, {
      status: "running",
      startedAt: room.startedAt || now,
      endsAt: now + durationMs,
      remainingMs: durationMs,
      updatedAt: serverTimestamp(),
    });
  });
}

export async function pauseRoom(db, roomId) {
  const ref = doc(db, "focusRooms", roomId);
  await runTransaction(db, async (tx) => {
    const snap = await tx.get(ref);
    if (!snap.exists()) return;
    const room = snap.data();
    if (room.status !== "running") return;
    const endsAt = Number(room.endsAt || 0);
    const remainingMs = Math.max(0, endsAt - Date.now());
    tx.update(ref, {
      status: "paused",
      endsAt: null,
      remainingMs,
      updatedAt: serverTimestamp(),
    });
  });
}

export async function resetRoom(db, roomId) {
  const ref = doc(db, "focusRooms", roomId);
  await runTransaction(db, async (tx) => {
    const snap = await tx.get(ref);
    if (!snap.exists()) return;
    const room = snap.data();
    const durationMs = Number(room.durationMinutes || 25) * 60 * 1000;
    tx.update(ref, {
      status: "idle",
      startedAt: null,
      endsAt: null,
      remainingMs: durationMs,
      updatedAt: serverTimestamp(),
    });
  });
}

export function watchIncomingChallenges(db, uid, cb) {
  const q = query(collection(db, "friendChallenges"), where("targetUid", "==", uid));
  return onSnapshot(q, (snap) => {
    const rows = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    rows.sort((a, b) => toMillis(b.createdAt) - toMillis(a.createdAt));
    cb(rows);
  });
}

export function watchOutgoingChallenges(db, uid, cb) {
  const q = query(collection(db, "friendChallenges"), where("creatorUid", "==", uid));
  return onSnapshot(q, (snap) => {
    const rows = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    rows.sort((a, b) => toMillis(b.createdAt) - toMillis(a.createdAt));
    cb(rows);
  });
}

export async function createChallenge(db, { creatorUid, targetUid, title, targetMinutes, deadlineAt, rewardCoins }) {
  const safeTarget = Math.max(10, Number(targetMinutes || 60));
  const computedReward = Math.min(300, Math.max(20, Math.round(safeTarget * 2)));
  await addDoc(collection(db, "friendChallenges"), {
    creatorUid,
    targetUid,
    title: title?.trim() || "Daily Focus Challenge",
    targetMinutes: safeTarget,
    rewardCoins: computedReward,
    deadlineAt: Number(deadlineAt || 0),
    status: "pending",
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
}

export async function updateChallengeStatus(db, challengeId, status) {
  await updateDoc(doc(db, "friendChallenges", challengeId), {
    status,
    updatedAt: serverTimestamp(),
  });
}

export async function completeChallenge(db, challengeId, actorUid) {
  const challengeRef = doc(db, "friendChallenges", challengeId);
  const userRef = doc(db, "users", actorUid);

  await runTransaction(db, async (tx) => {
    const snap = await tx.get(challengeRef);
    if (!snap.exists()) return;
    const challenge = snap.data();
    if (challenge.status !== "accepted") return;
    if (challenge.targetUid !== actorUid) throw new Error("Only challenge target can complete");

    const reward = Math.max(0, Number(challenge.rewardCoins || 0));
    tx.update(challengeRef, { status: "completed", updatedAt: serverTimestamp() });
    if (reward > 0) {
      tx.set(
        userRef,
        {
          coins: increment(reward),
          earnedTotal: increment(reward),
          updatedAt: serverTimestamp(),
        },
        { merge: true }
      );
    }
  });
}

export async function deleteRoom(db, roomId) {
  await deleteDoc(doc(db, "focusRooms", roomId));
}

export async function deleteChallenge(db, challengeId) {
  await deleteDoc(doc(db, "friendChallenges", challengeId));
}

export async function loadRecentChallengesForPair(db, aUid, bUid) {
  const q = query(
    collection(db, "friendChallenges"),
    where("creatorUid", "==", aUid),
    where("targetUid", "==", bUid),
    limit(10)
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}
