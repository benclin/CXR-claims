import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

/**
 * WexBadge - WEX Design System Badge Component
 *
 * Small status descriptor for UI elements with semantic intent variants.
 *
 * @example
 * <WexBadge intent="default">New</WexBadge>
 * <WexBadge intent="destructive">Error</WexBadge>
 */

const wexBadgeVariants = cva(
  "inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      intent: {
        // NEUTRAL - Layer 3 tokens
        default: [
          "bg-wex-badge-neutral-bg",
          "text-wex-badge-neutral-fg",
          "border-wex-badge-neutral-border",
        ].join(" "),
        // SECONDARY - Layer 2 (no dedicated Layer 3 tokens)
        secondary:
          "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        // DESTRUCTIVE - Layer 3 tokens
        destructive: [
          "shadow",
          "bg-wex-badge-destructive-bg",
          "text-wex-badge-destructive-fg",
          "border-wex-badge-destructive-border",
        ].join(" "),
        // OUTLINE - Layer 2
        outline: "text-foreground",
        // SUCCESS - Layer 3 tokens
        success: [
          "shadow",
          "bg-wex-badge-success-bg",
          "text-wex-badge-success-fg",
          "border-wex-badge-success-border",
        ].join(" "),
        // WARNING - Layer 3 tokens
        warning: [
          "shadow",
          "bg-wex-badge-warning-bg",
          "text-wex-badge-warning-fg",
          "border-wex-badge-warning-border",
        ].join(" "),
        // INFO - Layer 3 tokens
        info: [
          "shadow",
          "bg-wex-badge-info-bg",
          "text-wex-badge-info-fg",
          "border-wex-badge-info-border",
        ].join(" "),
      },
    },
    defaultVariants: {
      intent: "default",
    },
  }
);

export interface WexBadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof wexBadgeVariants> {}

function WexBadge({ className, intent, ...props }: WexBadgeProps) {
  return (
    <div className={cn(wexBadgeVariants({ intent }), className)} {...props} />
  );
}

export { WexBadge, wexBadgeVariants };

