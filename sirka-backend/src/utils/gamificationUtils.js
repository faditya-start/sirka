import User from '../models/User.js';

const POINTS_MAP = {
  'LOG_FOOD': 10,
  'LOG_WATER': 5,
  'LOG_SLEEP': 10,
  'LOG_ACTIVITY': 15,
  'DAILY_LOGIN': 5
};

const calculateLevel = (points) => {
  // Simple formula: Level 1 = 0-99, Level 2 = 100-249, Level 3 = 250-449...
  // Or simpler: Level = floor(sqrt(points / 100)) + 1 or similar
  // Let's do: 100 points per level curve
  // Level 1: 0-99
  // Level 2: 100-299
  // Level 3: 300-599
  return Math.floor(Math.sqrt(points / 50)) + 1;
};

// Cek dan update streak harian
const checkAndUpdateStreak = (user) => {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  
  if (!user.lastActiveDate) {
    user.currentStreak = 1;
    user.lastActiveDate = today;
  } else {
    const lastActive = new Date(user.lastActiveDate);
    const lastActiveDay = new Date(lastActive.getFullYear(), lastActive.getMonth(), lastActive.getDate());
    
    const diffTime = Math.abs(today - lastActiveDay);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
    
    if (diffDays === 1) {
      // Login hari berikutnya
      user.currentStreak += 1;
      user.lastActiveDate = today;
    } else if (diffDays > 1) {
      // Terlewat lebih dari sehari, streak 리set
      user.currentStreak = 1;
      user.lastActiveDate = today;
    }
  }

  // Update highest streak
  if (user.currentStreak > user.highestStreak) {
    user.highestStreak = user.currentStreak;
  }
};

const checkBadges = (user) => {
  const newBadges = [];
  
  if (user.currentStreak >= 7 && !user.badges.includes('7_DAY_STREAK')) {
    newBadges.push('7_DAY_STREAK');
  }
  if (user.currentStreak >= 30 && !user.badges.includes('30_DAY_STREAK')) {
    newBadges.push('30_DAY_STREAK');
  }
  if (user.level >= 5 && !user.badges.includes('LEVEL_5_RISING_STAR')) {
    newBadges.push('LEVEL_5_RISING_STAR');
  }
  if (user.level >= 10 && !user.badges.includes('LEVEL_10_MASTER')) {
    newBadges.push('LEVEL_10_MASTER');
  }

  if (newBadges.length > 0) {
    user.badges = [...user.badges, ...newBadges];
  }

  return newBadges;
};

export const awardPoints = async (userId, actionType) => {
  try {
    const user = await User.findById(userId);
    if (!user) return null;

    const pointsToAward = POINTS_MAP[actionType] || 0;
    if (pointsToAward === 0) return user;

    // Update Points
    user.points += pointsToAward;

    // Check level up
    user.level = calculateLevel(user.points);

    // Update streak
    checkAndUpdateStreak(user);

    // Check badges
    const newBadges = checkBadges(user);

    await user.save();

    return {
      pointsAwarded: pointsToAward,
      totalPoints: user.points,
      level: user.level,
      currentStreak: user.currentStreak,
      newBadges
    };
  } catch (error) {
    console.error('Error in awardPoints:', error);
    return null;
  }
};
