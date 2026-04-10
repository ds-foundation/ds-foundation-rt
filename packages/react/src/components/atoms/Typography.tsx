import * as React from "react"
import { cn } from "../utils"

interface TypographyProps extends React.HTMLAttributes<HTMLElement> { }

const Display = React.forwardRef<HTMLHeadingElement, TypographyProps>(
  ({ className, ...props }, ref) => (
    <h1 ref={ref} className={cn(
      "text-[length:var(--ds-font-size-7xl)] font-bold leading-[var(--ds-font-leading-tight)] tracking-tight",
      className
    )} {...props} />
  )
)
Display.displayName = "Display"

const H1 = React.forwardRef<HTMLHeadingElement, TypographyProps>(
  ({ className, ...props }, ref) => (
    <h1 ref={ref} className={cn(
      "text-[length:var(--ds-font-size-5xl)] font-bold leading-[var(--ds-font-leading-tight)] tracking-tight",
      className
    )} {...props} />
  )
)
H1.displayName = "H1"

const H2 = React.forwardRef<HTMLHeadingElement, TypographyProps>(
  ({ className, ...props }, ref) => (
    <h2 ref={ref} className={cn(
      "text-[length:var(--ds-font-size-4xl)] font-bold leading-[var(--ds-font-leading-tight)] tracking-tight",
      className
    )} {...props} />
  )
)
H2.displayName = "H2"

const H3 = React.forwardRef<HTMLHeadingElement, TypographyProps>(
  ({ className, ...props }, ref) => (
    <h3 ref={ref} className={cn(
      "text-[length:var(--ds-font-size-3xl)] font-semibold leading-[var(--ds-font-leading-snug)] tracking-tight",
      className
    )} {...props} />
  )
)
H3.displayName = "H3"

const H4 = React.forwardRef<HTMLHeadingElement, TypographyProps>(
  ({ className, ...props }, ref) => (
    <h4 ref={ref} className={cn(
      "text-[length:var(--ds-font-size-2xl)] font-semibold leading-[var(--ds-font-leading-snug)] tracking-tight",
      className
    )} {...props} />
  )
)
H4.displayName = "H4"

const H5 = React.forwardRef<HTMLHeadingElement, TypographyProps>(
  ({ className, ...props }, ref) => (
    <h5 ref={ref} className={cn(
      "text-[length:var(--ds-font-size-xl)] font-semibold leading-[var(--ds-font-leading-snug)] tracking-tight",
      className
    )} {...props} />
  )
)
H5.displayName = "H5"

const BodyLarge = React.forwardRef<HTMLParagraphElement, TypographyProps>(
  ({ className, ...props }, ref) => (
    <p ref={ref} className={cn(
      "text-[length:var(--ds-font-size-xl)] font-normal leading-[var(--ds-font-leading-relaxed)]",
      className
    )} {...props} />
  )
)
BodyLarge.displayName = "BodyLarge"

const Body = React.forwardRef<HTMLParagraphElement, TypographyProps>(
  ({ className, ...props }, ref) => (
    <p ref={ref} className={cn(
      "text-[length:var(--ds-font-size-md)] font-normal leading-[var(--ds-font-leading-normal)]",
      className
    )} {...props} />
  )
)
Body.displayName = "Body"

const BodySmall = React.forwardRef<HTMLParagraphElement, TypographyProps>(
  ({ className, ...props }, ref) => (
    <p ref={ref} className={cn(
      "text-[length:var(--ds-font-size-sm)] font-normal leading-[var(--ds-font-leading-normal)]",
      className
    )} {...props} />
  )
)
BodySmall.displayName = "BodySmall"

const Caption = React.forwardRef<HTMLSpanElement, TypographyProps>(
  ({ className, ...props }, ref) => (
    <span ref={ref} className={cn(
      "text-[length:var(--ds-font-size-xs)] font-normal leading-[var(--ds-font-leading-snug)] text-ds-text-muted",
      className
    )} {...props} />
  )
)
Caption.displayName = "Caption"

export { Display, H1, H2, H3, H4, H5, BodyLarge, Body, BodySmall, Caption }
