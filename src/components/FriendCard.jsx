import PrimaryButton from "./PrimaryButton";

export default function FriendCard({ user, actionLabel = "Add", onAction, todayFocusMinutes }) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-white/15 bg-white/5 px-3 py-2">
      <div>
        <p className="font-semibold">@{user.username || "no-username"}</p>
        <p className="text-xs text-slate-300">{user.displayName || user.email || "User"}</p>
        {typeof todayFocusMinutes === "number" && (
          <p className="text-xs text-slate-300">Today {todayFocusMinutes} min</p>
        )}
      </div>
      {onAction && (
        <PrimaryButton variant="ghost" onClick={onAction}>{actionLabel}</PrimaryButton>
      )}
    </div>
  );
}
