export default function Slider({ value, onChange, min = 1, max = 60, label }) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-sm text-slate-100">
        <span>{label}</span>
        <span className="font-semibold">{value}</span>
      </div>
      <input
        className="range h-2 w-full cursor-pointer appearance-none rounded-full bg-white/20"
        type="range"
        value={value}
        min={min}
        max={max}
        onChange={(e) => onChange(Number(e.target.value))}
      />
    </div>
  );
}
