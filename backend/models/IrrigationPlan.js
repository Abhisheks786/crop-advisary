const mongoose = require('mongoose');

const irrigationPlanSchema = new mongoose.Schema({
  recommendationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Recommendation' },
  crop_name: { type: String },
  landArea: { type: Number },
  landUnit: { type: String },
  irrigationMethod: { type: String },
  totalWaterRequired: { type: Number },
  waterAvailable: { type: Number },
  waterSurplusDeficit: { type: Number },
  schedule: [{ stage_name: String, day: Number, water_mm: Number, water_liters: Number, status: String }],
  criticalStages: [{ type: String }],
  frequency: { type: String },
  warnings: [{ type: String }],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('IrrigationPlan', irrigationPlanSchema);
