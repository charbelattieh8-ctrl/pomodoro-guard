export default function Toggle({ checked, onChange, label }) {
  return (
    <label className="flex items-center justify-between gap-3">
      <span className="text-sm text-slate-100">{label}</span>
      <button
        onClick={() => onChange(!checked)}
        className={`relative h-7 w-12 rounded-full transition ${checked ? "bg-emerald-400/80" : "bg-slate-700/80"}`}
        type="button"
      >
        <span
          className={`absolute top-1 h-5 w-5 rounded-full bg-white transition ${checked ? "left-6" : "left-1"}`}
        />
      </button>
    </label>
  );
}
