/**
 * Rotation Controller
 * 
 * Handles crop rotation recommendations using the RotationService.
 */

const RotationService = require('../services/RotationService');

/**
 * POST /api/rotation/recommend
 * Get crop rotation recommendation
 */
exports.getRotationRecommendation = async (req, res, next) => {
  try {
    const { currentCrop, previousCrop, season, soilType } = req.body;

    if (!currentCrop) {
      return res.status(400).json({ error: 'currentCrop is required' });
    }

    const plan = await RotationService.getRotationRecommendation({
      currentCrop,
      previousCrop: previousCrop || 'None',
      season: season || 'Rabi',
      soilType: soilType || 'Loamy'
    });

    res.json(plan);
  } catch (err) {
    next(err);
  }
};
