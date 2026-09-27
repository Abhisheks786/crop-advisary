import React from 'react';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';
import Card from './Card';

const StatCard = ({ title, value, subtitle, icon: Icon, trend, color = 'primary' }) => {
  const colors = {
    primary: 'bg-green-100 text-green-600',
    secondary: 'bg-teal-100 text-teal-600',
    warning: 'bg-yellow-100 text-yellow-600',
    danger: 'bg-red-100 text-red-600',
    info: 'bg-blue-100 text-blue-600',
  };

  return (
    <Card className="flex flex-col">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <h4 className="text-2xl font-bold text-gray-900 mt-1">{value}</h4>
        </div>
        {Icon && (
          <div className={`p-2.5 rounded-lg ${colors[color]}`}>
            <Icon size={24} />
          </div>
        )}
      </div>
      
      {(subtitle || trend) && (
        <div className="mt-4 flex items-center text-sm">
          {trend && (
            <span className={`flex items-center font-medium mr-2 ${trend > 0 ? 'text-green-600' : trend < 0 ? 'text-red-600' : 'text-gray-500'}`}>
              {trend > 0 ? <ArrowUpRight size={16} className="mr-1" /> : trend < 0 ? <ArrowDownRight size={16} className="mr-1" /> : null}
              {Math.abs(trend)}%
            </span>
          )}
          {subtitle && <span className="text-gray-500">{subtitle}</span>}
        </div>
      )}
    </Card>
  );
};

export default StatCard;
