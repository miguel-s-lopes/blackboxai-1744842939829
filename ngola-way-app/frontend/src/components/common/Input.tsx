import { forwardRef, InputHTMLAttributes } from 'react';
import { InputProps } from '@/types';
import { cn } from '@/utils/helpers';

export const Input = forwardRef<
  HTMLInputElement,
  InputProps & InputHTMLAttributes<HTMLInputElement>
>(({
  className,
  type = 'text',
  error,
  label,
  required,
  disabled,
  ...props
}, ref) => {
  const id = props.id || props.name;

  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={id}
          className={cn(
            'block mb-2 text-sm font-medium',
            error ? 'text-red-500' : 'text-gray-700 dark:text-gray-200',
            disabled && 'opacity-50'
          )}
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <div className="relative">
        <input
          type={type}
          className={cn(
            'input',
            error && 'border-red-500 focus-visible:ring-red-500',
            className
          )}
          ref={ref}
          disabled={disabled}
          id={id}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={error ? `${id}-error` : undefined}
          {...props}
        />
      </div>
      {error && (
        <p
          className="mt-2 text-sm text-red-500"
          id={`${id}-error`}
          role="alert"
        >
          {error}
        </p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;
