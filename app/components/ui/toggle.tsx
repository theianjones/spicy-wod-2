'use client';

import * as React from 'react';
import * as TogglePrimitive from '@radix-ui/react-toggle';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '~/lib/utils';

const toggleVariants = cva(
  'inline-flex items-center justify-center gap-2 text-base font-medium transition-colors disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-5 [&_svg]:shrink-0 border-[3px] border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-transform duration-100',
  {
    variants: {
      variant: {
        default:
          'bg-white text-black hover:bg-gray-100 data-[state=on]:bg-black data-[state=on]:text-white',
        outline:
          'bg-white text-black hover:bg-gray-100 data-[state=on]:bg-black data-[state=on]:text-white',
      },
      size: {
        default: 'h-12 px-4 min-w-12',
        sm: 'h-10 px-3 min-w-10',
        lg: 'h-14 px-6 min-w-14',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

const Toggle = React.forwardRef<
  React.ElementRef<typeof TogglePrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof TogglePrimitive.Root> & VariantProps<typeof toggleVariants>
>(({ className, variant, size, ...props }, ref) => (
  <TogglePrimitive.Root
    ref={ref}
    className={cn(toggleVariants({ variant, size, className }))}
    {...props}
  />
));

Toggle.displayName = TogglePrimitive.Root.displayName;

export { Toggle, toggleVariants };
