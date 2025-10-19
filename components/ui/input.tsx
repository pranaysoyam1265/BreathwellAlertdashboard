import type * as React from "react"

import { cn } from "@/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-gray-900/50 border-input flex h-11 w-full min-w-0 rounded-md border bg-background/50 backdrop-blur-sm px-3 py-2 text-base shadow-sm transition-all duration-200 outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm min-h-[44px] touch-manipulation",
        "focus-visible:ring-2 focus-visible:ring-blue-300 focus-visible:border-blue-300 focus-visible:bg-background/80 hover:bg-background/70 hover:border-border/80",
        "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
        "dark:border-gray-700 dark:hover:border-gray-600 dark:focus-visible:border-blue-300 dark:text-gray-100 dark:placeholder:text-gray-400",
        className,
      )}
      {...props}
    />
  )
}

export { Input }
