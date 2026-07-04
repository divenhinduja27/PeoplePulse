import * as React from "react"
import { cn } from "@/lib/utils"

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
}

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, children, label, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1.5 w-full">
        {label && (
          <label className="text-xs font-semibold text-foreground/80">
            {label}
          </label>
        )}
        <select
          className={cn(
            "form-control h-9.5",
            className
          )}
          ref={ref}
          {...props}
        >
          {children}
        </select>
      </div>
    )
  }
)
Select.displayName = "Select"

export { Select }
export function SelectItem({ value, children, ...props }: React.OptionHTMLAttributes<HTMLOptionElement>) {
  return (
    <option value={value} className="bg-background text-foreground" {...props}>
      {children}
    </option>
  )
}
export function SelectContent({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
export function SelectTrigger({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn("w-full", className)}>{children}</div>
}
export function SelectValue({ placeholder }: { placeholder?: string }) {
  return <span>{placeholder}</span>
}
export function SelectRoot({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
