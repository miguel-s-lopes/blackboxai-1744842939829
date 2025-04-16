import React from 'react';
import { Link } from 'react-router-dom';

const variants = {
  default: 'bg-white',
  primary: 'bg-primary-50',
  secondary: 'bg-secondary-50',
};

const Card = ({
  children,
  className = '',
  variant = 'default',
  to,
  onClick,
  hover = true,
  padding = true,
  border = true,
  shadow = true,
}) => {
  const baseClasses = `
    rounded-lg
    ${padding ? 'p-6' : ''}
    ${border ? 'border border-gray-200' : ''}
    ${shadow ? 'shadow-sm' : ''}
    ${hover ? 'transition-all duration-200 hover:shadow-md' : ''}
    ${variants[variant]}
    ${className}
  `;

  if (to) {
    return (
      <Link to={to} className={baseClasses}>
        {children}
      </Link>
    );
  }

  if (onClick) {
    return (
      <button
        onClick={onClick}
        className={`${baseClasses} w-full text-left`}
        type="button"
      >
        {children}
      </button>
    );
  }

  return <div className={baseClasses}>{children}</div>;
};

// Card Header Component
Card.Header = function CardHeader({ children, className = '' }) {
  return (
    <div className={`flex items-center justify-between mb-4 ${className}`}>
      {children}
    </div>
  );
};

// Card Title Component
Card.Title = function CardTitle({ children, className = '' }) {
  return (
    <h3 className={`text-lg font-semibold text-gray-900 ${className}`}>
      {children}
    </h3>
  );
};

// Card Description Component
Card.Description = function CardDescription({ children, className = '' }) {
  return (
    <p className={`text-sm text-gray-500 ${className}`}>
      {children}
    </p>
  );
};

// Card Content Component
Card.Content = function CardContent({ children, className = '' }) {
  return <div className={className}>{children}</div>;
};

// Card Footer Component
Card.Footer = function CardFooter({ children, className = '' }) {
  return (
    <div className={`mt-4 flex items-center justify-between ${className}`}>
      {children}
    </div>
  );
};

// Card Image Component
Card.Image = function CardImage({ src, alt, className = '' }) {
  return (
    <div className={`relative ${className}`}>
      <img
        src={src}
        alt={alt}
        className="w-full h-full object-cover rounded-t-lg"
      />
    </div>
  );
};

// Card Badge Component
Card.Badge = function CardBadge({ 
  children, 
  variant = 'default',
  className = '' 
}) {
  const badgeVariants = {
    default: 'bg-gray-100 text-gray-800',
    success: 'bg-green-100 text-green-800',
    warning: 'bg-yellow-100 text-yellow-800',
    danger: 'bg-red-100 text-red-800',
    info: 'bg-blue-100 text-blue-800',
  };

  return (
    <span className={`
      inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
      ${badgeVariants[variant]}
      ${className}
    `}>
      {children}
    </span>
  );
};

export default Card;

/* Example usage:
<Card>
  <Card.Image
    src="https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg"
    alt="Property"
  />
  <Card.Header>
    <Card.Title>Luxury Apartment</Card.Title>
    <Card.Badge variant="success">Available</Card.Badge>
  </Card.Header>
  <Card.Description>
    Beautiful apartment in the heart of the city with amazing views.
  </Card.Description>
  <Card.Content>
    <div className="mt-4 space-y-2">
      <div className="flex items-center">
        <LocationIcon className="h-5 w-5 text-gray-400" />
        <span className="ml-2 text-gray-600">Downtown</span>
      </div>
      <div className="flex items-center">
        <PriceIcon className="h-5 w-5 text-gray-400" />
        <span className="ml-2 text-gray-600">$200/night</span>
      </div>
    </div>
  </Card.Content>
  <Card.Footer>
    <Button variant="primary">Book Now</Button>
    <Button variant="outline">View Details</Button>
  </Card.Footer>
</Card>
*/
