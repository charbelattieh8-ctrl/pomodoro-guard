import { motion } from "framer-motion";
import { Coins } from "lucide-react";
import GlassCard from "../components/GlassCard";
import PrimaryButton from "../components/PrimaryButton";
import ThemePreview from "../components/ThemePreview";
import { useAppState } from "../context/AppStateProvider";

export default function ShopPage() {
  const { state, actions } = useAppState();
  const themes = state.admin.config.themes;
  const orderedThemes = [...themes].sort((a, b) => {
    const rank = (t) => {
      if (t.isFree) return 0;
      if (t.tier === "premium") return 2;
      return 1;
    };
    const tierDiff = rank(a) - rank(b);
    if (tierDiff !== 0) return tierDiff;
    return Number(a.priceCoins || 0) - Number(b.priceCoins || 0);
  });

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="eyebrow">Visual Identity</p>
          <h2 className="mt-2 font-display text-3xl font-semibold tracking-[-0.05em]">Theme Shop</h2>
          <p className="mt-2 text-sm text-slate-200/84">Unlock premium backgrounds and advanced fill effects with coins.</p>
        </div>
        <GlassCard className="px-4 py-3">
          <div className="flex items-center gap-2 text-sm font-semibold">
            <Coins size={16} />
            <span>{state.economy.coins} coins</span>
          </div>
        </GlassCard>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {orderedThemes.map((theme) => {
          const unlocked = state.shop.unlockedThemeIds.includes(theme.id) || theme.isFree;
          const selected = state.user.preferences.selectedThemeId === theme.id;
          const affordable = state.economy.coins >= theme.priceCoins;

          return (
            <ThemePreview key={theme.id} theme={theme} selected={selected} locked={!unlocked}>
              {unlocked ? (
                <PrimaryButton
                  className="w-full"
                  variant={selected ? "ghost" : "solid"}
                  onClick={() => actions.selectTheme(theme.id)}
                >
                  {selected ? "Selected" : "Select"}
                </PrimaryButton>
              ) : (
                <PrimaryButton
                  className="w-full disabled:cursor-not-allowed disabled:opacity-50"
                  onClick={() => actions.unlockTheme(theme.id)}
                  disabled={!affordable}
                >
                  {affordable ? "Unlock" : `Need ${theme.priceCoins - state.economy.coins} more`}
                </PrimaryButton>
              )}
            </ThemePreview>
          );
        })}
      </div>
    </motion.div>
  );
}
