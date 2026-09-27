import React from 'react';
import { Sprout } from 'lucide-react';
import Button from './Button';

/**
 * Enhanced Agriculture-Themed EmptyState Component
 * Provides clear, friendly non-technical guidance to farmers when no records exist.
 */
const EmptyState = ({
  title = "No advisories yet",
  message = "Enter your farm details to receive a personalized crop recommendation with irrigation and resource planning.",
  icon: Icon = Sprout,
  actionText = "Get Your First Advisory",
  onAction,
  action,
  className = ""
}) => {
  return (
    <div className={`flex flex-col items-center justify-center py-16 px-6 text-center bg-white rounded-2xl border-2 border-dashed border-[#D1CDBC] shadow-xs ${className}`}>
      <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-[#F5F4EE] border border-[#E8E6D5] mb-5 text-[#5C7A3C] shadow-inner">
        <Icon className="h-10 w-10 text-[#5C7A3C]" aria-hidden="true" />
      </div>
      <h3 className="text-xl font-bold font-sans text-[#262619] mb-2">{title}</h3>
      {message && <p className="text-base text-[#6B6B47] max-w-md mx-auto mb-6 leading-relaxed">{message}</p>}
      
      {action ? (
        action
      ) : onAction ? (
        <Button variant="primary" size="lg" onClick={onAction}>
          {actionText}
        </Button>
      ) : null}
    </div>
  );
};

export default EmptyState;
