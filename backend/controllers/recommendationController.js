/**
 * Recommendation Controller
 * 
 * Handles crop recommendation generation, retrieval, and history.
 * Uses the RecommendationService scoring engine for all calculations.
 */

const RecommendationService = require('../services/RecommendationService');
const IrrigationService = require('../services/IrrigationService');
const RotationService = require('../services/RotationService');
const ResourceService = require('../services/ResourceService');
const DemoDataService = require('../services/DemoDataService');
const { getCache, setCache } = require('../config/redis');
const { generateId } = require('../utils/helpers');

const isDemoMode = () => process.env.DEMO_MODE === 'true';

/**
 * POST /api/recommendations
 * Generate crop recommendations based on farm input
 */
exports.generateRecommendation = async (req, res, next) => {
  try {
    const {
      soilType, soilPH, previousCrop, waterAvailability,
      season, landArea, landUnit, irrigationMethod,
      temperature, rainfall, state, district, village
    } = req.body;

    // Validate required fields
    if (!soilType || !season || !waterAvailability) {
      return res.status(400).json({
        error: 'Missing required fields',
        required: ['soilType', 'season', 'waterAvailability']
      });
    }

    // Check cache first
    const cacheKey = `recommendation:${state || 'any'}:${soilType}:${season}:${waterAvailability}:${soilPH || 'any'}:${previousCrop || 'none'}`;
    const cachedResult = await getCache(cacheKey);
    if (cachedResult) {
      return res.status(200).json({
        ...cachedResult,
        cached: true
      });
    }

    // Generate recommendations using the scoring engine
    const result = await RecommendationService.generateRecommendation({
      soilType, soilPH, previousCrop, waterAvailability,
      season, landArea: landArea || 5, landUnit: landUnit || 'acres',
      irrigationMethod, temperature, rainfall, state, district
    });

    // Generate irrigation plan for top recommendation
    let irrigationPlan = null;
    let resourcePlan = null;
    let rotationPlan = null;

    if (result.recommendations.length > 0) {
      const topCrop = result.recommendations[0];

      try {
        irrigationPlan = await IrrigationService.calculateIrrigation({
          crop_name: topCrop.crop_name,
          landArea: landArea || 5,
          landUnit: landUnit || 'acres',
          waterAvailability: waterAvailability,
          irrigationMethod: irrigationMethod || 'Flood',
          season
        });
      } catch (e) {
        console.warn('Irrigation plan generation failed:', e.message);
      }

      try {
        resourcePlan = await ResourceService.calculateResources({
          crop_name: topCrop.crop_name,
          landArea: landArea || 5,
          landUnit: landUnit || 'acres'
        });
      } catch (e) {
        console.warn('Resource plan generation failed:', e.message);
      }

      try {
        rotationPlan = await RotationService.getRotationRecommendation({
          currentCrop: topCrop.crop_name,
          previousCrop: previousCrop || 'None',
          season,
          soilType
        });
      } catch (e) {
        console.warn('Rotation plan generation failed:', e.message);
      }
    }

    // Build the full recommendation object
    const recommendation = {
      _id: generateId(),
      userId: req.user?.id || req.user?._id || 'anonymous',
      input: {
        soilType, soilPH, previousCrop, waterAvailability,
        season, landArea, landUnit, irrigationMethod,
        temperature, rainfall, state, district, village
      },
      recommendedCrops: result.recommendations,
      irrigationPlan,
      resourcePlan,
      rotationPlan,
      totalCropsAnalyzed: result.total_crops_analyzed,
      demoMode: isDemoMode(),
      createdAt: new Date().toISOString()
    };

    // Save recommendation
    if (isDemoMode()) {
      DemoDataService.addRecommendation(recommendation);
    } else {
      try {
        const Recommendation = require('../models/Recommendation');
        const saved = new Recommendation(recommendation);
        await saved.save();
        recommendation._id = saved._id;
      } catch (err) {
        console.warn('Could not save to MongoDB:', err.message);
        DemoDataService.addRecommendation(recommendation);
      }
    }

    // Cache the result
    await setCache(cacheKey, recommendation, 3600);

    res.status(201).json(recommendation);
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/recommendations
 * Get user's recommendation history
 */
exports.getUserRecommendations = async (req, res, next) => {
  try {
    const userId = req.user?.id || req.user?._id;

    if (isDemoMode()) {
      const recs = DemoDataService.getRecommendations(userId);
      return res.json(recs);
    }

    const Recommendation = require('../models/Recommendation');
    const recs = await Recommendation.find({ userId })
      .sort({ createdAt: -1 })
      .limit(50);
    res.json(recs);
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/recommendations/:id
 * Get specific recommendation by ID
 */
exports.getRecommendationById = async (req, res, next) => {
  try {
    if (isDemoMode()) {
      const rec = DemoDataService.getRecommendationById(req.params.id);
      if (!rec) return res.status(404).json({ error: 'Recommendation not found' });
      return res.json(rec);
    }

    const Recommendation = require('../models/Recommendation');
    const rec = await Recommendation.findById(req.params.id);
    if (!rec) return res.status(404).json({ error: 'Recommendation not found' });
    res.json(rec);
  } catch (err) {
    next(err);
  }
};
