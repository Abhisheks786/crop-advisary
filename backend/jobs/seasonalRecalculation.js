/**
 * Seasonal Recalculation Job
 * 
 * At the beginning of a new agricultural season:
 * - Recalculate crop scores based on new season
 * - Update seasonal recommendations  
 * - Refresh cached regional recommendations
 * - Generate updated statistics
 * 
 * Can be triggered manually by admin or scheduled via cron
 */

const RecommendationService = require('../services/RecommendationService');
const { invalidateCache } = require('../config/redis');

class SeasonalRecalculationJob {
  constructor() {
    this.isRunning = false;
    this.lastRun = null;
    this.results = null;
  }

  /**
   * Determine the current agricultural season based on month
   */
  getCurrentSeason() {
    const month = new Date().getMonth() + 1; // 1-12
    if (month >= 6 && month <= 10) return 'Kharif';  // June-October
    if (month >= 11 || month <= 3) return 'Rabi';     // November-March
    return 'Zaid';                                      // April-May
  }

  /**
   * Run the seasonal recalculation
   */
  async run() {
    if (this.isRunning) {
      console.log('Seasonal recalculation is already running');
      return { status: 'already_running' };
    }

    this.isRunning = true;
    const startTime = Date.now();
    console.log('\n🌾 Starting Seasonal Recalculation Job...');

    try {
      const currentSeason = this.getCurrentSeason();
      console.log(`Current Season: ${currentSeason}`);

      // Step 1: Invalidate all cached recommendations
      console.log('Step 1: Invalidating cached recommendations...');
      await invalidateCache('recommendation:*');
      console.log('  ✅ Cache invalidated');

      // Step 2: Get sample regional data and recalculate
      console.log('Step 2: Recalculating regional recommendations...');
      const regions = [
        { state: 'Punjab', soil: 'Loamy', ph: 7.0, water: 'Medium' },
        { state: 'Maharashtra', soil: 'Black Soil', ph: 7.5, water: 'Medium' },
        { state: 'Karnataka', soil: 'Clay Loam', ph: 6.5, water: 'Low' },
        { state: 'Uttar Pradesh', soil: 'Alluvial Soil', ph: 7.0, water: 'High' },
        { state: 'Rajasthan', soil: 'Sandy', ph: 7.5, water: 'Low' }
      ];

      const regionalResults = [];
      for (const region of regions) {
        try {
          const result = await RecommendationService.generateRecommendation({
            soilType: region.soil,
            soilPH: region.ph,
            previousCrop: 'None',
            waterAvailability: region.water,
            season: currentSeason,
            landArea: 5,
            landUnit: 'acres',
            state: region.state
          });
          regionalResults.push({
            region: region.state,
            topCrop: result.recommendations[0]?.crop_name,
            score: result.recommendations[0]?.suitability_score,
            totalOptions: result.recommendations.length
          });
          console.log(`  ✅ ${region.state}: Top crop = ${result.recommendations[0]?.crop_name}`);
        } catch (err) {
          console.log(`  ⚠️ ${region.state}: Failed - ${err.message}`);
        }
      }

      // Step 3: Generate statistics summary
      console.log('Step 3: Generating updated statistics...');
      const stats = {
        season: currentSeason,
        regions_processed: regionalResults.length,
        top_crops: [...new Set(regionalResults.map(r => r.topCrop))],
        average_score: Math.round(regionalResults.reduce((sum, r) => sum + (r.score || 0), 0) / regionalResults.length)
      };
      console.log(`  ✅ Stats: ${JSON.stringify(stats)}`);

      const duration = Date.now() - startTime;
      this.lastRun = new Date().toISOString();
      this.results = {
        status: 'completed',
        season: currentSeason,
        duration_ms: duration,
        regions_processed: regionalResults.length,
        regional_results: regionalResults,
        statistics: stats
      };

      console.log(`\n✅ Seasonal Recalculation completed in ${duration}ms`);
      return this.results;

    } catch (error) {
      console.error('❌ Seasonal recalculation failed:', error.message);
      this.results = { status: 'failed', error: error.message };
      return this.results;
    } finally {
      this.isRunning = false;
    }
  }

  getStatus() {
    return {
      isRunning: this.isRunning,
      lastRun: this.lastRun,
      lastResults: this.results
    };
  }
}

module.exports = new SeasonalRecalculationJob();
