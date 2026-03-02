import { Settings } from "lucide-react";
import { Link } from "react-router-dom";
import { useAppState } from "../context/AppStateProvider";

export default function TopBar() {
  const { state } = useAppState();
  return (
    <header className="glass sticky top-4 z-20 mx-4 mb-4 flex items-center justify-between rounded-2xl px-4 py-3 shadow-glow ring-1 ring-white/20 md:mx-0">
      <div>
        <h1 className="font-display text-lg font-semibold">Hi, {state.user.displayName}</h1>
      </div>
      <div className="flex items-center gap-4 text-sm">
        <Link
          to="/settings"
          className="rounded-full border border-white/25 bg-white/10 p-2 transition hover:bg-white/20"
        >
          <Settings size={16} />
        </Link>
      </div>
    </header>
  );
}
