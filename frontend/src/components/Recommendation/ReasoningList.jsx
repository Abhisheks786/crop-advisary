import React from 'react';
import { CheckCircle, AlertTriangle, XCircle } from 'lucide-react';

const ReasoningList = ({ reasoning }) => {
  if (!reasoning || reasoning.length === 0) return null;

  const getIcon = (type) => {
    switch (type) {
      case 'positive': return <CheckCircle className="text-green-500" size={18} />;
      case 'warning': return <AlertTriangle className="text-yellow-500" size={18} />;
      case 'negative': return <XCircle className="text-red-500" size={18} />;
      default: return <CheckCircle className="text-gray-400" size={18} />;
    }
  };

  const getWeightColor = (type) => {
    switch (type) {
      case 'positive': return 'bg-green-500';
      case 'warning': return 'bg-yellow-500';
      case 'negative': return 'bg-red-500';
      default: return 'bg-gray-300';
    }
  };

  return (
    <div className="space-y-3">
      {reasoning.map((item, index) => (
        <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
          <div className="mt-0.5">{getIcon(item.type)}</div>
          <div className="flex-1">
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm font-medium text-gray-900">{item.factor}</span>
              <span className="text-xs font-bold text-gray-600">{item.score}/10</span>
            </div>
            <p className="text-xs text-gray-600 mb-2">{item.message}</p>
            <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className={`h-full ${getWeightColor(item.type)}`} 
                style={{ width: `${(item.score / 10) * 100}%` }}
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ReasoningList;
