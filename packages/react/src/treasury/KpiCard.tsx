import * as React from "react"
import { TrendingUp, TrendingDown, Minus } from "lucide-react"
import { cn } from "../components/utils"
import { H2, Caption } from "../components/atoms/Typography"

export interface KpiCardProps extends React.HTMLAttributes<HTMLDivElement> {
  label: string
  value: string | number
  trend?: { direction: "up" | "down" | "neutral"; label: string }
  icon?: React.ReactNode
}

const KpiCard = React.forwardRef<HTMLDivElement, KpiCardProps>(
  ({ label, value, trend, icon, className, ...props }, ref) => {
    const trendConfig = {
      up:      { cls: "bg-ds-surface text-ds-feedback-success", Icon: TrendingUp },
      down:    { cls: "bg-ds-surface text-ds-feedback-warning", Icon: TrendingDown },
      neutral: { cls: "bg-ds-sunken text-ds-text-muted",        Icon: Minus },
    }
    return (
      <div
        ref={ref}
        className={cn("border border-ds-border rounded-xl shadow-sm bg-ds-surface p-6 flex flex-col gap-3", className)}
        {...props}
      >
        <div className="flex items-center justify-between">
          <Caption className="text-ds-text-muted uppercase tracking-wide font-medium">{label}</Caption>
          {icon && <span className="text-ds-text-muted">{icon}</span>}
        </div>
        <H2 className="text-ds-text">{typeof value === "number" ? value.toLocaleString() : value}</H2>
        {trend && (() => {
          const { cls, Icon } = trendConfig[trend.direction]
          return (
            <span className={cn("inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium w-fit", cls)}>
              <Icon className="w-3 h-3" />{trend.label}
            </span>
          )
        })()}
      </div>
    )
  }
)

KpiCard.displayName = "KpiCard"

export { KpiCard }
