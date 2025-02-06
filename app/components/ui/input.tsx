import * as React from 'react'

import {cn} from '~/lib/utils'

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<'input'>>(
  ({className, type, ...props}, ref) => {
    return (
      <input
        type={type}
        className={cn(
          'flex h-9 w-full px-3 py-2 bg-gray-100 border-2 border-black text-black placeholder:text-gray-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-black transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground disabled:cursor-not-allowed disabled:opacity-50',
          className,
        )}
        ref={ref}
        {...props}
      />
    )
  },
)
Input.displayName = 'Input'

export {Input}
