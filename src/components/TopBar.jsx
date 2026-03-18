import { LogOut, Settings } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthProvider";
import GlassCard from "./GlassCard";

export default function TopBar() {
  const { profile, actions } = useAuth();
  const location = useLocation();
  const isTimerPage = location.pathname === "/timer";

  const identity = (
    <div>
      <h1 className="font-display text-lg font-semibold">LOCK INNN</h1>
      <p className="text-xs text-slate-200">@{profile?.username || "guest"}</p>
    </div>
  );

  const controls = (
    <div className="flex flex-wrap items-center justify-end gap-2 text-sm sm:gap-3">
      <Link to="/settings" className="h-9 w-9 overflow-hidden rounded-full border border-white/25 bg-white/10">
        {profile?.photoURL ? (
          <img src={profile.photoURL} alt="me" className="h-full w-full object-cover" />
        ) : (
          <div className="grid h-full w-full place-items-center text-xs text-slate-200">
            {(profile?.username || "U").slice(0, 1).toUpperCase()}
          </div>
        )}
      </Link>
      <Link
        to="/settings"
        className="rounded-full border border-white/25 bg-white/10 p-2 transition hover:bg-white/20"
      >
        <Settings size={16} />
      </Link>
      <button
        type="button"
        className="rounded-full border border-white/25 bg-white/10 p-2 transition hover:bg-white/20"
        onClick={actions.logout}
        title="Logout"
      >
        <LogOut size={16} />
      </button>
    </div>
  );

  if (isTimerPage) {
    return (
      <div className="z-20 mb-4 flex flex-col gap-3 md:sticky md:top-4 md:flex-row md:items-center md:justify-between">
        <GlassCard className="w-full px-4 py-3 md:w-auto">{identity}</GlassCard>
        <GlassCard className="w-full px-4 py-3 md:w-auto">
          <div className="flex justify-end">{controls}</div>
        </GlassCard>
      </div>
    );
  }

  return (
    <header className="glass z-20 mb-4 flex flex-wrap items-center justify-between gap-3 rounded-2xl px-4 py-3 shadow-glow ring-1 ring-white/20 md:sticky md:top-4 md:flex-nowrap">
      {identity}
      {controls}
    </header>
  );
}
