import React from 'react';

const Card = ({ children, className = '', title, subtitle, icon: Icon, action, variant = 'default' }) => {
  const variantStyles = {
    default: 'bg-white border-gray-100',
    success: 'bg-green-50 border-green-100',
    warning: 'bg-yellow-50 border-yellow-100',
    danger: 'bg-red-50 border-red-100',
    info: 'bg-blue-50 border-blue-100'
  };

  return (
    <div className={`rounded-xl border shadow-sm transition-shadow hover:shadow-md ${variantStyles[variant]} ${className}`}>
      {(title || Icon || action) && (
        <div className="p-4 sm:p-5 border-b border-gray-100/50 flex justify-between items-start">
          <div className="flex items-center gap-3">
            {Icon && (
              <div className="p-2 rounded-lg bg-white shadow-sm text-gray-600">
                <Icon size={20} />
              </div>
            )}
            <div>
              {title && <h3 className="font-semibold text-gray-900">{title}</h3>}
              {subtitle && <p className="text-sm text-gray-500 mt-0.5">{subtitle}</p>}
            </div>
          </div>
          {action && <div>{action}</div>}
        </div>
      )}
      <div className="p-4 sm:p-5">
        {children}
      </div>
    </div>
  );
};

export default Card;
