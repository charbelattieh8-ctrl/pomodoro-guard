export const addCoins = (economy, amount) => ({
  coins: Math.max(0, economy.coins + amount),
  earnedTotal: Math.max(0, economy.earnedTotal + Math.max(0, amount)),
});

export const canAfford = (coins, cost) => coins >= cost;
