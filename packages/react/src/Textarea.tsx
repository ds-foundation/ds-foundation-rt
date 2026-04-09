import * as React from "react"

import { cn } from "./utils"

const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.ComponentProps<"textarea">
>(({ className, ...props }, ref) => {
  return (
    <textarea
      className={cn(
        "flex min-h-[80px] w-full rounded-md border border-ds-border bg-ds-bg px-3 py-2 text-base ring-offset-ds-bg placeholder:text-ds-text-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ds-border-focus focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        className
      )}
      ref={ref}
      {...props}
    />
  )
})
Textarea.displayName = "Textarea"

export { Textarea }
