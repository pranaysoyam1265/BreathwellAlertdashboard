"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { useScrollableContainer, useSwipeGesture } from "@/hooks/use-touch-gestures"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "./button"

interface ScrollableContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  showScrollIndicators?: boolean
  snapToItems?: boolean
}

export function ScrollableContainer({
  children,
  className,
  showScrollIndicators = true,
  snapToItems = false,
  ...props
}: ScrollableContainerProps) {
  const { containerRef, isScrollable, checkScrollable } = useScrollableContainer()
  const [canScrollLeft, setCanScrollLeft] = React.useState(false)
  const [canScrollRight, setCanScrollRight] = React.useState(false)

  const checkScrollPosition = React.useCallback(() => {
    if (containerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = containerRef.current
      setCanScrollLeft(scrollLeft > 0)
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1)
    }
  }, [])

  const scrollLeft = React.useCallback(() => {
    if (containerRef.current) {
      const scrollAmount = containerRef.current.clientWidth * 0.8
      containerRef.current.scrollBy({ left: -scrollAmount, behavior: "smooth" })
    }
  }, [])

  const scrollRight = React.useCallback(() => {
    if (containerRef.current) {
      const scrollAmount = containerRef.current.clientWidth * 0.8
      containerRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" })
    }
  }, [])

  const swipeGesture = useSwipeGesture((gesture) => {
    if (gesture.direction === "left") {
      scrollRight()
    } else if (gesture.direction === "right") {
      scrollLeft()
    }
  })

  React.useEffect(() => {
    checkScrollable()
    checkScrollPosition()

    const handleResize = () => {
      checkScrollable()
      checkScrollPosition()
    }

    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [checkScrollable, checkScrollPosition])

  React.useEffect(() => {
    const container = containerRef.current
    if (container) {
      container.addEventListener("scroll", checkScrollPosition)
      return () => container.removeEventListener("scroll", checkScrollPosition)
    }
  }, [checkScrollPosition])

  return (
    <div className="relative group">
      <div
        ref={containerRef}
        className={cn(
          "overflow-x-auto scrollbar-thin scrollbar-thumb-slate-600 scrollbar-track-transparent",
          snapToItems && "snap-x snap-mandatory",
          "touch-pan-x",
          className,
        )}
        onScroll={checkScrollPosition}
        {...swipeGesture}
        {...props}
      >
        <div className={cn("flex", snapToItems && "snap-start")}>{children}</div>
      </div>

      {/* Scroll indicators */}
      {showScrollIndicators && isScrollable && (
        <>
          {canScrollLeft && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-background/80 backdrop-blur-sm shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 min-h-[44px] min-w-[44px]"
              onClick={scrollLeft}
              aria-label="Scroll left"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
          )}
          {canScrollRight && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-background/80 backdrop-blur-sm shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 min-h-[44px] min-w-[44px]"
              onClick={scrollRight}
              aria-label="Scroll right"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          )}
        </>
      )}
    </div>
  )
}
