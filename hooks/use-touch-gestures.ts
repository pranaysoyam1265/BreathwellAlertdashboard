"use client"

import type React from "react"

import { useCallback, useRef, useState } from "react"

interface TouchPosition {
  x: number
  y: number
}

interface SwipeGesture {
  direction: "left" | "right" | "up" | "down" | null
  distance: number
  velocity: number
}

export function useSwipeGesture(onSwipe?: (gesture: SwipeGesture) => void, threshold = 50, velocityThreshold = 0.3) {
  const startPos = useRef<TouchPosition | null>(null)
  const startTime = useRef<number>(0)

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    const touch = e.touches[0]
    startPos.current = { x: touch.clientX, y: touch.clientY }
    startTime.current = Date.now()
  }, [])

  const handleTouchEnd = useCallback(
    (e: React.TouchEvent) => {
      if (!startPos.current) return

      const touch = e.changedTouches[0]
      const endPos = { x: touch.clientX, y: touch.clientY }
      const endTime = Date.now()

      const deltaX = endPos.x - startPos.current.x
      const deltaY = endPos.y - startPos.current.y
      const deltaTime = endTime - startTime.current

      const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY)
      const velocity = distance / deltaTime

      if (distance < threshold || velocity < velocityThreshold) {
        startPos.current = null
        return
      }

      let direction: SwipeGesture["direction"] = null

      if (Math.abs(deltaX) > Math.abs(deltaY)) {
        direction = deltaX > 0 ? "right" : "left"
      } else {
        direction = deltaY > 0 ? "down" : "up"
      }

      onSwipe?.({ direction, distance, velocity })
      startPos.current = null
    },
    [onSwipe, threshold, velocityThreshold],
  )

  return {
    onTouchStart: handleTouchStart,
    onTouchEnd: handleTouchEnd,
  }
}

export function useScrollableContainer() {
  const [isScrollable, setIsScrollable] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const checkScrollable = useCallback(() => {
    if (containerRef.current) {
      const { scrollWidth, clientWidth, scrollHeight, clientHeight } = containerRef.current
      setIsScrollable(scrollWidth > clientWidth || scrollHeight > clientHeight)
    }
  }, [])

  return {
    containerRef,
    isScrollable,
    checkScrollable,
  }
}

export function useTouchFeedback() {
  const [isPressed, setIsPressed] = useState(false)

  const handleTouchStart = useCallback(() => {
    setIsPressed(true)
  }, [])

  const handleTouchEnd = useCallback(() => {
    setIsPressed(false)
  }, [])

  return {
    isPressed,
    touchProps: {
      onTouchStart: handleTouchStart,
      onTouchEnd: handleTouchEnd,
      onTouchCancel: handleTouchEnd,
    },
  }
}
