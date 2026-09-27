/**
 * Dashboard Controller
 * 
 * Provides dashboard statistics and recent activity data.
 */

const DemoDataService = require('../services/DemoDataService');
const { getCache, setCache } = require('../config/redis');

const isDemoMode = () => process.env.DEMO_MODE === 'true';

/**
 * GET /api/dashboard/statistics
 * Get dashboard statistics
 */
exports.getStatistics = async (req, res, next) => {
  try {
    // Check cache
    const cached = await getCache('dashboard:statistics');
    if (cached) return res.json(cached);

    let stats;

    if (isDemoMode()) {
      stats = DemoDataService.getStatistics();
    } else {
      try {
        const Recommendation = require('../models/Recommendation');
        const User = require('../models/User');
        const Crop = require('../models/Crop');

        const [totalRecs, totalUsers, totalCrops] = await Promise.all([
          Recommendation.countDocuments().catch(() => 0),
          User.countDocuments().catch(() => 0),
          Crop.countDocuments({ isActive: true }).catch(() => 0)
        ]);

        const topCrops = await Recommendation.aggregate([
          { $unwind: '$recommendedCrops' },
          { $group: { _id: '$recommendedCrops.crop_name', count: { $sum: 1 } } },
          { $sort: { count: -1 } },
          { $limit: 5 }
        ]).catch(() => []);

        stats = {
          totalRecommendations: totalRecs,
          totalUsers,
          totalCrops,
          mostRecommendedCrop: topCrops[0]?._id || 'N/A',
          averageScore: 82,
          topCrops: topCrops.map(c => ({ name: c._id, count: c.count }))
        };
      } catch (err) {
        stats = DemoDataService.getStatistics();
      }
    }

    // Cache for 5 minutes
    await setCache('dashboard:statistics', stats, 300);

    res.json(stats);
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/dashboard/recent
 * Get recent recommendations
 */
exports.getRecentRecommendations = async (req, res, next) => {
  try {
    if (isDemoMode()) {
      const recs = DemoDataService.getAllRecommendations().slice(0, 10);
      return res.json(recs);
    }

    const Recommendation = require('../models/Recommendation');
    const recs = await Recommendation.find()
      .sort({ createdAt: -1 })
      .limit(10)
      .select('input recommendedCrops createdAt userId');
    res.json(recs);
  } catch (err) {
    next(err);
  }
};
