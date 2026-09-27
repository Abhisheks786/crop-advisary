import React from 'react';
import StatCard from '../UI/StatCard';

const StatsGrid = ({ stats }) => {
  if (!stats || stats.length === 0) return null;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
      {stats.map((stat, index) => (
        <StatCard
          key={index}
          title={stat.title}
          value={stat.value}
          subtitle={stat.subtitle}
          icon={stat.icon}
          trend={stat.trend}
          color={stat.color}
        />
      ))}
    </div>
  );
};

export default StatsGrid;
