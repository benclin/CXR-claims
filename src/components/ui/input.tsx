import * as React from "react"

import { cn } from "@/lib/utils"

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          // Layout
          "flex h-11 w-full rounded-md px-3 py-2 text-sm shadow-sm transition-colors",
          // Layer 3 tokens - background and text
          "bg-wex-input-bg text-wex-input-fg",
          // Layer 3 tokens - border states
          "border border-wex-input-border",
          "hover:border-wex-input-border-hover",
          "focus-visible:border-wex-input-border-focus",
          // Layer 3 tokens - placeholder
          "placeholder:text-wex-input-placeholder",
          // Focus ring
          "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-wex-input-focus-ring",
          // Layer 3 tokens - disabled states (explicit colors)
          "disabled:cursor-not-allowed",
          "disabled:bg-wex-input-disabled-bg",
          "disabled:text-wex-input-disabled-fg",
          "disabled:border-wex-input-disabled-border",
          "disabled:opacity-[var(--wex-component-input-disabled-opacity)]",
          // File input
          "file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }
