import GlassCard from "./GlassCard";
import PrimaryButton from "./PrimaryButton";

export default function UsernameModal({ open, busy, error, onSubmit }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[90] grid place-items-center bg-black/55 p-4">
      <GlassCard className="w-full max-w-md space-y-3 p-5">
        <h3 className="font-display text-xl font-semibold">Choose username</h3>
        <p className="text-sm text-slate-200">Required for social and streak features.</p>
        <form
          className="space-y-3"
          onSubmit={(e) => {
            e.preventDefault();
            const fd = new FormData(e.currentTarget);
            onSubmit(String(fd.get("username") || ""));
          }}
        >
          <input
            name="username"
            autoFocus
            required
            className="w-full rounded-xl border border-white/20 bg-white/10 px-3 py-2"
            placeholder="username"
          />
          <PrimaryButton className="w-full" disabled={busy}>Save username</PrimaryButton>
        </form>
        {error && <p className="text-sm text-rose-200">{error}</p>}
      </GlassCard>
    </div>
  );
}
