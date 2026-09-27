import React from 'react';
import { Droplets } from 'lucide-react';
import ProgressBar from '../UI/ProgressBar';
import Card from '../UI/Card';

const WaterBalance = ({ required, available, deficit }) => {
  const percentage = Math.min(100, Math.round((available / required) * 100)) || 0;
  const isDeficit = deficit > 0 || available < required;

  return (
    <Card title="Water Balance" icon={Droplets}>
      <div className="flex items-end justify-between mb-2">
        <div>
          <p className="text-3xl font-bold text-gray-900">{available} <span className="text-sm font-medium text-gray-500">mm available</span></p>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-500">Required: {required} mm</p>
        </div>
      </div>
      
      <ProgressBar 
        value={available} 
        max={required} 
        color={isDeficit ? 'bg-red-500' : 'bg-blue-500'} 
        size="lg"
        className="mb-4"
      />
      
      <div className="flex justify-between items-center text-sm font-medium">
        <span className={isDeficit ? 'text-red-600' : 'text-blue-600'}>
          {percentage}% Covered
        </span>
        {isDeficit && (
          <span className="text-red-600 flex items-center gap-1">
            Deficit: {deficit || (required - available)} mm
          </span>
        )}
        {!isDeficit && (
          <span className="text-green-600">
            Surplus: {available - required} mm
          </span>
        )}
      </div>
    </Card>
  );
};

export default WaterBalance;
