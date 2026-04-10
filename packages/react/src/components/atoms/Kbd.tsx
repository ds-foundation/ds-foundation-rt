import * as React from "react"
import { cn } from "../utils"

const Kbd = React.forwardRef<HTMLElement, React.HTMLAttributes<HTMLElement>>(
  ({ className, ...props }, ref) => (
    <kbd
      ref={ref}
      className={cn(
        "inline-flex items-center rounded border border-ds-border bg-ds-sunken",
        "px-1.5 py-0.5 text-[length:var(--ds-font-size-2xs)] font-mono font-medium text-ds-text-muted",
        "shadow-ds-xs",
        "sketch:rounded-none sketch:border-black sketch:bg-white sketch:font-sans",
        className
      )}
      {...props}
    />
  )
)
Kbd.displayName = "Kbd"

export { Kbd }
