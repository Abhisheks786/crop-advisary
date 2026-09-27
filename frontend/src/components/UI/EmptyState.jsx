import React from 'react';

const EmptyState = ({ title, message, icon: Icon, action }) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center bg-white rounded-xl border border-gray-100 border-dashed">
      {Icon && (
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gray-50 mb-4">
          <Icon className="h-8 w-8 text-gray-400" aria-hidden="true" />
        </div>
      )}
      <h3 className="text-lg font-medium text-gray-900 mb-1">{title}</h3>
      {message && <p className="text-sm text-gray-500 max-w-sm mx-auto mb-6">{message}</p>}
      {action && <div>{action}</div>}
    </div>
  );
};

export default EmptyState;
