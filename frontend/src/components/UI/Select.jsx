import React from 'react';

const Select = ({ 
  label, 
  name, 
  value, 
  onChange, 
  options = [], 
  error, 
  required = false, 
  disabled = false, 
  placeholder, 
  helpText,
  className = ''
}) => {
  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <select
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        disabled={disabled}
        className={`block w-full rounded-lg border ${
          error ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-green-500 focus:border-green-500'
        } bg-white px-3 py-2 text-sm text-gray-900 shadow-sm focus:outline-none focus:ring-1 disabled:bg-gray-50 disabled:text-gray-500`}
      >
        {placeholder && <option value="" disabled>{placeholder}</option>}
        {options.map((option, index) => {
          const val = typeof option === 'string' ? option : option.value;
          const lbl = typeof option === 'string' ? option : option.label;
          return (
            <option key={index} value={val}>
              {lbl}
            </option>
          );
        })}
      </select>
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
      {helpText && !error && <p className="mt-1 text-sm text-gray-500">{helpText}</p>}
    </div>
  );
};

export default Select;
