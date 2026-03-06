import GlassCard from "./GlassCard";

export default function StatCard({ title, value, icon }) {
  return (
    <GlassCard className="p-4">
      <div className="flex items-center justify-between text-slate-200">
        <span className="text-sm">{title}</span>
        {icon}
      </div>
      <p className="mt-3 font-display text-3xl font-semibold">{value}</p>
    </GlassCard>
  );
}
