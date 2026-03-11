import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db, hasFirebaseConfig } from "../lib/firebase";
import { doc, getDoc, serverTimestamp, updateDoc } from "firebase/firestore";
import {
  claimUniqueUsername,
  createInitialProfile,
  getDailyRef,
  getUsersByIds,
  migrateLocalToCloud,
  watchDailyStats14,
  watchUserProfile,
} from "../lib/firestore";
import {
  continueAsGuest,
  loginWithApple,
  loginWithEmail,
  loginWithGoogle,
  logoutUser,
  signupWithEmail,
} from "../lib/auth";
import {
  acceptFriendRequest,
  declineFriendRequest,
  loadFriendsProfiles,
  searchUsers,
  sendFriendRequest,
  unfriend,
  watchFriendships,
  watchIncomingFriendRequests,
  watchOutgoingFriendRequests,
} from "../lib/social";
import { readCache } from "../lib/storage";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [profileResolved, setProfileResolved] = useState(false);
  const [dailyStats, setDailyStats] = useState([]);
  const [incomingRequests, setIncomingRequests] = useState([]);
  const [outgoingRequests, setOutgoingRequests] = useState([]);
  const [friendUids, setFriendUids] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState("");
  const [authTransitioning, setAuthTransitioning] = useState(false);
  const authTransitioningRef = useRef(false);
  const userUidRef = useRef(null);
  const pendingSignedOutTimerRef = useRef(null);

  useEffect(() => {
    authTransitioningRef.current = authTransitioning;
  }, [authTransitioning]);

  useEffect(() => {
    userUidRef.current = user?.uid || null;
  }, [user]);

  useEffect(() => {
    if (!auth || !db) {
      setLoading(false);
      return undefined;
    }

    const clearPendingSignedOut = () => {
      if (pendingSignedOutTimerRef.current) {
        clearTimeout(pendingSignedOutTimerRef.current);
        pendingSignedOutTimerRef.current = null;
      }
    };

    const finalizeSignedOut = () => {
      setUser(null);
      setProfile(null);
      setProfileResolved(false);
      setDailyStats([]);
      setIncomingRequests([]);
      setOutgoingRequests([]);
      setFriendUids([]);
      setLeaderboard([]);
      setLoading(false);
      setAuthTransitioning(false);
    };

    const unsub = onAuthStateChanged(auth, async (nextUser) => {
      clearPendingSignedOut();
      setAuthError("");
      if (!nextUser) {
        if (authTransitioningRef.current) {
          pendingSignedOutTimerRef.current = setTimeout(finalizeSignedOut, 4000);
          return;
        }
        finalizeSignedOut();
        return;
      }

      if (nextUser.uid === userUidRef.current) {
        setUser(nextUser);
        setLoading(false);
        setAuthTransitioning(false);
        return;
      }

      setUser(nextUser);
      setProfileResolved(false);
      try {
        await createInitialProfile(db, nextUser);
      } catch (err) {
        setAuthError(err?.message || "Failed to initialize profile");
      } finally {
        setLoading(false);
        setAuthTransitioning(false);
      }
    });

    return () => {
      clearPendingSignedOut();
      unsub();
    };
  }, []);

  useEffect(() => {
    if (!db || !user) return undefined;
    const unsub = watchUserProfile(db, user.uid, (nextProfile) => {
      if (!nextProfile) {
        setProfile(null);
        setProfileResolved(false);
        createInitialProfile(db, user)
          .then(() => {
            setLoading(false);
          })
          .catch((err) => {
            setAuthError(err?.message || "Failed to load profile");
            setLoading(false);
          });
        return;
      }
      setProfile(nextProfile);
      setProfileResolved(true);
      setLoading(false);
    });
    return () => unsub();
  }, [user]);

  useEffect(() => {
    if (!db || !user) return undefined;
    const unsub = watchDailyStats14(db, user.uid, setDailyStats);
    return () => unsub();
  }, [user]);

  useEffect(() => {
    if (!db || !user) return undefined;
    const unsubs = [
      watchIncomingFriendRequests(db, user.uid, setIncomingRequests),
      watchOutgoingFriendRequests(db, user.uid, setOutgoingRequests),
      watchFriendships(db, user.uid, setFriendUids),
    ];
    return () => unsubs.forEach((u) => u && u());
  }, [user]);

  useEffect(() => {
    let mounted = true;
    if (!db || !friendUids.length) {
      setLeaderboard([]);
      return undefined;
    }
    loadFriendsProfiles(db, friendUids).then(async (rows) => {
      if (!mounted) return;
      const dayKey = new Date().toISOString().slice(0, 10);
      const withToday = await Promise.all(
        rows.map(async (r) => {
          try {
            const snap = await getDoc(getDailyRef(db, r.id, dayKey));
            return { ...r, todayFocusMinutes: Number(snap.data()?.focusMinutes || 0) };
          } catch {
            return { ...r, todayFocusMinutes: 0 };
          }
        })
      );
      if (mounted) {
        setLeaderboard(withToday.sort((a, b) => (b.streakDays || 0) - (a.streakDays || 0)));
      }
    });
    return () => {
      mounted = false;
    };
  }, [friendUids]);

  useEffect(() => {
    if (!db || !user || !profile) return;
    const local = readCache();
    migrateLocalToCloud({ db, uid: user.uid, localState: local, profile }).catch(() => {});
  }, [user, profile]);

  const wrapAuth = async (fn) => {
    setAuthError("");
    setAuthTransitioning(true);
    setLoading(true);
    try {
      const result = await fn();
      if (result?.user) {
        setUser(result.user);
      }
      return result;
    } catch (err) {
      setAuthError(err?.message || "Auth failed");
      setAuthTransitioning(false);
      setLoading(false);
      throw err;
    }
  };

  const actions = useMemo(
    () => ({
      loginEmail: (email, password) => wrapAuth(() => loginWithEmail(auth, email, password)),
      signupEmail: (email, password) => wrapAuth(() => signupWithEmail(auth, email, password)),
      loginGoogle: () => wrapAuth(() => loginWithGoogle(auth)),
      loginApple: () => wrapAuth(() => loginWithApple(auth)),
      continueGuest: () => wrapAuth(() => continueAsGuest(auth)),
      logout: () => logoutUser(auth),
      claimProfileUsername: (username) => {
        if (!user) throw new Error("Sign in first");
        const cleaned = String(username || "").trim().toLowerCase();
        return claimUniqueUsername(db, user.uid, cleaned).then(() => {
          setProfile((prev) => (prev ? { ...prev, username: cleaned } : prev));
          setProfileResolved(true);
        });
      },
      searchUsers: (term) => {
        if (!user) throw new Error("Sign in first");
        return searchUsers(db, term, user.uid);
      },
      sendRequest: (toUid) => {
        if (!user) throw new Error("Sign in first");
        return sendFriendRequest(db, user.uid, toUid);
      },
      acceptRequest: (request) => acceptFriendRequest(db, request),
      declineRequest: (id) => declineFriendRequest(db, id),
      cancelRequest: (id) => declineFriendRequest(db, id),
      unfriend: (friendUid) => {
        if (!user) throw new Error("Sign in first");
        return unfriend(db, user.uid, friendUid);
      },
      getUsersByIds: (ids) => getUsersByIds(db, ids),
      updateMyProfile: async (patch) => {
        if (!user) throw new Error("Sign in first");
        const safePatch = {};
        if (typeof patch.displayName === "string") safePatch.displayName = patch.displayName.trim();
        if (typeof patch.photoURL === "string") safePatch.photoURL = patch.photoURL.trim();
        if (Object.keys(safePatch).length === 0) return;
        await updateDoc(doc(db, "users", user.uid), {
          ...safePatch,
          updatedAt: serverTimestamp(),
          lastSeenAt: serverTimestamp(),
        });
      },
    }),
    [user]
  );

  const value = {
    hasFirebaseConfig,
    user,
    profile,
    dailyStats,
    incomingRequests,
    outgoingRequests,
    friendUids,
    leaderboard,
    loading,
    authTransitioning,
    profileLoading: Boolean(user) && !profileResolved,
    authError,
    isAuthenticated: Boolean(user),
    needsUsername: Boolean(user && profileResolved && profile && !profile.username),
    actions,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
