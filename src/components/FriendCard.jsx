import PrimaryButton from "./PrimaryButton";
import { Link } from "react-router-dom";

export default function FriendCard({
  user,
  actionLabel = "Add",
  onAction,
  todayFocusMinutes,
  profileHref,
}) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-white/15 bg-white/5 px-3 py-2">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 overflow-hidden rounded-full border border-white/20 bg-white/10">
          {user.photoURL ? (
            <img src={user.photoURL} alt={user.username || "friend"} className="h-full w-full object-cover" />
          ) : (
            <div className="grid h-full w-full place-items-center text-xs text-slate-300">
              {(user.displayName || user.username || "U").slice(0, 1).toUpperCase()}
            </div>
          )}
        </div>
        <div>
          {profileHref ? (
            <Link to={profileHref} className="font-semibold underline-offset-2 hover:underline">
              @{user.username || "no-username"}
            </Link>
          ) : (
            <p className="font-semibold">@{user.username || "no-username"}</p>
          )}
          <p className="text-xs text-slate-300">{user.displayName || user.email || "User"}</p>
        </div>
        {typeof todayFocusMinutes === "number" && (
          <p className="text-xs text-slate-300">Today {todayFocusMinutes} min</p>
        )}
      </div>
      <div className="flex items-center gap-2">
        {profileHref && (
          <Link
            to={profileHref}
            className="rounded-xl border border-white/20 bg-white/10 px-3 py-2 text-sm transition hover:bg-white/20"
          >
            View
          </Link>
        )}
        {onAction && (
          <PrimaryButton variant="ghost" onClick={onAction}>
            {actionLabel}
          </PrimaryButton>
        )}
      </div>
    </div>
  );
}
