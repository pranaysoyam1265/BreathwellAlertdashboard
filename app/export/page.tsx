"use client"

import type React from "react"

import { useState } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import {
  Download,
  Upload,
  Database,
  Brain,
  Settings,
  Play,
  RefreshCw,
  CheckCircle,
  AlertCircle,
  Info,
  Calendar,
  Activity,
} from "lucide-react"

// Mock data for demonstration
const mockExportHistory = [
  {
    id: 1,
    name: "Delhi AQI Dataset - Q4 2024",
    format: "CSV",
    size: "2.4 MB",
    records: 8640,
    date: "2024-12-15",
    status: "completed",
    downloadUrl: "#",
  },
  {
    id: 2,
    name: "Multi-City Health Correlations",
    format: "JSON",
    size: "1.8 MB",
    records: 5280,
    date: "2024-12-10",
    status: "completed",
    downloadUrl: "#",
  },
  {
    id: 3,
    name: "Mumbai Forecasting Model Data",
    format: "Parquet",
    size: "3.2 MB",
    records: 12960,
    date: "2024-12-08",
    status: "processing",
    downloadUrl: null,
  },
]

const mockMLModels = [
  {
    id: 1,
    name: "AQI Prediction Model v2.1",
    type: "Random Forest",
    accuracy: 94.2,
    lastTrained: "2024-12-14",
    status: "active",
    features: ["PM2.5", "PM10", "Temperature", "Humidity", "Wind Speed", "Season"],
    trainingData: "15,840 samples",
    performance: {
      mae: 8.3,
      rmse: 12.1,
      r2: 0.89,
    },
  },
  {
    id: 2,
    name: "Health Risk Classifier",
    type: "Neural Network",
    accuracy: 91.7,
    lastTrained: "2024-12-12",
    status: "training",
    features: ["AQI", "Age", "Health Conditions", "Activity Level"],
    trainingData: "8,920 samples",
    performance: {
      precision: 0.92,
      recall: 0.89,
      f1: 0.9,
    },
  },
  {
    id: 3,
    name: "Multi-City Forecaster",
    type: "LSTM",
    accuracy: 87.5,
    lastTrained: "2024-12-10",
    status: "pending",
    features: ["Historical AQI", "Weather Data", "Traffic Patterns", "Industrial Activity"],
    trainingData: "25,600 samples",
    performance: {
      mae: 15.2,
      rmse: 21.8,
      r2: 0.82,
    },
  },
]

export default function ExportPage() {
  const [selectedFormat, setSelectedFormat] = useState("csv")
  const [selectedDateRange, setSelectedDateRange] = useState("last30days")
  const [selectedCities, setSelectedCities] = useState<string[]>(["delhi", "mumbai"])
  const [selectedMetrics, setSelectedMetrics] = useState<string[]>(["aqi", "pm25", "pm10"])
  const [includeWeather, setIncludeWeather] = useState(true)
  const [includeHealth, setIncludeHealth] = useState(false)
  const [isExporting, setIsExporting] = useState(false)
  const [exportProgress, setExportProgress] = useState(0)
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [isTraining, setIsTraining] = useState(false)
  const [trainingProgress, setTrainingProgress] = useState(0)
  const [selectedModel, setSelectedModel] = useState<string>("")
  const [modelConfig, setModelConfig] = useState({
    algorithm: "random_forest",
    features: ["pm25", "pm10", "temperature", "humidity"],
    testSplit: 0.2,
    crossValidation: 5,
    hyperparameterTuning: true,
  })

  const handleExport = () => {
    setIsExporting(true)
    setExportProgress(0)

    // Simulate export progress
    const interval = setInterval(() => {
      setExportProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setIsExporting(false)
          // Trigger download
          const blob = new Blob([generateMockData()], { type: getMimeType(selectedFormat) })
          const url = URL.createObjectURL(blob)
          const a = document.createElement("a")
          a.href = url
          a.download = `breathewell-export-${new Date().toISOString().split("T")[0]}.${selectedFormat}`
          a.click()
          URL.revokeObjectURL(url)
          return 100
        }
        return prev + Math.random() * 15
      })
    }, 200)
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setUploadedFile(file)
    }
  }

  const handleModelTraining = () => {
    setIsTraining(true)
    setTrainingProgress(0)

    // Simulate training progress
    const interval = setInterval(() => {
      setTrainingProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setIsTraining(false)
          return 100
        }
        return prev + Math.random() * 8
      })
    }, 500)
  }

  const generateMockData = () => {
    const headers = ["timestamp", "city", ...selectedMetrics]
    if (includeWeather) headers.push("temperature", "humidity", "wind_speed")
    if (includeHealth) headers.push("health_risk", "recommendations")

    let data = headers.join(",") + "\n"

    // Generate sample rows
    for (let i = 0; i < 100; i++) {
      const row = [
        new Date(Date.now() - i * 3600000).toISOString(),
        selectedCities[i % selectedCities.length],
        ...selectedMetrics.map(() => Math.floor(Math.random() * 200)),
      ]
      if (includeWeather) {
        row.push(
          (Math.random() * 20 + 15).toFixed(1), // temperature
          (Math.random() * 40 + 40).toFixed(1), // humidity
          (Math.random() * 20 + 5).toFixed(1), // wind speed
        )
      }
      if (includeHealth) {
        row.push(["Low", "Moderate", "High"][Math.floor(Math.random() * 3)], "Stay indoors during peak hours")
      }
      data += row.join(",") + "\n"
    }

    return data
  }

  const getMimeType = (format: string) => {
    switch (format) {
      case "csv":
        return "text/csv"
      case "json":
        return "application/json"
      case "xlsx":
        return "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      case "parquet":
        return "application/octet-stream"
      default:
        return "text/plain"
    }
  }

  return (
    <DashboardLayout>
      <div className="space-y-8 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-700 min-h-screen p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white flex items-center gap-2">
              <Database className="h-8 w-8 text-purple-400" />
              Data Export & ML Training
            </h1>
            <p className="text-slate-300 mt-1">
              Export datasets, upload custom data, and train machine learning models for air quality prediction
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="border-slate-600 text-slate-200 hover:bg-slate-700 bg-transparent">
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </Button>
            <Button variant="outline" className="border-slate-600 text-slate-200 hover:bg-slate-700 bg-transparent">
              <Info className="h-4 w-4 mr-2" />
              API Docs
            </Button>
          </div>
        </div>

        <Tabs defaultValue="export" className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-slate-800/40">
            <TabsTrigger
              value="export"
              className="data-[state=active]:bg-slate-700/80 data-[state=active]:text-white text-slate-300"
            >
              Data Export
            </TabsTrigger>
            <TabsTrigger
              value="upload"
              className="data-[state=active]:bg-slate-700/80 data-[state=active]:text-white text-slate-300"
            >
              Dataset Upload
            </TabsTrigger>
            <TabsTrigger
              value="models"
              className="data-[state=active]:bg-slate-700/80 data-[state=active]:text-white text-slate-300"
            >
              ML Models
            </TabsTrigger>
            <TabsTrigger
              value="history"
              className="data-[state=active]:bg-slate-700/80 data-[state=active]:text-white text-slate-300"
            >
              Export History
            </TabsTrigger>
          </TabsList>

          {/* Enhanced Data Export Tab */}
          <TabsContent value="export" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Export Configuration */}
              <div className="lg:col-span-2">
                <Card className="bg-slate-800/60 backdrop-blur-md border border-slate-700/50">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-white">
                      <Download className="h-5 w-5 text-blue-400" />
                      Export Configuration
                    </CardTitle>
                    <CardDescription className="text-slate-300">
                      Configure your data export with advanced filtering and formatting options
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Format Selection */}
                    <div className="space-y-2">
                      <Label className="text-slate-200">Export Format</Label>
                      <Select value={selectedFormat} onValueChange={setSelectedFormat}>
                        <SelectTrigger className="bg-slate-700/50 border-slate-600 text-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-800 border-slate-700">
                          <SelectItem value="csv">📄 CSV (Comma Separated)</SelectItem>
                          <SelectItem value="json">🔗 JSON (JavaScript Object)</SelectItem>
                          <SelectItem value="xlsx">📊 Excel (XLSX)</SelectItem>
                          <SelectItem value="parquet">⚡ Parquet (Optimized)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Date Range */}
                    <div className="space-y-2">
                      <Label className="text-slate-200">Date Range</Label>
                      <Select value={selectedDateRange} onValueChange={setSelectedDateRange}>
                        <SelectTrigger className="bg-slate-700/50 border-slate-600 text-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-800 border-slate-700">
                          <SelectItem value="last7days">Last 7 Days</SelectItem>
                          <SelectItem value="last30days">Last 30 Days</SelectItem>
                          <SelectItem value="last90days">Last 90 Days</SelectItem>
                          <SelectItem value="last1year">Last 1 Year</SelectItem>
                          <SelectItem value="custom">Custom Range</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* City Selection */}
                    <div className="space-y-2">
                      <Label className="text-slate-200">Cities to Include</Label>
                      <div className="grid grid-cols-2 gap-2">
                        {["delhi", "mumbai", "bangalore", "chennai", "kolkata", "hyderabad"].map((city) => (
                          <div key={city} className="flex items-center space-x-2">
                            <Checkbox
                              id={city}
                              checked={selectedCities.includes(city)}
                              onCheckedChange={(checked) => {
                                if (checked) {
                                  setSelectedCities([...selectedCities, city])
                                } else {
                                  setSelectedCities(selectedCities.filter((c) => c !== city))
                                }
                              }}
                            />
                            <Label htmlFor={city} className="text-slate-300 capitalize">
                              {city}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Metrics Selection */}
                    <div className="space-y-2">
                      <Label className="text-slate-200">Air Quality Metrics</Label>
                      <div className="grid grid-cols-2 gap-2">
                        {[
                          { id: "aqi", label: "AQI Index" },
                          { id: "pm25", label: "PM2.5" },
                          { id: "pm10", label: "PM10" },
                          { id: "no2", label: "NO2" },
                          { id: "so2", label: "SO2" },
                          { id: "co", label: "CO" },
                        ].map((metric) => (
                          <div key={metric.id} className="flex items-center space-x-2">
                            <Checkbox
                              id={metric.id}
                              checked={selectedMetrics.includes(metric.id)}
                              onCheckedChange={(checked) => {
                                if (checked) {
                                  setSelectedMetrics([...selectedMetrics, metric.id])
                                } else {
                                  setSelectedMetrics(selectedMetrics.filter((m) => m !== metric.id))
                                }
                              }}
                            />
                            <Label htmlFor={metric.id} className="text-slate-300">
                              {metric.label}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Additional Data */}
                    <div className="space-y-4">
                      <Label className="text-slate-200">Additional Data</Label>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <Label htmlFor="weather" className="text-slate-300">
                            Include Weather Data
                          </Label>
                          <Switch id="weather" checked={includeWeather} onCheckedChange={setIncludeWeather} />
                        </div>
                        <div className="flex items-center justify-between">
                          <Label htmlFor="health" className="text-slate-300">
                            Include Health Recommendations
                          </Label>
                          <Switch id="health" checked={includeHealth} onCheckedChange={setIncludeHealth} />
                        </div>
                      </div>
                    </div>

                    {/* Export Button */}
                    <div className="pt-4 border-t border-slate-700">
                      <Button
                        onClick={handleExport}
                        disabled={isExporting || selectedCities.length === 0 || selectedMetrics.length === 0}
                        className="w-full bg-blue-600 hover:bg-blue-700"
                      >
                        {isExporting ? (
                          <>
                            <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                            Exporting... {Math.round(exportProgress)}%
                          </>
                        ) : (
                          <>
                            <Download className="h-4 w-4 mr-2" />
                            Export Dataset
                          </>
                        )}
                      </Button>
                      {isExporting && <Progress value={exportProgress} className="mt-2" />}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Export Preview */}
              <div>
                <Card className="bg-slate-800/60 backdrop-blur-md border border-slate-700/50">
                  <CardHeader>
                    <CardTitle className="text-white">Export Preview</CardTitle>
                    <CardDescription className="text-slate-300">Preview of your export configuration</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-400">Format:</span>
                        <Badge className="bg-blue-600 text-white">{selectedFormat.toUpperCase()}</Badge>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-400">Cities:</span>
                        <span className="text-slate-200">{selectedCities.length}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-400">Metrics:</span>
                        <span className="text-slate-200">{selectedMetrics.length}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-400">Est. Records:</span>
                        <span className="text-slate-200">~{(selectedCities.length * 24 * 30).toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-400">Est. Size:</span>
                        <span className="text-slate-200">
                          ~{(selectedCities.length * selectedMetrics.length * 0.1).toFixed(1)} MB
                        </span>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-slate-700">
                      <h4 className="text-sm font-medium text-white mb-2">Sample Structure</h4>
                      <div className="bg-slate-900/50 rounded p-2 text-xs font-mono text-slate-300">
                        {selectedFormat === "json" ? (
                          <pre>{`{
  "timestamp": "2024-12-15T10:00:00Z",
  "city": "delhi",
  "aqi": 145,
  ${selectedMetrics.includes("pm25") ? '"pm25": 78,' : ""}
  ${includeWeather ? '"temperature": 28.5' : ""}
}`}</pre>
                        ) : (
                          <pre>{`timestamp,city,${selectedMetrics.join(",")}${includeWeather ? ",temp,humidity" : ""}
2024-12-15T10:00:00Z,delhi,145,78,125${includeWeather ? ",28.5,65" : ""}`}</pre>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Dataset Upload Tab */}
          <TabsContent value="upload" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-slate-800/60 backdrop-blur-md border border-slate-700/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-white">
                    <Upload className="h-5 w-5 text-green-400" />
                    Upload Custom Dataset
                  </CardTitle>
                  <CardDescription className="text-slate-300">
                    Upload your own air quality datasets for analysis and model training
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="border-2 border-dashed border-slate-600 rounded-lg p-8 text-center">
                    <Upload className="h-12 w-12 text-slate-500 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-white mb-2">Drop files here</h3>
                    <p className="text-slate-400 mb-4">or click to browse</p>
                    <Input
                      type="file"
                      accept=".csv,.json,.xlsx,.parquet"
                      onChange={handleFileUpload}
                      className="hidden"
                      id="file-upload"
                    />
                    <Label htmlFor="file-upload">
                      <Button
                        variant="outline"
                        className="border-slate-600 text-slate-200 hover:bg-slate-700 bg-transparent"
                      >
                        Choose File
                      </Button>
                    </Label>
                  </div>

                  {uploadedFile && (
                    <div className="bg-slate-700/30 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium text-white">{uploadedFile.name}</h4>
                          <p className="text-sm text-slate-400">{(uploadedFile.size / 1024 / 1024).toFixed(2)} MB</p>
                        </div>
                        <CheckCircle className="h-5 w-5 text-green-400" />
                      </div>
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label className="text-slate-200">Dataset Description</Label>
                    <Textarea
                      placeholder="Describe your dataset (optional)"
                      className="bg-slate-700/50 border-slate-600 text-white"
                    />
                  </div>

                  <Button className="w-full bg-green-600 hover:bg-green-700" disabled={!uploadedFile}>
                    <Upload className="h-4 w-4 mr-2" />
                    Process Dataset
                  </Button>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/60 backdrop-blur-md border border-slate-700/50">
                <CardHeader>
                  <CardTitle className="text-white">Upload Guidelines</CardTitle>
                  <CardDescription className="text-slate-300">
                    Requirements and best practices for dataset uploads
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-400 mt-0.5" />
                      <div>
                        <h4 className="text-sm font-medium text-white">Supported Formats</h4>
                        <p className="text-xs text-slate-400">CSV, JSON, Excel (.xlsx), Parquet</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-400 mt-0.5" />
                      <div>
                        <h4 className="text-sm font-medium text-white">Required Columns</h4>
                        <p className="text-xs text-slate-400">
                          timestamp, location/city, at least one air quality metric
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-400 mt-0.5" />
                      <div>
                        <h4 className="text-sm font-medium text-white">File Size Limit</h4>
                        <p className="text-xs text-slate-400">Maximum 100 MB per file</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <AlertCircle className="h-4 w-4 text-yellow-400 mt-0.5" />
                      <div>
                        <h4 className="text-sm font-medium text-white">Data Quality</h4>
                        <p className="text-xs text-slate-400">
                          Ensure timestamps are in ISO format and values are numeric
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-700">
                    <h4 className="text-sm font-medium text-white mb-2">Sample Format</h4>
                    <div className="bg-slate-900/50 rounded p-2 text-xs font-mono text-slate-300">
                      <pre>{`timestamp,city,aqi,pm25,pm10
2024-12-15T10:00:00Z,Delhi,145,78,125
2024-12-15T11:00:00Z,Mumbai,98,58,85`}</pre>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* ML Models Tab */}
          <TabsContent value="models" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Model Training */}
              <div className="lg:col-span-2">
                <Card className="bg-slate-800/60 backdrop-blur-md border border-slate-700/50">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-white">
                      <Brain className="h-5 w-5 text-purple-400" />
                      Train New Model
                    </CardTitle>
                    <CardDescription className="text-slate-300">
                      Configure and train machine learning models for air quality prediction
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="text-slate-200">Model Type</Label>
                        <Select
                          value={modelConfig.algorithm}
                          onValueChange={(value) => setModelConfig({ ...modelConfig, algorithm: value })}
                        >
                          <SelectTrigger className="bg-slate-700/50 border-slate-600 text-white">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="bg-slate-800 border-slate-700">
                            <SelectItem value="random_forest">🌳 Random Forest</SelectItem>
                            <SelectItem value="neural_network">🧠 Neural Network</SelectItem>
                            <SelectItem value="lstm">📈 LSTM (Time Series)</SelectItem>
                            <SelectItem value="xgboost">⚡ XGBoost</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-slate-200">Test Split</Label>
                        <Select
                          value={modelConfig.testSplit.toString()}
                          onValueChange={(value) =>
                            setModelConfig({ ...modelConfig, testSplit: Number.parseFloat(value) })
                          }
                        >
                          <SelectTrigger className="bg-slate-700/50 border-slate-600 text-white">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="bg-slate-800 border-slate-700">
                            <SelectItem value="0.1">10% Test</SelectItem>
                            <SelectItem value="0.2">20% Test</SelectItem>
                            <SelectItem value="0.3">30% Test</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-slate-200">Feature Selection</Label>
                      <div className="grid grid-cols-2 gap-2">
                        {[
                          { id: "pm25", label: "PM2.5" },
                          { id: "pm10", label: "PM10" },
                          { id: "temperature", label: "Temperature" },
                          { id: "humidity", label: "Humidity" },
                          { id: "wind_speed", label: "Wind Speed" },
                          { id: "season", label: "Season" },
                        ].map((feature) => (
                          <div key={feature.id} className="flex items-center space-x-2">
                            <Checkbox
                              id={feature.id}
                              checked={modelConfig.features.includes(feature.id)}
                              onCheckedChange={(checked) => {
                                if (checked) {
                                  setModelConfig({ ...modelConfig, features: [...modelConfig.features, feature.id] })
                                } else {
                                  setModelConfig({
                                    ...modelConfig,
                                    features: modelConfig.features.filter((f) => f !== feature.id),
                                  })
                                }
                              }}
                            />
                            <Label htmlFor={feature.id} className="text-slate-300">
                              {feature.label}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <Label htmlFor="hyperparameter" className="text-slate-200">
                        Hyperparameter Tuning
                      </Label>
                      <Switch
                        id="hyperparameter"
                        checked={modelConfig.hyperparameterTuning}
                        onCheckedChange={(checked) => setModelConfig({ ...modelConfig, hyperparameterTuning: checked })}
                      />
                    </div>

                    <Button
                      onClick={handleModelTraining}
                      disabled={isTraining || modelConfig.features.length === 0}
                      className="w-full bg-purple-600 hover:bg-purple-700"
                    >
                      {isTraining ? (
                        <>
                          <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                          Training... {Math.round(trainingProgress)}%
                        </>
                      ) : (
                        <>
                          <Play className="h-4 w-4 mr-2" />
                          Start Training
                        </>
                      )}
                    </Button>
                    {isTraining && <Progress value={trainingProgress} className="mt-2" />}
                  </CardContent>
                </Card>
              </div>

              {/* Training Status */}
              <div>
                <Card className="bg-slate-800/60 backdrop-blur-md border border-slate-700/50">
                  <CardHeader>
                    <CardTitle className="text-white">Training Status</CardTitle>
                    <CardDescription className="text-slate-300">Current model training progress</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-400">Algorithm:</span>
                        <Badge className="bg-purple-600 text-white">
                          {modelConfig.algorithm.replace("_", " ").toUpperCase()}
                        </Badge>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-400">Features:</span>
                        <span className="text-slate-200">{modelConfig.features.length}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-400">Test Split:</span>
                        <span className="text-slate-200">{modelConfig.testSplit * 100}%</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-400">CV Folds:</span>
                        <span className="text-slate-200">{modelConfig.crossValidation}</span>
                      </div>
                    </div>

                    {isTraining && (
                      <div className="pt-4 border-t border-slate-700">
                        <h4 className="text-sm font-medium text-white mb-2">Training Metrics</h4>
                        <div className="space-y-2 text-xs">
                          <div className="flex justify-between">
                            <span className="text-slate-400">Current Epoch:</span>
                            <span className="text-slate-200">{Math.floor(trainingProgress / 10)}/10</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-400">Loss:</span>
                            <span className="text-slate-200">{(0.5 - trainingProgress * 0.004).toFixed(4)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-400">Accuracy:</span>
                            <span className="text-slate-200">{(60 + trainingProgress * 0.3).toFixed(1)}%</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Existing Models */}
            <Card className="bg-slate-800/60 backdrop-blur-md border border-slate-700/50">
              <CardHeader>
                <CardTitle className="text-white">Trained Models</CardTitle>
                <CardDescription className="text-slate-300">
                  Manage and monitor your trained machine learning models
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockMLModels.map((model) => (
                    <div
                      key={model.id}
                      className="bg-slate-700/30 rounded-lg p-4 hover:bg-slate-700/50 transition-colors"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="font-semibold text-white flex items-center gap-2">
                            {model.name}
                            <Badge
                              className={
                                model.status === "active"
                                  ? "bg-green-600 text-white"
                                  : model.status === "training"
                                    ? "bg-yellow-600 text-white"
                                    : "bg-slate-600 text-white"
                              }
                            >
                              {model.status}
                            </Badge>
                          </h3>
                          <p className="text-sm text-slate-400">
                            {model.type} • {model.trainingData}
                          </p>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold text-green-400">{model.accuracy}%</div>
                          <div className="text-xs text-slate-500">Accuracy</div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <span className="text-slate-400">Features:</span>
                          <div className="text-slate-200">{model.features.length} selected</div>
                        </div>
                        <div>
                          <span className="text-slate-400">Last Trained:</span>
                          <div className="text-slate-200">{model.lastTrained}</div>
                        </div>
                        <div>
                          <span className="text-slate-400">Performance:</span>
                          <div className="text-slate-200">
                            {model.performance.mae
                              ? `MAE: ${model.performance.mae}`
                              : model.performance.precision
                                ? `F1: ${model.performance.f1}`
                                : `R²: ${model.performance.r2}`}
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="border-slate-600 text-slate-200 hover:bg-slate-700 bg-transparent"
                          >
                            <Activity className="h-3 w-3 mr-1" />
                            Details
                          </Button>
                          {model.status === "active" && (
                            <Button
                              variant="outline"
                              size="sm"
                              className="border-slate-600 text-slate-200 hover:bg-slate-700 bg-transparent"
                            >
                              <Download className="h-3 w-3 mr-1" />
                              Export
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Export History Tab */}
          <TabsContent value="history" className="space-y-6">
            <Card className="bg-slate-800/60 backdrop-blur-md border border-slate-700/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <Calendar className="h-5 w-5 text-orange-400" />
                  Export History
                </CardTitle>
                <CardDescription className="text-slate-300">
                  Track and manage your previous data exports
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockExportHistory.map((export_item) => (
                    <div
                      key={export_item.id}
                      className="bg-slate-700/30 rounded-lg p-4 hover:bg-slate-700/50 transition-colors"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-semibold text-white mb-1">{export_item.name}</h3>
                          <div className="flex items-center gap-4 text-sm text-slate-400">
                            <span>📄 {export_item.format}</span>
                            <span>💾 {export_item.size}</span>
                            <span>📊 {export_item.records.toLocaleString()} records</span>
                            <span>📅 {export_item.date}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge
                            className={
                              export_item.status === "completed"
                                ? "bg-green-600 text-white"
                                : export_item.status === "processing"
                                  ? "bg-yellow-600 text-white"
                                  : "bg-red-600 text-white"
                            }
                          >
                            {export_item.status}
                          </Badge>
                          {export_item.status === "completed" && (
                            <Button
                              variant="outline"
                              size="sm"
                              className="border-slate-600 text-slate-200 hover:bg-slate-700 bg-transparent"
                            >
                              <Download className="h-3 w-3 mr-1" />
                              Download
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
