import React from 'react';
import { Info, CheckCircle, AlertTriangle, XCircle, X } from 'lucide-react';

const Alert = ({ type = 'info', title, message, onClose, children, className = '' }) => {
  const types = {
    info: {
      bg: 'bg-blue-50',
      border: 'border-blue-200',
      text: 'text-blue-800',
      icon: Info,
      iconColor: 'text-blue-500'
    },
    success: {
      bg: 'bg-green-50',
      border: 'border-green-200',
      text: 'text-green-800',
      icon: CheckCircle,
      iconColor: 'text-green-500'
    },
    warning: {
      bg: 'bg-yellow-50',
      border: 'border-yellow-200',
      text: 'text-yellow-800',
      icon: AlertTriangle,
      iconColor: 'text-yellow-500'
    },
    error: {
      bg: 'bg-red-50',
      border: 'border-red-200',
      text: 'text-red-800',
      icon: XCircle,
      iconColor: 'text-red-500'
    }
  };

  const style = types[type];
  const Icon = style.icon;

  return (
    <div className={`rounded-lg border p-4 ${style.bg} ${style.border} ${className}`}>
      <div className="flex gap-3">
        <div className="flex-shrink-0">
          <Icon className={`h-5 w-5 ${style.iconColor}`} />
        </div>
        <div className="flex-1">
          {title && <h3 className={`text-sm font-medium ${style.text} mb-1`}>{title}</h3>}
          <div className={`text-sm ${style.text} opacity-90`}>
            {message || children}
          </div>
        </div>
        {onClose && (
          <div className="flex-shrink-0">
            <button
              onClick={onClose}
              className={`inline-flex rounded-md p-1.5 focus:outline-none focus:ring-2 focus:ring-offset-2 hover:bg-black/5 ${style.text}`}
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Alert;
