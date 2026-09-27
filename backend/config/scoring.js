// Configurable scoring weights for the recommendation engine
// These weights determine how much each factor contributes to the overall crop suitability score
const SCORING_WEIGHTS = {
  soil: 0.25,        // 25% - Soil type compatibility
  season: 0.20,      // 20% - Season suitability
  water: 0.20,       // 20% - Water availability match
  ph: 0.10,          // 10% - Soil pH compatibility
  rotation: 0.10,    // 10% - Crop rotation compatibility
  temperature: 0.10, // 10% - Temperature suitability
  rainfall: 0.05     // 5%  - Rainfall adequacy
};

// Water availability mapping (liters per acre per season)
const WATER_LEVELS = {
  'Very Low': 50000,
  'Low': 150000,
  'Medium': 300000,
  'High': 500000,
  'Very High': 750000
};

// Rainfall categories (mm per season)
const RAINFALL_LEVELS = {
  'Low': 300,
  'Medium': 700,
  'High': 1200,
  'Very High': 2000
};

module.exports = { SCORING_WEIGHTS, WATER_LEVELS, RAINFALL_LEVELS };
