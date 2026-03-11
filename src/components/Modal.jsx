import GlassCard from "./GlassCard";
import PrimaryButton from "./PrimaryButton";

export default function Modal({ open, title, description, onCancel, onConfirm }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/50 p-4">
      <GlassCard className="w-full max-w-md p-5">
        <h3 className="font-display text-xl font-semibold">{title}</h3>
        <p className="mt-2 text-sm text-slate-200/90">{description}</p>
        <div className="mt-5 flex justify-end gap-3">
          <PrimaryButton variant="ghost" onClick={onCancel}>
            Cancel
          </PrimaryButton>
          <PrimaryButton onClick={onConfirm}>Confirm</PrimaryButton>
        </div>
      </GlassCard>
    </div>
  );
}
