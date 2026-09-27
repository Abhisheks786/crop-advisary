const mongoose = require('mongoose');

const resourcePlanSchema = new mongoose.Schema({
  recommendationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Recommendation' },
  crop_name: { type: String },
  landArea: { type: Number },
  seeds_kg: { type: Number },
  water_liters: { type: Number },
  fertilizer_kg: { type: Number },
  fertilizer_type: [{ type: String }],
  labour_days: { type: Number },
  estimated_cost: { type: Number },
  expected_yield_quintals: { type: Number },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('ResourcePlan', resourcePlanSchema);
