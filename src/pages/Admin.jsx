import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import GlassCard from "../components/GlassCard";
import Modal from "../components/Modal";
import PrimaryButton from "../components/PrimaryButton";
import { useAppState } from "../context/AppStateProvider";
import { hashStringSHA256 } from "../lib/utils";

export default function AdminPage() {
  const { state, actions } = useAppState();
  const [unlocked, setUnlocked] = useState(false);
  const [passcode, setPasscode] = useState("");
  const [showReset, setShowReset] = useState(false);

  const [coinsPerCompletedFocus, setCoinsPerCompletedFocus] = useState(
    state.admin.config.rewards.coinsPerCompletedFocus
  );
  const [bonusCoins, setBonusCoins] = useState(state.admin.config.rewards.bonusCoins);
  const [themesJson, setThemesJson] = useState(
    JSON.stringify(state.admin.config.themes, null, 2)
  );
  const [milestonesJson, setMilestonesJson] = useState(
    JSON.stringify(state.admin.config.milestoneDefinitions, null, 2)
  );
  const [newPasscode, setNewPasscode] = useState("");
  const [grantCoinsValue, setGrantCoinsValue] = useState("1000");

  const errorText = useMemo(() => {
    try {
      JSON.parse(themesJson);
      JSON.parse(milestonesJson);
      return "";
    } catch {
      return "Invalid JSON in themes or milestones.";
    }
  }, [themesJson, milestonesJson]);

  const unlockAdmin = async () => {
    const hash = await hashStringSHA256(passcode);
    if (hash === state.admin.passcodeHash) {
      setUnlocked(true);
      setPasscode("");
    }
  };

  const saveAll = () => {
    if (errorText) return;
    actions.adminUpdateConfig({
      rewards: {
        coinsPerCompletedFocus: Number(coinsPerCompletedFocus),
        bonusCoins: {
          firstSession: Number(bonusCoins.firstSession),
          tenSessions: Number(bonusCoins.tenSessions),
          threeHundredMinutes: Number(bonusCoins.threeHundredMinutes),
          sevenDayStreak: Number(bonusCoins.sevenDayStreak),
        },
      },
      themes: JSON.parse(themesJson),
      milestoneDefinitions: JSON.parse(milestonesJson),
    });

    if (newPasscode.trim()) {
      hashStringSHA256(newPasscode.trim()).then((hash) => actions.adminSetPasscodeHash(hash));
      setNewPasscode("");
    }
  };

  if (!unlocked) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <GlassCard className="mx-auto max-w-md space-y-4 p-5">
          <h2 className="font-display text-2xl font-semibold">Admin Access</h2>
          <p className="text-sm text-slate-200">Enter passcode to unlock admin controls.</p>
          <input
            className="w-full rounded-xl border border-white/20 bg-white/10 px-3 py-2 outline-none"
            type="password"
            value={passcode}
            onChange={(e) => setPasscode(e.target.value)}
            placeholder="Passcode"
          />
          <PrimaryButton className="w-full" onClick={unlockAdmin}>
            Unlock
          </PrimaryButton>
        </GlassCard>
      </motion.div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
      <h2 className="font-display text-2xl font-semibold">Admin Config</h2>
      <GlassCard className="space-y-4 p-4">
        <h3 className="font-semibold">Rewards</h3>
        <div className="grid gap-3 md:grid-cols-2">
          <label className="text-sm">
            Coins Per Focus
            <input
              className="mt-1 w-full rounded-lg bg-white/10 px-3 py-2"
              type="number"
              value={coinsPerCompletedFocus}
              onChange={(e) => setCoinsPerCompletedFocus(e.target.value)}
            />
          </label>
          {Object.keys(bonusCoins).map((key) => (
            <label key={key} className="text-sm">
              {key}
              <input
                className="mt-1 w-full rounded-lg bg-white/10 px-3 py-2"
                type="number"
                value={bonusCoins[key]}
                onChange={(e) =>
                  setBonusCoins((prev) => ({ ...prev, [key]: Number(e.target.value) }))
                }
              />
            </label>
          ))}
        </div>
      </GlassCard>

      <GlassCard className="space-y-2 p-4">
        <h3 className="font-semibold">Themes (JSON)</h3>
        <textarea
          className="h-48 w-full rounded-xl bg-black/20 p-3 font-mono text-xs"
          value={themesJson}
          onChange={(e) => setThemesJson(e.target.value)}
        />
      </GlassCard>

      <GlassCard className="space-y-2 p-4">
        <h3 className="font-semibold">Milestones (JSON)</h3>
        <textarea
          className="h-48 w-full rounded-xl bg-black/20 p-3 font-mono text-xs"
          value={milestonesJson}
          onChange={(e) => setMilestonesJson(e.target.value)}
        />
      </GlassCard>

      <GlassCard className="space-y-3 p-4">
        <h3 className="font-semibold">Admin Security</h3>
        <input
          className="w-full rounded-xl border border-white/20 bg-white/10 px-3 py-2 outline-none"
          type="password"
          value={newPasscode}
          onChange={(e) => setNewPasscode(e.target.value)}
          placeholder="Set new passcode"
        />
      </GlassCard>

      <GlassCard className="space-y-3 p-4">
        <h3 className="font-semibold">Free Coins</h3>
        <div className="flex flex-wrap items-end gap-3">
          <label className="text-sm">
            Amount
            <input
              className="mt-1 w-48 rounded-lg bg-white/10 px-3 py-2"
              type="number"
              min={1}
              step={1}
              value={grantCoinsValue}
              onChange={(e) => setGrantCoinsValue(e.target.value)}
            />
          </label>
          <PrimaryButton
            onClick={() => {
              actions.adminGrantCoins(grantCoinsValue);
              setGrantCoinsValue("1000");
            }}
          >
            Grant Coins
          </PrimaryButton>
        </div>
        <p className="text-xs text-slate-200">Adds coins directly without any cost.</p>
      </GlassCard>

      {errorText && <p className="text-sm text-rose-200">{errorText}</p>}

      <div className="flex flex-wrap gap-3">
        <PrimaryButton onClick={saveAll} disabled={Boolean(errorText)}>
          Save Admin Config
        </PrimaryButton>
        <PrimaryButton variant="ghost" onClick={() => setShowReset(true)}>
          Reset App Data
        </PrimaryButton>
      </div>

      <Modal
        open={showReset}
        title="Reset all data"
        description="This clears user progress, coins, and settings to defaults."
        onCancel={() => setShowReset(false)}
        onConfirm={() => {
          actions.adminResetData();
          setShowReset(false);
        }}
      />
    </motion.div>
  );
}
