import * as React from "react"
import { cn } from "@/lib/utils/cn"

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'success' | 'warning' | 'destructive' | 'outline'
}

function Badge({ className, variant = 'default', ...props }: BadgeProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors",
        {
          'bg-foreground text-background': variant === 'default',
          'bg-green-600 text-white': variant === 'success',
          'bg-yellow-600 text-white': variant === 'warning',
          'bg-red-600 text-white': variant === 'destructive',
          'border border-foreground/20': variant === 'outline',
        },
        className
      )}
      {...props}
    />
  )
}

export { Badge }
