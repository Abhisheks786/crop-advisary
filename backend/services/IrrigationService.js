/**
 * IrrigationService - Irrigation Planning Module
 * 
 * Generates stage-wise irrigation schedules with water balance analysis.
 * Considers crop water requirements, land area, irrigation efficiency,
 * and available water to produce actionable irrigation plans.
 */

const DemoDataService = require('./DemoDataService');
const { convertToHectares, calculateWaterInLiters } = require('../utils/helpers');

// Water availability in liters per hectare per season
const WATER_AVAILABILITY_LITERS = {
  'Very Low': 100000,
  'Low': 250000,
  'Medium': 500000,
  'High': 800000,
  'Very High': 1500000
};

class IrrigationService {
  /**
   * Calculate irrigation plan
   * Supports both method names: calculateIrrigation and planIrrigation
   */
  async calculateIrrigation(params) {
    return this.planIrrigation(params);
  }

  planIrrigation(params) {
    const { crop_name, landArea, landUnit, waterAvailability, irrigationMethod, season } = params;

    // Load crop data
    const crop = DemoDataService.getCropByName(crop_name);
    if (!crop) {
      throw new Error(`Crop "${crop_name}" not found in database`);
    }

    const cropName = crop.crop_name || crop.name;

    // Convert land area to hectares for calculations
    const areaHectares = convertToHectares(landArea, landUnit);
    const areaSqMeters = areaHectares * 10000;

    // Find irrigation method efficiency
    const methods = DemoDataService.getIrrigationMethods() || [];
    const iMethod = methods.find(m =>
      (m.method || m.name || '').toLowerCase() === (irrigationMethod || 'Flood').toLowerCase()
    ) || { method: irrigationMethod || 'Flood', efficiency_percent: { min: 50, max: 60 } };

    // Calculate efficiency as a decimal
    const efficiency = iMethod.efficiency_percent
      ? (iMethod.efficiency_percent.min + iMethod.efficiency_percent.max) / 200
      : iMethod.efficiency || 0.50;

    // Build irrigation schedule from crop's irrigation stages
    let totalWaterMm = 0;
    const schedule = [];
    const criticalStages = [];

    // Get stages from crop data - handle different field naming conventions
    const stages = crop.irrigation_stages || [
      { stage_name: 'Initial Irrigation', day: 20, water_mm: 30 },
      { stage_name: 'Vegetative Growth', day: 40, water_mm: 50 },
      { stage_name: 'Flowering', day: 70, water_mm: 60 },
      { stage_name: 'Maturity', day: 100, water_mm: 20 }
    ];

    stages.forEach((s, index) => {
      const stageName = s.stage_name || s.stage || `Stage ${index + 1}`;
      const stageDay = s.day || s.days || (index + 1) * 20;
      const stageWaterMm = s.water_mm || 30;

      // Calculate actual water needed in liters (accounting for efficiency)
      const stageLiters = Math.round(calculateWaterInLiters(stageWaterMm, areaSqMeters) / efficiency);
      totalWaterMm += stageWaterMm;

      // Determine if this is a critical stage
      const isCritical = s.critical ||
        stageName.toLowerCase().includes('flower') ||
        stageName.toLowerCase().includes('grain') ||
        stageName.toLowerCase().includes('crown root');

      schedule.push({
        stage: stageName,
        day: stageDay,
        water_mm: stageWaterMm,
        water_liters: stageLiters,
        status: isCritical ? 'Critical' : 'Important'
      });

      if (isCritical) {
        criticalStages.push(stageName);
      }
    });

    // Calculate total water requirement
    const totalWaterRequired = Math.round(calculateWaterInLiters(totalWaterMm, areaSqMeters) / efficiency);

    // Calculate available water based on level and area
    const availablePerHectare = WATER_AVAILABILITY_LITERS[waterAvailability] || 500000;
    const totalWaterAvailable = Math.round(availablePerHectare * areaHectares);

    // Calculate surplus/deficit
    const surplusDeficit = totalWaterAvailable - totalWaterRequired;

    // Determine water status
    let waterStatus = 'Optimal';
    if (surplusDeficit < -100000) waterStatus = 'Severe Deficit';
    else if (surplusDeficit < 0) waterStatus = 'Slight Deficit';
    else if (surplusDeficit > 200000) waterStatus = 'Surplus';

    // Find alternative low-water crops if there's a deficit
    const alternatives = [];
    if (surplusDeficit < 0) {
      const allCrops = DemoDataService.getCrops();
      const lowerWaterCrops = allCrops
        .filter(c => {
          const cName = c.crop_name || c.name;
          if (cName === cropName) return false;
          const waterReq = c.water_requirement || 'Medium';
          const currentWaterReq = crop.water_requirement || 'Medium';
          const waterOrder = { 'Low': 1, 'Medium': 2, 'High': 3 };
          return (waterOrder[waterReq] || 2) < (waterOrder[currentWaterReq] || 2);
        })
        .map(c => ({
          crop_name: c.crop_name || c.name,
          water_requirement: c.water_requirement,
          category: c.category
        }))
        .slice(0, 3);
      alternatives.push(...lowerWaterCrops);
    }

    // Determine irrigation frequency
    const frequency = crop.irrigation_frequency_days
      ? `Every ${crop.irrigation_frequency_days} days`
      : 'Every 15-20 days';

    // Build warnings
    const warnings = [];
    if (surplusDeficit < 0) {
      warnings.push(`Water deficit of ${Math.abs(surplusDeficit).toLocaleString()} liters detected. Consider water-saving irrigation methods or alternative crops.`);
    }
    if (efficiency < 0.50) {
      warnings.push('Current irrigation method has low efficiency. Consider upgrading to drip or sprinkler irrigation.');
    }

    return {
      crop_name: cropName,
      land_area: { value: parseFloat(landArea), unit: landUnit },
      irrigation_method: {
        name: iMethod.method || iMethod.name || irrigationMethod,
        efficiency: Math.round(efficiency * 100) / 100
      },
      total_water_required_liters: totalWaterRequired,
      water_available_liters: totalWaterAvailable,
      water_surplus_deficit: surplusDeficit,
      water_status: waterStatus,
      schedule,
      critical_stages: criticalStages,
      frequency,
      warnings,
      alternatives
    };
  }
}

module.exports = new IrrigationService();
