import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Pause, Play, RotateCcw, Users } from "lucide-react";
import GlassCard from "../components/GlassCard";
import PrimaryButton from "../components/PrimaryButton";
import ProgressRing from "../components/ProgressRing";
import { useAuth } from "../context/AuthProvider";
import { db } from "../lib/firebase";
import { formatMs } from "../lib/utils";
import {
  createFocusRoom,
  deleteRoom,
  joinRoom,
  leaveRoom,
  pauseRoom,
  resetRoom,
  startRoom,
  watchMyRooms,
} from "../lib/collab";

function roomRemainingMs(room, now) {
  if (!room) return 0;
  if (room.status === "running" && room.endsAt) {
    return Math.max(0, Number(room.endsAt) - now);
  }
  return Math.max(0, Number(room.remainingMs || 0));
}

export default function RoomsPage() {
  const { user, friendUids, leaderboard } = useAuth();
  const [rooms, setRooms] = useState([]);
  const [activeRoomId, setActiveRoomId] = useState("");
  const [name, setName] = useState("Study Sprint");
  const [duration, setDuration] = useState(25);
  const [inviteUid, setInviteUid] = useState("");
  const [ringSize, setRingSize] = useState(320);
  const [now, setNow] = useState(Date.now());
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const applySize = () =>
      setRingSize(window.innerWidth < 480 ? 240 : window.innerWidth < 768 ? 280 : 320);
    applySize();
    window.addEventListener("resize", applySize);
    return () => window.removeEventListener("resize", applySize);
  }, []);

  useEffect(() => {
    const anyRunning = rooms.some((r) => r.status === "running");
    const intervalMs = anyRunning ? 250 : 1200;
    const t = setInterval(() => setNow(Date.now()), intervalMs);
    return () => clearInterval(t);
  }, [rooms]);

  useEffect(() => {
    if (!db || !user) return undefined;
    const unsub = watchMyRooms(db, user.uid, setRooms);
    return () => unsub();
  }, [user]);

  useEffect(() => {
    if (!rooms.length) {
      setActiveRoomId("");
      return;
    }
    setActiveRoomId((prev) => (rooms.some((r) => r.id === prev) ? prev : rooms[0].id));
  }, [rooms]);

  const friends = useMemo(
    () => leaderboard.filter((f) => friendUids.includes(f.id)),
    [leaderboard, friendUids]
  );

  const activeRoom = useMemo(() => rooms.find((r) => r.id === activeRoomId) || null, [rooms, activeRoomId]);
  const activeRemaining = roomRemainingMs(activeRoom, now);
  const activeProgress = useMemo(() => {
    if (!activeRoom) return 0;
    const total = Math.max(1, Number(activeRoom.durationMinutes || 25) * 60 * 1000);
    return Math.max(0, Math.min(1, (total - activeRemaining) / total));
  }, [activeRoom, activeRemaining]);

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

  const iAmOwner = activeRoom?.ownerUid === user?.uid;
  const iAmInRoom = Boolean(activeRoom && (activeRoom.participantUids || []).includes(user.uid));

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

      {activeRoom && (
        <>
          <GlassCard className="w-full p-6 md:p-10">
            <div className="grid place-items-center">
              <ProgressRing progress={activeProgress} size={ringSize}>
                <div className="text-center">
                  <p className="text-sm uppercase tracking-[0.2em] text-slate-200">
                    Shared Focus
                  </p>
                  <p className="mt-2 font-display text-5xl font-semibold sm:text-6xl md:text-7xl">
                    {formatMs(activeRemaining)}
                  </p>
                  <p className="mt-2 text-xs text-slate-300">
                    {activeRoom.name} · {activeRoom.status || "idle"}
                  </p>
                </div>
              </ProgressRing>
            </div>
          </GlassCard>

          <GlassCard className="w-full p-4">
            <div className="grid grid-cols-2 gap-3 sm:flex sm:flex-wrap sm:justify-center">
              {!iAmInRoom && (
                <PrimaryButton onClick={() => run(() => joinRoom(db, activeRoom.id, user.uid))}>
                  Join
                </PrimaryButton>
              )}
              {iAmInRoom && (
                <PrimaryButton variant="ghost" onClick={() => run(() => leaveRoom(db, activeRoom.id, user.uid))}>
                  Leave
                </PrimaryButton>
              )}
              {iAmOwner && activeRoom.status !== "running" && (
                <PrimaryButton className="flex items-center justify-center gap-2" onClick={() => run(() => startRoom(db, activeRoom.id))}>
                  <Play size={16} /> Start
                </PrimaryButton>
              )}
              {iAmOwner && activeRoom.status === "running" && (
                <PrimaryButton className="flex items-center justify-center gap-2" onClick={() => run(() => pauseRoom(db, activeRoom.id))}>
                  <Pause size={16} /> Pause
                </PrimaryButton>
              )}
              {iAmOwner && (
                <PrimaryButton
                  className="flex items-center justify-center gap-2"
                  variant="ghost"
                  onClick={() => run(() => resetRoom(db, activeRoom.id))}
                >
                  <RotateCcw size={16} /> Reset
                </PrimaryButton>
              )}
              {iAmOwner && (
                <PrimaryButton variant="ghost" onClick={() => run(() => deleteRoom(db, activeRoom.id))}>
                  Delete Room
                </PrimaryButton>
              )}
            </div>
            <p className="mt-3 text-center text-xs text-slate-300">
              <Users size={14} className="mr-1 inline-block" />
              {Array.isArray(activeRoom.participantUids) ? activeRoom.participantUids.length : 0} participants
            </p>
          </GlassCard>
        </>
      )}

      <GlassCard className="space-y-3 p-4">
        <h3 className="font-semibold">Your rooms</h3>
        {rooms.length === 0 && <p className="text-sm text-slate-200">No rooms yet.</p>}
        {rooms.map((room) => {
          const remaining = roomRemainingMs(room, now);
          const selected = room.id === activeRoomId;
          return (
            <button
              key={room.id}
              type="button"
              onClick={() => setActiveRoomId(room.id)}
              className={`w-full rounded-2xl border p-3 text-left transition ${
                selected ? "border-white/45 bg-white/15" : "border-white/15 bg-white/5 hover:bg-white/10"
              }`}
            >
              <p className="font-semibold">{room.name || "Focus Room"}</p>
              <p className="text-xs text-slate-300">
                {room.status || "idle"} · {formatMs(remaining)}
              </p>
            </button>
          );
        })}
      </GlassCard>
    </motion.div>
  );
}
