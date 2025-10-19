"use client"

import { useCallback, useEffect, useRef } from "react"

interface KeyboardNavigationOptions {
  onEscape?: () => void
  onEnter?: () => void
  onArrowUp?: () => void
  onArrowDown?: () => void
  onArrowLeft?: () => void
  onArrowRight?: () => void
  onTab?: () => void
  onShiftTab?: () => void
  disabled?: boolean
}

export function useKeyboardNavigation(options: KeyboardNavigationOptions = {}) {
  const {
    onEscape,
    onEnter,
    onArrowUp,
    onArrowDown,
    onArrowLeft,
    onArrowRight,
    onTab,
    onShiftTab,
    disabled = false,
  } = options

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (disabled) return

      switch (event.key) {
        case "Escape":
          onEscape?.()
          break
        case "Enter":
          onEnter?.()
          break
        case "ArrowUp":
          event.preventDefault()
          onArrowUp?.()
          break
        case "ArrowDown":
          event.preventDefault()
          onArrowDown?.()
          break
        case "ArrowLeft":
          event.preventDefault()
          onArrowLeft?.()
          break
        case "ArrowRight":
          event.preventDefault()
          onArrowRight?.()
          break
        case "Tab":
          if (event.shiftKey) {
            onShiftTab?.()
          } else {
            onTab?.()
          }
          break
      }
    },
    [disabled, onEscape, onEnter, onArrowUp, onArrowDown, onArrowLeft, onArrowRight, onTab, onShiftTab],
  )

  useEffect(() => {
    if (!disabled) {
      document.addEventListener("keydown", handleKeyDown)
      return () => document.removeEventListener("keydown", handleKeyDown)
    }
  }, [handleKeyDown, disabled])

  return { handleKeyDown }
}

export function useFocusManagement() {
  const focusableElementsRef = useRef<HTMLElement[]>([])
  const currentFocusIndex = useRef(0)

  const updateFocusableElements = useCallback((container: HTMLElement) => {
    const focusableSelectors = [
      "button:not([disabled])",
      "input:not([disabled])",
      "select:not([disabled])",
      "textarea:not([disabled])",
      "a[href]",
      '[tabindex]:not([tabindex="-1"])',
    ].join(", ")

    focusableElementsRef.current = Array.from(container.querySelectorAll(focusableSelectors)) as HTMLElement[]
  }, [])

  const focusNext = useCallback(() => {
    const elements = focusableElementsRef.current
    if (elements.length === 0) return

    currentFocusIndex.current = (currentFocusIndex.current + 1) % elements.length
    elements[currentFocusIndex.current]?.focus()
  }, [])

  const focusPrevious = useCallback(() => {
    const elements = focusableElementsRef.current
    if (elements.length === 0) return

    currentFocusIndex.current = currentFocusIndex.current === 0 ? elements.length - 1 : currentFocusIndex.current - 1
    elements[currentFocusIndex.current]?.focus()
  }, [])

  const focusFirst = useCallback(() => {
    const elements = focusableElementsRef.current
    if (elements.length === 0) return

    currentFocusIndex.current = 0
    elements[0]?.focus()
  }, [])

  const focusLast = useCallback(() => {
    const elements = focusableElementsRef.current
    if (elements.length === 0) return

    currentFocusIndex.current = elements.length - 1
    elements[currentFocusIndex.current]?.focus()
  }, [])

  return {
    updateFocusableElements,
    focusNext,
    focusPrevious,
    focusFirst,
    focusLast,
  }
}

export function useSkipNavigation() {
  const skipToContent = useCallback(() => {
    const mainContent = document.querySelector("main")
    if (mainContent) {
      mainContent.focus()
      mainContent.scrollIntoView({ behavior: "smooth" })
    }
  }, [])

  const skipToNavigation = useCallback(() => {
    const navigation = document.querySelector("nav")
    if (navigation) {
      const firstLink = navigation.querySelector("a, button")
      if (firstLink) {
        ;(firstLink as HTMLElement).focus()
      }
    }
  }, [])

  return {
    skipToContent,
    skipToNavigation,
  }
}
