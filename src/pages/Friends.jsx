import { useEffect, useState } from "react";
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
  const [userMap, setUserMap] = useState({});

  useEffect(() => {
    const ids = Array.from(
      new Set([
        ...incomingRequests.map((r) => r.fromUid),
        ...incomingRequests.map((r) => r.toUid),
        ...outgoingRequests.map((r) => r.fromUid),
        ...outgoingRequests.map((r) => r.toUid),
      ])
    );
    if (!ids.length) {
      setUserMap({});
      return;
    }
    actions
      .getUsersByIds(ids)
      .then((rows) => {
        const next = {};
        for (const row of rows) next[row.id] = row;
        setUserMap(next);
      })
      .catch(() => {});
  }, [incomingRequests, outgoingRequests, actions]);

  const runSearch = async () => {
    if (!query.trim()) return;
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
        <form
          className="flex flex-wrap gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            runSearch();
          }}
        >
          <input
            className="min-w-[220px] flex-1 rounded-xl border border-white/20 bg-white/10 px-3 py-2"
            placeholder="exact username or display name prefix"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <PrimaryButton type="submit" disabled={busy || !query.trim()}>
            {busy ? "Searching..." : "Search"}
          </PrimaryButton>
        </form>
        {error && <p className="text-sm text-rose-200">{error}</p>}
        <div className="space-y-2">
          {results.map((r) => (
            <FriendCard
              key={r.id}
              user={r}
              profileHref={`/friends/${r.id}`}
              actionLabel={actionBusyId === `add-${r.id}` ? "Sending..." : "Add"}
              onAction={() => runAction(`add-${r.id}`, () => actions.sendRequest(r.id))}
            />
          ))}
        </div>
        {actionError && <p className="text-sm text-rose-200">{actionError}</p>}
      </GlassCard>

      <RequestsPanel
        incoming={incomingRequests.filter((r) => r.status === "pending")}
        userMap={userMap}
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
            <div key={r.id} className="flex items-center justify-between rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-sm">
              <span>
                To @{userMap[r.toUid]?.username || userMap[r.toUid]?.displayName || r.toUid.slice(0, 6)}
              </span>
              <PrimaryButton
                variant="ghost"
                onClick={() => runAction(`cancel-${r.id}`, () => actions.cancelRequest(r.id))}
              >
                Cancel
              </PrimaryButton>
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
            actionLabel={actionBusyId === `unfriend-${friend.id}` ? "Removing..." : "Unfriend"}
            onAction={() => runAction(`unfriend-${friend.id}`, () => actions.unfriend(friend.id))}
          />
        ))}
      </GlassCard>
    </motion.div>
  );
}
