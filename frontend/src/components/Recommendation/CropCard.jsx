import React from 'react';
import { Droplets, Calendar, Scale, Activity, ArrowRight } from 'lucide-react';
import Card from '../UI/Card';
import Badge from '../UI/Badge';
import Button from '../UI/Button';
import ScoreDisplay from './ScoreDisplay';

const CropCard = ({ crop, rank, onViewDetails, onCompare, isSelected }) => {
  const getSuitabilityLabel = (score) => {
    if (score >= 80) return { label: 'Highly Recommended', variant: 'success' };
    if (score >= 60) return { label: 'Recommended', variant: 'info' };
    if (score >= 40) return { label: 'Possible', variant: 'warning' };
    return { label: 'Not Recommended', variant: 'danger' };
  };

  const suitability = getSuitabilityLabel(crop.suitabilityScore);

  return (
    <Card className={`relative overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-lg ${isSelected ? 'ring-2 ring-green-500' : ''}`}>
      <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-green-400 to-green-600" />
      
      <div className="flex justify-between items-start mb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-gray-100 text-gray-700 text-xs font-bold">
              #{rank}
            </span>
            <h3 className="text-lg font-bold text-gray-900">{crop.name}</h3>
          </div>
          <Badge variant={suitability.variant} size="sm">{suitability.label}</Badge>
        </div>
        <ScoreDisplay score={crop.suitabilityScore} size="sm" />
      </div>

      <div className="grid grid-cols-2 gap-y-3 gap-x-2 text-sm text-gray-600 mb-5">
        <div className="flex items-center gap-1.5">
          <Droplets size={16} className="text-blue-500" />
          <span>{crop.waterLevel}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Calendar size={16} className="text-orange-500" />
          <span>{crop.season}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Scale size={16} className="text-green-500" />
          <span>{crop.yieldPotential} Yield</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Activity size={16} className="text-red-500" />
          <span>{crop.riskLevel} Risk</span>
        </div>
      </div>

      <div className="flex items-center gap-2 mt-auto">
        <Button 
          variant="outline" 
          size="sm" 
          className="flex-1"
          onClick={() => onCompare && onCompare(crop.id)}
        >
          {isSelected ? 'Remove' : 'Compare'}
        </Button>
        <Button 
          variant="primary" 
          size="sm" 
          className="flex-1"
          onClick={() => onViewDetails && onViewDetails(crop.id)}
        >
          Details <ArrowRight size={16} className="ml-1" />
        </Button>
      </div>
    </Card>
  );
};

export default CropCard;
