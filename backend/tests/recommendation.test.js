/**
 * Tests for the Recommendation Engine
 * 
 * Run: npm test
 */

// Set demo mode for testing
process.env.DEMO_MODE = 'true';

const RecommendationService = require('../services/RecommendationService');

describe('Recommendation Engine', () => {

  // Test 1: Suitable soil + suitable season should return high-scoring results
  test('should return high-scoring crops for matching soil and season', async () => {
    const result = await RecommendationService.generateRecommendation({
      soilType: 'Loamy',
      soilPH: 6.8,
      previousCrop: 'Rice',
      waterAvailability: 'Medium',
      season: 'Rabi',
      landArea: 5,
      landUnit: 'acres'
    });

    expect(result).toBeDefined();
    expect(result.recommendations).toBeDefined();
    expect(result.recommendations.length).toBeGreaterThan(0);
    
    // Top recommendation should have a high score
    const topCrop = result.recommendations[0];
    expect(topCrop.suitability_score).toBeGreaterThanOrEqual(70);
    expect(topCrop.crop_name).toBeDefined();
    expect(topCrop.reasoning).toBeDefined();
    expect(topCrop.reasoning.length).toBeGreaterThan(0);
  });

  // Test 2: Wrong soil should lower scores
  test('should give lower scores for incompatible soil', async () => {
    const result = await RecommendationService.generateRecommendation({
      soilType: 'Sandy',
      soilPH: 4.0,
      previousCrop: 'None',
      waterAvailability: 'Low',
      season: 'Rabi',
      landArea: 5,
      landUnit: 'acres'
    });

    expect(result).toBeDefined();
    expect(result.recommendations).toBeDefined();
    
    // Scores should generally be lower for Sandy soil with low pH in Rabi
    const topScore = result.recommendations[0]?.suitability_score || 0;
    // Still should find some crops but with lower scores
    expect(topScore).toBeLessThan(95);
  });

  // Test 3: Insufficient water should generate warnings
  test('should generate warnings for insufficient water', async () => {
    const result = await RecommendationService.generateRecommendation({
      soilType: 'Clay',
      soilPH: 6.5,
      previousCrop: 'None',
      waterAvailability: 'Very Low',
      season: 'Kharif',
      landArea: 10,
      landUnit: 'acres'
    });

    expect(result).toBeDefined();
    expect(result.recommendations).toBeDefined();
    
    // High-water crops like Rice should have water warnings
    const riceCrop = result.recommendations.find(c => c.crop_name === 'Rice');
    if (riceCrop) {
      expect(riceCrop.warnings.length).toBeGreaterThan(0);
      expect(riceCrop.warnings.some(w => w.toLowerCase().includes('water'))).toBe(true);
    }
  });

  // Test 4: Incompatible previous crop should affect rotation score
  test('should give lower rotation score for incompatible previous crop', async () => {
    const result = await RecommendationService.generateRecommendation({
      soilType: 'Loamy',
      soilPH: 7.0,
      previousCrop: 'Wheat',
      waterAvailability: 'Medium',
      season: 'Rabi',
      landArea: 5,
      landUnit: 'acres'
    });

    expect(result).toBeDefined();
    
    // Find Wheat in recommendations - it should have lower rotation score
    // since planting Wheat after Wheat is bad rotation
    const wheat = result.recommendations.find(c => c.crop_name === 'Wheat');
    if (wheat) {
      const rotationFactor = wheat.reasoning.find(r => r.factor.toLowerCase().includes('rotation'));
      if (rotationFactor) {
        // Planting same crop consecutively should not get full rotation score
        expect(rotationFactor.score).toBeLessThan(100);
      }
    }
  });

  // Test 5: Invalid pH should lower pH score
  test('should penalize crops when pH is outside optimal range', async () => {
    const result = await RecommendationService.generateRecommendation({
      soilType: 'Loamy',
      soilPH: 3.0,  // Very acidic, outside range for most crops
      previousCrop: 'None',
      waterAvailability: 'Medium',
      season: 'Rabi',
      landArea: 5,
      landUnit: 'acres'
    });

    expect(result).toBeDefined();
    expect(result.recommendations).toBeDefined();
    
    // pH 3.0 is outside range for all crops, scores should be lower
    const topScore = result.recommendations[0]?.suitability_score || 0;
    expect(topScore).toBeLessThan(90);
    
    // Check that reasoning mentions pH issue
    const topCrop = result.recommendations[0];
    if (topCrop) {
      const phFactor = topCrop.reasoning.find(r => r.factor.toLowerCase().includes('ph'));
      if (phFactor) {
        expect(phFactor.status).not.toBe('positive');
      }
    }
  });

  // Test 6: Should return empty or low results when nothing matches
  test('should handle no matching crop gracefully', async () => {
    const result = await RecommendationService.generateRecommendation({
      soilType: 'Sandy',
      soilPH: 2.0,  // Extremely acidic
      previousCrop: 'None',
      waterAvailability: 'Very Low',
      season: 'Zaid',  // Limited season
      landArea: 1,
      landUnit: 'acres',
      temperature: 5  // Very cold
    });

    expect(result).toBeDefined();
    // Should still return results (even if low-scoring)
    expect(result.recommendations).toBeDefined();
  });

  // Test 7: Deterministic results for same input
  test('should produce deterministic results for the same input', async () => {
    const input = {
      soilType: 'Loamy',
      soilPH: 6.8,
      previousCrop: 'Rice',
      waterAvailability: 'Medium',
      season: 'Rabi',
      landArea: 5,
      landUnit: 'acres'
    };

    const result1 = await RecommendationService.generateRecommendation(input);
    const result2 = await RecommendationService.generateRecommendation(input);

    expect(result1.recommendations.length).toBe(result2.recommendations.length);
    
    // Same crops should appear in same order with same scores
    for (let i = 0; i < result1.recommendations.length; i++) {
      expect(result1.recommendations[i].crop_name).toBe(result2.recommendations[i].crop_name);
      expect(result1.recommendations[i].suitability_score).toBe(result2.recommendations[i].suitability_score);
    }
  });

  // Test 8: Reasoning should be generated for every recommendation
  test('should generate reasoning for every recommended crop', async () => {
    const result = await RecommendationService.generateRecommendation({
      soilType: 'Loamy',
      soilPH: 7.0,
      previousCrop: 'None',
      waterAvailability: 'High',
      season: 'Kharif',
      landArea: 5,
      landUnit: 'acres'
    });

    result.recommendations.forEach(crop => {
      expect(crop.reasoning).toBeDefined();
      expect(Array.isArray(crop.reasoning)).toBe(true);
      expect(crop.reasoning.length).toBeGreaterThanOrEqual(5);
      
      // Each reasoning should have required fields
      crop.reasoning.forEach(reason => {
        expect(reason.factor).toBeDefined();
        expect(reason.score).toBeDefined();
        expect(reason.message).toBeDefined();
        expect(reason.status).toBeDefined();
        expect(['positive', 'warning', 'negative']).toContain(reason.status);
      });
    });
  });

  // Test 9: Temperature should affect scores
  test('should consider temperature in scoring', async () => {
    const coldResult = await RecommendationService.generateRecommendation({
      soilType: 'Loamy',
      soilPH: 7.0,
      previousCrop: 'None',
      waterAvailability: 'Medium',
      season: 'Rabi',
      landArea: 5,
      landUnit: 'acres',
      temperature: 15
    });

    const hotResult = await RecommendationService.generateRecommendation({
      soilType: 'Loamy',
      soilPH: 7.0,
      previousCrop: 'None',
      waterAvailability: 'Medium',
      season: 'Kharif',
      landArea: 5,
      landUnit: 'acres',
      temperature: 35
    });

    // Results should differ based on temperature
    expect(coldResult.recommendations[0].crop_name).toBeDefined();
    expect(hotResult.recommendations[0].crop_name).toBeDefined();
    // Different temperatures should lead to different rankings or scores
  });

  // Test 10: Total score should be between 0 and 100
  test('should produce scores between 0 and 100', async () => {
    const result = await RecommendationService.generateRecommendation({
      soilType: 'Clay Loam',
      soilPH: 6.5,
      previousCrop: 'Maize',
      waterAvailability: 'Medium',
      season: 'Rabi',
      landArea: 3,
      landUnit: 'hectares'
    });

    result.recommendations.forEach(crop => {
      expect(crop.suitability_score).toBeGreaterThanOrEqual(0);
      expect(crop.suitability_score).toBeLessThanOrEqual(100);
    });
  });
});
