import { LogOut, Settings } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthProvider";

export default function TopBar() {
  const { profile, actions } = useAuth();
  return (
    <header className="glass sticky top-4 z-20 mx-4 mb-4 flex items-center justify-between rounded-2xl px-4 py-3 shadow-glow ring-1 ring-white/20 md:mx-0">
      <div>
        <h1 className="font-display text-lg font-semibold">LOCK IN</h1>
        <p className="text-xs text-slate-200">
          @{profile?.username || "guest"}
        </p>
      </div>
      <div className="flex items-center gap-3 text-sm">
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
    </header>
  );
}
