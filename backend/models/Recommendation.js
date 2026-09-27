const mongoose = require('mongoose');

const recommendationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  farmId: { type: mongoose.Schema.Types.ObjectId, ref: 'Farm' },
  input: { type: Object },
  recommendedCrops: [{
    crop_name: String,
    suitability_score: Number,
    reasoning: [{ factor: String, score: Number, message: String, status: String }],
    water_requirement: String,
    irrigation_frequency: String,
    expected_yield: String,
    risk_level: String,
    category: String
  }],
  selectedCrop: { type: String },
  irrigationPlan: { type: Object },
  resourcePlan: { type: Object },
  rotationPlan: { type: Object },
  warnings: [{ type: String }],
  demoMode: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Recommendation', recommendationSchema);
