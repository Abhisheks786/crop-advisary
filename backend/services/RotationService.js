/**
 * RotationService - Crop Rotation Recommendation Engine
 * 
 * Recommends next crops based on rotation compatibility, soil health,
 * nitrogen fixation benefits, and seasonal appropriateness.
 */

const DemoDataService = require('./DemoDataService');

class RotationService {
  /**
   * Get rotation recommendation
   * Supports both method names for compatibility
   */
  async getRotationRecommendation(params) {
    return this.getRotationPlan(params);
  }

  getRotationPlan(params) {
    const { currentCrop, previousCrop, season, soilType } = params;
    const rotations = DemoDataService.getCropRotation();
    const crops = DemoDataService.getCrops();

    // Helper to find crop data by name (handles both 'name' and 'crop_name' fields)
    const findCrop = (name) => {
      if (!name || name === 'None') return null;
      return crops.find(c =>
        (c.crop_name || c.name || '').toLowerCase() === name.toLowerCase()
      );
    };

    const currentCropData = findCrop(currentCrop) || { crop_name: currentCrop };
    const prevCropData = findCrop(previousCrop);
    const currentName = currentCropData.crop_name || currentCropData.name || currentCrop;

    let suggestedNext = [];

    // Find rotation entry for the current crop
    const rotationEntry = rotations.find(r =>
      (r.crop_name || r.current_crop || '').toLowerCase() === currentCrop.toLowerCase()
    );

    if (rotationEntry) {
      // Use good_successors if available, otherwise fall back to next_crops
      const successors = rotationEntry.good_successors || rotationEntry.next_crops || [];

      successors.forEach(successor => {
        const successorName = typeof successor === 'string' ? successor : successor.name;
        const successorCropData = findCrop(successorName);

        if (successorCropData) {
          const successorRotation = rotations.find(r =>
            (r.crop_name || '').toLowerCase() === successorName.toLowerCase()
          );

          suggestedNext.push({
            crop_name: successorCropData.crop_name || successorName,
            season: (successorCropData.season || [])[0] || 'Any',
            rotation_benefit: successorRotation?.rotation_benefits || 
              (typeof successor === 'object' ? successor.benefit : 'Provides good rotation benefit'),
            soil_impact: successorRotation?.soil_impact || 'Neutral',
            nitrogen_fixing: successorRotation?.nitrogen_fixing || false,
            compatibility_score: typeof successor === 'object' ? (successor.score || 85) : 85,
            reason: this._getRotationReason(currentCropData, successorCropData)
          });
        } else {
          suggestedNext.push({
            crop_name: successorName,
            season: 'Any',
            rotation_benefit: typeof successor === 'object' ? successor.benefit : 'Standard rotation practice',
            soil_impact: 'Neutral',
            nitrogen_fixing: false,
            compatibility_score: 75,
            reason: 'Recommended rotation sequence'
          });
        }
      });
    }

    // If no rotation data found, infer based on crop category
    if (suggestedNext.length === 0) {
      suggestedNext = this._inferRotation(currentCropData, crops, season);
    }

    // Sort by compatibility score
    suggestedNext.sort((a, b) => b.compatibility_score - a.compatibility_score);

    // Limit to top 3
    suggestedNext = suggestedNext.slice(0, 3);

    // Build rotation sequence
    const sequence = [];
    if (previousCrop && previousCrop !== 'None') sequence.push(previousCrop);
    sequence.push(currentCrop);
    if (suggestedNext.length > 0) sequence.push(suggestedNext[0].crop_name);

    // Determine compatibility rating
    let compatibility = 'Good';
    if (rotationEntry) {
      const badPredecessors = rotationEntry.bad_predecessors || rotationEntry.incompatible_previous || [];
      if (previousCrop && badPredecessors.includes(previousCrop)) {
        compatibility = 'Poor';
      } else {
        const goodPredecessors = rotationEntry.good_predecessors || rotationEntry.compatible_previous || [];
        if (previousCrop && goodPredecessors.includes(previousCrop)) {
          compatibility = 'Excellent';
        }
      }
    }

    // Build warnings
    const warnings = [];
    if (previousCrop === currentCrop) {
      warnings.push('Growing the same crop consecutively depletes specific soil nutrients. Consider rotation.');
    }

    // Get soil impact for current crop from rotation data
    const currentRotation = rotations.find(r =>
      (r.crop_name || '').toLowerCase() === currentCrop.toLowerCase()
    );

    return {
      previous_crop: prevCropData ? {
        name: prevCropData.crop_name || previousCrop,
        season: (prevCropData.season || [])[0] || 'Unknown',
        soil_impact: this._getSoilImpact(prevCropData, rotations)
      } : null,
      current_crop: {
        name: currentName,
        season: (currentCropData.season || [])[0] || season || 'Unknown',
        soil_impact: currentRotation?.soil_impact || 'Neutral'
      },
      suggested_next: suggestedNext,
      rotation_sequence: sequence,
      compatibility,
      warnings
    };
  }

  /**
   * Infer rotation when no explicit data is available
   * @private
   */
  _inferRotation(currentCrop, allCrops, season) {
    const category = (currentCrop.category || '').toLowerCase();
    const suggestions = [];

    // Category-based rotation rules
    const rotationMap = {
      'cereal': ['Pulse', 'Legume', 'Oilseed'],
      'pulse': ['Cereal', 'Vegetable'],
      'oilseed': ['Cereal', 'Pulse'],
      'cash crop': ['Pulse', 'Cereal'],
      'vegetable': ['Cereal', 'Pulse', 'Oilseed']
    };

    const preferredCategories = rotationMap[category] || ['Pulse', 'Cereal'];

    allCrops.forEach(crop => {
      const cropName = crop.crop_name || crop.name;
      const cropCategory = crop.category || '';

      if (cropName === (currentCrop.crop_name || currentCrop.name)) return;

      if (preferredCategories.includes(cropCategory)) {
        suggestions.push({
          crop_name: cropName,
          season: (crop.season || [])[0] || 'Any',
          rotation_benefit: `${cropCategory} after ${currentCrop.category || 'current crop'} provides good rotation benefit`,
          soil_impact: cropCategory === 'Pulse' ? 'Improves' : 'Neutral',
          nitrogen_fixing: cropCategory === 'Pulse',
          compatibility_score: cropCategory === 'Pulse' ? 90 : 80,
          reason: this._getRotationReason(currentCrop, crop)
        });
      }
    });

    return suggestions;
  }

  /**
   * Generate human-readable rotation reason
   * @private
   */
  _getRotationReason(fromCrop, toCrop) {
    const fromCat = (fromCrop.category || '').toLowerCase();
    const toCat = (toCrop.category || '').toLowerCase();
    const toName = toCrop.crop_name || toCrop.name;

    if (toCat === 'pulse') {
      return `${toName} (legume) fixes atmospheric nitrogen, restoring soil fertility after ${fromCrop.crop_name || fromCrop.name}`;
    }
    if (fromCat === 'pulse' && toCat === 'cereal') {
      return `${toName} benefits from nitrogen fixed by the previous legume crop`;
    }
    if (fromCat === toCat) {
      return `Different variety within same category provides moderate rotation benefit`;
    }
    return `${toName} utilizes different soil nutrients, providing good crop diversity`;
  }

  /**
   * Get soil impact for a crop
   * @private
   */
  _getSoilImpact(crop, rotations) {
    const entry = rotations.find(r =>
      (r.crop_name || '').toLowerCase() === (crop.crop_name || crop.name || '').toLowerCase()
    );
    return entry?.soil_impact || 'Neutral';
  }
}

module.exports = new RotationService();
