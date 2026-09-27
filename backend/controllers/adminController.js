/**
 * Admin Controller
 * 
 * Handles admin-specific operations like statistics, weight management, and overview.
 */

const DemoDataService = require('../services/DemoDataService');
const RecommendationService = require('../services/RecommendationService');
const { getCache, setCache } = require('../config/redis');

const isDemoMode = () => process.env.DEMO_MODE === 'true';

/**
 * GET /api/admin/statistics
 * Get detailed admin statistics
 */
exports.getAdminStatistics = async (req, res, next) => {
  try {
    let stats;

    if (isDemoMode()) {
      stats = DemoDataService.getStatistics();
      stats.systemInfo = {
        demoMode: true,
        uptime: process.uptime(),
        nodeVersion: process.version,
        memoryUsage: process.memoryUsage()
      };
    } else {
      try {
        const Recommendation = require('../models/Recommendation');
        const User = require('../models/User');
        const Crop = require('../models/Crop');

        const [totalRecs, totalUsers, totalCrops] = await Promise.all([
          Recommendation.countDocuments(),
          User.countDocuments(),
          Crop.countDocuments({ isActive: true })
        ]);

        const cropStats = await Recommendation.aggregate([
          { $unwind: '$recommendedCrops' },
          { $group: { _id: '$recommendedCrops.crop_name', count: { $sum: 1 }, avgScore: { $avg: '$recommendedCrops.suitability_score' } } },
          { $sort: { count: -1 } }
        ]).catch(() => []);

        const regionStats = await Recommendation.aggregate([
          { $group: { _id: '$input.state', count: { $sum: 1 } } },
          { $sort: { count: -1 } }
        ]).catch(() => []);

        const seasonStats = await Recommendation.aggregate([
          { $group: { _id: '$input.season', count: { $sum: 1 } } },
          { $sort: { count: -1 } }
        ]).catch(() => []);

        stats = {
          totalRecommendations: totalRecs,
          totalUsers,
          totalCrops,
          topCrops: cropStats.map(c => ({ name: c._id, count: c.count, avgScore: Math.round(c.avgScore) })),
          regionDistribution: regionStats.map(r => ({ region: r._id, count: r.count })),
          seasonDistribution: seasonStats.map(s => ({ season: s._id, count: s.count })),
          systemInfo: {
            demoMode: false,
            uptime: process.uptime(),
            nodeVersion: process.version
          }
        };
      } catch (err) {
        stats = DemoDataService.getStatistics();
      }
    }

    res.json(stats);
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/admin/recommendations
 * Get all recommendations (paginated)
 */
exports.getAllRecommendations = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;

    if (isDemoMode()) {
      const allRecs = DemoDataService.getAllRecommendations();
      const start = (page - 1) * limit;
      return res.json({
        recommendations: allRecs.slice(start, start + limit),
        total: allRecs.length,
        page,
        pages: Math.ceil(allRecs.length / limit)
      });
    }

    const Recommendation = require('../models/Recommendation');
    const total = await Recommendation.countDocuments();
    const recommendations = await Recommendation.find()
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    res.json({
      recommendations,
      total,
      page,
      pages: Math.ceil(total / limit)
    });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/admin/scoring-weights
 * Get current recommendation scoring weights
 */
exports.getScoringWeights = async (req, res, next) => {
  try {
    res.json(RecommendationService.getWeights());
  } catch (err) {
    next(err);
  }
};

/**
 * PUT /api/admin/scoring-weights
 * Update recommendation scoring weights
 */
exports.updateScoringWeights = async (req, res, next) => {
  try {
    const weights = req.body;

    // Validate that weights sum to 1.0 (approximately)
    const sum = Object.values(weights).reduce((a, b) => a + b, 0);
    if (Math.abs(sum - 1.0) > 0.01) {
      return res.status(400).json({
        error: 'Weights must sum to 1.0',
        currentSum: sum
      });
    }

    RecommendationService.updateWeights(weights);

    // Invalidate cached recommendations since weights changed
    const { invalidateCache } = require('../config/redis');
    await invalidateCache('recommendation:*');

    res.json({
      message: 'Scoring weights updated successfully',
      weights: RecommendationService.getWeights()
    });
  } catch (err) {
    next(err);
  }
};
