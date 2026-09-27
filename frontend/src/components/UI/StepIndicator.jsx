import React from 'react';
import { Check } from 'lucide-react';

const StepIndicator = ({ steps, currentStep, onStepClick }) => {
  return (
    <div className="py-4">
      <nav aria-label="Progress">
        <ol className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 lg:space-x-8">
          {steps.map((step, index) => {
            const isCompleted = index < currentStep;
            const isCurrent = index === currentStep;
            const Icon = step.icon;

            return (
              <li key={step.label} className="flex-1">
                <button
                  onClick={() => isCompleted && onStepClick && onStepClick(index)}
                  disabled={!isCompleted && !onStepClick}
                  className={`group flex items-start w-full focus:outline-none ${isCompleted ? 'cursor-pointer' : 'cursor-default'}`}
                >
                  <span className="flex items-center">
                    <span
                      className={`relative flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full border-2 transition-colors ${
                        isCompleted
                          ? 'border-green-600 bg-green-600'
                          : isCurrent
                          ? 'border-green-600 bg-white'
                          : 'border-gray-300 bg-white'
                      }`}
                    >
                      {isCompleted ? (
                        <Check className="h-5 w-5 text-white" />
                      ) : (
                        Icon ? (
                          <Icon className={`h-4 w-4 ${isCurrent ? 'text-green-600' : 'text-gray-400'}`} />
                        ) : (
                          <span className={`text-sm font-medium ${isCurrent ? 'text-green-600' : 'text-gray-500'}`}>
                            {index + 1}
                          </span>
                        )
                      )}
                    </span>
                    <span className="hidden sm:block ml-4 h-0.5 w-full bg-gray-200">
                      {(isCompleted || (isCurrent && index < steps.length - 1)) && (
                        <span 
                          className={`h-0.5 block bg-green-600 transition-all duration-300 ${isCompleted ? 'w-full' : 'w-0'}`} 
                        />
                      )}
                    </span>
                  </span>
                  <span className="ml-4 flex min-w-0 flex-col sm:hidden">
                    <span className={`text-sm font-medium ${isCurrent ? 'text-green-600' : isCompleted ? 'text-gray-900' : 'text-gray-500'}`}>
                      {step.label}
                    </span>
                    {step.description && (
                      <span className="text-sm text-gray-500">{step.description}</span>
                    )}
                  </span>
                </button>
                <div className="hidden sm:block mt-3">
                  <span className={`text-sm font-medium ${isCurrent ? 'text-green-600' : isCompleted ? 'text-gray-900' : 'text-gray-500'}`}>
                    {step.label}
                  </span>
                  {step.description && (
                    <p className="text-xs text-gray-500 mt-1">{step.description}</p>
                  )}
                </div>
              </li>
            );
          })}
        </ol>
      </nav>
    </div>
  );
};

export default StepIndicator;
