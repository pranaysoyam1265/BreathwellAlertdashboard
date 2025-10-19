"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import {
  Wind,
  Leaf,
  Heart,
  BarChart3,
  MapPin,
  Bell,
  TrendingUp,
  Building2,
  Zap,
  Download,
  Settings,
  Menu,
  X,
} from "lucide-react"

const navigation = [
  { name: "Dashboard", href: "/", icon: Wind, description: "Main dashboard" },
  { name: "Trends", href: "/trends", icon: TrendingUp, description: "Time series analysis" },
  { name: "Cities", href: "/cities", icon: Building2, description: "Multi-city comparison" },
  { name: "Health", href: "/health", icon: Heart, description: "Personal health insights" },
  { name: "Forecasting", href: "/forecasting", icon: Zap, description: "Air quality predictions" },
  { name: "Locations", href: "/locations", icon: MapPin, description: "Location management" },
  { name: "Alerts", href: "/alerts", icon: Bell, description: "Notification system" },
  { name: "Export", href: "/reports", icon: Download, description: "Data export interface" },
  { name: "Settings", href: "/settings", icon: Settings, description: "User preferences" },
]

interface DashboardLayoutProps {
  children: React.ReactNode
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const pathname = usePathname()

  return (
    <div className="w-full h-screen flex overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 transform bg-slate-900/95 backdrop-blur-xl border-r border-cyan-500/20 transition-all duration-300 ease-in-out lg:translate-x-0 shadow-2xl",
          sidebarOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-cyan-500/20">
            <div className="flex items-center space-x-3">
              <div
                className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-500 to-emerald-500 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900"
                tabIndex={0}
                role="img"
                aria-label="BreathewellAlert Logo"
              >
                <Leaf className="h-6 w-6 text-white animate-pulse" />
              </div>
              <div>
                <h1 className="text-lg font-semibold text-white text-balance">BreathewellAlert</h1>
                <p className="text-sm text-cyan-400/80">Air Quality Monitor</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden text-slate-400 hover:text-white hover:bg-slate-800/50 min-h-[44px] min-w-[44px] touch-manipulation"
              onClick={() => setSidebarOpen(false)}
              aria-label="Close sidebar"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Navigation */}
          <nav
            className="flex-1 space-y-1 p-4 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-600 scrollbar-track-transparent"
            role="navigation"
            aria-label="Main navigation"
          >
            {navigation.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "group flex items-center rounded-lg px-3 py-3 text-sm font-medium transition-all duration-200 min-h-[44px] touch-manipulation focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900 outline-none",
                    isActive
                      ? "bg-cyan-600/80 text-white shadow-lg shadow-cyan-600/25 scale-[1.02]"
                      : "text-slate-200 hover:bg-slate-800/60 hover:text-white hover:scale-[1.01] active:scale-[0.99]",
                  )}
                  onClick={() => setSidebarOpen(false)}
                  aria-current={isActive ? "page" : undefined}
                >
                  <item.icon
                    className={cn(
                      "mr-3 h-5 w-5 flex-shrink-0 transition-colors duration-200",
                      isActive ? "text-white" : "text-slate-400 group-hover:text-cyan-400",
                    )}
                  />
                  <div className="flex-1">
                    <div className={cn("font-medium", isActive ? "text-white" : "")}>{item.name}</div>
                    <div className={cn("text-xs text-pretty", isActive ? "text-white/80" : "text-slate-400")}>
                      {item.description}
                    </div>
                  </div>
                  {isActive && <div className="w-1 h-8 bg-cyan-400 rounded-full opacity-80" />}
                </Link>
              )
            })}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-cyan-500/20">
            <Card className="p-3 bg-slate-800/80 backdrop-blur-md border border-cyan-500/30 hover:bg-slate-800/90 transition-all duration-200 cursor-pointer group">
              <div className="flex items-center space-x-2">
                <BarChart3 className="h-4 w-4 text-cyan-400 group-hover:text-cyan-300 transition-colors" />
                <div className="text-xs">
                  <div className="font-medium text-white">Air Quality Index</div>
                  <div className="text-emerald-400 font-semibold">Good (42 AQI)</div>
                </div>
                <div className="ml-auto">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-lg shadow-emerald-500/50"></div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 min-w-0 lg:pl-64 flex flex-col h-screen">
        {/* Top bar */}
        <div className="sticky top-0 z-30 flex h-16 items-center gap-x-4 border-b border-cyan-500/20 bg-slate-900/95 backdrop-blur-xl px-4 shadow-lg shadow-black/25 sm:gap-x-6 sm:px-6 lg:px-8">
          <Button
            variant="ghost"
            size="sm"
            className="lg:hidden text-slate-400 hover:text-white hover:bg-slate-800/50 min-h-[44px] min-w-[44px] touch-manipulation"
            onClick={() => setSidebarOpen(true)}
            aria-label="Open sidebar"
          >
            <Menu className="h-5 w-5" />
          </Button>

          <div className="flex min-w-0 flex-1 gap-x-4 self-stretch lg:gap-x-6">
            <div className="flex flex-1 items-center">
              <h2 className="text-lg font-semibold text-white text-balance">
                {navigation.find((item) => item.href === pathname)?.name || "Dashboard"}
              </h2>
            </div>
            <div className="flex items-center gap-x-4 lg:gap-x-6">
              <div className="flex items-center space-x-2 text-sm bg-slate-800/50 rounded-full px-3 py-1 backdrop-blur-sm border border-cyan-500/20">
                <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse shadow-lg shadow-emerald-500/50"></div>
                <span className="text-slate-200 font-medium">Live Data</span>
              </div>
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className="flex-1 min-h-0 overflow-auto py-6" role="main">
          <div className="w-full min-w-0 px-4 md:px-6 lg:px-8">{children}</div>
        </main>
      </div>
    </div>
  )
}
