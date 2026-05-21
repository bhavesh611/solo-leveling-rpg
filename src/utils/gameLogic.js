export const RANKS = [
  { name: 'E', minLevel: 1,  color: '#a0a0b0', bg: 'rgba(160,160,176,0.12)', label: 'E-RANK', description: 'Beginner hunter. The journey begins.' },
  { name: 'D', minLevel: 5,  color: '#4ade80', bg: 'rgba(74,222,128,0.12)',  label: 'D-RANK', description: 'Light exercise introduced. Keep pushing.' },
  { name: 'C', minLevel: 10, color: '#60a5fa', bg: 'rgba(96,165,250,0.12)',  label: 'C-RANK', description: 'Moderate intensity. You are no longer weak.' },
  { name: 'B', minLevel: 15, color: '#a78bfa', bg: 'rgba(167,139,250,0.12)', label: 'B-RANK', description: 'Structured programming. A real hunter.' },
  { name: 'A', minLevel: 20, color: '#f59e0b', bg: 'rgba(245,158,11,0.12)',  label: 'A-RANK', description: 'Advanced habits. The elite tier awaits.' },
  { name: 'S', minLevel: 25, color: '#f97316', bg: 'rgba(249,115,22,0.12)',  label: 'S-RANK', description: 'Elite. You have surpassed all limits.' },
];

export const getRankObj = (rankName) => RANKS.find(r => r.name === rankName) || RANKS[0];

export const getRankForLevel = (level) => {
  for (let i = RANKS.length - 1; i >= 0; i--) {
    if (level >= RANKS[i].minLevel) return RANKS[i];
  }
  return RANKS[0];
};

export const calcXpToNext = (level) => {
  let threshold = 100;
  for (let i = 1; i < level; i++) threshold = Math.floor(threshold * 1.5);
  return threshold;
};

export const getStartingStats = (activityLevel) => {
  if (activityLevel === 'lightly')    return { STR: 10, AGI: 8,  VIT: 9,  END: 7  };
  if (activityLevel === 'moderately') return { STR: 13, AGI: 11, VIT: 12, END: 10 };
  if (activityLevel === 'very')       return { STR: 16, AGI: 14, VIT: 15, END: 13 };
  return { STR: 8, AGI: 6, VIT: 7, END: 5 };
};

export const processXP = (player, xpGained) => {
  let { xp, level, stats } = player;
  let leveledUp = false;
  const oldRank = player.rank;

  xp += xpGained;
  stats = { ...stats };

  while (xp >= calcXpToNext(level)) {
    xp -= calcXpToNext(level);
    level++;
    stats.STR += 2; stats.AGI += 2; stats.VIT += 2; stats.END += 2;
    leveledUp = true;
  }

  const newRankObj = getRankForLevel(level);
  return {
    ...player,
    xp,
    level,
    rank: newRankObj.name,
    xpToNext: calcXpToNext(level),
    stats,
    _leveledUp: leveledUp,
    _rankChanged: newRankObj.name !== oldRank,
    _newRank: newRankObj.name,
    _oldRank: oldRank,
  };
};

export const getDefaultQuests = () => [
  { id: 1, type: 'workout',   title: 'PUSH-UP CIRCUIT',      description: 'Complete 3 sets of 10 push-ups. Rest 60 seconds between sets. Focus on form.', xp: 20, completed: false },
  { id: 2, type: 'workout',   title: 'MORNING WALK',         description: 'Walk for 15 minutes at a comfortable pace. Any time of day counts.', xp: 15, completed: false },
  { id: 3, type: 'nutrition', title: 'PROTEIN INTAKE',       description: 'Consume a meal containing at least 20g of protein (eggs, chicken, legumes).', xp: 15, completed: false },
  { id: 4, type: 'nutrition', title: 'VEGETABLE SERVING',    description: 'Include 2 servings of vegetables in your meals today.', xp: 10, completed: false },
  { id: 5, type: 'hydration', title: 'HYDRATION TARGET',     description: 'Drink at least 2 liters of water throughout the day. Track each glass.', xp: 10, completed: false },
];
