const mongoose = require('mongoose');

const farmSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  farmName: { type: String },
  state: { type: String, required: true },
  district: { type: String, required: true },
  village: { type: String },
  landArea: { type: Number, required: true },
  landUnit: { type: String, enum: ['acres', 'hectares'], default: 'acres' },
  soilType: { type: String, required: true },
  soilPH: { type: Number, required: true },
  irrigationMethod: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Farm', farmSchema);
