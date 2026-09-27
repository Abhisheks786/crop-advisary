/**
 * Irrigation Controller
 * 
 * Handles irrigation plan calculation using the IrrigationService.
 */

const IrrigationService = require('../services/IrrigationService');

/**
 * POST /api/irrigation/calculate
 * Calculate irrigation plan for a crop
 */
exports.calculateIrrigation = async (req, res, next) => {
  try {
    const { crop_name, landArea, landUnit, waterAvailability, irrigationMethod, season } = req.body;

    if (!crop_name) {
      return res.status(400).json({ error: 'crop_name is required' });
    }

    const plan = await IrrigationService.calculateIrrigation({
      crop_name,
      landArea: landArea || 5,
      landUnit: landUnit || 'acres',
      waterAvailability: waterAvailability || 'Medium',
      irrigationMethod: irrigationMethod || 'Flood',
      season: season || 'Rabi'
    });

    res.status(200).json(plan);
  } catch (err) {
    next(err);
  }
};
