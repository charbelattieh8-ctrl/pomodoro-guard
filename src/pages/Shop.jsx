import { motion } from "framer-motion";
import { Coins } from "lucide-react";
import GlassCard from "../components/GlassCard";
import PrimaryButton from "../components/PrimaryButton";
import ThemePreview from "../components/ThemePreview";
import { useAppState } from "../context/AppStateProvider";

export default function ShopPage() {
  const { state, actions } = useAppState();
  const themes = state.admin.config.themes;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="font-display text-2xl font-semibold">Theme Shop</h2>
          <p className="text-sm text-slate-200">Unlock premium gradients with coins.</p>
        </div>
        <GlassCard className="px-4 py-2">
          <div className="flex items-center gap-2 text-sm font-semibold">
            <Coins size={16} />
            <span>{state.economy.coins} coins</span>
          </div>
        </GlassCard>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {themes.map((theme) => {
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
