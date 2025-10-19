import type React from "react"
import type { Metadata } from "next"
import { Analytics } from "@vercel/analytics/next"
import { Suspense } from "react"
import { SettingsProvider } from '@/contexts/SettingsContext'
import { Toaster } from 'sonner'
import "./globals.css"

export const metadata: Metadata = {
  title: "BreathewellAlert - Air Quality Monitoring Dashboard",
  description: "Monitor air quality, track trends, and get health insights with BreathewellAlert",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`font-sans bg-gradient-to-br from-slate-900 via-slate-800 to-slate-700 text-white min-h-screen`}>
        <SettingsProvider>
          <Suspense fallback={null}>{children}</Suspense>
          <Toaster 
            position="top-right" 
            theme="dark"
            toastOptions={{
              style: {
                background: '#1e293b',
                color: '#f8fafc',
                border: '1px solid #334155',
              },
              className: 'sonner-toast',
            }}
          />
          <Analytics />
        </SettingsProvider>
      </body>
    </html>
  )
}