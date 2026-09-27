const mongoose = require('mongoose');

const regionSchema = new mongoose.Schema({
  state: { type: String, required: true },
  district: { type: String, required: true },
  region_name: { type: String, required: true },
  soil_types: [{ type: String }],
  seasons: [{ type: String }],
  major_crops: [{ type: String }],
  climate: { type: String },
  avg_temperature: { min: Number, max: Number },
  avg_rainfall_mm: { type: Number },
  water_availability: { type: String }
});

module.exports = mongoose.model('Region', regionSchema);
