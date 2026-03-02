import { useState } from "react";
import { motion } from "framer-motion";
import GlassCard from "../components/GlassCard";
import PrimaryButton from "../components/PrimaryButton";
import RequestsPanel from "../components/RequestsPanel";
import FriendCard from "../components/FriendCard";
import { useAuth } from "../context/AuthProvider";

export default function FriendsPage() {
  const { incomingRequests, outgoingRequests, leaderboard, actions } = useAuth();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [actionError, setActionError] = useState("");
  const [actionBusyId, setActionBusyId] = useState("");

  const runSearch = async () => {
    setBusy(true);
    setError("");
    try {
      setResults(await actions.searchUsers(query));
    } catch (err) {
      setError(err?.message || "Search failed");
    } finally {
      setBusy(false);
    }
  };

  const runAction = async (id, fn) => {
    setActionError("");
    setActionBusyId(id);
    try {
      await fn();
    } catch (err) {
      setActionError(err?.message || "Action failed");
    } finally {
      setActionBusyId("");
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
      <h2 className="font-display text-2xl font-semibold">Friends</h2>

      <GlassCard className="space-y-3 p-4">
        <h3 className="font-semibold">Find friends</h3>
        <div className="flex flex-wrap gap-2">
          <input
            className="min-w-[220px] flex-1 rounded-xl border border-white/20 bg-white/10 px-3 py-2"
            placeholder="exact username or display name prefix"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <PrimaryButton disabled={busy || !query.trim()} onClick={runSearch}>
            {busy ? "Searching..." : "Search"}
          </PrimaryButton>
        </div>
        {error && <p className="text-sm text-rose-200">{error}</p>}
        <div className="space-y-2">
          {results.map((r) => (
            <FriendCard
              key={r.id}
              user={r}
              actionLabel={actionBusyId === `add-${r.id}` ? "Sending..." : "Add"}
              onAction={() => runAction(`add-${r.id}`, () => actions.sendRequest(r.id))}
            />
          ))}
        </div>
        {actionError && <p className="text-sm text-rose-200">{actionError}</p>}
      </GlassCard>

      <RequestsPanel
        incoming={incomingRequests.filter((r) => r.status === "pending")}
        onAccept={(request) => runAction(`accept-${request.id}`, () => actions.acceptRequest(request))}
        onDecline={(id) => runAction(`decline-${id}`, () => actions.declineRequest(id))}
      />

      <GlassCard className="space-y-3 p-4">
        <h3 className="font-semibold">Outgoing requests</h3>
        {outgoingRequests.filter((r) => r.status === "pending").length === 0 && (
          <p className="text-sm text-slate-200">No pending outgoing requests.</p>
        )}
        {outgoingRequests
          .filter((r) => r.status === "pending")
          .map((r) => (
            <div key={r.id} className="rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-sm">
              To UID {r.toUid.slice(0, 6)}...
            </div>
          ))}
      </GlassCard>

      <GlassCard className="space-y-3 p-4">
        <h3 className="font-semibold">Friends stats</h3>
        {leaderboard.length === 0 && <p className="text-sm text-slate-200">No friends yet.</p>}
        {leaderboard.map((friend) => (
          <FriendCard
            key={friend.id}
            user={friend}
            todayFocusMinutes={friend.todayFocusMinutes}
            profileHref={`/friends/${friend.id}`}
          />
        ))}
      </GlassCard>
    </motion.div>
  );
}
