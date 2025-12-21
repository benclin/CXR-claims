"use client"

import { useEffect, useState } from "react"
import { Toaster as Sonner, toast } from "sonner"

type ToasterProps = React.ComponentProps<typeof Sonner>

/**
 * Toast positions available for WexToaster
 */
export type ToastPosition = 
  | "top-left" 
  | "top-center" 
  | "top-right" 
  | "bottom-left" 
  | "bottom-center" 
  | "bottom-right"

interface WexToasterProps extends Omit<ToasterProps, "position"> {
  position?: ToastPosition
}

const Toaster = ({ position = "bottom-right", ...props }: WexToasterProps) => {
  const [theme, setTheme] = useState<"light" | "dark">("light")

  useEffect(() => {
    // Initial theme check
    const isDark = document.documentElement.classList.contains("dark")
    setTheme(isDark ? "dark" : "light")

    // Watch for theme changes
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === "class") {
          const isDark = document.documentElement.classList.contains("dark")
          setTheme(isDark ? "dark" : "light")
        }
      })
    })

    observer.observe(document.documentElement, { attributes: true })
    return () => observer.disconnect()
  }, [])

  return (
    <Sonner
      theme={theme}
      position={position}
      className="toaster group"
      toastOptions={{
        classNames: {
          // Base toast styling - uses semantic colors
          toast:
            "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
          // Description inherits toast text color with slight opacity
          description: "group-[.toast]:opacity-90",
          // Action buttons
          actionButton:
            "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground group-[.toast]:hover:bg-primary-hover",
          cancelButton:
            "group-[.toast]:bg-muted group-[.toast]:text-foreground",
          // Success toast: green background with white text
          success:
            "group-[.toaster]:bg-success group-[.toaster]:text-success-foreground group-[.toaster]:border-success [&_[data-description]]:text-success-foreground/90",
          // Error/Destructive toast: red background with WHITE text (fixes contrast issue)
          // Note: We explicitly use text-destructive-foreground which maps to --wex-destructive-foreground (white)
          error:
            "group-[.toaster]:bg-destructive group-[.toaster]:text-destructive-foreground group-[.toaster]:border-destructive [&_[data-description]]:text-destructive-foreground/90",
          // Warning toast: amber background with black text (high contrast)
          warning:
            "group-[.toaster]:bg-warning group-[.toaster]:text-warning-foreground group-[.toaster]:border-warning [&_[data-description]]:text-warning-foreground/90",
          // Info toast: blue background with white text
          info:
            "group-[.toaster]:bg-info group-[.toaster]:text-info-foreground group-[.toaster]:border-info [&_[data-description]]:text-info-foreground/90",
        },
      }}
      {...props}
    />
  )
}

export { Toaster, toast }
