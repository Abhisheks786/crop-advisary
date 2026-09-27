import React, { useState } from 'react';
import { AlertTriangle, X } from 'lucide-react';

const DemoModeBanner = () => {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div className="bg-yellow-100 px-4 py-2 sm:px-6 lg:px-8 border-b border-yellow-200">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2 text-yellow-800">
          <AlertTriangle size={18} className="flex-shrink-0" />
          <p className="text-sm font-medium">
            Demo Mode — Using Offline Dataset. Data might not reflect real-time API responses.
          </p>
        </div>
        <button 
          onClick={() => setIsVisible(false)}
          className="p-1 rounded-md hover:bg-yellow-200 text-yellow-700 transition-colors"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
};

export default DemoModeBanner;
