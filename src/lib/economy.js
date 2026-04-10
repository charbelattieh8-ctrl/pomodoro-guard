export const addCoins = (economy, amount) => ({
  coins: Math.max(0, economy.coins + amount),
  earnedTotal: Math.max(0, economy.earnedTotal + Math.max(0, amount)),
});

export const canAfford = (coins, cost) => coins >= cost;

/** Scale focus rewards by duration: 1 coin per 5 minutes, minimum 15 min to earn. */
export const calculateFocusReward = (plannedMinutes) => {
  if (plannedMinutes < 15) return 0;
  return Math.floor(plannedMinutes / 5);
};
