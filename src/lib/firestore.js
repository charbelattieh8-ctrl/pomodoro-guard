import {
  collection,
  doc,
  getDoc,
  query,
  where,
  orderBy,
  limit,
  runTransaction,
  setDoc,
  serverTimestamp,
  updateDoc,
  increment,
  writeBatch,
  getDocs,
  documentId,
  onSnapshot,
} from "firebase/firestore";

export const usersRef = () => collection;

export const getUserRef = (db, uid) => doc(db, "users", uid);
export const getFriendshipRef = (db, uid) => doc(db, "friendships", uid);
export const getUsernameRef = (db, username) => doc(db, "usernames", username);
export const getSessionRef = (db, uid, sessionId) => doc(db, "users", uid, "sessions", sessionId);
export const getDailyRef = (db, uid, dayKey) => doc(db, "users", uid, "dailyStats", dayKey);

export const getIncomingRequestsQuery = (db, uid) =>
  query(collection(db, "friendRequests"), where("toUid", "==", uid), orderBy("createdAt", "desc"));

export const getOutgoingRequestsQuery = (db, uid) =>
  query(collection(db, "friendRequests"), where("fromUid", "==", uid), orderBy("createdAt", "desc"));

export const getDailyRangeQuery = (db, uid) =>
  query(collection(db, "users", uid, "dailyStats"), orderBy(documentId(), "desc"), limit(14));

export const createInitialProfile = async (db, user) => {
  const ref = getUserRef(db, user.uid);
  const snap = await getDoc(ref);
  if (!snap.exists()) {
    await setDoc(ref, {
      uid: user.uid,
      displayName: user.displayName || "",
      username: null,
      photoURL: user.photoURL || "",
      email: user.email || "",
      createdAt: serverTimestamp(),
      lastSeenAt: serverTimestamp(),
      streakDays: 0,
      bestStreakDays: 0,
      focusSessionsCompleted: 0,
      focusMinutesCompleted: 0,
      coins: 0,
      earnedTotal: 0,
      lastFocusCompletionDate: null,
      migratedLocal: false,
    });
  } else {
    await updateDoc(ref, { lastSeenAt: serverTimestamp() });
  }
  return ref;
};

export const claimUniqueUsername = async (db, uid, usernameRaw) => {
  const username = usernameRaw.trim().toLowerCase();
  if (!/^[a-z0-9_]{3,20}$/.test(username)) {
    throw new Error("Username must be 3-20 chars, using a-z 0-9 _");
  }
  const usernameRef = getUsernameRef(db, username);
  const userRef = getUserRef(db, uid);

  await runTransaction(db, async (tx) => {
    const [uSnap, meSnap] = await Promise.all([tx.get(usernameRef), tx.get(userRef)]);
    if (!meSnap.exists()) throw new Error("Profile missing");
    if (uSnap.exists()) throw new Error("Username is already taken");

    tx.set(usernameRef, { uid, createdAt: serverTimestamp() });
    tx.update(userRef, { username, updatedAt: serverTimestamp() });
  });
};

export const completeFocusToCloud = async ({
  db,
  uid,
  session,
  coinsAwarded,
  streakDays,
  bestStreakDays,
  lastFocusCompletionDate,
}) => {
  const userRef = getUserRef(db, uid);
  const sessionRef = getSessionRef(db, uid, session.id);
  const dayKey = new Date(session.endedAt).toISOString().slice(0, 10);
  const dailyRef = getDailyRef(db, uid, dayKey);

  await runTransaction(db, async (tx) => {
    const sessionSnap = await tx.get(sessionRef);
    if (!sessionSnap.exists()) {
      tx.set(sessionRef, {
        ...session,
        completed: true,
      });
      tx.set(
        userRef,
        {
          focusSessionsCompleted: increment(1),
          focusMinutesCompleted: increment(Number(session.actualMinutes || session.plannedMinutes || 0)),
          coins: increment(Number(coinsAwarded || 0)),
          earnedTotal: increment(Number(coinsAwarded || 0)),
          streakDays: Number(streakDays || 0),
          bestStreakDays: Number(bestStreakDays || 0),
          lastFocusCompletionDate,
          lastSeenAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        },
        { merge: true }
      );
      tx.set(
        dailyRef,
        {
          focusMinutes: increment(Number(session.actualMinutes || session.plannedMinutes || 0)),
          focusSessions: increment(1),
          coinsEarned: increment(Number(coinsAwarded || 0)),
          updatedAt: serverTimestamp(),
        },
        { merge: true }
      );
    }
  });
};

export const migrateLocalToCloud = async ({ db, uid, localState, profile }) => {
  const meaningfulCloud =
    Number(profile?.focusSessionsCompleted || 0) > 0 ||
    Number(profile?.focusMinutesCompleted || 0) > 0 ||
    Number(profile?.coins || 0) > 0 ||
    Number(profile?.earnedTotal || 0) > 0;

  if (meaningfulCloud || profile?.migratedLocal) {
    await setDoc(getUserRef(db, uid), { migratedLocal: true, updatedAt: serverTimestamp() }, { merge: true });
    return;
  }

  const batch = writeBatch(db);
  const userRef = getUserRef(db, uid);
  const p = localState.milestones.progress;

  batch.set(
    userRef,
    {
      streakDays: Number(p.streakDays || 0),
      bestStreakDays: Number(p.bestStreakDays || 0),
      focusSessionsCompleted: Number(p.focusSessionsCompleted || 0),
      focusMinutesCompleted: Number(p.focusMinutesCompleted || 0),
      coins: Number(localState.economy.coins || 0),
      earnedTotal: Number(localState.economy.earnedTotal || 0),
      lastFocusCompletionDate: p.lastFocusCompletionDate || null,
      migratedLocal: true,
      updatedAt: serverTimestamp(),
    },
    { merge: true }
  );

  const history = (localState.sessions.history || []).filter((s) => s.mode === "focus" && s.completed);
  for (const s of history) {
    const ref = getSessionRef(db, uid, s.id);
    batch.set(ref, {
      ...s,
      completed: true,
    });

    const dayKey = new Date(s.endedAt).toISOString().slice(0, 10);
    const dailyRef = getDailyRef(db, uid, dayKey);
    batch.set(
      dailyRef,
      {
        focusMinutes: increment(Number(s.actualMinutes || s.plannedMinutes || 0)),
        focusSessions: increment(1),
        coinsEarned: increment(0),
        updatedAt: serverTimestamp(),
      },
      { merge: true }
    );
  }

  await batch.commit();
};

export const watchUserProfile = (db, uid, cb) => onSnapshot(getUserRef(db, uid), (snap) => cb(snap.exists() ? { id: snap.id, ...snap.data() } : null));
export const watchDailyStats14 = (db, uid, cb) => onSnapshot(getDailyRangeQuery(db, uid), (snap) => cb(snap.docs.map((d) => ({ id: d.id, ...d.data() }))));

export const getUsersByIds = async (db, ids) => {
  if (!ids.length) return [];
  const q = query(collection(db, "users"), where(documentId(), "in", ids.slice(0, 10)));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
};
