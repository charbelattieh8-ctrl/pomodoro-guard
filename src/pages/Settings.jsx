import { motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import GlassCard from "../components/GlassCard";
import PrimaryButton from "../components/PrimaryButton";
import Toggle from "../components/Toggle";
import { useAppState } from "../context/AppStateProvider";
import { useAuth } from "../context/AuthProvider";

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

export default function SettingsPage() {
  const { state, actions } = useAppState();
  const { profile, actions: authActions } = useAuth();
  const timer = state.user.timer;
  const prefs = state.user.preferences;
  const [displayName, setDisplayName] = useState(profile?.displayName || "");
  const [photoURL, setPhotoURL] = useState(profile?.photoURL || "");
  const [saveBusy, setSaveBusy] = useState(false);
  const [saveMsg, setSaveMsg] = useState("");
  const [saveErr, setSaveErr] = useState("");
  const inputClass =
    "mt-1 w-full rounded-xl border border-white/20 bg-white/10 px-3 py-2 outline-none transition focus:border-white/40";
  const avatar = useMemo(() => photoURL || profile?.photoURL || "", [photoURL, profile?.photoURL]);

  useEffect(() => {
    setDisplayName(profile?.displayName || "");
    setPhotoURL(profile?.photoURL || "");
  }, [profile?.displayName, profile?.photoURL]);

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
                <img src={avatar} alt="Profile" className="h-full w-full object-cover" />
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
              value={timer.focusMinutes === 0 ? "" : timer.focusMinutes}
              onChange={(e) => actions.updateUserTimerSettings({ focusMinutes: Number(e.target.value) })}
            />
          </label>
          <label className="block text-sm text-slate-100">
            Break Minutes
            <input
              className={inputClass}
              type="number"
              value={timer.breakMinutes === 0 ? "" : timer.breakMinutes}
              onChange={(e) => actions.updateUserTimerSettings({ breakMinutes: Number(e.target.value) })}
            />
          </label>
          <label className="block text-sm text-slate-100">
            Long Break Minutes
            <input
              className={inputClass}
              type="number"
              value={timer.longBreakMinutes === 0 ? "" : timer.longBreakMinutes}
              onChange={(e) => actions.updateUserTimerSettings({ longBreakMinutes: Number(e.target.value) })}
            />
          </label>
          <label className="block text-sm text-slate-100">
            Cycles Before Long Break
            <input
              className={inputClass}
              type="number"
              value={timer.cyclesBeforeLongBreak === 0 ? "" : timer.cyclesBeforeLongBreak}
              onChange={(e) =>
                actions.updateUserTimerSettings({ cyclesBeforeLongBreak: Number(e.target.value) })
              }
            />
          </label>
        </GlassCard>

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
