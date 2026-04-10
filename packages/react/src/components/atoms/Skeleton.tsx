import * as React from "react"
import { cn } from "../utils"
import { useReducedMotion } from "../utils/useReducedMotion"

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  const prefersReducedMotion = useReducedMotion()
  return (
    <div
      className={cn(
        "rounded-md bg-ds-sunken",
        !prefersReducedMotion && "animate-pulse",
        className
      )}
      {...props}
    />
  )
}

export { Skeleton }
