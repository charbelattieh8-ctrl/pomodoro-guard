import { LogOut, Settings, Sparkles } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthProvider";
import { useAppState } from "../context/AppStateProvider";

export default function TopBar() {
  const { profile, actions } = useAuth();
  const { state } = useAppState();
  const location = useLocation();
  const routeLabel =
    location.pathname === "/"
      ? "Dashboard"
      : location.pathname.slice(1).split("/")[0].replace(/^\w/, (m) => m.toUpperCase());

  return (
    <header className="glass sticky top-4 z-20 mx-4 mb-5 rounded-[26px] px-4 py-4 shadow-glow ring-1 ring-white/20 md:mx-0 md:px-5">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-start gap-3">
          <div className="nav-pill grid h-12 w-12 place-items-center rounded-2xl text-cyan-100">
            <Sparkles size={18} />
          </div>
          <div>
            <p className="eyebrow">Focus OS</p>
            <div className="mt-1 flex flex-wrap items-center gap-2">
              <h1 className="font-display text-xl font-semibold tracking-[-0.04em] md:text-2xl">LOCK IN</h1>
              <span className="rounded-full border border-white/12 bg-white/8 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-200/80">
                {routeLabel}
              </span>
            </div>
            <p className="mt-1 text-sm text-slate-200/85">@{profile?.username || "guest"} · {state.economy.coins} coins · {state.milestones.progress.streakDays} day streak</p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end md:self-auto">
          <Link to="/settings" className="nav-pill flex h-11 items-center gap-3 rounded-2xl px-3 pr-4 transition hover:bg-white/12">
            <div className="h-9 w-9 overflow-hidden rounded-2xl border border-white/20 bg-white/10">
              {profile?.photoURL ? (
                <img src={profile.photoURL} alt="me" className="h-full w-full object-cover" />
              ) : (
                <div className="grid h-full w-full place-items-center text-xs font-semibold text-slate-200">
                  {(profile?.username || "U").slice(0, 1).toUpperCase()}
                </div>
              )}
            </div>
            <span className="hidden text-left sm:block">
              <span className="block text-[11px] uppercase tracking-[0.2em] text-slate-300/70">Profile</span>
              <span className="block text-sm font-semibold text-white">Settings</span>
            </span>
          </Link>

          <Link
            to="/settings"
            className="nav-pill rounded-2xl p-3 text-slate-100 transition hover:bg-white/12"
          >
            <Settings size={16} />
          </Link>
          <button
            type="button"
            className="nav-pill rounded-2xl p-3 text-slate-100 transition hover:bg-white/12"
            onClick={actions.logout}
            title="Logout"
          >
            <LogOut size={16} />
          </button>
        </div>
      </div>
    </header>
  );
}
