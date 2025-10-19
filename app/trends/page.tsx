"use client"

import { useState } from "react"
import { format } from "date-fns"
import {
  CalendarIcon,
  FileImage,
  Download,
  X,
  BarChart3,
  TrendingUp,
  Heart,
  Clock,
  Target,
  User,
  Shield,
  AlertTriangle,
} from "lucide-react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  BarChart,
  Bar,
} from "recharts"
import { cn } from "@/lib/utils"

const chartData = [
  { date: "Sep 01", pm25: 35, pm10: 45, o3: 28, no2: 22, so2: 15, co: 8 },
  { date: "Sep 02", pm25: 42, pm10: 52, o3: 31, no2: 25, so2: 18, co: 9 },
  { date: "Sep 03", pm25: 38, pm10: 48, o3: 29, no2: 23, so2: 16, co: 8 },
  { date: "Sep 04", pm25: 45, pm10: 55, o3: 33, no2: 27, so2: 20, co: 10 },
  { date: "Sep 05", pm25: 40, pm10: 50, o3: 30, no2: 24, so2: 17, co: 9 },
  { date: "Sep 06", pm25: 37, pm10: 47, o3: 28, no2: 22, so2: 15, co: 8 },
  { date: "Sep 07", pm25: 43, pm10: 53, o3: 32, no2: 26, so2: 19, co: 10 },
]

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-800/95 backdrop-blur-md border border-slate-700/50 rounded-lg p-3 shadow-xl">
        <p className="text-slate-200 font-medium mb-2">{`Date: ${label}`}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} className="text-sm" style={{ color: entry.color }}>
            {`${entry.name}: ${entry.value} μg/m³`}
          </p>
        ))}
      </div>
    )
  }
  return null
}

export default function TrendsPage() {
  const [dateRange, setDateRange] = useState<{ from: Date; to: Date }>({
    from: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    to: new Date(),
  })
  const [selectedPollutants, setSelectedPollutants] = useState<string[]>(["PM2.5", "PM10", "O3"])
  const [chartType, setChartType] = useState("line")
  const [showCalendar, setShowCalendar] = useState(false)
  const [visibleLines, setVisibleLines] = useState<{ [key: string]: boolean }>({
    pm25: true,
    pm10: true,
    o3: true,
  })
  const [showDetailedModal, setShowDetailedModal] = useState(false)
  const [modalPollutants, setModalPollutants] = useState<{ [key: string]: boolean }>({
    pm25: true,
    pm10: true,
    o3: true,
    no2: false,
    so2: false,
    co: false,
  })
  const [timeGranularity, setTimeGranularity] = useState("daily")
  const [showHealthModal, setShowHealthModal] = useState(false)

  const pollutants = [
    { id: "PM2.5", label: "PM2.5", color: "bg-blue-500", chartColor: "#3b82f6" },
    { id: "PM10", label: "PM10", color: "bg-indigo-500", chartColor: "#6366f1" },
    { id: "SO2", label: "SO₂", color: "bg-yellow-500", chartColor: "#eab308" },
    { id: "NO2", label: "NO₂", color: "bg-purple-500", chartColor: "#a855f7" },
    { id: "CO", label: "CO", color: "bg-blue-500", chartColor: "#0ea5e9" },
    { id: "O3", label: "O₃", color: "bg-pink-500", chartColor: "#f472b6" },
  ]

  const presetRanges = [
    { label: "24H", days: 1 },
    { label: "7D", days: 7 },
    { label: "30D", days: 30 },
    { label: "90D", days: 90 },
  ]

  const statisticsData = [
    {
      title: "Average AQI",
      value: "78",
      icon: BarChart3,
      color: "text-yellow-400",
      bgColor: "bg-yellow-900/20",
    },
    {
      title: "Peak Value",
      value: "156",
      icon: TrendingUp,
      color: "text-red-400",
      bgColor: "bg-red-900/20",
    },
    {
      title: "Minimum Value",
      value: "28",
      icon: Target,
      color: "text-green-400",
      bgColor: "bg-green-900/20",
    },
    {
      title: "Trend Direction",
      value: "↗ +5%",
      icon: TrendingUp,
      color: "text-blue-400",
      bgColor: "bg-blue-900/20",
    },
    {
      title: "Data Points",
      value: "2,016",
      icon: BarChart3,
      color: "text-purple-400",
      bgColor: "bg-purple-900/20",
    },
    {
      title: "Time Range",
      value: "7 Days",
      icon: Clock,
      color: "text-cyan-400",
      bgColor: "bg-cyan-900/20",
    },
  ]

  const handlePresetRange = (days: number) => {
    const to = new Date()
    const from = new Date(Date.now() - days * 24 * 60 * 60 * 1000)
    setDateRange({ from, to })
  }

  const handlePollutantToggle = (pollutantId: string) => {
    setSelectedPollutants((prev) =>
      prev.includes(pollutantId) ? prev.filter((id) => id !== pollutantId) : [...prev, pollutantId],
    )
  }

  const toggleLineVisibility = (lineKey: string) => {
    setVisibleLines((prev) => ({
      ...prev,
      [lineKey]: !prev[lineKey],
    }))
  }

  const toggleModalPollutant = (key: string) => {
    setModalPollutants((prev) => ({
      ...prev,
      [key]: !prev[key],
    }))
  }

  const handleCrossModalNavigation = (target: string) => {
    if (target === "health") {
      setShowDetailedModal(false)
      setTimeout(() => setShowHealthModal(true), 100)
    } else if (target === "trends") {
      setShowHealthModal(false)
      setTimeout(() => setShowDetailedModal(true), 100)
    }
  }

  return (
    <DashboardLayout>
      <div className="min-h-screen w-full bg-gradient-to-br from-slate-900 via-slate-800 to-slate-700">
        <div className="space-y-6 p-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white">Trends Analysis</h1>
              <p className="text-slate-300 mt-1">Comprehensive air quality trends and statistical analysis</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-3 items-center">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-slate-200">Filters:</span>
              <Badge variant="secondary" className="bg-slate-700/50 text-slate-200 border-slate-600">
                Date: {format(dateRange.from, "MMM dd")} - {format(dateRange.to, "MMM dd")}
              </Badge>
              <Badge variant="secondary" className="bg-slate-700/50 text-slate-200 border-slate-600">
                Pollutants: {selectedPollutants.length} selected
              </Badge>
              <Badge variant="secondary" className="bg-slate-700/50 text-slate-200 border-slate-600">
                Type: {chartType === "line" ? "Line Chart" : chartType === "area" ? "Area Chart" : "Bar Chart"}
              </Badge>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowDetailedModal(true)}
              className="bg-slate-700/50 border-slate-600 text-slate-200 hover:bg-slate-600/50"
            >
              Advanced Analysis
            </Button>
          </div>

          <Card className="w-full bg-slate-800/60 backdrop-blur-md border border-slate-700/50">
            <CardHeader>
              <CardTitle className="text-white flex items-center space-x-2">
                <TrendingUp className="h-5 w-5 text-blue-400" />
                <span>Interactive Air Quality Trends</span>
              </CardTitle>
              <CardDescription className="text-slate-300">
                Real-time pollutant monitoring with customizable visualization
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Compact Controls Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Date Range Picker */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-slate-200">Date Range</Label>
                  <div className="flex gap-1">
                    {presetRanges.map((preset) => (
                      <Button
                        key={preset.label}
                        variant="outline"
                        size="sm"
                        onClick={() => handlePresetRange(preset.days)}
                        className="h-7 text-xs bg-slate-700/50 border-slate-600 text-slate-200 hover:bg-slate-600/50"
                      >
                        {preset.label}
                      </Button>
                    ))}
                    <Popover open={showCalendar} onOpenChange={setShowCalendar}>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-7 text-xs bg-slate-700/50 border-slate-600 text-slate-200 hover:bg-slate-600/50"
                        >
                          <CalendarIcon className="h-3 w-3" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0 bg-slate-800 border-slate-700" align="start">
                        <Calendar
                          mode="range"
                          selected={{ from: dateRange.from, to: dateRange.to }}
                          onSelect={(range) => {
                            if (range?.from && range?.to) {
                              setDateRange({ from: range.from, to: range.to })
                              setShowCalendar(false)
                            }
                          }}
                          numberOfMonths={2}
                          className="text-white"
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>

                {/* Pollutant Toggles */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-slate-200">Pollutants</Label>
                  <div className="flex flex-wrap gap-2">
                    {pollutants.slice(0, 3).map((pollutant) => (
                      <Button
                        key={pollutant.id}
                        variant={selectedPollutants.includes(pollutant.id) ? "default" : "outline"}
                        size="sm"
                        onClick={() => handlePollutantToggle(pollutant.id)}
                        className={cn(
                          "h-7 text-xs",
                          selectedPollutants.includes(pollutant.id)
                            ? "bg-blue-600 text-white border-blue-500"
                            : "bg-slate-700/50 border-slate-600 text-slate-200 hover:bg-slate-600/50",
                        )}
                      >
                        <div className={cn("w-2 h-2 rounded-full mr-1", pollutant.color)} />
                        {pollutant.label}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Chart Type Selector */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-slate-200">Chart Type</Label>
                  <RadioGroup value={chartType} onValueChange={setChartType} className="flex gap-4">
                    <div className="flex items-center space-x-1">
                      <RadioGroupItem value="line" id="line" className="border-slate-500 text-blue-600 w-3 h-3" />
                      <Label htmlFor="line" className="cursor-pointer text-slate-200 text-xs">
                        Line
                      </Label>
                    </div>
                    <div className="flex items-center space-x-1">
                      <RadioGroupItem value="area" id="area" className="border-slate-500 text-blue-600 w-3 h-3" />
                      <Label htmlFor="area" className="cursor-pointer text-slate-200 text-xs">
                        Area
                      </Label>
                    </div>
                    <div className="flex items-center space-x-1">
                      <RadioGroupItem value="bar" id="bar" className="border-slate-500 text-blue-600 w-3 h-3" />
                      <Label htmlFor="bar" className="cursor-pointer text-slate-200 text-xs">
                        Bar
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                {/* Export Controls */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-slate-200">Export</Label>
                  <div className="flex gap-1">
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-7 text-xs bg-slate-700/50 border-slate-600 text-slate-200 hover:bg-slate-600/50"
                    >
                      <FileImage className="h-3 w-3 mr-1" />
                      PNG
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-7 text-xs bg-slate-700/50 border-slate-600 text-slate-200 hover:bg-slate-600/50"
                    >
                      <Download className="h-3 w-3 mr-1" />
                      CSV
                    </Button>
                  </div>
                </div>
              </div>

              <div className="w-full bg-slate-800/60 backdrop-blur-md border border-slate-700/50 rounded-xl p-6">
                <ResponsiveContainer width="100%" height={500}>
                  {chartType === "bar" ? (
                    <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#475569" opacity={0.3} />
                      <XAxis dataKey="date" stroke="#cbd5e1" fontSize={12} tickLine={false} axisLine={false} />
                      <YAxis
                        stroke="#cbd5e1"
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                        label={{
                          value: "Concentration (μg/m³)",
                          angle: -90,
                          position: "insideLeft",
                          style: { textAnchor: "middle", fill: "#cbd5e1" },
                        }}
                      />
                      <Tooltip content={<CustomTooltip />} />
                      <Legend wrapperStyle={{ color: "#cbd5e1" }} />
                      {visibleLines.pm25 && <Bar dataKey="pm25" fill="#3b82f6" name="PM2.5" />}
                      {visibleLines.pm10 && <Bar dataKey="pm10" fill="#6366f1" name="PM10" />}
                      {visibleLines.o3 && <Bar dataKey="o3" fill="#f472b6" name="O3" />}
                    </BarChart>
                  ) : (
                    <LineChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#475569" opacity={0.3} />
                      <XAxis dataKey="date" stroke="#cbd5e1" fontSize={12} tickLine={false} axisLine={false} />
                      <YAxis
                        stroke="#cbd5e1"
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                        label={{
                          value: "Concentration (μg/m³)",
                          angle: -90,
                          position: "insideLeft",
                          style: { textAnchor: "middle", fill: "#cbd5e1" },
                        }}
                      />
                      <Tooltip content={<CustomTooltip />} />
                      <Legend
                        wrapperStyle={{ color: "#cbd5e1" }}
                        onClick={(e) => {
                          const lineKey = e.dataKey === "pm25" ? "pm25" : e.dataKey === "pm10" ? "pm10" : "o3"
                          toggleLineVisibility(lineKey)
                        }}
                      />
                      {visibleLines.pm25 && (
                        <Line
                          type="monotone"
                          dataKey="pm25"
                          stroke="#3b82f6"
                          strokeWidth={3}
                          dot={{ fill: "#3b82f6", strokeWidth: 2, r: 4 }}
                          activeDot={{ r: 6, stroke: "#3b82f6", strokeWidth: 2 }}
                          name="PM2.5"
                        />
                      )}
                      {visibleLines.pm10 && (
                        <Line
                          type="monotone"
                          dataKey="pm10"
                          stroke="#6366f1"
                          strokeWidth={3}
                          dot={{ fill: "#6366f1", strokeWidth: 2, r: 4 }}
                          activeDot={{ r: 6, stroke: "#6366f1", strokeWidth: 2 }}
                          name="PM10"
                        />
                      )}
                      {visibleLines.o3 && (
                        <Line
                          type="monotone"
                          dataKey="o3"
                          stroke="#f472b6"
                          strokeWidth={3}
                          dot={{ fill: "#f472b6", strokeWidth: 2, r: 4 }}
                          activeDot={{ r: 6, stroke: "#f472b6", strokeWidth: 2 }}
                          name="O3"
                        />
                      )}
                    </LineChart>
                  )}
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-slate-800/60 backdrop-blur-md border border-slate-700/50">
              <CardHeader>
                <CardTitle className="text-white flex items-center space-x-2">
                  <BarChart3 className="h-5 w-5 text-purple-400" />
                  <span>Pollutant Comparison</span>
                </CardTitle>
                <CardDescription className="text-slate-300">
                  Compare different pollutant levels side by side
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  {pollutants.map((pollutant) => (
                    <div
                      key={pollutant.id}
                      className={cn(
                        "p-3 rounded-lg border transition-all cursor-pointer",
                        selectedPollutants.includes(pollutant.id)
                          ? "bg-blue-900/30 border-blue-700/50"
                          : "bg-slate-700/30 border-slate-600/50 hover:bg-slate-600/30",
                      )}
                      onClick={() => handlePollutantToggle(pollutant.id)}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <div className={cn("w-3 h-3 rounded-full", pollutant.color)} />
                          <span className="text-sm font-medium text-slate-200">{pollutant.label}</span>
                        </div>
                        <Checkbox
                          checked={selectedPollutants.includes(pollutant.id)}
                          readOnly
                          className="border-slate-500 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                        />
                      </div>
                      <div className="text-lg font-bold text-white">
                        {
                          chartData[chartData.length - 1][
                            pollutant.id.toLowerCase().replace(".", "").replace("₂", "2").replace("₃", "3")
                          ]
                        }{" "}
                        μg/m³
                      </div>
                      <div className="text-xs text-slate-400">Current level</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/60 backdrop-blur-md border border-slate-700/50">
              <CardHeader>
                <CardTitle className="text-white flex items-center space-x-2">
                  <TrendingUp className="h-5 w-5 text-green-400" />
                  <span>Quick Insights</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-blue-900/20 border border-blue-800/30 rounded-lg">
                  <span className="text-sm font-medium text-slate-200">Dominant Pollutant</span>
                  <span className="text-blue-400 font-semibold">PM10 (53 μg/m³)</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-yellow-900/20 border border-yellow-800/30 rounded-lg">
                  <span className="text-sm font-medium text-slate-200">Trend Direction</span>
                  <span className="text-yellow-400 font-semibold">↗ Increasing</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-green-900/20 border border-green-800/30 rounded-lg">
                  <span className="text-sm font-medium text-slate-200">Data Quality</span>
                  <span className="text-green-400 font-semibold">98.5% Complete</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-purple-900/20 border border-purple-800/30 rounded-lg">
                  <span className="text-sm font-medium text-slate-200">Next Update</span>
                  <span className="text-purple-400 font-semibold">In 3 minutes</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Statistics Summary Cards */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-white">Statistical Summary</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {statisticsData.map((stat, index) => {
                const IconComponent = stat.icon
                return (
                  <Card
                    key={index}
                    className="bg-slate-800/60 backdrop-blur-md border border-slate-700/50 hover:bg-slate-800/80 transition-all"
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <p className="text-sm text-slate-300 font-medium">{stat.title}</p>
                          <p className={cn("text-2xl font-bold", stat.color)}>{stat.value}</p>
                        </div>
                        <div className={cn("p-2 rounded-lg", stat.bgColor)}>
                          <IconComponent className={cn("h-5 w-5", stat.color)} />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>

          {/* Additional Insights */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-slate-800/60 backdrop-blur-md border border-slate-700/50">
              <CardHeader>
                <CardTitle className="text-lg text-white">Trend Insights</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-blue-900/20 border border-blue-800/30 rounded-lg">
                  <span className="text-sm font-medium text-slate-200">Overall Trend</span>
                  <span className="text-blue-400 font-semibold">Improving (+12%)</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-yellow-900/20 border border-yellow-800/30 rounded-lg">
                  <span className="text-sm font-medium text-slate-200">Peak Hours</span>
                  <span className="text-yellow-400 font-semibold">8-10 AM, 6-8 PM</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-green-900/20 border border-green-800/30 rounded-lg">
                  <span className="text-sm font-medium text-slate-200">Best Day</span>
                  <span className="text-green-400 font-semibold">Sunday (AQI: 45)</span>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/60 backdrop-blur-md border border-slate-700/50">
              <CardHeader>
                <CardTitle className="text-lg text-white">Data Quality</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-green-900/20 border border-green-800/30 rounded-lg">
                  <span className="text-sm font-medium text-slate-200">Data Completeness</span>
                  <span className="text-green-400 font-semibold">98.5%</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-blue-900/20 border border-blue-800/30 rounded-lg">
                  <span className="text-sm font-medium text-slate-200">Sensor Accuracy</span>
                  <span className="text-blue-400 font-semibold">±2.1 μg/m³</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-purple-900/20 border border-purple-800/30 rounded-lg">
                  <span className="text-sm font-medium text-slate-200">Update Frequency</span>
                  <span className="text-purple-400 font-semibold">Every 5 min</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Detailed Trends Modal */}
        <Dialog open={showDetailedModal} onOpenChange={setShowDetailedModal}>
          <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto bg-slate-900/95 backdrop-blur-md border border-slate-700/50 text-white">
            <DialogHeader className="border-b border-slate-700/50 pb-4">
              <div className="flex items-center justify-between">
                <DialogTitle className="text-2xl font-bold text-white flex items-center space-x-2">
                  <BarChart3 className="h-6 w-6 text-blue-400" />
                  <span>Advanced Trends Analysis</span>
                </DialogTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowDetailedModal(false)}
                  className="text-slate-400 hover:text-white hover:bg-slate-800/50"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </DialogHeader>

            <div className="space-y-6 p-6">
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* Pollutant Selector */}
                <div className="bg-slate-800/60 backdrop-blur-md border border-slate-700/50 rounded-lg p-4">
                  <h3 className="text-white font-medium mb-3">Pollutants</h3>
                  <div className="space-y-2">
                    {Object.entries(modalPollutants).map(([key, visible]) => (
                      <div key={key} className="flex items-center space-x-2">
                        <Checkbox
                          checked={visible}
                          onCheckedChange={() => toggleModalPollutant(key)}
                          className="border-slate-500 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                        />
                        <div
                          className={cn(
                            "w-3 h-3 rounded-full",
                            key === "pm25"
                              ? "bg-blue-500"
                              : key === "pm10"
                                ? "bg-indigo-500"
                                : key === "o3"
                                  ? "bg-pink-500"
                                  : key === "no2"
                                    ? "bg-purple-500"
                                    : key === "so2"
                                      ? "bg-yellow-500"
                                      : "bg-sky-500",
                          )}
                        />
                        <Label className="text-slate-200 cursor-pointer">
                          {key.toUpperCase().replace("25", "2.5").replace("10", "10")}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Time Granularity */}
                <div className="bg-slate-800/60 backdrop-blur-md border border-slate-700/50 rounded-lg p-4">
                  <h3 className="text-white font-medium mb-3">Time Granularity</h3>
                  <RadioGroup value={timeGranularity} onValueChange={setTimeGranularity}>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="hourly" id="hourly" className="border-slate-500 text-blue-600" />
                      <Label htmlFor="hourly" className="text-slate-200">
                        Hourly
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="daily" id="daily" className="border-slate-500 text-blue-600" />
                      <Label htmlFor="daily" className="text-slate-200">
                        Daily
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="weekly" id="weekly" className="border-slate-500 text-blue-600" />
                      <Label htmlFor="weekly" className="text-slate-200">
                        Weekly
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                {/* Export Options */}
                <div className="bg-slate-800/60 backdrop-blur-md border border-slate-700/50 rounded-lg p-4">
                  <h3 className="text-white font-medium mb-3">Export</h3>
                  <div className="space-y-2">
                    <Button className="w-full bg-green-600 hover:bg-green-700 text-white">
                      <Download className="h-4 w-4 mr-2" />
                      Export Data
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full border-slate-600 text-slate-200 hover:bg-slate-700 bg-transparent"
                    >
                      Generate Report
                    </Button>
                  </div>
                </div>

                {/* Cross Navigation */}
                <div className="bg-slate-800/60 backdrop-blur-md border border-slate-700/50 rounded-lg p-4">
                  <h3 className="text-white font-medium mb-3">Related Views</h3>
                  <Button
                    onClick={() => handleCrossModalNavigation("health")}
                    className="w-full bg-red-600 hover:bg-red-700 text-white"
                  >
                    <Heart className="h-4 w-4 mr-2" />
                    Health Impact
                  </Button>
                </div>
              </div>

              {/* Advanced Chart */}
              <div className="bg-slate-800/60 backdrop-blur-md border border-slate-700/50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Multi-Pollutant Analysis</h3>
                <div className="h-96">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                      <XAxis dataKey="date" stroke="#9ca3af" fontSize={12} />
                      <YAxis stroke="#9ca3af" fontSize={12} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#1e293b",
                          border: "1px solid #475569",
                          borderRadius: "8px",
                          color: "#ffffff",
                        }}
                      />
                      <Legend />
                      {modalPollutants.pm25 && (
                        <Line type="monotone" dataKey="pm25" stroke="#3b82f6" strokeWidth={2} name="PM2.5" />
                      )}
                      {modalPollutants.pm10 && (
                        <Line type="monotone" dataKey="pm10" stroke="#6366f1" strokeWidth={2} name="PM10" />
                      )}
                      {modalPollutants.o3 && (
                        <Line type="monotone" dataKey="o3" stroke="#f472b6" strokeWidth={2} name="O3" />
                      )}
                      {modalPollutants.no2 && (
                        <Line type="monotone" dataKey="no2" stroke="#a855f7" strokeWidth={2} name="NO2" />
                      )}
                      {modalPollutants.so2 && (
                        <Line type="monotone" dataKey="so2" stroke="#eab308" strokeWidth={2} name="SO2" />
                      )}
                      {modalPollutants.co && (
                        <Line type="monotone" dataKey="co" stroke="#0ea5e9" strokeWidth={2} name="CO" />
                      )}
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Health Modal */}
        <Dialog open={showHealthModal} onOpenChange={setShowHealthModal}>
          <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto bg-slate-900/95 backdrop-blur-md border border-slate-700/50 text-white">
            <DialogHeader>
              <div className="flex items-center justify-between">
                <DialogTitle className="text-2xl font-bold text-white flex items-center space-x-2">
                  <Heart className="h-6 w-6 text-red-500" />
                  <span>Personal Health Dashboard</span>
                </DialogTitle>
                <Button
                  onClick={() => handleCrossModalNavigation("trends")}
                  className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-3 py-1"
                >
                  <TrendingUp className="h-4 w-4 mr-2" />
                  View Related Trends
                </Button>
              </div>
            </DialogHeader>

            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="bg-slate-800/60 backdrop-blur-md border border-slate-700/50">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center space-x-2">
                      <User className="h-5 w-5 text-blue-400" />
                      <span>Health Profile</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-slate-200 space-y-3">
                    <div className="flex items-center space-x-2">
                      <Checkbox checked={true} readOnly />
                      <span className="text-sm">Asthma ✓</span>
                    </div>
                    <div className="text-sm">
                      <span className="text-slate-400">Age Group:</span> Adult (25-45 years)
                    </div>
                    <div className="text-sm">
                      <span className="text-slate-400">Activity Level:</span> Moderate Activity
                    </div>
                    <div className="text-sm">
                      <span className="text-slate-400">Sensitivity:</span>
                      <span className="bg-red-600 text-white px-2 py-1 rounded">High</span>
                    </div>
                  </CardContent>
                </Card>

                <Card className="lg:col-span-2 bg-slate-800/60 backdrop-blur-md border border-slate-700/50">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center space-x-2">
                      <Shield className="h-5 w-5 text-orange-400" />
                      <span>Real-time Risk Assessment</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center space-x-6">
                      <div className="text-center">
                        <div className="relative w-24 h-24 mx-auto mb-2">
                          <div className="absolute inset-0 rounded-full border-8 border-slate-700"></div>
                          <div className="absolute inset-0 rounded-full border-8 border-t-red-500 border-r-red-500 border-b-transparent border-l-transparent transform rotate-45"></div>
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="text-center">
                              <div className="text-2xl font-bold text-white">7.2</div>
                              <div className="text-xs text-slate-400">/10</div>
                            </div>
                          </div>
                        </div>
                        <span className="bg-red-600 text-white px-2 py-1 rounded flex items-center space-x-1">
                          <AlertTriangle className="h-3 w-3" />
                          <span>HIGH RISK</span>
                        </span>
                      </div>

                      <div className="flex-1 space-y-3 text-slate-200">
                        <div className="flex justify-between">
                          <span className="text-sm">Current AQI (78):</span>
                          <span className="text-sm font-medium">+3.2 risk points</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm">Asthma condition:</span>
                          <span className="text-sm font-medium">+2.8 risk points</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm">Activity level:</span>
                          <span className="text-sm font-medium">+1.2 risk points</span>
                        </div>
                        <div className="pt-2 border-t border-slate-700">
                          <div className="flex items-center space-x-2 text-orange-400">
                            <Clock className="h-4 w-4" />
                            <span className="text-sm">Breathing difficulty likely within 2-4 hours</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  )
}
