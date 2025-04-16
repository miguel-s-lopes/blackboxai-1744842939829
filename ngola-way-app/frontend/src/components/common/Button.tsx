import { forwardRef, ButtonHTMLAttributes } from 'react';
import { cn } from '@/utils/helpers';
import { ButtonProps } from '@/types';
import { Loading } from './Loading';

const Button = forwardRef<HTMLButtonElement, ButtonProps & ButtonHTMLAttributes<HTMLButtonElement>>(
  (
    {
      className,
      variant = 'primary',
      size = 'md',
      children,
      disabled,
      loading = false,
      fullWidth = false,
      icon,
      ...props
    },
    ref
  ) => {
    const baseStyles = 'btn';
    const variants = {
      primary: 'btn-primary',
      secondary: 'btn-secondary',
      destructive: 'btn-destructive',
      outline: 'btn-outline',
      ghost: 'btn-ghost',
      link: 'btn-link',
    };
    const sizes = {
      sm: 'h-8 px-3 text-xs',
      md: 'h-10 px-4',
      lg: 'h-12 px-6 text-lg',
    };

    return (
      <button
        ref={ref}
        className={cn(
          baseStyles,
          variants[variant],
          sizes[size],
          fullWidth && 'w-full',
          className
        )}
        disabled={disabled || loading}
        {...props}
      >
        <span className={cn('flex items-center justify-center gap-2', loading && 'opacity-0')}>
          {icon && <span className="h-5 w-5">{icon}</span>}
          {children}
        </span>
        {loading && (
          <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            <Loading size="sm" />
          </span>
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';

export { Button };
export default Button;
