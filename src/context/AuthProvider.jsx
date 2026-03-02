import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db, hasFirebaseConfig } from "../lib/firebase";
import {
  claimUniqueUsername,
  createInitialProfile,
  getDailyRef,
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
  watchFriendships,
  watchIncomingFriendRequests,
  watchOutgoingFriendRequests,
} from "../lib/social";
import { readCache } from "../lib/storage";
import { getDoc } from "firebase/firestore";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [dailyStats, setDailyStats] = useState([]);
  const [incomingRequests, setIncomingRequests] = useState([]);
  const [outgoingRequests, setOutgoingRequests] = useState([]);
  const [friendUids, setFriendUids] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState("");

  useEffect(() => {
    if (!auth || !db) {
      setLoading(false);
      return undefined;
    }

    const unsub = onAuthStateChanged(auth, async (nextUser) => {
      setUser(nextUser);
      setAuthError("");
      if (!nextUser) {
        setProfile(null);
        setDailyStats([]);
        setIncomingRequests([]);
        setOutgoingRequests([]);
        setFriendUids([]);
        setLeaderboard([]);
        setLoading(false);
        return;
      }

      await createInitialProfile(db, nextUser);
      setLoading(false);
    });

    return () => unsub();
  }, []);

  useEffect(() => {
    if (!db || !user) return undefined;
    const unsub = watchUserProfile(db, user.uid, setProfile);
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
    try {
      await fn();
    } catch (err) {
      setAuthError(err?.message || "Auth failed");
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
      claimProfileUsername: (username) => claimUniqueUsername(db, user.uid, username),
      searchUsers: (term) => searchUsers(db, term, user.uid),
      sendRequest: (toUid) => sendFriendRequest(db, user.uid, toUid),
      acceptRequest: (request) => acceptFriendRequest(db, request),
      declineRequest: (id) => declineFriendRequest(db, id),
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
    authError,
    isAuthenticated: Boolean(user),
    needsUsername: Boolean(user && profile && !profile.username),
    actions,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
