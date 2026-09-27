import React, { useEffect, useState } from 'react';

const ScoreDisplay = ({ score, size = 'md' }) => {
  const [animatedScore, setAnimatedScore] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedScore(score);
    }, 100);
    return () => clearTimeout(timer);
  }, [score]);

  const getColor = (s) => {
    if (s >= 75) return 'text-green-500 stroke-green-500';
    if (s >= 50) return 'text-yellow-500 stroke-yellow-500';
    return 'text-red-500 stroke-red-500';
  };

  const sizes = {
    sm: { wrapper: 'w-12 h-12', text: 'text-sm', stroke: 3 },
    md: { wrapper: 'w-20 h-20', text: 'text-xl', stroke: 4 },
    lg: { wrapper: 'w-32 h-32', text: 'text-3xl', stroke: 6 }
  };

  const radius = 50 - sizes[size].stroke / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (animatedScore / 100) * circumference;

  return (
    <div className={`relative flex items-center justify-center ${sizes[size].wrapper}`}>
      <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
        <circle
          className="stroke-gray-200 fill-transparent"
          strokeWidth={sizes[size].stroke}
          r={radius}
          cx="50"
          cy="50"
        />
        <circle
          className={`fill-transparent transition-all duration-1000 ease-out ${getColor(score).split(' ')[1]}`}
          strokeWidth={sizes[size].stroke}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          r={radius}
          cx="50"
          cy="50"
        />
      </svg>
      <div className={`absolute flex flex-col items-center justify-center ${getColor(score).split(' ')[0]}`}>
        <span className={`font-bold ${sizes[size].text}`}>{Math.round(animatedScore)}</span>
        {size !== 'sm' && <span className="text-xs text-gray-500 font-medium">%</span>}
      </div>
    </div>
  );
};

export default ScoreDisplay;
