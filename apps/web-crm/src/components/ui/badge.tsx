import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground shadow hover:bg-primary/80",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive:
          "border-transparent bg-badge-destructive text-badge-destructive-foreground hover:bg-badge-destructive/80",
        outline: "text-foreground",
        success:
          "border-transparent bg-badge-success text-badge-success-foreground hover:bg-badge-success/80",
        warning:
          "border-transparent bg-badge-warning text-badge-warning-foreground hover:bg-badge-warning/80",
        info:
          "border-transparent bg-badge-info text-badge-info-foreground hover:bg-badge-info/80",
        notification:
          "border-transparent bg-badge-notification text-badge-notification-foreground shadow hover:bg-badge-notification/80",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
