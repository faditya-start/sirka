import FoodLog from "../models/FoodLog.js";
import ActivityLog from "../models/ActivityLog.js";
import WeightProgress from "../models/WeightProgress.js";
import WaterLog from "../models/WaterLog.js";


// Get daily summary for user
export const getDailySummary = async (req, res) => {
  try {
    const userId = req.user.id;

    const { date } = req.query;
    const targetDate = new Date(date);
    const startOfDay = new Date(targetDate.setHours(0, 0, 0, 0));
    const endOfDay = new Date(targetDate.setHours(23, 59, 59, 999));

    // Get all food logs on that day
    const foodLogs = await FoodLog.find({
      user: userId,
      date: { $gte: startOfDay, $lte: endOfDay },
    });

    // Get all activity logs on that day
    const activityLogs = await ActivityLog.find({
      user: userId,
      date: { $gte: startOfDay, $lte: endOfDay },
    });

    // Get latest weight log
    const latestWeight = await WeightProgress.findOne({ user: userId }).sort({ date: -1 });

    // Get water logs for the day
    const waterLogs = await WaterLog.find({
      user: userId,
      date: { $gte: startOfDay, $lte: endOfDay },
    });

    // Calculate totals
    const totalCaloriesIn = foodLogs.reduce((sum, log) => sum + log.calories, 0);
    const totalProtein = foodLogs.reduce((sum, log) => sum + (log.protein || 0), 0);
    const totalCarbs = foodLogs.reduce((sum, log) => sum + (log.carbs || 0), 0);
    const totalFat = foodLogs.reduce((sum, log) => sum + (log.fat || 0), 0);
    const totalCaloriesOut = activityLogs.reduce((sum, log) => sum + log.caloriesBurned, 0);
    const totalWater = waterLogs.reduce((sum, log) => sum + log.amount, 0);
    const netCalories = totalCaloriesIn - totalCaloriesOut;

    res.json({
      status: "success",
      summary: {
        totalCaloriesIn,
        totalProtein,
        totalCarbs,
        totalFat,
        totalCaloriesOut,
        netCalories,
        totalWater,
        latestWeight: latestWeight ? latestWeight.weight : null,
      },
      details: {
        foods: foodLogs,
        activities: activityLogs,
        water: waterLogs,
      },
    });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
};

// Get weekly trend 
export const getWeeklyTrend = async (req, res) => {
  try {
    const { userId } = req.query;

    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const foodLogs = await FoodLog.find({
      user: userId,
      date: { $gte: sevenDaysAgo },
    });

    const activityLogs = await ActivityLog.find({
      user: userId,
      date: { $gte: sevenDaysAgo },
    });

    const weightLogs = await WeightProgress.find({
      user: userId,
      date: { $gte: sevenDaysAgo },
    });

    const waterLogs = await WaterLog.find({
      user: userId,
      date: { $gte: sevenDaysAgo },
    });

    const totalCaloriesIn = foodLogs.reduce((sum, log) => sum + log.calories, 0);
    const totalProtein = foodLogs.reduce((sum, log) => sum + (log.protein || 0), 0);
    const totalCarbs = foodLogs.reduce((sum, log) => sum + (log.carbs || 0), 0);
    const totalFat = foodLogs.reduce((sum, log) => sum + (log.fat || 0), 0);
    const totalCaloriesOut = activityLogs.reduce((sum, log) => sum + log.caloriesBurned, 0);
    const totalWater = waterLogs.reduce((sum, log) => sum + log.amount, 0);

    res.json({
      status: "success",
      weeklySummary: {
        totalCaloriesIn,
        totalProtein,
        totalCarbs,
        totalFat,
        totalCaloriesOut,
        netCalories: totalCaloriesIn - totalCaloriesOut,
        totalWater,
        startWeight: weightLogs[weightLogs.length - 1]?.weight || null,
        endWeight: weightLogs[0]?.weight || null,
      },
      logs: {
        foodLogs,
        activityLogs,
        weightLogs,
        waterLogs,
      },
    });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
};
