import { ReactNode } from 'react';
import { cn } from '@/utils/helpers';

interface LayoutProps {
  children: ReactNode;
  className?: string;
}

interface HeaderProps extends LayoutProps {
  sticky?: boolean;
}

interface MainProps extends LayoutProps {
  padded?: boolean;
}

export const Header = ({ children, className, sticky = true }: HeaderProps) => {
  return (
    <header
      className={cn(
        'w-full bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700',
        sticky && 'sticky top-0 z-40',
        className
      )}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {children}
        </div>
      </div>
    </header>
  );
};

export const Main = ({ children, className, padded = true }: MainProps) => {
  return (
    <main
      className={cn(
        'flex-1',
        padded && 'container mx-auto px-4 sm:px-6 lg:px-8 py-8',
        className
      )}
    >
      {children}
    </main>
  );
};

export const Footer = ({ children, className }: LayoutProps) => {
  return (
    <footer
      className={cn(
        'w-full bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700',
        className
      )}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </div>
    </footer>
  );
};

export const Layout = ({ children, className }: LayoutProps) => {
  return (
    <div
      className={cn(
        'min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col',
        className
      )}
    >
      {children}
    </div>
  );
};

// Compound components pattern
export default Object.assign(Layout, {
  Header,
  Main,
  Footer,
});
