import { Link } from "react-router-dom";
import GlassCard from "../components/GlassCard";

export default function NotFound() {
  return (
    <div className="grid min-h-[60vh] place-items-center">
      <GlassCard className="max-w-md space-y-4 p-8 text-center">
        <h1 className="font-display text-5xl font-bold">404</h1>
        <p className="text-slate-200">This page doesn't exist.</p>
        <Link
          to="/"
          className="inline-block rounded-xl bg-white/15 px-6 py-2 text-sm font-semibold transition hover:bg-white/25"
        >
          Back to Dashboard
        </Link>
      </GlassCard>
    </div>
  );
}
