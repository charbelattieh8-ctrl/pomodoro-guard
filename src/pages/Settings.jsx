import { motion } from "framer-motion";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Coins } from "lucide-react";
import GlassCard from "../components/GlassCard";
import PrimaryButton from "../components/PrimaryButton";
import Toggle from "../components/Toggle";
import { useAppState } from "../context/useAppState";
import { useAuth } from "../context/useAuth";

async function fileToDataUrl(file) {
  const dataUrl = await new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ""));
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

  const img = await new Promise((resolve, reject) => {
    const el = new Image();
    el.onload = () => resolve(el);
    el.onerror = reject;
    el.src = dataUrl;
  });

  const max = 512;
  const scale = Math.min(1, max / img.width, max / img.height);
  const width = Math.max(1, Math.round(img.width * scale));
  const height = Math.max(1, Math.round(img.height * scale));
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  ctx.drawImage(img, 0, 0, width, height);
  return canvas.toDataURL("image/jpeg", 0.82);
}

function PurchaseHistory() {
  const { user } = useAuth();
  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchPurchases = useCallback(async () => {
    if (!user || user.isAnonymous) return;
    setLoading(true);
    try {
      const token = await user.getIdToken();
      const res = await fetch("/api/purchases", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setPurchases(data.purchases || []);
      }
    } catch {
      // silently fail
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchPurchases();
  }, [fetchPurchases]);

  if (!user || user.isAnonymous) return null;
  if (!loading && purchases.length === 0) return null;

  return (
    <GlassCard className="space-y-3 p-4">
      <h3 className="font-semibold">Purchase History</h3>
      {loading ? (
        <p className="text-sm text-slate-300">Loading...</p>
      ) : (
        <div className="space-y-2">
          {purchases.map((p) => (
            <div
              key={p.id}
              className="flex items-center justify-between rounded-lg bg-white/5 px-3 py-2 text-sm"
            >
              <div className="flex items-center gap-2">
                <Coins size={14} className="text-yellow-400" />
                <span className="font-medium">+{p.coinsGranted}</span>
                <span className="text-slate-400">
                  ${((p.amountUsdCents || 0) / 100).toFixed(2)}
                </span>
              </div>
              <div className="flex items-center gap-2">
                {p.status === "refunded" && (
                  <span className="rounded bg-rose-500/20 px-1.5 py-0.5 text-[10px] text-rose-300">
                    Refunded
                  </span>
                )}
                <span className="text-xs text-slate-400">
                  {p.createdAt ? new Date(p.createdAt).toLocaleDateString() : "—"}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </GlassCard>
  );
}

export default function SettingsPage() {
  const { state, actions } = useAppState();
  const { profile, actions: authActions } = useAuth();
  const timer = state.user.timer;
  const prefs = state.user.preferences;
  const [displayName, setDisplayName] = useState(profile?.displayName || "");
  const [photoURL, setPhotoURL] = useState(profile?.photoURL || "");
  const [timerInputs, setTimerInputs] = useState(() => ({
    focusMinutes: String(timer.focusMinutes || ""),
    breakMinutes: String(timer.breakMinutes || ""),
    longBreakMinutes: String(timer.longBreakMinutes || ""),
    cyclesBeforeLongBreak: String(timer.cyclesBeforeLongBreak || ""),
  }));
  const [saveBusy, setSaveBusy] = useState(false);
  const [saveMsg, setSaveMsg] = useState("");
  const [saveErr, setSaveErr] = useState("");
  const inputClass =
    "mt-1 w-full rounded-xl border border-white/20 bg-white/10 px-3 py-2 outline-none transition focus:border-white/40";
  const avatar = useMemo(() => photoURL || profile?.photoURL || "", [photoURL, profile?.photoURL]);
  const timerFormatOptions = [
    {
      value: "minutesSeconds",
      label: "Minutes:Seconds",
      example: "25:00",
      help: "Keeps the current display style and rolls total minutes upward.",
    },
    {
      value: "hoursMinutesSeconds",
      label: "Hours:Minutes:Seconds",
      example: "00:25:00",
      help: "Shows a dedicated hours field for longer timers.",
    },
  ];

  useEffect(() => {
    setDisplayName(profile?.displayName || "");
    setPhotoURL(profile?.photoURL || "");
  }, [profile?.displayName, profile?.photoURL]);

  useEffect(() => {
    setTimerInputs({
      focusMinutes: String(timer.focusMinutes || ""),
      breakMinutes: String(timer.breakMinutes || ""),
      longBreakMinutes: String(timer.longBreakMinutes || ""),
      cyclesBeforeLongBreak: String(timer.cyclesBeforeLongBreak || ""),
    });
  }, [
    timer.focusMinutes,
    timer.breakMinutes,
    timer.longBreakMinutes,
    timer.cyclesBeforeLongBreak,
  ]);

  const updateTimerInput = (key, value) => {
    setTimerInputs((prev) => ({ ...prev, [key]: value }));
  };

  const commitTimerInput = (key) => {
    const value = Number(timerInputs[key]);
    actions.updateUserTimerSettings({
      [key]: Number.isFinite(value) ? value : timer[key],
    });
  };

  const saveProfile = async () => {
    setSaveBusy(true);
    setSaveErr("");
    setSaveMsg("");
    try {
      await authActions.updateMyProfile({ displayName, photoURL });
      setSaveMsg("Profile updated");
    } catch (err) {
      setSaveErr(err?.message || "Failed to update profile");
    } finally {
      setSaveBusy(false);
    }
  };

  const onPickPhoto = async (file) => {
    if (!file) return;
    setSaveErr("");
    try {
      const url = await fileToDataUrl(file);
      setPhotoURL(url);
    } catch {
      setSaveErr("Could not process image");
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
      <h2 className="font-display text-2xl font-semibold">Settings</h2>
      <div className="grid gap-4 lg:grid-cols-2">
        <GlassCard className="space-y-4 p-4">
          <h3 className="font-semibold">Profile</h3>
          <div className="flex items-center gap-3">
            <div className="h-14 w-14 overflow-hidden rounded-full border border-white/20 bg-white/10">
              {avatar ? (
                <img src={avatar} alt="Profile" loading="lazy" className="h-full w-full object-cover" />
              ) : (
                <div className="grid h-full w-full place-items-center text-sm text-slate-300">
                  {(displayName || profile?.username || "U").slice(0, 1).toUpperCase()}
                </div>
              )}
            </div>
            <label className="cursor-pointer rounded-xl border border-white/20 bg-white/10 px-3 py-2 text-sm transition hover:bg-white/20">
              Upload photo
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => onPickPhoto(e.target.files?.[0])}
              />
            </label>
          </div>
          <label className="block text-sm text-slate-100">
            Display Name
            <input
              className={inputClass}
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="Your name"
            />
          </label>
          <label className="block text-sm text-slate-100">
            Photo URL (optional)
            <input
              className={inputClass}
              type="url"
              value={photoURL}
              onChange={(e) => setPhotoURL(e.target.value)}
              placeholder="https://..."
            />
          </label>
          <PrimaryButton disabled={saveBusy} onClick={saveProfile}>
            {saveBusy ? "Saving..." : "Save Profile"}
          </PrimaryButton>
          {saveMsg && <p className="text-sm text-emerald-200">{saveMsg}</p>}
          {saveErr && <p className="text-sm text-rose-200">{saveErr}</p>}
        </GlassCard>

        <GlassCard className="space-y-4 p-4">
          <h3 className="font-semibold">Timer Durations</h3>
          <label className="block text-sm text-slate-100">
            Focus Minutes
            <input
              className={inputClass}
              type="number"
              min={15}
              max={180}
              value={timerInputs.focusMinutes}
              onChange={(e) => updateTimerInput("focusMinutes", e.target.value)}
              onBlur={() => commitTimerInput("focusMinutes")}
              onKeyDown={(e) => {
                if (e.key === "Enter") e.currentTarget.blur();
              }}
            />
            <span className="text-xs text-slate-400">15 – 180 min</span>
          </label>
          <label className="block text-sm text-slate-100">
            Break Minutes
            <input
              className={inputClass}
              type="number"
              min={1}
              max={30}
              value={timerInputs.breakMinutes}
              onChange={(e) => updateTimerInput("breakMinutes", e.target.value)}
              onBlur={() => commitTimerInput("breakMinutes")}
              onKeyDown={(e) => {
                if (e.key === "Enter") e.currentTarget.blur();
              }}
            />
          </label>
          <label className="block text-sm text-slate-100">
            Long Break Minutes
            <input
              className={inputClass}
              type="number"
              min={5}
              max={60}
              value={timerInputs.longBreakMinutes}
              onChange={(e) => updateTimerInput("longBreakMinutes", e.target.value)}
              onBlur={() => commitTimerInput("longBreakMinutes")}
              onKeyDown={(e) => {
                if (e.key === "Enter") e.currentTarget.blur();
              }}
            />
          </label>
          <label className="block text-sm text-slate-100">
            Cycles Before Long Break
            <input
              className={inputClass}
              type="number"
              min={1}
              max={10}
              value={timerInputs.cyclesBeforeLongBreak}
              onChange={(e) => updateTimerInput("cyclesBeforeLongBreak", e.target.value)}
              onBlur={() => commitTimerInput("cyclesBeforeLongBreak")}
              onKeyDown={(e) => {
                if (e.key === "Enter") e.currentTarget.blur();
              }}
            />
          </label>

          <div className="space-y-3">
            <div>
              <p className="text-sm text-slate-100">Timer Display Format</p>
              <p className="mt-1 text-xs text-slate-300">
                Choose how the countdown appears on the timer page.
              </p>
            </div>

            <div className="grid gap-2">
              {timerFormatOptions.map((option) => {
                const isActive = (timer.displayFormat || "minutesSeconds") === option.value;
                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => actions.updateUserTimerSettings({ displayFormat: option.value })}
                    className={`rounded-xl border px-3 py-3 text-left transition ${
                      isActive
                        ? "border-white/50 bg-white/20"
                        : "border-white/20 bg-white/10 hover:bg-white/15"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-sm font-medium text-white">{option.label}</span>
                      <span className="font-mono text-sm text-slate-200">{option.example}</span>
                    </div>
                    <p className="mt-1 text-xs text-slate-300">{option.help}</p>
                  </button>
                );
              })}
            </div>
          </div>
        </GlassCard>

        <PurchaseHistory />

        <GlassCard className="space-y-4 p-4">
          <h3 className="font-semibold">Preferences</h3>
          <Toggle
            label="Sound"
            checked={prefs.soundOn}
            onChange={(soundOn) => actions.updatePreferences({ soundOn })}
          />
          <Toggle
            label="Notifications"
            checked={prefs.notificationsOn}
            onChange={(notificationsOn) => actions.updatePreferences({ notificationsOn })}
          />
          <Toggle
            label="Reduce Motion"
            checked={prefs.reduceMotion}
            onChange={(reduceMotion) => actions.updatePreferences({ reduceMotion })}
          />
        </GlassCard>
      </div>
    </motion.div>
  );
}

