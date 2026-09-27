import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import Button from './Button';

/**
 * Friendly ErrorState Component
 * Avoids showing raw Axios/500 errors to rural farmers.
 * Offers clear guidance and a prominent "Try Again" retry action.
 */
const ErrorState = ({
  title = "We couldn't generate your advisory",
  message = "Please check your network connection and try again. Our servers may be updating.",
  onRetry,
  retryText = "Try Again",
  className = ""
}) => {
  return (
    <div className={`flex flex-col items-center justify-center py-14 px-6 text-center bg-[#FAFAF7] rounded-2xl border border-red-200 shadow-xs ${className}`}>
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50 border border-red-200 mb-4 text-red-600">
        <AlertTriangle className="h-8 w-8 text-red-600" aria-hidden="true" />
      </div>
      <h3 className="text-xl font-bold font-sans text-[#262619] mb-2">{title}</h3>
      <p className="text-base text-[#6B6B47] max-w-md mx-auto mb-6 leading-relaxed">
        {message}
      </p>
      {onRetry && (
        <Button variant="primary" size="md" icon={RefreshCw} onClick={onRetry}>
          {retryText}
        </Button>
      )}
    </div>
  );
};

export default ErrorState;
