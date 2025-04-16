import React from 'react';

const sizes = {
  sm: 'h-4 w-4',
  md: 'h-8 w-8',
  lg: 'h-12 w-12',
  xl: 'h-16 w-16',
};

const variants = {
  primary: 'text-primary-600',
  secondary: 'text-secondary-600',
  white: 'text-white',
  gray: 'text-gray-600',
};

function Loading({
  size = 'md',
  variant = 'primary',
  fullScreen = false,
  text,
  className = '',
}) {
  const Spinner = () => (
    <svg
      className={`animate-spin ${sizes[size]} ${variants[variant]} ${className}`}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      ></circle>
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      ></path>
    </svg>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-75 z-50">
        <div className="text-center">
          <Spinner />
          {text && (
            <p className="mt-4 text-sm font-medium text-gray-500">{text}</p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center">
      <Spinner />
      {text && (
        <span className="ml-2 text-sm font-medium text-gray-500">{text}</span>
      )}
    </div>
  );
}

// Skeleton Loading Component
Loading.Skeleton = function Skeleton({
  className = '',
  variant = 'default',
  animate = true,
}) {
  const variants = {
    default: 'bg-gray-200',
    dark: 'bg-gray-700',
  };

  return (
    <div
      className={`
        rounded 
        ${variants[variant]}
        ${animate ? 'animate-pulse' : ''}
        ${className}
      `}
    />
  );
};

// Card Skeleton Component
Loading.CardSkeleton = function CardSkeleton() {
  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <Loading.Skeleton className="h-48 w-full rounded-lg" />
      <div className="space-y-3 mt-4">
        <Loading.Skeleton className="h-4 w-3/4" />
        <Loading.Skeleton className="h-4 w-1/2" />
        <div className="flex space-x-2">
          <Loading.Skeleton className="h-4 w-1/4" />
          <Loading.Skeleton className="h-4 w-1/4" />
        </div>
      </div>
    </div>
  );
};

// List Skeleton Component
Loading.ListSkeleton = function ListSkeleton({ count = 3 }) {
  return (
    <div className="space-y-4">
      {[...Array(count)].map((_, index) => (
        <div key={index} className="flex items-center space-x-4">
          <Loading.Skeleton className="h-12 w-12 rounded-full" />
          <div className="space-y-2 flex-1">
            <Loading.Skeleton className="h-4 w-3/4" />
            <Loading.Skeleton className="h-4 w-1/2" />
          </div>
        </div>
      ))}
    </div>
  );
};

// Form Skeleton Component
Loading.FormSkeleton = function FormSkeleton({ fields = 3 }) {
  return (
    <div className="space-y-6">
      {[...Array(fields)].map((_, index) => (
        <div key={index} className="space-y-1">
          <Loading.Skeleton className="h-4 w-1/4" />
          <Loading.Skeleton className="h-10 w-full rounded-md" />
        </div>
      ))}
    </div>
  );
};

export default Loading;

/* Example usage:
// Simple spinner
<Loading />

// Full screen loading with text
<Loading fullScreen text="Loading your dashboard..." />

// Skeleton loading for a card
<Loading.CardSkeleton />

// Skeleton loading for a list
<Loading.ListSkeleton count={5} />

// Skeleton loading for a form
<Loading.FormSkeleton fields={4} />

// Custom skeleton
<Loading.Skeleton className="h-4 w-1/2" />
*/
