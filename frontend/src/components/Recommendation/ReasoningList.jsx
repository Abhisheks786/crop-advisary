import React, { useState } from 'react';
import { 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  ChevronDown, 
  ChevronUp, 
  HelpCircle,
  Layers,
  Calendar,
  Droplets,
  FlaskConical,
  RefreshCw,
  Thermometer,
  CloudRain
} from 'lucide-react';

/**
 * Visual Explainable Scoring Engine Component
 * Replaces dense text with clean horizontal factor bars, visual weights,
 * and expandable farmer-friendly explanations.
 */
const ReasoningList = ({ reasoning = [], title = "Explainable Suitability Breakdown" }) => {
  const [expandedIndex, setExpandedIndex] = useState(null);

  if (!reasoning || reasoning.length === 0) return null;

  // Factor icons
  const getFactorIcon = (factorName = '') => {
    const f = factorName.toLowerCase();
    if (f.includes('soil type') || f.includes('soil comp')) return <Layers size={16} className="text-[#5C7A3C]" />;
    if (f.includes('season')) return <Calendar size={16} className="text-[#5C7A3C]" />;
    if (f.includes('water')) return <Droplets size={16} className="text-[#0284C7]" />;
    if (f.includes('ph')) return <FlaskConical size={16} className="text-[#9D9678]" />;
    if (f.includes('rotation')) return <RefreshCw size={16} className="text-[#5FA83D]" />;
    if (f.includes('temp')) return <Thermometer size={16} className="text-[#E6A900]" />;
    if (f.includes('rain')) return <CloudRain size={16} className="text-[#0284C7]" />;
    return <HelpCircle size={16} className="text-[#6B6B47]" />;
  };

  const getStatusBadge = (score, status) => {
    if (score >= 70 || status === 'positive') {
      return {
        bg: 'bg-[#5FA83D]',
        text: 'text-[#5FA83D]',
        lightBg: 'bg-[#5FA83D]/10',
        border: 'border-[#5FA83D]/30',
        icon: <CheckCircle2 className="text-[#5FA83D]" size={16} />,
        label: 'Optimal'
      };
    }
    if (score >= 40 || status === 'warning') {
      return {
        bg: 'bg-[#E6A900]',
        text: 'text-[#B8860B]',
        lightBg: 'bg-[#E6A900]/10',
        border: 'border-[#E6A900]/30',
        icon: <AlertTriangle className="text-[#E6A900]" size={16} />,
        label: 'Moderate'
      };
    }
    return {
      bg: 'bg-[#DC2626]',
      text: 'text-[#DC2626]',
      lightBg: 'bg-red-50',
      border: 'border-red-200',
      icon: <XCircle className="text-[#DC2626]" size={16} />,
      label: 'Suboptimal'
    };
  };

  const toggleExpand = (idx) => {
    setExpandedIndex(expandedIndex === idx ? null : idx);
  };

  return (
    <div className="bg-white rounded-2xl border border-[#E8E6D5] p-5 shadow-xs space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-[#E8E6D5]">
        <div>
          <h4 className="text-base font-bold font-sans text-[#262619] flex items-center gap-2">
            <span>{title}</span>
          </h4>
          <p className="text-xs text-[#6B6B47] mt-0.5">
            Transparent scoring calculated by our 7-factor agricultural model
          </p>
        </div>
      </div>

      <div className="space-y-3">
        {reasoning.map((item, idx) => {
          // Normalize score to 0-100 range
          const rawScore = Number(item.score);
          const score = isNaN(rawScore) ? 75 : rawScore > 10 ? rawScore : rawScore * 10;
          const config = getStatusBadge(score, item.status);
          const isExpanded = expandedIndex === idx;

          return (
            <div 
              key={idx} 
              className={`rounded-xl border transition-all duration-200 overflow-hidden ${
                isExpanded ? 'border-[#5C7A3C] bg-[#FAFAF7]' : 'border-[#E8E6D5] bg-white hover:border-[#D1CDBC]'
              }`}
            >
              {/* Factor Header & Visual Bar */}
              <div 
                onClick={() => toggleExpand(idx)}
                className="p-3.5 cursor-pointer flex flex-col gap-2 select-none"
                role="button"
                tabIndex={0}
                aria-expanded={isExpanded}
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') toggleExpand(idx); }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="p-1.5 rounded-lg bg-[#F5F4EE] border border-[#E8E6D5]">
                      {getFactorIcon(item.factor)}
                    </div>
                    <div>
                      <span className="text-sm font-bold text-[#262619]">{item.factor}</span>
                      {item.weight && (
                        <span className="text-xs text-[#6B6B47] ml-2 font-mono">
                          (weight: {Math.round(item.weight * 100)}%)
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-sm font-bold font-mono text-[#262619]">
                      {score}%
                    </span>
                    <span className={`hidden sm:inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-md font-semibold ${config.lightBg} ${config.text} border ${config.border}`}>
                      {config.icon}
                      {config.label}
                    </span>
                    <button 
                      type="button"
                      aria-label="Toggle details"
                      className="text-[#6B6B47] hover:text-[#262619] p-0.5 rounded focus:outline-none"
                    >
                      {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </button>
                  </div>
                </div>

                {/* Horizontal Progress Bar */}
                <div className="w-full bg-[#E8E6D5]/60 h-2.5 rounded-full overflow-hidden flex">
                  <div 
                    className={`h-full ${config.bg} rounded-full transition-all duration-500`}
                    style={{ width: `${Math.min(100, Math.max(0, score))}%` }}
                  />
                </div>
              </div>

              {/* Expandable Explanation for Non-Technical Farmers */}
              {isExpanded && (
                <div className="px-4 pb-3.5 pt-1 text-xs sm:text-sm text-[#4A4A2E] border-t border-[#E8E6D5]/80 bg-[#F5F4EE]/60 flex items-start gap-2.5">
                  <div className="mt-0.5 shrink-0">
                    {config.icon}
                  </div>
                  <div className="space-y-1">
                    <p className="font-medium text-[#262619] leading-relaxed">
                      {item.message || `Calculated match compatibility is ${score}%.`}
                    </p>
                    <p className="text-xs text-[#6B6B47]">
                      {score >= 70 
                        ? "This factor strongly supports healthy crop development under your current farm conditions."
                        : score >= 40
                        ? "This factor is acceptable, though slight yield or irrigation adjustments may be needed."
                        : "Caution: This parameter deviates from the ideal crop range and will require special management."}
                    </p>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ReasoningList;
