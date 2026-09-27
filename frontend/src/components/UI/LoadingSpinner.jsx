import React from 'react';
import { Loader2, Leaf } from 'lucide-react';

const LoadingSpinner = ({ size = 'md', message = 'Loading...', fullScreen = false }) => {
  const sizes = {
    sm: 'w-5 h-5',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  };

  const content = (
    <div className="flex flex-col items-center justify-center gap-3">
      <div className="relative text-green-600">
        <Loader2 className={`animate-spin ${sizes[size]}`} />
        <Leaf className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-50 ${size === 'lg' ? 'w-5 h-5' : 'w-3 h-3'}`} />
      </div>
      {message && <p className="text-gray-500 text-sm font-medium animate-pulse">{message}</p>}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-white/80 backdrop-blur-sm z-50 flex items-center justify-center">
        {content}
      </div>
    );
  }

  return <div className="p-4 flex items-center justify-center">{content}</div>;
};

export default LoadingSpinner;
