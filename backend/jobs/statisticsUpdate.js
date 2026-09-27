/**
 * Statistics Update Job
 * 
 * Aggregates and caches system-wide statistics:
 * - Total recommendations
 * - Most popular crops
 * - Regional distribution
 * - Water usage patterns
 * - Seasonal trends
 */

const { setCache } = require('../config/redis');

class StatisticsUpdateJob {
  constructor() {
    this.isRunning = false;
    this.lastRun = null;
    this.cachedStats = null;
  }

  async run(demoDataService = null) {
    if (this.isRunning) {
      return { status: 'already_running' };
    }

    this.isRunning = true;
    console.log('\n📊 Starting Statistics Update Job...');

    try {
      let stats;

      if (process.env.DEMO_MODE === 'true' && demoDataService) {
        stats = demoDataService.getStatistics();
      } else {
        // In production, aggregate from MongoDB
        const Recommendation = require('../models/Recommendation');
        const User = require('../models/User');
        const Crop = require('../models/Crop');

        const [totalRecs, totalUsers, totalCrops] = await Promise.all([
          Recommendation.countDocuments().catch(() => 0),
          User.countDocuments().catch(() => 0),
          Crop.countDocuments({ isActive: true }).catch(() => 0)
        ]);

        // Get most recommended crops
        const cropAggregation = await Recommendation.aggregate([
          { $unwind: '$recommendedCrops' },
          { $group: { _id: '$recommendedCrops.crop_name', count: { $sum: 1 }, avgScore: { $avg: '$recommendedCrops.suitability_score' } } },
          { $sort: { count: -1 } },
          { $limit: 10 }
        ]).catch(() => []);

        // Get regional distribution
        const regionAggregation = await Recommendation.aggregate([
          { $group: { _id: '$input.state', count: { $sum: 1 } } },
          { $sort: { count: -1 } },
          { $limit: 10 }
        ]).catch(() => []);

        stats = {
          totalRecommendations: totalRecs,
          totalUsers,
          totalCrops,
          topCrops: cropAggregation.map(c => ({ name: c._id, count: c.count, avgScore: Math.round(c.avgScore) })),
          regionDistribution: regionAggregation.map(r => ({ region: r._id, count: r.count })),
          updatedAt: new Date().toISOString()
        };
      }

      // Cache the statistics
      await setCache('system:statistics', stats, 1800); // 30 min cache

      this.cachedStats = stats;
      this.lastRun = new Date().toISOString();

      console.log('✅ Statistics update completed');
      this.isRunning = false;

      return { status: 'completed', stats };
    } catch (error) {
      console.error('❌ Statistics update failed:', error.message);
      this.isRunning = false;
      return { status: 'failed', error: error.message };
    }
  }

  getCachedStats() {
    return this.cachedStats;
  }

  getStatus() {
    return {
      isRunning: this.isRunning,
      lastRun: this.lastRun
    };
  }
}

module.exports = new StatisticsUpdateJob();
