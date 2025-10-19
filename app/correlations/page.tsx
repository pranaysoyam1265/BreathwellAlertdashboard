"use client"

import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts"
import { BarChart3, TrendingUp, Download, Calendar, Filter, Zap, AlertCircle, FileText, ImageIcon } from "lucide-react"
import { useState, useEffect } from "react"

// Sample correlation data with more data points for scatter plots
const generateScatterData = (xVar: string, yVar: string, correlation: number) => {
  const data = []
  for (let i = 0; i < 100; i++) {
    const x = Math.random() * 100 + 20
    const noise = (Math.random() - 0.5) * 30
    const y = correlation > 0 ? x * correlation * 0.8 + noise + 20 : x * correlation * 0.8 + noise + 80

    data.push({
      x: Math.max(0, x),
      y: Math.max(0, y),
      id: i,
      outlier: Math.random() > 0.95,
      date: new Date(2024, 0, Math.floor(Math.random() * 30) + 1).toISOString().split("T")[0],
      temperature: Math.random() * 40 + 10,
      humidity: Math.random() * 100,
      windSpeed: Math.random() * 20 + 5,
      pressure: Math.random() * 50 + 1000,
    })
  }
  return data
}

const regressionData = [
  { x: 20, y: 85, yPred: 82, upper: 90, lower: 74 },
  { x: 40, y: 65, yPred: 68, upper: 76, lower: 60 },
  { x: 60, y: 45, yPred: 54, upper: 62, lower: 46 },
  { x: 80, y: 35, yPred: 40, upper: 48, lower: 32 },
  { x: 100, y: 25, yPred: 26, upper: 34, lower: 18 },
]

export default function CorrelationsPage() {
  const [xVariable, setXVariable] = useState("PM2.5")
  const [yVariable, setYVariable] = useState("Temperature")
  const [dateRange, setDateRange] = useState("30D")
  const [startDate, setStartDate] = useState("2024-01-01")
  const [endDate, setEndDate] = useState("2024-01-31")
  const [selectedPoint, setSelectedPoint] = useState<any>(null)
  const [isUpdating, setIsUpdating] = useState(false)
  const [scatterData, setScatterData] = useState<any[]>([])
  const [correlationValue, setCorrelationValue] = useState(0)

  const variables = [
    "PM2.5",
    "PM10",
    "SO2",
    "NO2",
    "CO",
    "O3",
    "Temperature",
    "Humidity",
    "Wind Speed",
    "Pressure",
    "Visibility",
  ]

  useEffect(() => {
    setIsUpdating(true)

    // Simulate API call delay
    const timer = setTimeout(() => {
      const newCorrelationValue =
        xVariable === yVariable
          ? 1.0
          : xVariable === "PM2.5" && yVariable === "Temperature"
            ? -0.65
            : xVariable === "PM10" && yVariable === "Wind Speed"
              ? -0.73
              : xVariable === "NO2" && yVariable === "Humidity"
                ? 0.42
                : (Math.random() - 0.5) * 1.8

      setCorrelationValue(newCorrelationValue)
      setScatterData(generateScatterData(xVariable, yVariable, newCorrelationValue))
      setIsUpdating(false)
    }, 300)

    return () => clearTimeout(timer)
  }, [xVariable, yVariable, dateRange])

  const rSquared = Math.pow(Math.abs(correlationValue), 2)
  const pValue = Math.abs(correlationValue) > 0.3 ? 0.001 : 0.089

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      return (
        <div className="bg-slate-900/95 backdrop-blur-md border border-slate-700/50 rounded-lg p-3 text-white shadow-lg">
          <p className="font-medium">{`${xVariable}: ${data.x.toFixed(1)}`}</p>
          <p className="font-medium">{`${yVariable}: ${data.y.toFixed(1)}`}</p>
          <p className="text-slate-300 text-sm">{`Date: ${data.date}`}</p>
          <p className="text-slate-300 text-sm">{`Temperature: ${data.temperature.toFixed(1)}°C`}</p>
          <p className="text-slate-300 text-sm">{`Humidity: ${data.humidity.toFixed(1)}%`}</p>
          {data.outlier && (
            <p className="text-orange-400 text-sm flex items-center">
              <AlertCircle className="h-3 w-3 mr-1" />
              Outlier detected
            </p>
          )}
        </div>
      )
    }
    return null
  }

  const handlePointClick = (data: any) => {
    setSelectedPoint(data)
  }

  const exportCSV = () => {
    const headers = ["Date", xVariable, yVariable, "Temperature", "Humidity", "Wind Speed", "Pressure", "Outlier"]
    const csvContent = [
      headers.join(","),
      ...scatterData.map((row) =>
        [
          row.date,
          row.x.toFixed(2),
          row.y.toFixed(2),
          row.temperature.toFixed(2),
          row.humidity.toFixed(2),
          row.windSpeed.toFixed(2),
          row.pressure.toFixed(2),
          row.outlier ? "Yes" : "No",
        ].join(","),
      ),
    ].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `correlation-data-${xVariable}-${yVariable}-${new Date().toISOString().split("T")[0]}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  const exportAnalysis = () => {
    const analysisData = {
      analysis: {
        title: `Correlation Analysis: ${xVariable} vs ${yVariable}`,
        date: new Date().toISOString(),
        variables: { x: xVariable, y: yVariable },
        correlation: correlationValue,
        rSquared: rSquared,
        pValue: pValue,
        dateRange: { start: startDate, end: endDate },
        dataPoints: scatterData.length,
        outliers: scatterData.filter((d) => d.outlier).length,
        equation: `y = ${correlationValue.toFixed(2)}x + ${(50 - correlationValue * 25).toFixed(1)}`,
        interpretation:
          Math.abs(correlationValue) > 0.7
            ? `Strong ${correlationValue > 0 ? "positive" : "negative"} relationship detected`
            : Math.abs(correlationValue) > 0.4
              ? `Moderate ${correlationValue > 0 ? "positive" : "negative"} relationship exists`
              : "Weak or no linear relationship found",
        recommendations: [
          pValue < 0.05 ? "Relationship is statistically significant" : "Relationship is not statistically significant",
          scatterData.filter((d) => d.outlier).length > 5
            ? "High number of outliers detected - investigate data quality"
            : "Data quality appears good",
          rSquared > 0.7
            ? "Model has excellent predictive power"
            : rSquared > 0.4
              ? "Model has moderate predictive power"
              : "Model has limited predictive power",
        ],
      },
      statistics: {
        sampleSize: scatterData.length,
        outlierPercentage: ((scatterData.filter((d) => d.outlier).length / scatterData.length) * 100).toFixed(1),
        correlationStrength:
          Math.abs(correlationValue) > 0.7 ? "Strong" : Math.abs(correlationValue) > 0.4 ? "Moderate" : "Weak",
        significance: pValue < 0.05 ? "Significant" : "Not Significant",
      },
    }

    const blob = new Blob([JSON.stringify(analysisData, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `correlation-analysis-${xVariable}-${yVariable}-${new Date().toISOString().split("T")[0]}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  const exportChartImage = () => {
    // This would typically use a library like html2canvas or similar
    // For now, we'll create a simple notification
    alert("Chart export functionality would be implemented with html2canvas or similar library")
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Controls Section */}
        <Card className="bg-slate-800/60 backdrop-blur-md border border-slate-700/50">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-white">
              <BarChart3 className="h-5 w-5 text-blue-400" />
              <span>Correlation Analysis Controls</span>
              {isUpdating && <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-400"></div>}
            </CardTitle>
            <CardDescription className="text-slate-300">
              Configure variables and parameters for statistical correlation analysis with instant chart updates
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col lg:flex-row gap-6">
              {/* Variable Selection */}
              <div className="flex flex-row items-center space-x-4 flex-wrap gap-4">
                <div className="flex items-center space-x-2">
                  <Label className="text-slate-200 whitespace-nowrap">X-Axis:</Label>
                  <Select value={xVariable} onValueChange={setXVariable}>
                    <SelectTrigger className="w-32 bg-slate-700/50 border-slate-600 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-slate-700">
                      {variables.map((variable) => (
                        <SelectItem key={variable} value={variable} className="text-white hover:bg-slate-700">
                          {variable}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center space-x-2">
                  <Label className="text-slate-200 whitespace-nowrap">Y-Axis:</Label>
                  <Select value={yVariable} onValueChange={setYVariable}>
                    <SelectTrigger className="w-32 bg-slate-700/50 border-slate-600 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-slate-700">
                      {variables.map((variable) => (
                        <SelectItem key={variable} value={variable} className="text-white hover:bg-slate-700">
                          {variable}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Date Range Filter */}
              <div className="flex flex-row items-center space-x-4 flex-wrap gap-4">
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4 text-slate-400" />
                  <Select value={dateRange} onValueChange={setDateRange}>
                    <SelectTrigger className="w-32 bg-slate-700/50 border-slate-600 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-slate-700">
                      <SelectItem value="7D" className="text-white hover:bg-slate-700">
                        Last 7 Days
                      </SelectItem>
                      <SelectItem value="30D" className="text-white hover:bg-slate-700">
                        Last 30 Days
                      </SelectItem>
                      <SelectItem value="90D" className="text-white hover:bg-slate-700">
                        Last 90 Days
                      </SelectItem>
                      <SelectItem value="custom" className="text-white hover:bg-slate-700">
                        Custom Range
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {dateRange === "custom" && (
                  <>
                    <Input
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="w-36 bg-slate-700/50 border-slate-600 text-white"
                    />
                    <Input
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="w-36 bg-slate-700/50 border-slate-600 text-white"
                    />
                  </>
                )}

                <div className="flex items-center space-x-2">
                  <Button
                    onClick={exportCSV}
                    className="bg-green-600 hover:bg-green-700 text-white flex items-center space-x-2"
                  >
                    <FileText className="h-4 w-4" />
                    <span>CSV</span>
                  </Button>

                  <Button
                    onClick={exportAnalysis}
                    className="bg-blue-600 hover:bg-blue-700 text-white flex items-center space-x-2"
                  >
                    <Download className="h-4 w-4" />
                    <span>Analysis</span>
                  </Button>

                  <Button
                    onClick={exportChartImage}
                    variant="outline"
                    className="border-slate-600 text-slate-200 hover:bg-slate-700 bg-transparent flex items-center space-x-2"
                  >
                    <ImageIcon className="h-4 w-4" />
                    <span>PNG</span>
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Charts Section - Side by Side on Desktop, Stacked on Mobile */}
        <div className="flex flex-col lg:flex-row gap-6 w-full">
          {/* Scatter Plot */}
          <Card className="flex-1 bg-slate-800/60 backdrop-blur-md border border-slate-700/50">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-white">
                <TrendingUp className="h-5 w-5 text-green-400" />
                <span>Live Scatter Plot</span>
                <Badge className="bg-green-600 text-white animate-pulse">LIVE</Badge>
              </CardTitle>
              <CardDescription className="text-slate-300">
                Interactive data points with outlier detection and hover tooltips
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80 w-full relative">
                {isUpdating && (
                  <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-10 rounded-lg">
                    <div className="flex items-center space-x-2 text-white">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-400"></div>
                      <span>Updating chart...</span>
                    </div>
                  </div>
                )}
                <ResponsiveContainer width="100%" height="100%">
                  <ScatterChart data={scatterData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis
                      dataKey="x"
                      stroke="#9CA3AF"
                      name={xVariable}
                      label={{ value: xVariable, position: "insideBottom", offset: -10, fill: "#9CA3AF" }}
                    />
                    <YAxis
                      dataKey="y"
                      stroke="#9CA3AF"
                      name={yVariable}
                      label={{ value: yVariable, angle: -90, position: "insideLeft", fill: "#9CA3AF" }}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Scatter
                      dataKey="y"
                      fill={(point: any) => (point.outlier ? "#f97316" : "#3b82f6")}
                      onClick={handlePointClick}
                      className="cursor-pointer"
                    />
                  </ScatterChart>
                </ResponsiveContainer>
              </div>

              {/* Statistics */}
              <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-300">Correlation (r):</span>
                  <Badge className={correlationValue > 0 ? "bg-red-600" : "bg-blue-600"}>
                    {correlationValue.toFixed(3)}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-300">Data Points:</span>
                  <span className="text-white font-medium">{scatterData.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-300">Outliers:</span>
                  <Badge variant="outline" className="text-orange-400 border-orange-400">
                    {scatterData.filter((d) => d.outlier).length}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-300">P-Value:</span>
                  <Badge className={pValue < 0.05 ? "bg-green-600" : "bg-gray-600"}>
                    {pValue < 0.001 ? "< 0.001" : pValue.toFixed(3)}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Regression Line Chart */}
          <Card className="flex-1 bg-slate-800/60 backdrop-blur-md border border-slate-700/50">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-white">
                <Zap className="h-5 w-5 text-purple-400" />
                <span>Regression Line Chart</span>
              </CardTitle>
              <CardDescription className="text-slate-300">
                Linear regression with 95% confidence intervals and regression statistics
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={regressionData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis
                      dataKey="x"
                      stroke="#9CA3AF"
                      label={{ value: xVariable, position: "insideBottom", offset: -10, fill: "#9CA3AF" }}
                    />
                    <YAxis
                      stroke="#9CA3AF"
                      label={{ value: yVariable, angle: -90, position: "insideLeft", fill: "#9CA3AF" }}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#1e293b",
                        border: "1px solid #475569",
                        borderRadius: "8px",
                        color: "#f1f5f9",
                      }}
                    />

                    {/* Confidence Interval */}
                    <Line
                      dataKey="upper"
                      stroke="#8b5cf6"
                      strokeWidth={1}
                      strokeDasharray="5 5"
                      dot={false}
                      name="Upper CI (95%)"
                    />
                    <Line
                      dataKey="lower"
                      stroke="#8b5cf6"
                      strokeWidth={1}
                      strokeDasharray="5 5"
                      dot={false}
                      name="Lower CI (95%)"
                    />

                    {/* Regression Line */}
                    <Line dataKey="yPred" stroke="#ef4444" strokeWidth={3} dot={false} name="Regression Line" />

                    {/* Actual Data Points */}
                    <Line
                      dataKey="y"
                      stroke="#3b82f6"
                      strokeWidth={0}
                      dot={{ fill: "#3b82f6", strokeWidth: 2, r: 4 }}
                      name="Observed Values"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {/* Regression Statistics */}
              <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-300">R² Value:</span>
                  <Badge className="bg-purple-600">{rSquared.toFixed(3)}</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-300">Model Fit:</span>
                  <Badge className={rSquared > 0.7 ? "bg-green-600" : rSquared > 0.4 ? "bg-yellow-600" : "bg-red-600"}>
                    {rSquared > 0.7 ? "Excellent" : rSquared > 0.4 ? "Good" : "Poor"}
                  </Badge>
                </div>
                <div className="col-span-2 flex justify-between">
                  <span className="text-slate-300">Equation:</span>
                  <span className="font-mono text-xs text-white">
                    y = {correlationValue.toFixed(2)}x + {(50 - correlationValue * 25).toFixed(1)}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Data Drilldown Section */}
        {selectedPoint && (
          <Card className="bg-slate-800/60 backdrop-blur-md border border-slate-700/50">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-white">
                <Filter className="h-5 w-5 text-orange-400" />
                <span>Data Point Drilldown</span>
              </CardTitle>
              <CardDescription className="text-slate-300">
                Detailed analysis of selected data point with export options
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <h4 className="font-medium text-white">Point Details</h4>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-300">{xVariable}:</span>
                      <span className="text-white font-medium">{selectedPoint.x.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-300">{yVariable}:</span>
                      <span className="text-white font-medium">{selectedPoint.y.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-300">Date:</span>
                      <span className="text-white font-medium">{selectedPoint.date}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-300">Temperature:</span>
                      <span className="text-white font-medium">{selectedPoint.temperature.toFixed(1)}°C</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-300">Humidity:</span>
                      <span className="text-white font-medium">{selectedPoint.humidity.toFixed(1)}%</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="font-medium text-white">Statistical Position</h4>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-300">Residual:</span>
                      <span className="text-white font-medium">
                        {(selectedPoint.y - (correlationValue * selectedPoint.x + 50)).toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-300">Leverage:</span>
                      <Badge variant="outline" className="text-blue-400 border-blue-400">
                        {(Math.random() * 0.1).toFixed(3)}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-300">Influence:</span>
                      <Badge className={selectedPoint.outlier ? "bg-orange-600" : "bg-green-600"}>
                        {selectedPoint.outlier ? "High" : "Normal"}
                      </Badge>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="font-medium text-white">Context & Actions</h4>
                  <div className="text-sm text-slate-300 mb-3">
                    {selectedPoint.outlier ? (
                      <p>
                        This point is identified as an outlier and may represent unusual environmental conditions or
                        measurement errors.
                      </p>
                    ) : (
                      <p>
                        This data point falls within the expected range and contributes positively to the correlation
                        model.
                      </p>
                    )}
                  </div>
                  <Button
                    onClick={() => {
                      const pointData = {
                        point: selectedPoint,
                        analysis: {
                          residual: selectedPoint.y - (correlationValue * selectedPoint.x + 50),
                          isOutlier: selectedPoint.outlier,
                          context: selectedPoint.outlier ? "Outlier - investigate further" : "Normal data point",
                        },
                      }
                      const blob = new Blob([JSON.stringify(pointData, null, 2)], { type: "application/json" })
                      const url = URL.createObjectURL(blob)
                      const a = document.createElement("a")
                      a.href = url
                      a.download = `data-point-${selectedPoint.id}-${selectedPoint.date}.json`
                      a.click()
                      URL.revokeObjectURL(url)
                    }}
                    size="sm"
                    className="w-full bg-orange-600 hover:bg-orange-700 text-white"
                  >
                    <Download className="h-3 w-3 mr-2" />
                    Export Point Data
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Summary Statistics */}
        <Card className="bg-slate-800/60 backdrop-blur-md border border-slate-700/50">
          <CardHeader>
            <CardTitle className="flex items-center justify-between text-white">
              <div className="flex items-center space-x-2">
                <BarChart3 className="h-5 w-5 text-blue-400" />
                <span>Correlation Summary</span>
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  onClick={exportCSV}
                  variant="outline"
                  size="sm"
                  className="border-slate-600 text-slate-200 hover:bg-slate-700 bg-transparent"
                >
                  <FileText className="h-4 w-4 mr-2" />
                  Export CSV
                </Button>
                <Button
                  onClick={exportAnalysis}
                  variant="outline"
                  size="sm"
                  className="border-slate-600 text-slate-200 hover:bg-slate-700 bg-transparent"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Export Analysis
                </Button>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <h4 className="font-medium text-white">Relationship Strength</h4>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-300">Correlation Type:</span>
                    <Badge className={correlationValue > 0 ? "bg-red-600" : "bg-blue-600"}>
                      {correlationValue > 0 ? "Positive" : "Negative"}
                    </Badge>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-300">Strength:</span>
                    <Badge
                      className={
                        Math.abs(correlationValue) > 0.7
                          ? "bg-green-600"
                          : Math.abs(correlationValue) > 0.4
                            ? "bg-yellow-600"
                            : "bg-red-600"
                      }
                    >
                      {Math.abs(correlationValue) > 0.7
                        ? "Strong"
                        : Math.abs(correlationValue) > 0.4
                          ? "Moderate"
                          : "Weak"}
                    </Badge>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-300">Significance:</span>
                    <Badge className={pValue < 0.05 ? "bg-green-600" : "bg-gray-600"}>
                      {pValue < 0.05 ? "Significant" : "Not Significant"}
                    </Badge>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="font-medium text-white">Data Quality</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-300">Sample Size:</span>
                    <span className="text-white font-medium">{scatterData.length} points</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-300">Outliers:</span>
                    <span className="text-white font-medium">
                      {scatterData.filter((d) => d.outlier).length} (
                      {((scatterData.filter((d) => d.outlier).length / scatterData.length) * 100).toFixed(1)}%)
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-300">Date Range:</span>
                    <span className="text-white font-medium">{dateRange}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-300">Quality Score:</span>
                    <Badge
                      className={
                        scatterData.filter((d) => d.outlier).length / scatterData.length < 0.05
                          ? "bg-green-600"
                          : scatterData.filter((d) => d.outlier).length / scatterData.length < 0.1
                            ? "bg-yellow-600"
                            : "bg-red-600"
                      }
                    >
                      {scatterData.filter((d) => d.outlier).length / scatterData.length < 0.05
                        ? "Excellent"
                        : scatterData.filter((d) => d.outlier).length / scatterData.length < 0.1
                          ? "Good"
                          : "Poor"}
                    </Badge>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="font-medium text-white">Interpretation</h4>
                <div className="text-sm text-slate-300">
                  {Math.abs(correlationValue) > 0.7 ? (
                    <p>
                      Strong relationship detected. Changes in {xVariable} are highly predictive of changes in{" "}
                      {yVariable}. This relationship is{" "}
                      {pValue < 0.05 ? "statistically significant" : "not statistically significant"}.
                    </p>
                  ) : Math.abs(correlationValue) > 0.4 ? (
                    <p>
                      Moderate relationship exists. {xVariable} shows meaningful association with {yVariable}. Consider
                      additional variables for better prediction.
                    </p>
                  ) : (
                    <p>
                      Weak or no linear relationship. Other factors may be more influential than {xVariable} on{" "}
                      {yVariable}. Non-linear relationships may exist.
                    </p>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
