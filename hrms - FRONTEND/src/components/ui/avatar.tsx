import * as React from "react"
import { cn } from "@/lib/utils"

export function Avatar({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full border border-border/40 select-none",
        className
      )}
      {...props}
    />
  )
}

export function AvatarImage({ className, src, alt, ...props }: React.ComponentProps<"img">) {
  const [hasError, setHasError] = React.useState(false)

  if (!src || hasError) return null

  return (
    <img
      src={src}
      alt={alt}
      onError={() => setHasError(true)}
      className={cn("aspect-square h-full w-full object-cover", className)}
      {...props}
    />
  )
}

export function AvatarFallback({ className, children, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "flex h-full w-full items-center justify-center rounded-full bg-secondary text-secondary-foreground text-sm font-semibold border-none uppercase",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}
