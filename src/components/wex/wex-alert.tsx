import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

/**
 * WexAlert - WEX Design System Alert Component
 *
 * Displays important messages to users with semantic intent variants.
 *
 * @example
 * <WexAlert intent="default">
 *   <WexAlert.Title>Heads up!</WexAlert.Title>
 *   <WexAlert.Description>Important information here.</WexAlert.Description>
 * </WexAlert>
 */

const wexAlertVariants = cva(
  "relative w-full rounded-lg border px-4 py-3 text-sm [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-3.5 [&>svg]:text-foreground [&>svg~*]:pl-7",
  {
    variants: {
      intent: {
        default: "bg-background text-foreground",
        destructive:
          "border-destructive/50 text-destructive dark:border-destructive [&>svg]:text-destructive",
        success:
          "border-success/50 bg-success/10 text-success dark:border-success [&>svg]:text-success",
        warning:
          "border-warning/50 bg-warning/10 text-warning-foreground dark:border-warning [&>svg]:text-warning",
        info:
          "border-info/50 bg-info/10 text-info dark:border-info [&>svg]:text-info",
      },
    },
    defaultVariants: {
      intent: "default",
    },
  }
);

export interface WexAlertProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof wexAlertVariants> {}

const WexAlertRoot = React.forwardRef<HTMLDivElement, WexAlertProps>(
  ({ className, intent, ...props }, ref) => (
    <div
      ref={ref}
      role="alert"
      className={cn(wexAlertVariants({ intent }), className)}
      {...props}
    />
  )
);
WexAlertRoot.displayName = "WexAlert";

const WexAlertTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h5
    ref={ref}
    className={cn("mb-1 font-medium leading-none tracking-tight", className)}
    {...props}
  />
));
WexAlertTitle.displayName = "WexAlert.Title";

const WexAlertDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("text-sm [&_p]:leading-relaxed", className)}
    {...props}
  />
));
WexAlertDescription.displayName = "WexAlert.Description";

// Namespace pattern: WexAlert.Title, WexAlert.Description
export const WexAlert = Object.assign(WexAlertRoot, {
  Title: WexAlertTitle,
  Description: WexAlertDescription,
});

export { wexAlertVariants };

