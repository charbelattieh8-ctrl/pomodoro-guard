import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Coins, ChevronDown } from "lucide-react";
import GlassCard from "../components/GlassCard";
import PrimaryButton from "../components/PrimaryButton";
import ThemePreview from "../components/ThemePreview";
import { useAppState } from "../context/useAppState";
import { THEME_CATEGORIES } from "../lib/themes";

export default function ShopPage() {
  const { state, actions } = useAppState();
  const themes = state.admin.config.themes;

  const [collapsed, setCollapsed] = useState(new Set());

  const toggle = (catId) =>
    setCollapsed((prev) => {
      const next = new Set(prev);
      if (next.has(catId)) next.delete(catId);
      else next.add(catId);
      return next;
    });

  const grouped = useMemo(() => {
    const buckets = new Map();
    for (const cat of THEME_CATEGORIES) buckets.set(cat.id, []);
    for (const theme of themes) {
      const catId = theme.category || "warm";
      if (!buckets.has(catId)) buckets.set(catId, []);
      buckets.get(catId).push(theme);
    }
    return THEME_CATEGORIES.map((cat) => ({
      ...cat,
      themes: buckets.get(cat.id) || [],
    })).filter((g) => g.themes.length > 0);
  }, [themes]);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="font-display text-2xl font-semibold">Theme Shop</h2>
          <p className="text-sm text-slate-200">Unlock premium animated worlds with coins.</p>
        </div>
        <GlassCard className="px-4 py-2">
          <div className="flex items-center gap-2 text-sm font-semibold">
            <Coins size={16} />
            <span>{state.economy.coins} coins</span>
          </div>
        </GlassCard>
      </div>

      {grouped.map((group) => {
        const isOpen = !collapsed.has(group.id);
        const ownedCount = group.themes.filter(
          (t) => t.isFree || state.shop.unlockedThemeIds.includes(t.id)
        ).length;

        return (
          <section key={group.id}>
            <button
              type="button"
              onClick={() => toggle(group.id)}
              className="mb-3 flex w-full items-center gap-3 text-left"
            >
              <div className="flex-1">
                <h3 className="font-display text-lg font-semibold">{group.label}</h3>
                <p className="text-xs text-slate-300">
                  {group.description} &middot; {ownedCount}/{group.themes.length} owned
                </p>
              </div>
              <ChevronDown
                size={18}
                className={`text-slate-300 transition-transform ${isOpen ? "rotate-0" : "-rotate-90"}`}
              />
            </button>

            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  key="grid"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  className="overflow-hidden"
                >
                  <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                    {group.themes.map((theme) => {
                      const unlocked =
                        state.shop.unlockedThemeIds.includes(theme.id) || theme.isFree;
                      const selected = state.user.preferences.selectedThemeId === theme.id;
                      const affordable = state.economy.coins >= theme.priceCoins;

                      return (
                        <ThemePreview
                          key={theme.id}
                          theme={theme}
                          selected={selected}
                          locked={!unlocked}
                        >
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
                              {affordable
                                ? "Unlock"
                                : `Need ${theme.priceCoins - state.economy.coins} more`}
                            </PrimaryButton>
                          )}
                        </ThemePreview>
                      );
                    })}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </section>
        );
      })}
    </motion.div>
  );
}
