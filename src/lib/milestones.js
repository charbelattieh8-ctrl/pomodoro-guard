const metricForDefinition = (definition, progress) => {
  if (definition.type === "focusSessionsCompleted") {
    return progress.focusSessionsCompleted;
  }
  if (definition.type === "focusMinutesCompleted") {
    return progress.focusMinutesCompleted;
  }
  if (definition.type === "singleFocusSessionMinutes") {
    return progress.maxSingleFocusMinutes || 0;
  }
  if (definition.type === "streakDays") {
    return progress.streakDays;
  }
  return 0;
};

export const computeMilestoneProgress = (definitions, progress, earnedBadgeIds = []) =>
  definitions.map((definition) => {
    const value = metricForDefinition(definition, progress);
    return {
      ...definition,
      current: value,
      completed: value >= definition.target,
      earned: earnedBadgeIds.includes(definition.id),
      ratio: Math.min(1, value / Math.max(1, definition.target)),
    };
  });

export const collectNewMilestones = ({ definitions, progress, earnedBadgeIds }) => {
  const newMilestones = [];
  for (const definition of definitions) {
    const value = metricForDefinition(definition, progress);
    if (value >= definition.target && !earnedBadgeIds.includes(definition.id)) {
      newMilestones.push(definition);
    }
  }
  return newMilestones;
};
