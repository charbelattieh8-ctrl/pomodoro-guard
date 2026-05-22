import { useEffect, useMemo, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Coins, ChevronDown, Sparkles } from "lucide-react";
import GlassCard from "../components/GlassCard";
import PrimaryButton from "../components/PrimaryButton";
import ThemePreview from "../components/ThemePreview";
import { useAppState } from "../context/useAppState";
import { useAuth } from "../context/useAuth";
import { THEME_CATEGORIES } from "../lib/themes";
import { COIN_PACKAGES } from "../lib/packages";

export default function ShopPage() {
  const { state, actions, addToast } = useAppState();
  const { user } = useAuth();
  const themes = state.admin.config.themes;
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [collapsed, setCollapsed] = useState(new Set());
  const [buyingId, setBuyingId] = useState(null);

  // Handle post-checkout redirect
  useEffect(() => {
    const purchase = searchParams.get("purchase");
    if (purchase === "success") {
      addToast("Purchase successful! Coins added to your balance.", "success");
      navigate("/shop", { replace: true });
    } else if (purchase === "cancelled") {
      addToast("Purchase cancelled.", "info");
      navigate("/shop", { replace: true });
    }
  }, [searchParams, addToast, navigate]);

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

  const isAnonymous = user?.isAnonymous;

  const handleBuy = async (packageId) => {
    setBuyingId(packageId);
    await actions.purchaseCoins(packageId);
    setBuyingId(null);
  };

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

      {/* Buy CPoints Section */}
      <section>
        <h3 className="mb-3 font-display text-lg font-semibold flex items-center gap-2">
          <Sparkles size={18} />
          Buy CPoints
        </h3>
        {isAnonymous ? (
          <GlassCard className="p-4 text-center text-sm text-slate-300">
            Sign in with email or Google to purchase CPoints.
          </GlassCard>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {COIN_PACKAGES.map((pkg) => (
              <GlassCard key={pkg.id} className="relative flex flex-col items-center gap-2 p-4">
                {pkg.bonus && (
                  <span className="absolute -top-2 right-3 rounded-full bg-emerald-500/90 px-2 py-0.5 text-[10px] font-bold text-white">
                    {pkg.bonus}
                  </span>
                )}
                <div className="flex items-center gap-1.5 text-lg font-bold">
                  <Coins size={18} className="text-yellow-400" />
                  {pkg.coins.toLocaleString()}
                </div>
                <p className="text-xs text-slate-300">{pkg.label}</p>
                <PrimaryButton
                  className="mt-1 w-full"
                  onClick={() => handleBuy(pkg.id)}
                  disabled={buyingId === pkg.id}
                >
                  {buyingId === pkg.id ? "Redirecting..." : `$${pkg.priceUsd.toFixed(2)}`}
                </PrimaryButton>
              </GlassCard>
            ))}
          </div>
        )}
      </section>

      {/* Theme Categories */}
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
