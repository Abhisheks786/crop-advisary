import React from 'react';
import Card from '../UI/Card';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

const CostBreakdown = ({ breakdown, total }) => {
  if (!breakdown || breakdown.length === 0) return null;

  const COLORS = ['#10B981', '#3B82F6', '#F59E0B', '#8B5CF6', '#EF4444'];

  return (
    <Card title="Cost Breakdown" className="flex flex-col h-full">
      <div className="h-48 mb-4">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={breakdown}
              cx="50%"
              cy="50%"
              innerRadius={40}
              outerRadius={70}
              paddingAngle={2}
              dataKey="value"
            >
              {breakdown.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip formatter={(value) => `$${value}`} />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="space-y-3 flex-1">
        {breakdown.map((item, index) => (
          <div key={index} className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></span>
              <span className="text-gray-600">{item.name}</span>
            </div>
            <span className="font-medium text-gray-900">${item.value}</span>
          </div>
        ))}
      </div>

      <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
        <span className="font-bold text-gray-900">Total Estimated Cost</span>
        <span className="text-xl font-bold text-green-600">${total}</span>
      </div>
    </Card>
  );
};

export default CostBreakdown;
