import React, { useState } from 'react';
import { AlertTriangle, ChevronDown, ChevronUp } from 'lucide-react';

const WarningPanel = ({ warnings }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!warnings || warnings.length === 0) return null;

  return (
    <div className="bg-orange-50 border border-orange-200 rounded-xl overflow-hidden">
      <button 
        className="w-full flex items-center justify-between p-4 focus:outline-none focus:bg-orange-100/50 transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-3">
          <AlertTriangle className="text-orange-500" size={24} />
          <div className="text-left">
            <h4 className="font-semibold text-orange-900">Attention Needed</h4>
            <p className="text-sm text-orange-700">{warnings.length} warning{warnings.length !== 1 ? 's' : ''} detected for your region</p>
          </div>
        </div>
        {isExpanded ? (
          <ChevronUp className="text-orange-500" size={20} />
        ) : (
          <ChevronDown className="text-orange-500" size={20} />
        )}
      </button>
      
      {isExpanded && (
        <div className="p-4 border-t border-orange-100 bg-white/50 space-y-3">
          {warnings.map((warning, index) => (
            <div key={index} className="flex gap-2">
              <span className="text-orange-500 mt-0.5">•</span>
              <p className="text-sm text-orange-900">{warning}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default WarningPanel;
