/**
 * ResourceService - Resource Planning Module
 * 
 * Calculates estimated resource requirements for a given crop and land area.
 * Includes seeds, water, fertilizer, labour, cost, and expected yield.
 */

const DemoDataService = require('./DemoDataService');
const { convertToHectares } = require('../utils/helpers');

class ResourceService {
  /**
   * Calculate resource requirements
   * Supports both method names for compatibility
   */
  async calculateResources(params) {
    return this.planResources(params);
  }

  planResources(params) {
    const { crop_name, landArea, landUnit } = params;

    const crop = DemoDataService.getCropByName(crop_name);
    if (!crop) {
      throw new Error(`Crop "${crop_name}" not found in database`);
    }

    const cropName = crop.crop_name || crop.name;
    const areaHectares = convertToHectares(landArea, landUnit);

    // Extract per-hectare values from crop data (using correct field names)
    const seedKgPerHa = crop.seed_rate_kg_per_hectare || 100;
    const waterMmPerCycle = crop.water_requirement_mm || 450;
    const fertKgPerHa = crop.fertilizer_requirement_kg_per_hectare || 120;
    const laborDaysPerHa = crop.labour_requirement_days_per_hectare || 45;
    const yieldQuintalsPerHa = crop.expected_yield_quintal_per_hectare || 35;
    const estimatedCostPerHa = crop.estimated_cost_per_hectare || 30000;
    const fertTypes = crop.fertilizer_type || ['Urea', 'DAP', 'MOP'];

    // Scale by actual land area
    const totalSeeds = Math.round(seedKgPerHa * areaHectares);
    // Convert water from mm to liters: 1mm over 1 hectare = 10,000 liters
    const totalWater = Math.round(waterMmPerCycle * 10000 * areaHectares);
    const totalFert = Math.round(fertKgPerHa * areaHectares);
    const totalLabor = Math.round(laborDaysPerHa * areaHectares);
    const expectedYield = Math.round(yieldQuintalsPerHa * areaHectares * 10) / 10;

    // Cost breakdown (realistic Indian agricultural costs)
    const seedCostPerKg = 40; // Average seed cost
    const fertCostPerKg = 25; // Average fertilizer cost
    const laborCostPerDay = 400; // Daily wage
    const irrigationCostPerHa = 5000;
    const miscCostPerHa = 3000;

    const costBreakdown = {
      seeds: Math.round(totalSeeds * seedCostPerKg),
      fertilizer: Math.round(totalFert * fertCostPerKg),
      labour: Math.round(totalLabor * laborCostPerDay),
      irrigation: Math.round(areaHectares * irrigationCostPerHa),
      miscellaneous: Math.round(areaHectares * miscCostPerHa)
    };

    const totalCost = Object.values(costBreakdown).reduce((a, b) => a + b, 0);

    return {
      crop_name: cropName,
      land_area: { value: parseFloat(landArea), unit: landUnit },
      land_area_hectares: Math.round(areaHectares * 100) / 100,
      resources: {
        seeds: {
          quantity: totalSeeds,
          unit: 'kg',
          description: `${cropName} seeds at ${seedKgPerHa} kg/hectare`
        },
        water: {
          quantity: totalWater,
          unit: 'liters',
          description: `Total water for entire crop duration (${crop.crop_duration_days || 120} days)`
        },
        fertilizer: {
          quantity: totalFert,
          unit: 'kg',
          types: fertTypes,
          description: `${fertTypes.join(', ')} fertilizers`
        },
        labour: {
          quantity: totalLabor,
          unit: 'worker-days',
          description: 'Total manual labour required'
        },
        estimated_cost: {
          amount: totalCost,
          currency: 'INR',
          description: 'Estimated total input cost'
        },
        expected_yield: {
          quantity: expectedYield,
          unit: 'quintals',
          description: 'Expected yield under normal conditions'
        }
      },
      cost_breakdown: costBreakdown
    };
  }
}

module.exports = new ResourceService();
