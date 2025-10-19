"use client"

import { useState, useEffect } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Wind,
  Leaf,
  Heart,
  MapPin,
  Bell,
  TrendingUp,
  AlertTriangle,
  Cloud,
  Droplets,
  Eye,
  Thermometer,
  Sun,
} from "lucide-react"
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts"
import { useDashboardData, generateTrendData } from "@/hooks/useDashboardData"

export default function DashboardPage() {
  const { data, loading, error } = useDashboardData()
  const [isAqiLoaded, setIsAqiLoaded] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setIsAqiLoaded(true), 300)
    return () => clearTimeout(timer)
  }, [])

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-white text-lg">Loading real-time data...</div>
        </div>
      </DashboardLayout>
    )
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-red-400 text-lg">Error loading data</div>
        </div>
      </DashboardLayout>
    )
  }

  const aqiValue = data?.airQuality.aqi || 42
  const currentWeather = data?.weather || {
    temperature: 24,
    humidity: 62,
    windSpeed: 8,
    visibility: 12,
    uvIndex: 6,
    pressure: 1013,
    condition: "Partly Cloudy",
  }

  const getAqiColor = (aqi: number) => {
    if (aqi <= 50) return "#10b981"
    if (aqi <= 100) return "#eab308"
    if (aqi <= 150) return "#f97316"
    if (aqi <= 200) return "#ef4444"
    return "#a855f7"
  }

  const getAqiCategory = (aqi: number) => {
    if (aqi <= 50) return "Good air quality"
    if (aqi <= 100) return "Moderate"
    if (aqi <= 150) return "Unhealthy for Sensitive Groups"
    if (aqi <= 200) return "Unhealthy"
    return "Hazardous"
  }

  const getHealthAdvice = (aqi: number) => {
    if (aqi <= 50) return "Safe for outdoor activities"
    if (aqi <= 100) return "Sensitive individuals should limit prolonged outdoor exposure"
    if (aqi <= 150) return "Reduce outdoor activities"
    if (aqi <= 200) return "Avoid outdoor activities"
    return "Stay indoors and use air purifiers"
  }

  const progressPercentage = isAqiLoaded ? (aqiValue / 300) * 100 : 0
  const last24hData = generateTrendData(aqiValue)

  return (
    <DashboardLayout>
      <div className="space-y-6 w-full">
        <div className="border-b border-cyan-500/20 pb-6">
          <h1 className="text-4xl font-bold text-white mb-2">Air Quality Dashboard</h1>
          <p className="text-lg text-slate-300">Real-time monitoring and health insights for your area</p>
          {data && (
            <div className="text-center text-sm text-slate-400 mt-2">
              Showing data for: {data.weather.location} 
              {data.isMockData && " (Using demo data)"}
            </div>
          )}
        </div>

        {/* Dashboard Content - All visible at once */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6 w-full">
          <Card className="col-span-1 md:col-span-2 lg:col-span-2 bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-lg border border-cyan-500/30 text-white hover:border-cyan-500/60 hover:shadow-xl hover:shadow-cyan-500/20 transition-all duration-300 hover:scale-105">
            <CardContent className="p-6">
              <div className="flex flex-col lg:flex-row items-center gap-6">
                <div className="relative flex-shrink-0">
                  <svg width="250" height="250" viewBox="0 0 180 180" className="transform -rotate-90">
                    <circle
                      cx="90"
                      cy="90"
                      r="60"
                      stroke="#334155"
                      strokeWidth="10"
                      fill="transparent"
                      className="opacity-30"
                    />
                    <circle
                      cx="90"
                      cy="90"
                      r="60"
                      stroke={getAqiColor(aqiValue)}
                      strokeWidth="10"
                      fill="transparent"
                      strokeDasharray={2 * Math.PI * 60}
                      strokeDashoffset={2 * Math.PI * 60 - (progressPercentage / 100) * 2 * Math.PI * 60}
                      strokeLinecap="round"
                      className="transition-all duration-1500 ease-out"
                      style={{
                        filter: `drop-shadow(0 0 12px ${getAqiColor(aqiValue)}40)`,
                      }}
                    />
                  </svg>

                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <div className="text-4xl font-bold text-white mb-1">{aqiValue}</div>
                    <div className="text-2xs font-medium text-center" style={{ color: getAqiColor(aqiValue) }}>
                      {getAqiCategory(aqiValue)}
                    </div>
                    <Wind className="h-4 w-4 mt-2" style={{ color: getAqiColor(aqiValue) }} />
                  </div>
                </div>

                <div className="flex-1 w-full">
                  <div className="mb-4">
                    <h3 className="text-2xl font-semibold text-white mb-1">24h AQI Trend</h3>
                    <p className="text-2xs text-slate-400">Real-time air quality monitoring</p>
                  </div>
                  <div className="h-24 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={last24hData}>
                        <defs>
                          <linearGradient id="aqiGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor={getAqiColor(aqiValue)} stopOpacity={0.3} />
                            <stop offset="95%" stopColor={getAqiColor(aqiValue)} stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <XAxis
                          dataKey="time"
                          axisLine={false}
                          tickLine={false}
                          tick={{ fontSize: 10, fill: "#94a3b8" }}
                        />
                        <YAxis hide />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "#1e293b",
                            border: "1px solid #475569",
                            borderRadius: "8px",
                            color: "#ffffff",
                            fontSize: "12px",
                          }}
                        />
                        <Area
                          type="monotone"
                          dataKey="aqi"
                          stroke={getAqiColor(aqiValue)}
                          strokeWidth={2}
                          fill="url(#aqiGradient)"
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="text-center mt-2">
                    <p className="text-xs text-slate-400">Updated 5 min ago • {getHealthAdvice(aqiValue)}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-lg border border-orange-500/30 text-white hover:border-orange-500/60 hover:shadow-xl hover:shadow-orange-500/20 transition-all duration-300 hover:scale-105">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xl font-medium text-orange-200">Weather</CardTitle>
              <Cloud className="h-6 w-6 text-orange-400" />
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Thermometer className="h-5 w-5 text-orange-400" />
                  <span className="text-2xs text-slate-400">Temperature</span>
                </div>
                <span className="text-lg font-bold text-orange-100">{currentWeather.temperature}°C</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Droplets className="h-5 w-5 text-cyan-400" />
                  <span className="text-2xs text-slate-400">Humidity</span>
                </div>
                <span className="text-lg font-medium text-cyan-100">{currentWeather.humidity}%</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Wind className="h-5 w-5 text-emerald-400" />
                  <span className="text-2xs text-slate-400">Wind Speed</span>
                </div>
                <span className="text-lg font-medium text-emerald-100">{currentWeather.windSpeed} km/h</span>
              </div>
              <Badge className="h-8 w-full flex items-center justify-center bg-cyan-600/80 text-cyan-100 border-cyan-700/50 hover:bg-cyan-700/80 transition-all duration-300">
                {currentWeather.condition}
              </Badge>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-lg border border-emerald-500/30 text-white hover:border-emerald-500/60 hover:shadow-xl hover:shadow-emerald-500/20 transition-all duration-300 hover:scale-105">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xl font-medium text-emerald-200">Health Score</CardTitle>
              <Heart className="h-5 w-5 text-emerald-400" />
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="text-2xl font-bold text-emerald-100">{data?.healthScore || 85}</div>
              <div className="w-full bg-slate-700/50 rounded-full h-2">
                <div
                  className="bg-emerald-500 h-2 rounded-full transition-all duration-1000"
                  style={{ width: `${data?.healthScore || 85}%` }}
                ></div>
              </div>
              <p className="text-2xs text-emerald-400">Excellent condition</p>
              <div className="flex items-center gap-1">
                <TrendingUp className="h-3 w-3 text-emerald-400" />
                <span className="text-2xs text-emerald-400">+5 from yesterday</span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-lg border border-yellow-500/30 text-white hover:border-yellow-500/60 hover:shadow-xl hover:shadow-yellow-500/20 transition-all duration-300 hover:scale-105">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xl font-medium text-yellow-200">UV Index</CardTitle>
              <Sun className="h-6 w-6 text-yellow-400" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-yellow-100">{currentWeather.uvIndex}</div>
              <p className="text-xl text-yellow-400">High - Use protection</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-lg border border-cyan-500/30 text-white hover:border-cyan-500/60 hover:shadow-xl hover:shadow-cyan-500/20 transition-all duration-300 hover:scale-105">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xl font-medium text-cyan-200">Visibility</CardTitle>
              <Eye className="h-6 w-6 text-cyan-400" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-cyan-100">{currentWeather.visibility}</div>
              <p className="text-xl text-cyan-400">Good visibility(km)</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6 w-full">
          <Card className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-lg border border-cyan-500/30 text-white hover:border-cyan-500/60 hover:shadow-xl hover:shadow-cyan-500/20 transition-all duration-300 hover:scale-105">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xl font-medium text-cyan-200">Locations</CardTitle>
              <MapPin className="h-6 w-6 text-cyan-400" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-cyan-100">{data?.locations || 8}</div>
              <p className="text-xl text-cyan-400">+2 from last month</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-lg border border-red-500/30 text-white hover:border-red-500/60 hover:shadow-xl hover:shadow-red-500/20 transition-all duration-300 hover:scale-105">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xl font-medium text-red-200">Active Alerts</CardTitle>
              <Bell className="h-6 w-6 text-red-400" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-red-100">{data?.activeAlerts || 2}</div>
              <p className="text-xl text-red-400">
                <AlertTriangle className="inline h-5 w-5 mr-1" />
               Moderate alerts
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 w-full">
          <Card className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-lg border border-cyan-500/30 text-white hover:border-cyan-500/60 hover:shadow-xl hover:shadow-cyan-500/20 transition-all duration-300 hover:scale-105">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <TrendingUp className="h-5 w-5 text-cyan-400" />
                <span className="text-white">Recent Trends</span>
              </CardTitle>
              <CardDescription className="text-slate-300">
                Air quality trends in your monitored locations
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-slate-200">Downtown</span>
                <Badge className="bg-emerald-600/80 text-emerald-100 border-emerald-500/50">Good</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-slate-200">Industrial Area</span>
                <Badge className="bg-yellow-600/80 text-yellow-100 border-yellow-500/50">Moderate</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-slate-200">Residential</span>
                <Badge className="bg-emerald-600/80 text-emerald-100 border-emerald-500/50">Good</Badge>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-lg border border-emerald-500/30 text-white hover:border-emerald-500/60 hover:shadow-xl hover:shadow-emerald-500/20 transition-all duration-300 hover:scale-105">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Leaf className="h-5 w-5 text-emerald-400" />
                <span className="text-white">Health Insights</span>
              </CardTitle>
              <CardDescription className="text-slate-300">
                Personalized recommendations based on current conditions
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-3 rounded-lg bg-emerald-800/30 border border-emerald-700/50">
                <p className="text-sm text-emerald-200">✓ Great day for outdoor activities</p>
              </div>
              <div className="p-3 rounded-lg bg-cyan-800/30 border border-cyan-700/50">
                <p className="text-sm text-cyan-200">💧 Stay hydrated during outdoor exercise</p>
              </div>
              <div className="p-3 rounded-lg bg-yellow-800/30 border border-yellow-700/50">
                <p className="text-sm text-yellow-200">
                  ⚠️ Sensitive individuals should limit prolonged outdoor exposure
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}