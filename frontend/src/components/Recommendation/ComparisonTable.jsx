import React from 'react';
import Badge from '../UI/Badge';

const ComparisonTable = ({ crops }) => {
  if (!crops || crops.length === 0) return null;

  const features = [
    { key: 'suitabilityScore', label: 'Suitability', isHigherBetter: true, format: (val) => `${val}%` },
    { key: 'yieldPotential', label: 'Yield Potential', isHigherBetter: true },
    { key: 'waterRequirement', label: 'Water Need', isHigherBetter: false, format: (val) => `${val} mm` },
    { key: 'duration', label: 'Duration', isHigherBetter: false, format: (val) => `${val} days` },
    { key: 'riskLevel', label: 'Risk Level', isHigherBetter: false },
    { key: 'soilMatch', label: 'Soil Match', isHigherBetter: true, format: (val) => `${val}%` },
    { key: 'profitability', label: 'Est. Profit', isHigherBetter: true }
  ];

  const getBestValueIndex = (featureKey, isHigherBetter) => {
    let bestIdx = 0;
    for (let i = 1; i < crops.length; i++) {
      const currentVal = parseFloat(crops[i][featureKey]) || crops[i][featureKey];
      const bestVal = parseFloat(crops[bestIdx][featureKey]) || crops[bestIdx][featureKey];
      
      if (typeof currentVal === 'number' && typeof bestVal === 'number') {
        if (isHigherBetter ? currentVal > bestVal : currentVal < bestVal) {
          bestIdx = i;
        }
      }
    }
    return bestIdx;
  };

  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
      <table className="min-w-full divide-y divide-gray-200 text-sm">
        <thead className="bg-gray-50">
          <tr>
            <th scope="col" className="px-4 py-3 text-left font-semibold text-gray-900 border-r border-gray-200">Feature</th>
            {crops.map(crop => (
              <th key={crop.id} scope="col" className="px-4 py-3 text-center font-bold text-gray-900 w-1/3">
                {crop.name}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {features.map((feature, idx) => {
            const bestIndex = getBestValueIndex(feature.key, feature.isHigherBetter);
            
            return (
              <tr key={idx} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-medium text-gray-700 border-r border-gray-200">
                  {feature.label}
                </td>
                {crops.map((crop, cIdx) => (
                  <td 
                    key={crop.id} 
                    className={`px-4 py-3 text-center ${cIdx === bestIndex ? 'bg-green-50/50 font-semibold text-green-700' : 'text-gray-600'}`}
                  >
                    {feature.format ? feature.format(crop[feature.key]) : crop[feature.key]}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default ComparisonTable;
