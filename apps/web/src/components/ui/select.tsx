import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const selectVariants = cva(
  'flex w-full items-center justify-between rounded-lg border bg-white px-3 py-2 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 disabled:cursor-not-allowed disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'border-gray-300 focus-visible:border-primary-500',
        destructive: 'border-red-300 focus-visible:border-red-500',
      },
      size: {
        default: 'h-10',
        sm: 'h-9',
        lg: 'h-12',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

export interface SelectProps
  extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'size'>,
    VariantProps<typeof selectVariants> {}

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <select
        className={cn(selectVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Select.displayName = 'Select';

export { Select, selectVariants };
