/**
 * Region Controller
 * 
 * Handles region data retrieval.
 */

const DemoDataService = require('../services/DemoDataService');

const isDemoMode = () => process.env.DEMO_MODE === 'true';

/**
 * GET /api/regions
 * Get all regions
 */
exports.getAllRegions = async (req, res, next) => {
  try {
    if (isDemoMode()) {
      return res.json(DemoDataService.getRegions());
    }
    const Region = require('../models/Region');
    const regions = await Region.find();
    res.json(regions);
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/regions/:state
 * Get regions by state
 */
exports.getRegionsByState = async (req, res, next) => {
  try {
    const state = req.params.state;

    if (isDemoMode()) {
      return res.json(DemoDataService.getRegionsByState(state));
    }

    const Region = require('../models/Region');
    const regions = await Region.find({
      state: new RegExp(`^${state}$`, 'i')
    });
    res.json(regions);
  } catch (err) {
    next(err);
  }
};
