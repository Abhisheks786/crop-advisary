import React from 'react';
import Card from '../UI/Card';

const ResourceCard = ({ resource, icon: Icon }) => {
  if (!resource) return null;

  return (
    <Card className="flex flex-col h-full hover:border-green-300 transition-colors">
      <div className="flex items-start gap-4">
        {Icon && (
          <div className="p-3 rounded-xl bg-green-50 text-green-600">
            <Icon size={24} />
          </div>
        )}
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900">{resource.name}</h3>
          <p className="text-sm text-gray-500 line-clamp-2 mt-1">{resource.description}</p>
        </div>
      </div>
      
      <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
        <div>
          <span className="text-sm text-gray-500 block mb-0.5">Quantity</span>
          <span className="font-bold text-gray-900">{resource.quantity} {resource.unit}</span>
        </div>
        <div className="text-right">
          <span className="text-sm text-gray-500 block mb-0.5">Est. Cost</span>
          <span className="font-bold text-green-600">${resource.cost}</span>
        </div>
      </div>
    </Card>
  );
};

export default ResourceCard;
