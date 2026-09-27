const fs = require('fs');
const path = require('path');
const { generateId } = require('../utils/helpers');

class DemoDataService {
  constructor() {
    this.crops = [];
    this.soils = [];
    this.regions = [];
    this.irrigation = [];
    this.cropRotation = [];
    this.recommendations = [];
    this.users = [
      { _id: 'demo-farmer-1', name: 'Demo Farmer', email: 'farmer@demo.com', role: 'farmer', password: 'password' },
      { _id: 'demo-admin-1', name: 'Demo Admin', email: 'admin@demo.com', role: 'admin', password: 'password' }
    ];
    this.dataDir = path.join(__dirname, '..', 'data');
    this.loadData();
  }

  loadData() {
    const files = {
      crops: 'crops.json',
      soils: 'soils.json',
      regions: 'regions.json',
      irrigation: 'irrigation.json',
      cropRotation: 'crop_rotation.json'
    };

    for (const [key, filename] of Object.entries(files)) {
      try {
        const filePath = path.join(this.dataDir, filename);
        if (fs.existsSync(filePath)) {
          this[key] = JSON.parse(fs.readFileSync(filePath, 'utf8'));
          console.log(`  ✅ Loaded ${filename}: ${this[key].length} records`);
        } else {
          console.warn(`  ⚠️  ${filename} not found`);
        }
      } catch (error) {
        console.error(`  ❌ Error loading ${filename}:`, error.message);
      }
    }
  }

  // Crop methods - use crop_name field from JSON data
  getCrops() { return this.crops; }
  getCropByName(name) {
    return this.crops.find(c =>
      (c.crop_name || c.name || '').toLowerCase() === name.toLowerCase()
    );
  }
  getCropById(id) {
    return this.crops.find((c, index) => c._id === id || index.toString() === id);
  }

  // Soil methods
  getSoils() { return this.soils; }

  // Region methods
  getRegions() { return this.regions; }
  getRegionsByState(state) {
    return this.regions.filter(r =>
      r.state.toLowerCase() === state.toLowerCase()
    );
  }

  // Irrigation methods
  getIrrigationMethods() { return this.irrigation; }
  getIrrigationMethodByName(name) {
    return this.irrigation.find(m =>
      (m.method || m.name || '').toLowerCase() === name.toLowerCase()
    );
  }

  // Crop rotation
  getCropRotation() { return this.cropRotation; }
  getRotationForCrop(cropName) {
    return this.cropRotation.find(r =>
      (r.crop_name || '').toLowerCase() === cropName.toLowerCase()
    );
  }

  // Recommendation methods - in-memory storage for demo mode
  addRecommendation(rec) {
    rec._id = rec._id || generateId();
    rec.createdAt = rec.createdAt || new Date().toISOString();
    this.recommendations.push(rec);
    return rec;
  }
  getRecommendations(userId) {
    return this.recommendations
      .filter(r => r.userId === userId || !userId)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }
  getRecommendationById(id) {
    return this.recommendations.find(r => r._id === id);
  }
  getAllRecommendations() {
    return this.recommendations.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }

  // User methods
  getUserByEmail(email) {
    return this.users.find(u => u.email.toLowerCase() === email.toLowerCase());
  }
  getUserById(id) {
    return this.users.find(u => u._id === id);
  }
  addUser(user) {
    user._id = user._id || generateId();
    this.users.push(user);
    return user;
  }

  // Statistics
  getStatistics() {
    const cropCounts = {};
    const regionCounts = {};
    const seasonCounts = {};

    this.recommendations.forEach(rec => {
      // Count top recommended crops
      if (rec.recommendedCrops && rec.recommendedCrops[0]) {
        const cropName = rec.recommendedCrops[0].crop_name;
        cropCounts[cropName] = (cropCounts[cropName] || 0) + 1;
      }
      // Count regions
      if (rec.input && rec.input.state) {
        regionCounts[rec.input.state] = (regionCounts[rec.input.state] || 0) + 1;
      }
      // Count seasons
      if (rec.input && rec.input.season) {
        seasonCounts[rec.input.season] = (seasonCounts[rec.input.season] || 0) + 1;
      }
    });

    // Find most recommended crop
    const sortedCrops = Object.entries(cropCounts).sort((a, b) => b[1] - a[1]);
    const mostRecommendedCrop = sortedCrops.length > 0 ? sortedCrops[0][0] : 'Wheat';

    return {
      totalRecommendations: this.recommendations.length,
      totalUsers: this.users.length,
      totalCrops: this.crops.length,
      totalRegions: this.regions.length,
      mostRecommendedCrop,
      averageScore: this.recommendations.length > 0
        ? Math.round(this.recommendations.reduce((sum, r) =>
            sum + (r.recommendedCrops?.[0]?.suitability_score || 0), 0) / this.recommendations.length)
        : 82,
      topCrops: sortedCrops.slice(0, 5).map(([name, count]) => ({ name, count })),
      regionDistribution: Object.entries(regionCounts).map(([region, count]) => ({ region, count })),
      seasonDistribution: Object.entries(seasonCounts).map(([season, count]) => ({ season, count })),
      // Sample data for charts when no recommendations exist
      cropCategories: [
        { name: 'Cereals', count: this.crops.filter(c => c.category === 'Cereal').length },
        { name: 'Pulses', count: this.crops.filter(c => c.category === 'Pulse').length },
        { name: 'Oilseeds', count: this.crops.filter(c => c.category === 'Oilseed').length },
        { name: 'Cash Crops', count: this.crops.filter(c => c.category === 'Cash Crop').length },
        { name: 'Vegetables', count: this.crops.filter(c => c.category === 'Vegetable').length }
      ],
      waterDistribution: [
        { name: 'Low', count: this.crops.filter(c => c.water_requirement === 'Low').length },
        { name: 'Medium', count: this.crops.filter(c => c.water_requirement === 'Medium').length },
        { name: 'High', count: this.crops.filter(c => c.water_requirement === 'High').length }
      ]
    };
  }
}

module.exports = new DemoDataService();
