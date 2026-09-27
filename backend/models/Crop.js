const mongoose = require('mongoose');

const cropSchema = new mongoose.Schema({
  crop_name: { type: String, unique: true, index: true },
  category: String,
  water_requirement: Object,
  ideal_soil: [String],
  ph_range: Object,
  temperature_range: Object,
  season: [String],
  growth_stages: [Object],
  expected_yield: Object,
  isActive: { type: Boolean, default: true }
}, { timestamps: true, strict: false }); // Strict false allows other dynamic arrays/objects from crops.json

module.exports = mongoose.model('Crop', cropSchema);
