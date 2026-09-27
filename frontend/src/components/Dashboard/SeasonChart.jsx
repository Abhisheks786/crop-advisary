import React from 'react';
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip } from 'recharts';
import Card from '../UI/Card';

const SeasonChart = ({ data, title = 'Seasonal Suitability' }) => {
  return (
    <Card title={title} className="h-96 flex flex-col">
      <div className="flex-1 w-full h-full min-h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart cx="50%" cy="50%" outerRadius="70%" data={data}>
            <PolarGrid stroke="#E5E7EB" />
            <PolarAngleAxis dataKey="season" tick={{fill: '#4B5563', fontSize: 12}} />
            <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{fill: '#9CA3AF', fontSize: 10}} />
            <Radar
              name="Suitability"
              dataKey="score"
              stroke="#10B981"
              fill="#10B981"
              fillOpacity={0.5}
            />
            <Tooltip 
              contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};

export default SeasonChart;
