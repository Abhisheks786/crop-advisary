/**
 * Crop Controller
 * 
 * Handles CRUD operations for crop data.
 * Uses DemoDataService in demo mode, MongoDB otherwise.
 */

const DemoDataService = require('../services/DemoDataService');
const { invalidateCache } = require('../config/redis');

const isDemoMode = () => process.env.DEMO_MODE === 'true';

/**
 * GET /api/crops
 * Get all active crops
 */
exports.getAllCrops = async (req, res, next) => {
  try {
    if (isDemoMode()) {
      return res.json(DemoDataService.getCrops());
    }
    const Crop = require('../models/Crop');
    const crops = await Crop.find({ isActive: true });
    res.json(crops);
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/crops/:id
 * Get a specific crop by ID or name
 */
exports.getCropById = async (req, res, next) => {
  try {
    const idOrName = req.params.id;

    if (isDemoMode()) {
      // Try by index first, then by name
      const crops = DemoDataService.getCrops();
      let crop = crops[parseInt(idOrName)] || 
                 crops.find(c => (c.crop_name || '').toLowerCase() === idOrName.toLowerCase()) ||
                 DemoDataService.getCropById(idOrName);
      if (!crop) return res.status(404).json({ error: 'Crop not found' });
      return res.json(crop);
    }

    const Crop = require('../models/Crop');
    let crop = await Crop.findById(idOrName).catch(() => null);
    if (!crop) {
      crop = await Crop.findOne({ crop_name: new RegExp(`^${idOrName}$`, 'i') });
    }
    if (!crop) return res.status(404).json({ error: 'Crop not found' });
    res.json(crop);
  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/crops
 * Add a new crop (admin only)
 */
exports.addCrop = async (req, res, next) => {
  try {
    if (isDemoMode()) {
      const newCrop = { _id: `crop-${Date.now()}`, ...req.body, isActive: true };
      DemoDataService.getCrops().push(newCrop);
      await invalidateCache('recommendation:*');
      return res.status(201).json(newCrop);
    }

    const Crop = require('../models/Crop');
    const crop = new Crop(req.body);
    await crop.save();
    await invalidateCache('recommendation:*');
    res.status(201).json(crop);
  } catch (err) {
    next(err);
  }
};

/**
 * PUT /api/crops/:id
 * Update a crop (admin only)
 */
exports.updateCrop = async (req, res, next) => {
  try {
    if (isDemoMode()) {
      const crops = DemoDataService.getCrops();
      const idx = crops.findIndex((c, i) => 
        i.toString() === req.params.id || 
        c._id === req.params.id ||
        (c.crop_name || '').toLowerCase() === req.params.id.toLowerCase()
      );
      if (idx === -1) return res.status(404).json({ error: 'Crop not found' });
      crops[idx] = { ...crops[idx], ...req.body };
      await invalidateCache('recommendation:*');
      return res.json(crops[idx]);
    }

    const Crop = require('../models/Crop');
    const crop = await Crop.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!crop) return res.status(404).json({ error: 'Crop not found' });
    await invalidateCache('recommendation:*');
    res.json(crop);
  } catch (err) {
    next(err);
  }
};

/**
 * DELETE /api/crops/:id
 * Soft delete a crop (admin only)
 */
exports.deleteCrop = async (req, res, next) => {
  try {
    if (isDemoMode()) {
      const crops = DemoDataService.getCrops();
      const idx = crops.findIndex((c, i) => 
        i.toString() === req.params.id || c._id === req.params.id
      );
      if (idx !== -1) {
        crops[idx].isActive = false;
      }
      await invalidateCache('recommendation:*');
      return res.json({ message: 'Crop deleted successfully' });
    }

    const Crop = require('../models/Crop');
    const crop = await Crop.findByIdAndUpdate(req.params.id, { isActive: false });
    if (!crop) return res.status(404).json({ error: 'Crop not found' });
    await invalidateCache('recommendation:*');
    res.json({ message: 'Crop marked as inactive' });
  } catch (err) {
    next(err);
  }
};
