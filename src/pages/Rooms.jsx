import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import GlassCard from "../components/GlassCard";
import PrimaryButton from "../components/PrimaryButton";
import { useAuth } from "../context/AuthProvider";
import { db } from "../lib/firebase";
import {
  createFocusRoom,
  joinRoom,
  leaveRoom,
  pauseRoom,
  resetRoom,
  startRoom,
  watchMyRooms,
} from "../lib/collab";

function formatRemaining(ms) {
  const totalSec = Math.max(0, Math.ceil(Number(ms || 0) / 1000));
  const mm = String(Math.floor(totalSec / 60)).padStart(2, "0");
  const ss = String(totalSec % 60).padStart(2, "0");
  return `${mm}:${ss}`;
}

export default function RoomsPage() {
  const { user, friendUids, leaderboard } = useAuth();
  const [rooms, setRooms] = useState([]);
  const [name, setName] = useState("Study Sprint");
  const [duration, setDuration] = useState(25);
  const [inviteUid, setInviteUid] = useState("");
  const [now, setNow] = useState(Date.now());
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 400);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    if (!db || !user) return undefined;
    const unsub = watchMyRooms(db, user.uid, setRooms);
    return () => unsub();
  }, [user]);

  const friends = useMemo(
    () => leaderboard.filter((f) => friendUids.includes(f.id)),
    [leaderboard, friendUids]
  );

  const withRemaining = useMemo(
    () =>
      rooms.map((r) => {
        const remainingMs =
          r.status === "running" && r.endsAt ? Math.max(0, Number(r.endsAt) - now) : Number(r.remainingMs || 0);
        return { ...r, remainingMs };
      }),
    [rooms, now]
  );

  const run = async (fn) => {
    setBusy(true);
    setError("");
    try {
      await fn();
    } catch (err) {
      setError(err?.message || "Action failed");
    } finally {
      setBusy(false);
    }
  };

  const createRoom = () =>
    run(() =>
      createFocusRoom(db, {
        ownerUid: user.uid,
        name,
        durationMinutes: Math.max(1, Number(duration || 25)),
        invitedUid: inviteUid || null,
      })
    );

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
      <h2 className="font-display text-2xl font-semibold">Focus Rooms</h2>

      <GlassCard className="space-y-3 p-4">
        <h3 className="font-semibold">Create shared room</h3>
        <div className="grid gap-2 md:grid-cols-3">
          <input
            className="rounded-xl border border-white/20 bg-white/10 px-3 py-2"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Room name"
          />
          <input
            className="rounded-xl border border-white/20 bg-white/10 px-3 py-2"
            type="number"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            placeholder="Minutes"
          />
          <select
            className="rounded-xl border border-white/20 bg-slate-900/60 px-3 py-2"
            value={inviteUid}
            onChange={(e) => setInviteUid(e.target.value)}
          >
            <option value="">No invite</option>
            {friends.map((f) => (
              <option key={f.id} value={f.id}>
                @{f.username || f.displayName || f.id.slice(0, 6)}
              </option>
            ))}
          </select>
        </div>
        <PrimaryButton disabled={busy} onClick={createRoom}>
          {busy ? "Creating..." : "Create Room"}
        </PrimaryButton>
        {error && <p className="text-sm text-rose-200">{error}</p>}
      </GlassCard>

      <GlassCard className="space-y-3 p-4">
        <h3 className="font-semibold">Your rooms</h3>
        {withRemaining.length === 0 && <p className="text-sm text-slate-200">No rooms yet.</p>}
        {withRemaining.map((room) => {
          const iAmOwner = room.ownerUid === user.uid;
          const iAmIn = (room.participantUids || []).includes(user.uid);
          return (
            <div key={room.id} className="rounded-2xl border border-white/15 bg-white/5 p-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <p className="font-semibold">{room.name || "Focus Room"}</p>
                  <p className="text-xs text-slate-300">
                    {room.status || "idle"} · {formatRemaining(room.remainingMs)}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {!iAmIn && (
                    <PrimaryButton variant="ghost" onClick={() => run(() => joinRoom(db, room.id, user.uid))}>
                      Join
                    </PrimaryButton>
                  )}
                  {iAmIn && (
                    <PrimaryButton variant="ghost" onClick={() => run(() => leaveRoom(db, room.id, user.uid))}>
                      Leave
                    </PrimaryButton>
                  )}
                  {iAmOwner && room.status !== "running" && (
                    <PrimaryButton onClick={() => run(() => startRoom(db, room.id))}>Start</PrimaryButton>
                  )}
                  {iAmOwner && room.status === "running" && (
                    <PrimaryButton onClick={() => run(() => pauseRoom(db, room.id))}>Pause</PrimaryButton>
                  )}
                  {iAmOwner && (
                    <PrimaryButton variant="ghost" onClick={() => run(() => resetRoom(db, room.id))}>
                      Reset
                    </PrimaryButton>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </GlassCard>
    </motion.div>
  );
}

