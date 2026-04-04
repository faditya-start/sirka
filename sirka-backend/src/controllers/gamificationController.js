import User from "../models/User.js";

/**
 * Mendapatkan top leaderboard berdasarkan poin gamifikasi
 */
export const getLeaderboard = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    
    const leaderboard = await User.find({})
      .select("name points level badges highestStreak")
      .sort({ points: -1 })
      .limit(limit);

    res.json({
      status: "success",
      message: "Berhasil mengambil leaderboard",
      data: leaderboard
    });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
};

/**
 * Mendapatkan profil gamifikasi user terkait
 */
export const getMyGamificationStats = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId).select("points level badges currentStreak highestStreak lastActiveDate");
    
    if (!user) {
      return res.status(404).json({ status: "error", message: "User tidak ditemukan" });
    }

    // Mendapatkan peringkat user
    const rank = await User.countDocuments({ points: { $gt: user.points } }) + 1;

    res.json({
      status: "success",
      data: {
        ...user._doc,
        rank
      }
    });

  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
};
