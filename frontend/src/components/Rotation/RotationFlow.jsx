import React from 'react';
import { ArrowRight, Leaf, Beaker, Sprout } from 'lucide-react';
import Badge from '../UI/Badge';

const RotationFlow = ({ previous, current, suggested }) => {
  const renderCropBox = (crop, type) => {
    if (!crop) return null;
    
    const styles = {
      previous: 'bg-gray-50 border-gray-200 text-gray-600',
      current: 'bg-blue-50 border-blue-200 ring-2 ring-blue-500 ring-offset-2',
      suggested: 'bg-green-50 border-green-200 border-dashed'
    };

    const icons = {
      previous: History,
      current: Sprout,
      suggested: Leaf
    };
    
    const Icon = icons[type] || Sprout;

    return (
      <div className={`relative flex flex-col items-center p-4 rounded-xl border-2 w-full max-w-[200px] text-center ${styles[type]}`}>
        <span className="absolute -top-3 px-2 py-0.5 bg-white border border-gray-200 rounded-full text-xs font-bold uppercase tracking-wider text-gray-500">
          {type}
        </span>
        <h4 className="font-bold text-lg text-gray-900 mt-2 mb-1">{crop.name}</h4>
        <p className="text-xs text-gray-500 mb-3">{crop.season}</p>
        
        {crop.impact && (
          <div className="flex gap-1 flex-wrap justify-center mt-auto">
            {crop.impact.map((imp, idx) => (
              <Badge key={idx} variant="info" size="sm" className="text-[10px]">
                {imp}
              </Badge>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="py-8">
      <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8">
        {renderCropBox(previous, 'previous')}
        
        {previous && current && (
          <div className="hidden md:flex flex-col items-center text-gray-400">
            <ArrowRight size={24} />
          </div>
        )}
        
        {renderCropBox(current, 'current')}
        
        {current && suggested && (
          <div className="hidden md:flex flex-col items-center text-green-500">
            <Badge variant="success" size="sm" className="mb-2">Fixes Nitrogen</Badge>
            <ArrowRight size={24} />
          </div>
        )}
        
        {renderCropBox(suggested, 'suggested')}
      </div>
    </div>
  );
};

// Mock history icon for local use if not imported
const History = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/><path d="M12 7v5l4 2"/></svg>;

export default RotationFlow;
