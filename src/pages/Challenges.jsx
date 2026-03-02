import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import GlassCard from "../components/GlassCard";
import PrimaryButton from "../components/PrimaryButton";
import { useAuth } from "../context/AuthProvider";
import { db } from "../lib/firebase";
import {
  createChallenge,
  updateChallengeStatus,
  watchIncomingChallenges,
  watchOutgoingChallenges,
} from "../lib/collab";

function todayISO() {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export default function ChallengesPage() {
  const { user, friendUids, leaderboard, dailyStats } = useAuth();
  const [incoming, setIncoming] = useState([]);
  const [outgoing, setOutgoing] = useState([]);
  const [targetUid, setTargetUid] = useState("");
  const [targetMinutes, setTargetMinutes] = useState(120);
  const [title, setTitle] = useState("Lock-in duel");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [ok, setOk] = useState("");

  useEffect(() => {
    if (!db || !user) return undefined;
    const unsubs = [
      watchIncomingChallenges(db, user.uid, setIncoming),
      watchOutgoingChallenges(db, user.uid, setOutgoing),
    ];
    return () => unsubs.forEach((u) => u && u());
  }, [user]);

  const friends = useMemo(
    () => leaderboard.filter((f) => friendUids.includes(f.id)),
    [leaderboard, friendUids]
  );
  const todayMinutes = Number(dailyStats.find((d) => d.id === todayISO())?.focusMinutes || 0);

  const run = async (fn, successText = "") => {
    setBusy(true);
    setError("");
    setOk("");
    try {
      await fn();
      if (successText) setOk(successText);
    } catch (err) {
      setError(err?.message || "Action failed");
    } finally {
      setBusy(false);
    }
  };

  const sendChallenge = () =>
    run(
      () =>
        createChallenge(db, {
          creatorUid: user.uid,
          targetUid,
          title,
          targetMinutes: Math.max(10, Number(targetMinutes || 60)),
          deadlineDay: todayISO(),
        }),
      "Challenge sent"
    );

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
      <h2 className="font-display text-2xl font-semibold">Friend Challenges</h2>

      <GlassCard className="space-y-3 p-4">
        <h3 className="font-semibold">Create challenge</h3>
        <div className="grid gap-2 md:grid-cols-3">
          <input
            className="rounded-xl border border-white/20 bg-white/10 px-3 py-2"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Challenge title"
          />
          <input
            className="rounded-xl border border-white/20 bg-white/10 px-3 py-2"
            type="number"
            value={targetMinutes}
            onChange={(e) => setTargetMinutes(e.target.value)}
            placeholder="Target minutes"
          />
          <select
            className="rounded-xl border border-white/20 bg-slate-900/60 px-3 py-2"
            value={targetUid}
            onChange={(e) => setTargetUid(e.target.value)}
          >
            <option value="">Choose friend</option>
            {friends.map((f) => (
              <option key={f.id} value={f.id}>
                @{f.username || f.displayName || f.id.slice(0, 6)}
              </option>
            ))}
          </select>
        </div>
        <PrimaryButton disabled={!targetUid || busy} onClick={sendChallenge}>
          {busy ? "Sending..." : "Send Challenge"}
        </PrimaryButton>
        {ok && <p className="text-sm text-emerald-200">{ok}</p>}
        {error && <p className="text-sm text-rose-200">{error}</p>}
      </GlassCard>

      <GlassCard className="space-y-3 p-4">
        <h3 className="font-semibold">Incoming</h3>
        {incoming.length === 0 && <p className="text-sm text-slate-200">No incoming challenges.</p>}
        {incoming.map((c) => (
          <div key={c.id} className="rounded-xl border border-white/15 bg-white/5 p-3">
            <p className="font-semibold">{c.title || "Challenge"}</p>
            <p className="text-xs text-slate-300">
              Target: {Number(c.targetMinutes || 0)}m today · status: {c.status}
            </p>
            <p className="text-xs text-slate-300">Your progress today: {todayMinutes}m</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {c.status === "pending" && (
                <>
                  <PrimaryButton variant="ghost" onClick={() => run(() => updateChallengeStatus(db, c.id, "declined"))}>
                    Decline
                  </PrimaryButton>
                  <PrimaryButton onClick={() => run(() => updateChallengeStatus(db, c.id, "accepted"))}>
                    Accept
                  </PrimaryButton>
                </>
              )}
              {c.status === "accepted" && todayMinutes >= Number(c.targetMinutes || 0) && (
                <PrimaryButton onClick={() => run(() => updateChallengeStatus(db, c.id, "completed"))}>
                  Mark Completed
                </PrimaryButton>
              )}
            </div>
          </div>
        ))}
      </GlassCard>

      <GlassCard className="space-y-3 p-4">
        <h3 className="font-semibold">Outgoing</h3>
        {outgoing.length === 0 && <p className="text-sm text-slate-200">No outgoing challenges.</p>}
        {outgoing.map((c) => (
          <div key={c.id} className="rounded-xl border border-white/15 bg-white/5 p-3">
            <p className="font-semibold">{c.title || "Challenge"}</p>
            <p className="text-xs text-slate-300">
              Target: {Number(c.targetMinutes || 0)}m · status: {c.status}
            </p>
          </div>
        ))}
      </GlassCard>
    </motion.div>
  );
}

