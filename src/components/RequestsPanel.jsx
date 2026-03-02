import GlassCard from "./GlassCard";
import PrimaryButton from "./PrimaryButton";

export default function RequestsPanel({ incoming, onAccept, onDecline }) {
  return (
    <GlassCard className="space-y-3 p-4">
      <h3 className="font-semibold">Incoming requests</h3>
      {incoming.length === 0 && <p className="text-sm text-slate-200">No pending requests.</p>}
      {incoming.map((r) => (
        <div key={r.id} className="flex items-center justify-between rounded-xl border border-white/15 bg-white/5 px-3 py-2">
          <p className="text-sm">Request from UID {r.fromUid.slice(0, 6)}...</p>
          <div className="flex gap-2">
            <PrimaryButton variant="ghost" onClick={() => onDecline(r.id)}>Decline</PrimaryButton>
            <PrimaryButton onClick={() => onAccept(r)}>Accept</PrimaryButton>
          </div>
        </div>
      ))}
    </GlassCard>
  );
}
