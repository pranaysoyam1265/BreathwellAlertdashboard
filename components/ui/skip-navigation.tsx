"use client"
import { Button } from "./button"
import { useSkipNavigation } from "@/hooks/use-keyboard-navigation"

export function SkipNavigation() {
  const { skipToContent, skipToNavigation } = useSkipNavigation()

  return (
    <div className="sr-only focus-within:not-sr-only fixed top-4 left-4 z-[100] flex gap-2">
      <Button
        variant="secondary"
        size="sm"
        onClick={skipToContent}
        className="focus:not-sr-only bg-background border-2 border-primary text-foreground shadow-lg"
      >
        Skip to main content
      </Button>
      <Button
        variant="secondary"
        size="sm"
        onClick={skipToNavigation}
        className="focus:not-sr-only bg-background border-2 border-primary text-foreground shadow-lg"
      >
        Skip to navigation
      </Button>
    </div>
  )
}
