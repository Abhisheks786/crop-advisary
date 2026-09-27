/**
 * RecommendationService - Core Scoring-Based Recommendation Engine
 * 
 * This is the CENTERPIECE of the Smart Crop Advisory system.
 * It calculates a weighted suitability score for each crop based on
 * multiple factors and provides explainable recommendations.
 * 
 * Scoring Weights (configurable):
 *   Soil Type:     25%
 *   Season:        20%
 *   Water:         20%
 *   Soil pH:       10%
 *   Crop Rotation: 10%
 *   Temperature:   10%
 *   Rainfall:       5%
 */

const DemoDataService = require('./DemoDataService');
const { SCORING_WEIGHTS, WATER_LEVELS, RAINFALL_LEVELS } = require('../config/scoring');

// Numeric mapping for water requirement comparison
const WATER_NUMERIC = {
  'Very Low': 1,
  'Low': 2,
  'Medium': 3,
  'High': 4,
  'Very High': 5
};

// Rainfall category ordering
const RAINFALL_CATEGORIES = ['Low', 'Medium', 'High', 'Very High'];

class RecommendationService {
  constructor() {
    this.weights = { ...SCORING_WEIGHTS };
  }

  /**
   * Update scoring weights (used by admin)
   */
  updateWeights(newWeights) {
    this.weights = { ...this.weights, ...newWeights };
  }

  /**
   * Get current weights
   */
  getWeights() {
    return { ...this.weights };
  }

  /**
   * Main recommendation method - called by controller
   * Accepts generateRecommendation for backward compat
   */
  async generateRecommendation(params, customWeights = null) {
    return this.getRecommendations(params, customWeights);
  }

  /**
   * Generate crop recommendations based on input parameters
   * 
   * @param {Object} params - Farm input parameters
   * @param {Object} customWeights - Optional custom scoring weights
   * @returns {Object} Recommendations with scoring and reasoning
   */
  async getRecommendations(params, customWeights = null) {
    const {
      soilType, soilPH, previousCrop, waterAvailability,
      season, landArea, landUnit, irrigationMethod,
      temperature, rainfall, state, district
    } = params;

    // Load crop data
    let crops = [];
    const isDemoMode = process.env.DEMO_MODE === 'true';

    if (isDemoMode) {
      crops = DemoDataService.getCrops();
    } else {
      try {
        const Crop = require('../models/Crop');
        crops = await Crop.find({ isActive: true }).lean();
      } catch (err) {
        // Fallback to demo data
        crops = DemoDataService.getCrops();
      }
    }

    if (!crops || crops.length === 0) {
      return {
        recommendations: [],
        input_summary: params,
        total_crops_analyzed: 0,
        generated_at: new Date().toISOString(),
        message: 'No crop data available'
      };
    }

    const weights = customWeights || this.weights;
    const analyzedCrops = [];

    // Score each crop
    for (const crop of crops) {
      const cropName = crop.crop_name || crop.name;
      const warnings = [];
      const reasoning = [];

      // ─────────────────────────────────────────────
      // Factor 1: SOIL TYPE (25%)
      // ─────────────────────────────────────────────
      let soilScore = 0;
      let soilMessage = '';
      const suitableSoils = crop.suitable_soil || [];

      if (suitableSoils.includes(soilType)) {
        soilScore = 100;
        soilMessage = `${soilType} soil is highly suitable for ${cropName} cultivation`;
      } else if (suitableSoils.some(s =>
        s.includes(soilType.split(' ')[0]) || soilType.includes(s.split(' ')[0])
      )) {
        // Partial match (e.g., "Sandy Loam" when "Loamy" is needed)
        soilScore = 30;
        soilMessage = `${soilType} soil is somewhat compatible with ${cropName}`;
      } else {
        soilScore = 0;
        soilMessage = `${soilType} soil is not recommended for ${cropName}`;
      }
      reasoning.push(this._createReasoning('Soil Type', soilScore, weights.soil, soilMessage));

      // ─────────────────────────────────────────────
      // Factor 2: SEASON (20%)
      // ─────────────────────────────────────────────
      let seasonScore = 0;
      let seasonMessage = '';
      const cropSeasons = crop.season || [];

      if (cropSeasons.includes(season)) {
        seasonScore = 100;
        seasonMessage = `${season} season is ideal for ${cropName}`;
      } else if (cropSeasons.length > 1) {
        // Multi-season crop, but current season isn't listed
        seasonScore = 50;
        seasonMessage = `${cropName} grows in multiple seasons, but ${season} is not its primary season`;
      } else {
        seasonScore = 0;
        seasonMessage = `${cropName} is not suitable for ${season} season`;
      }
      reasoning.push(this._createReasoning('Season', seasonScore, weights.season, seasonMessage));

      // ─────────────────────────────────────────────
      // Factor 3: WATER AVAILABILITY (20%)
      // ─────────────────────────────────────────────
      let waterScore = 0;
      let waterMessage = '';
      const availableLevel = WATER_NUMERIC[waterAvailability] || 3;
      const requiredLevel = WATER_NUMERIC[crop.water_requirement] || 3;

      if (availableLevel >= requiredLevel) {
        waterScore = 100;
        if (availableLevel > requiredLevel) {
          waterMessage = `Water availability exceeds ${cropName}'s needs — water efficient choice`;
        } else {
          waterMessage = `Available water meets ${cropName}'s requirement (${crop.water_requirement})`;
        }
      } else {
        // Proportional score
        waterScore = Math.round((availableLevel / requiredLevel) * 100);
        waterScore = Math.max(0, waterScore);
        waterMessage = `Available water (${waterAvailability}) is below ${cropName}'s requirement (${crop.water_requirement})`;
      }
      reasoning.push(this._createReasoning('Water Availability', waterScore, weights.water, waterMessage));
      if (waterScore < 50) {
        warnings.push('Available water may not be sufficient for this crop');
      }

      // ─────────────────────────────────────────────
      // Factor 4: SOIL pH (10%)
      // ─────────────────────────────────────────────
      let phScore = 70; // Default neutral
      let phMessage = 'Soil pH not provided, assuming neutral suitability';

      if (soilPH !== undefined && soilPH !== null && soilPH !== '') {
        const phVal = parseFloat(soilPH);
        const minPh = crop.min_ph || 6.0;
        const maxPh = crop.max_ph || 7.5;

        if (phVal >= minPh && phVal <= maxPh) {
          phScore = 100;
          phMessage = `Soil pH ${phVal} is within the ideal range (${minPh}–${maxPh}) for ${cropName}`;
        } else {
          // Calculate distance from range
          const distance = phVal < minPh ? (minPh - phVal) : (phVal - maxPh);
          phScore = Math.max(0, Math.round(100 - (distance / 0.5) * 25));
          if (distance > 2.0) phScore = 0;
          phMessage = `Soil pH ${phVal} is outside the optimal range (${minPh}–${maxPh}) for ${cropName}`;
        }
      }
      reasoning.push(this._createReasoning('Soil pH', phScore, weights.ph, phMessage));
      if (phScore < 40) {
        warnings.push('Soil pH is outside the recommended range for this crop');
      }

      // ─────────────────────────────────────────────
      // Factor 5: CROP ROTATION (10%)
      // ─────────────────────────────────────────────
      let rotationScore = 100;
      let rotationMessage = 'No previous crop specified — neutral rotation impact';

      if (previousCrop && previousCrop !== 'None' && previousCrop !== '') {
        const compatibleCrops = crop.compatible_previous_crops || [];
        const incompatibleCrops = crop.incompatible_previous_crops || [];

        if (compatibleCrops.includes(previousCrop)) {
          rotationScore = 100;
          rotationMessage = `Excellent rotation: ${previousCrop} → ${cropName} improves soil health`;
        } else if (incompatibleCrops.includes(previousCrop)) {
          rotationScore = 0;
          rotationMessage = `Poor rotation: planting ${cropName} after ${previousCrop} is not recommended`;
        } else if (previousCrop === cropName) {
          // Same crop consecutively
          rotationScore = 20;
          rotationMessage = `Repeated cultivation of ${cropName} depletes soil nutrients`;
        } else {
          rotationScore = 80;
          rotationMessage = `Neutral rotation: ${previousCrop} has no significant impact on ${cropName}`;
        }
      }
      reasoning.push(this._createReasoning('Crop Rotation', rotationScore, weights.rotation, rotationMessage));
      if (rotationScore < 30) {
        warnings.push('Previous crop may negatively affect this crop');
      }

      // ─────────────────────────────────────────────
      // Factor 6: TEMPERATURE (10%)
      // ─────────────────────────────────────────────
      let tempScore = 70; // Default neutral
      let tempMessage = 'Temperature not provided — neutral impact assumed';

      if (temperature !== undefined && temperature !== null && temperature !== '') {
        const temp = parseFloat(temperature);
        const minT = crop.min_temperature || 15;
        const maxT = crop.max_temperature || 35;

        if (temp >= minT && temp <= maxT) {
          tempScore = 100;
          tempMessage = `Temperature ${temp}°C is within the ideal range (${minT}°C–${maxT}°C) for ${cropName}`;
        } else {
          const distance = temp < minT ? (minT - temp) : (temp - maxT);
          tempScore = Math.max(0, Math.round(100 - distance * 5));
          tempMessage = `Temperature ${temp}°C is outside the ideal range (${minT}°C–${maxT}°C) for ${cropName}`;
        }
      }
      reasoning.push(this._createReasoning('Temperature', tempScore, weights.temperature, tempMessage));

      // ─────────────────────────────────────────────
      // Factor 7: RAINFALL (5%)
      // ─────────────────────────────────────────────
      let rainScore = 70; // Default neutral
      let rainMessage = 'Rainfall not provided — neutral impact assumed';

      if (rainfall && crop.rainfall_requirement) {
        const inputIndex = RAINFALL_CATEGORIES.indexOf(rainfall);
        const cropIndex = RAINFALL_CATEGORIES.indexOf(crop.rainfall_requirement);

        if (inputIndex !== -1 && cropIndex !== -1) {
          const diff = Math.abs(inputIndex - cropIndex);
          if (diff === 0) {
            rainScore = 100;
            rainMessage = `Rainfall (${rainfall}) matches ${cropName}'s requirement perfectly`;
          } else if (diff === 1) {
            rainScore = 60;
            rainMessage = `Rainfall (${rainfall}) is close to ${cropName}'s requirement (${crop.rainfall_requirement})`;
          } else {
            rainScore = 30;
            rainMessage = `Rainfall (${rainfall}) is significantly different from ${cropName}'s requirement (${crop.rainfall_requirement})`;
          }
        }
      }
      reasoning.push(this._createReasoning('Rainfall', rainScore, weights.rainfall, rainMessage));

      // ─────────────────────────────────────────────
      // CALCULATE TOTAL SCORE
      // ─────────────────────────────────────────────
      const totalScore = Math.round(
        soilScore * weights.soil +
        seasonScore * weights.season +
        waterScore * weights.water +
        phScore * weights.ph +
        rotationScore * weights.rotation +
        tempScore * weights.temperature +
        rainScore * weights.rainfall
      );

      // Clamp score to 0-100
      const clampedScore = Math.max(0, Math.min(100, totalScore));

      if (clampedScore < 50) {
        warnings.push('This crop has low overall suitability for your conditions');
      }

      // Determine recommendation status
      let status, suitabilityLabel;
      if (clampedScore >= 70) {
        status = 'recommended';
        suitabilityLabel = 'Highly Suitable';
      } else if (clampedScore >= 50) {
        status = 'possible';
        suitabilityLabel = 'Moderately Suitable';
      } else {
        status = 'not recommended';
        suitabilityLabel = 'Not Recommended';
      }

      // Only include crops with score >= 30 (to show some alternatives)
      if (clampedScore >= 30) {
        analyzedCrops.push({
          crop_name: cropName,
          category: crop.category || 'General',
          suitability_score: clampedScore,
          suitability_label: suitabilityLabel,
          risk_level: crop.risk_level || 'Medium',
          water_requirement: crop.water_requirement || 'Medium',
          irrigation_frequency: crop.irrigation_frequency_days
            ? `Every ${crop.irrigation_frequency_days} days`
            : 'As needed',
          crop_duration: crop.crop_duration_days || 120,
          expected_yield: crop.expected_yield_quintal_per_hectare || 0,
          reasoning,
          warnings,
          status,
          // Extra data for downstream use
          seed_rate: crop.seed_rate_kg_per_hectare,
          fertilizer_type: crop.fertilizer_type,
          description: crop.description
        });
      }
    }

    // Sort by suitability score descending
    analyzedCrops.sort((a, b) => b.suitability_score - a.suitability_score);

    // Return top 5-8 crops
    const topCrops = analyzedCrops.slice(0, 8);

    return {
      recommendations: topCrops,
      input_summary: {
        soilType, soilPH, previousCrop, waterAvailability,
        season, landArea, landUnit, irrigationMethod,
        temperature, rainfall, state, district
      },
      total_crops_analyzed: crops.length,
      generated_at: new Date().toISOString()
    };
  }

  /**
   * Create a reasoning entry for a scoring factor
   * @private
   */
  _createReasoning(factor, score, weight, message) {
    let status;
    if (score >= 70) status = 'positive';
    else if (score >= 40) status = 'warning';
    else status = 'negative';

    return {
      factor,
      score: Math.round(score),
      weight,
      weighted_score: Math.round(score * weight * 100) / 100,
      status,
      message
    };
  }
}

module.exports = new RecommendationService();
