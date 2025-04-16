import { forwardRef, HTMLAttributes } from 'react';
import { CardProps } from '@/types';
import { cn } from '@/utils/helpers';

const Card = forwardRef<HTMLDivElement, CardProps & HTMLAttributes<HTMLDivElement>>(
  ({ className, children, ...props }, ref) => {
    return (
      <div ref={ref} className={cn('card', className)} {...props}>
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';

const CardHeader = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('card-header', className)} {...props} />
  )
);

CardHeader.displayName = 'CardHeader';

const CardTitle = forwardRef<HTMLParagraphElement, HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h3 ref={ref} className={cn('card-title', className)} {...props} />
  )
);

CardTitle.displayName = 'CardTitle';

const CardDescription = forwardRef<HTMLParagraphElement, HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => (
    <p ref={ref} className={cn('card-description', className)} {...props} />
  )
);

CardDescription.displayName = 'CardDescription';

const CardContent = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('card-content', className)} {...props} />
  )
);

CardContent.displayName = 'CardContent';

const CardFooter = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('card-footer', className)} {...props} />
  )
);

CardFooter.displayName = 'CardFooter';

type CardComponent = typeof Card & {
  Header: typeof CardHeader;
  Title: typeof CardTitle;
  Description: typeof CardDescription;
  Content: typeof CardContent;
  Footer: typeof CardFooter;
};

const CardWithComponents = Card as CardComponent;
CardWithComponents.Header = CardHeader;
CardWithComponents.Title = CardTitle;
CardWithComponents.Description = CardDescription;
CardWithComponents.Content = CardContent;
CardWithComponents.Footer = CardFooter;

export { CardWithComponents as Card };
export default CardWithComponents;
