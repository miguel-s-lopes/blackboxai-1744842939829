import React, { forwardRef } from 'react';

const variants = {
  default: 'border-gray-300 focus:border-primary-500 focus:ring-primary-500',
  error: 'border-red-300 text-red-900 placeholder-red-300 focus:border-red-500 focus:ring-red-500',
  success: 'border-green-300 text-green-900 placeholder-green-300 focus:border-green-500 focus:ring-green-500',
};

const sizes = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-base',
  lg: 'px-6 py-3 text-lg',
};

const Input = forwardRef(({
  label,
  error,
  success,
  helperText,
  variant = 'default',
  size = 'md',
  className = '',
  fullWidth = true,
  startIcon,
  endIcon,
  type = 'text',
  ...props
}, ref) => {
  // If there's an error, override the variant
  const currentVariant = error ? 'error' : success ? 'success' : variant;

  const inputClasses = `
    block
    rounded-md
    shadow-sm
    border
    bg-white
    disabled:bg-gray-50
    disabled:text-gray-500
    disabled:cursor-not-allowed
    ${variants[currentVariant]}
    ${sizes[size]}
    ${fullWidth ? 'w-full' : ''}
    ${startIcon ? 'pl-10' : ''}
    ${endIcon ? 'pr-10' : ''}
    ${className}
  `;

  const renderHelperText = () => {
    if (!helperText && !error) return null;
    
    return (
      <p 
        className={`mt-1 text-sm ${
          error ? 'text-red-600' : success ? 'text-green-600' : 'text-gray-500'
        }`}
      >
        {error || helperText}
      </p>
    );
  };

  return (
    <div className={fullWidth ? 'w-full' : ''}>
      {label && (
        <label
          htmlFor={props.id}
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          {label}
        </label>
      )}
      
      <div className="relative">
        {startIcon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            {startIcon}
          </div>
        )}
        
        <input
          ref={ref}
          type={type}
          className={inputClasses}
          {...props}
        />
        
        {endIcon && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            {endIcon}
          </div>
        )}
      </div>
      
      {renderHelperText()}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;

// Example usage:
/*
<Input
  label="Email"
  type="email"
  placeholder="Enter your email"
  error="Invalid email address"
  startIcon={
    <svg className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
      <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
      <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
    </svg>
  }
/>
*/
