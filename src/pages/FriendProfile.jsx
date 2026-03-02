import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import {
  collection,
  doc,
  getDoc,
  limit,
  onSnapshot,
  orderBy,
  query,
} from "firebase/firestore";
import GlassCard from "../components/GlassCard";
import { db } from "../lib/firebase";

function dayLabel(key) {
  return key?.slice(5) || key;
}

export default function FriendProfilePage() {
  const { uid } = useParams();
  const [profile, setProfile] = useState(null);
  const [daily, setDaily] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dailyError, setDailyError] = useState("");

  useEffect(() => {
    let mounted = true;
    if (!db || !uid) return undefined;
    setLoading(true);
    getDoc(doc(db, "users", uid))
      .then((snap) => {
        if (!mounted) return;
        setProfile(snap.exists() ? { id: snap.id, ...snap.data() } : null);
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, [uid]);

  useEffect(() => {
    if (!db || !uid) return undefined;
    const q = query(
      collection(db, "users", uid, "dailyStats"),
      orderBy("__name__", "desc"),
      limit(7)
    );
    const unsub = onSnapshot(
      q,
      (snap) => {
        setDailyError("");
        setDaily(snap.docs.map((d) => ({ id: d.id, ...d.data() })).reverse());
      },
      (err) => {
        setDaily([]);
        setDailyError(err?.message || "Daily stats unavailable");
      }
    );
    return () => unsub();
  }, [uid]);

  const totals = useMemo(() => {
    return daily.reduce(
      (acc, d) => {
        acc.focusMinutes += Number(d.focusMinutes || 0);
        acc.focusSessions += Number(d.focusSessions || 0);
        return acc;
      },
      { focusMinutes: 0, focusSessions: 0 }
    );
  }, [daily]);

  if (loading) {
    return (
      <GlassCard className="p-4">
        <p className="text-sm text-slate-200">Loading profile...</p>
      </GlassCard>
    );
  }

  if (!profile) {
    return (
      <GlassCard className="space-y-3 p-4">
        <p className="text-sm text-rose-200">Profile not found.</p>
        <Link to="/friends" className="text-sm underline">
          Back to friends
        </Link>
      </GlassCard>
    );
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
      <GlassCard className="space-y-2 p-4">
        <h2 className="font-display text-2xl font-semibold">@{profile.username || "user"}</h2>
        <p className="text-sm text-slate-200">{profile.displayName || profile.email || "Friend"}</p>
        <div className="grid gap-2 pt-2 sm:grid-cols-3">
          <div className="rounded-xl border border-white/15 bg-white/5 p-3">
            <p className="text-xs text-slate-300">Current streak</p>
            <p className="text-xl font-semibold">{Number(profile.streakDays || 0)} days</p>
          </div>
          <div className="rounded-xl border border-white/15 bg-white/5 p-3">
            <p className="text-xs text-slate-300">Best streak</p>
            <p className="text-xl font-semibold">{Number(profile.bestStreakDays || 0)} days</p>
          </div>
          <div className="rounded-xl border border-white/15 bg-white/5 p-3">
            <p className="text-xs text-slate-300">Total focus minutes</p>
            <p className="text-xl font-semibold">{Number(profile.focusMinutesCompleted || 0)}</p>
          </div>
        </div>
      </GlassCard>

      <GlassCard className="space-y-3 p-4">
        <h3 className="font-semibold">Last 7 days</h3>
        {dailyError && (
          <p className="text-sm text-slate-300">
            Daily details unavailable (you may need to be friends).
          </p>
        )}
        {!dailyError && daily.length === 0 && (
          <p className="text-sm text-slate-200">No daily stats yet.</p>
        )}
        {!dailyError && daily.length > 0 && (
          <>
            <div className="grid gap-2 sm:grid-cols-7">
              {daily.map((d) => (
                <div key={d.id} className="rounded-xl border border-white/15 bg-white/5 p-2 text-center">
                  <p className="text-[11px] text-slate-300">{dayLabel(d.id)}</p>
                  <p className="text-sm font-semibold">{Number(d.focusMinutes || 0)}m</p>
                </div>
              ))}
            </div>
            <p className="text-xs text-slate-300">
              7-day totals: {totals.focusMinutes} minutes, {totals.focusSessions} sessions
            </p>
          </>
        )}
      </GlassCard>

      <Link to="/friends" className="inline-block text-sm underline">
        Back to friends
      </Link>
    </motion.div>
  );
}

