"use client"

import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Switch } from "@/components/ui/switch"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import {
  Download,
  FileText,
  CalendarIcon,
  Settings,
  File,
  FileSpreadsheet,
  FileJson,
  Clock,
  CheckCircle,
  XCircle,
  Trash2,
  Mail,
  Filter,
  Search,
  Eye,
  Zap,
  Pause,
  RotateCcw,
} from "lucide-react"
import { useState } from "react"
import { format } from "date-fns"

export default function ReportsPage() {
  const [selectedFormat, setSelectedFormat] = useState("csv")
  const [selectedFields, setSelectedFields] = useState({
    airQuality: ["pm25", "pm10", "aqi"],
    weather: ["temperature", "humidity"],
    health: ["riskScores"],
    location: ["city", "coordinates"],
  })
  const [dateRange, setDateRange] = useState<{ from?: Date; to?: Date }>({
    from: new Date(2024, 0, 1),
    to: new Date(2024, 0, 31),
  })
  const [exportProgress, setExportProgress] = useState(0)
  const [isExporting, setIsExporting] = useState(false)
  const [compressionEnabled, setCompressionEnabled] = useState(true)
  const [includeMetadata, setIncludeMetadata] = useState(true)
  const [emailDelivery, setEmailDelivery] = useState(false)
  const [customFilename, setCustomFilename] = useState("")

  const exportFormats = [
    {
      id: "csv",
      name: "CSV",
      icon: File,
      description: "Comma-separated values for spreadsheets",
      sampleData: "timestamp,pm25,aqi\n2024-01-31,45,112",
      estimatedSize: "2.4 MB",
    },
    {
      id: "excel",
      name: "Excel",
      icon: FileSpreadsheet,
      description: "Microsoft Excel with multiple worksheets",
      sampleData: "Sheet1: Air Quality Data\nSheet2: Weather Data",
      estimatedSize: "5.8 MB",
    },
    {
      id: "json",
      name: "JSON",
      icon: FileJson,
      description: "JavaScript Object Notation for APIs",
      sampleData: '{"timestamp":"2024-01-31","pm25":45,"aqi":112}',
      estimatedSize: "3.2 MB",
    },
    {
      id: "pdf",
      name: "PDF",
      icon: FileText,
      description: "Formatted report with charts and analysis",
      sampleData: "Professional report with visualizations",
      estimatedSize: "12.5 MB",
    },
  ]

  const dataFieldCategories = {
    airQuality: {
      name: "Air Quality Data",
      fields: [
        { id: "pm25", name: "PM2.5", description: "Fine particulate matter" },
        { id: "pm10", name: "PM10", description: "Coarse particulate matter" },
        { id: "so2", name: "SO2", description: "Sulfur dioxide" },
        { id: "no2", name: "NO2", description: "Nitrogen dioxide" },
        { id: "co", name: "CO", description: "Carbon monoxide" },
        { id: "o3", name: "O3", description: "Ground-level ozone" },
        { id: "aqi", name: "AQI", description: "Air Quality Index" },
      ],
    },
    weather: {
      name: "Weather Data",
      fields: [
        { id: "temperature", name: "Temperature", description: "Ambient temperature" },
        { id: "humidity", name: "Humidity", description: "Relative humidity" },
        { id: "windSpeed", name: "Wind Speed", description: "Wind velocity" },
        { id: "pressure", name: "Pressure", description: "Atmospheric pressure" },
      ],
    },
    health: {
      name: "Health Data",
      fields: [
        { id: "riskScores", name: "Risk Scores", description: "Health risk assessments" },
        { id: "recommendations", name: "Recommendations", description: "Health advice" },
        { id: "alerts", name: "Alerts", description: "Health warnings" },
      ],
    },
    location: {
      name: "Location Data",
      fields: [
        { id: "city", name: "City", description: "City names" },
        { id: "coordinates", name: "Coordinates", description: "Lat/Long coordinates" },
        { id: "timeZones", name: "Time Zones", description: "Local time zones" },
      ],
    },
  }

  const exportHistory = [
    {
      id: "1",
      name: "January_AQI_Report.csv",
      format: "CSV",
      size: "2.4 MB",
      created: "2024-01-31 14:30",
      status: "completed",
      expiresIn: "28 days",
    },
    {
      id: "2",
      name: "Weekly_Health_Analysis.pdf",
      format: "PDF",
      size: "8.7 MB",
      created: "2024-01-28 09:15",
      status: "completed",
      expiresIn: "25 days",
    },
    {
      id: "3",
      name: "Large_Dataset_Q1.xlsx",
      format: "Excel",
      size: "45.2 MB",
      created: "2024-01-25 16:45",
      status: "processing",
      progress: 67,
    },
  ]

  const toggleFieldSelection = (category: string, fieldId: string) => {
    setSelectedFields((prev) => ({
      ...prev,
      [category]: prev[category as keyof typeof prev].includes(fieldId)
        ? prev[category as keyof typeof prev].filter((id) => id !== fieldId)
        : [...prev[category as keyof typeof prev], fieldId],
    }))
  }

  const selectAllFields = (category: string) => {
    const allFields = dataFieldCategories[category as keyof typeof dataFieldCategories].fields.map((f) => f.id)
    setSelectedFields((prev) => ({
      ...prev,
      [category]: allFields,
    }))
  }

  const selectNoneFields = (category: string) => {
    setSelectedFields((prev) => ({
      ...prev,
      [category]: [],
    }))
  }

  const getTotalSelectedFields = () => {
    return Object.values(selectedFields).flat().length
  }

  const getEstimatedSize = () => {
    const baseSize = getTotalSelectedFields() * 0.3
    const formatMultiplier = selectedFormat === "pdf" ? 4 : selectedFormat === "excel" ? 2.5 : 1
    const finalSize = baseSize * formatMultiplier
    return compressionEnabled ? finalSize * 0.4 : finalSize
  }

  const startExport = () => {
    setIsExporting(true)
    setExportProgress(0)

    const interval = setInterval(() => {
      setExportProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setIsExporting(false)
          return 100
        }
        return prev + 8
      })
    }, 400)
  }

  const presetDateRanges = [
    { label: "7 Days", days: 7 },
    { label: "30 Days", days: 30 },
    { label: "90 Days", days: 90 },
    { label: "1 Year", days: 365 },
  ]

  const setPresetRange = (days: number) => {
    const to = new Date()
    const from = new Date()
    from.setDate(from.getDate() - days)
    setDateRange({ from, to })
  }

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6 space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">Data Export & Reports</h1>
            <p className="text-slate-400 mt-2">
              Export air quality data with advanced filtering and formatting options
            </p>
          </div>
          <Button className="bg-blue-600 hover:bg-blue-700 text-white">
            <Download className="h-4 w-4 mr-2" />
            Quick Export
          </Button>
        </div>

        {/* Main Export Interface */}
        <div className="grid grid-cols-5 gap-6">
          {/* Left Panel - Format Selection & Options (40%) */}
          <div className="col-span-2 space-y-6">
            {/* Export Format Selection */}
            <Card className="bg-slate-800/60 backdrop-blur-md border border-slate-700/50">
              <CardHeader>
                <CardTitle className="text-white flex items-center space-x-2">
                  <FileText className="h-5 w-5 text-blue-400" />
                  <span>Export Format</span>
                </CardTitle>
                <CardDescription className="text-slate-400">Choose your preferred export format</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <RadioGroup value={selectedFormat} onValueChange={setSelectedFormat}>
                  {exportFormats.map((format) => {
                    const IconComponent = format.icon
                    return (
                      <div key={format.id} className="space-y-2">
                        <div className="flex items-center space-x-3 p-3 rounded-lg border border-slate-600/50 hover:border-slate-500 transition-colors">
                          <RadioGroupItem value={format.id} id={format.id} />
                          <IconComponent className="h-6 w-6 text-blue-400" />
                          <div className="flex-1">
                            <Label htmlFor={format.id} className="text-slate-200 font-medium cursor-pointer">
                              {format.name}
                            </Label>
                            <p className="text-sm text-slate-400">{format.description}</p>
                          </div>
                          <Badge variant="outline" className="text-slate-300 border-slate-600">
                            {format.estimatedSize}
                          </Badge>
                        </div>
                        {selectedFormat === format.id && (
                          <div className="ml-8 p-3 bg-slate-700/50 rounded-lg border border-slate-600/30">
                            <Label className="text-slate-400 text-sm">Sample Output:</Label>
                            <pre className="text-xs text-slate-300 mt-1 font-mono bg-slate-900/50 p-2 rounded overflow-x-auto">
                              {format.sampleData}
                            </pre>
                          </div>
                        )}
                      </div>
                    )
                  })}
                </RadioGroup>
              </CardContent>
            </Card>

            {/* Date Range Picker */}
            <Card className="bg-slate-800/60 backdrop-blur-md border border-slate-700/50">
              <CardHeader>
                <CardTitle className="text-white flex items-center space-x-2">
                  <CalendarIcon className="h-5 w-5 text-green-400" />
                  <span>Date Range</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  {presetDateRanges.map((preset) => (
                    <Button
                      key={preset.days}
                      variant="outline"
                      size="sm"
                      onClick={() => setPresetRange(preset.days)}
                      className="bg-slate-700/50 border-slate-600 text-slate-200 hover:bg-slate-600/50"
                    >
                      {preset.label}
                    </Button>
                  ))}
                </div>
                <div className="space-y-2">
                  <Label className="text-slate-400">Custom Range</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start bg-slate-700/50 border-slate-600 text-slate-200 hover:bg-slate-600/50"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {dateRange?.from ? (
                          dateRange.to ? (
                            <>
                              {format(dateRange.from, "LLL dd, y")} - {format(dateRange.to, "LLL dd, y")}
                            </>
                          ) : (
                            format(dateRange.from, "LLL dd, y")
                          )
                        ) : (
                          <span>Pick a date range</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0 bg-slate-800 border-slate-700" align="start">
                      <Calendar
                        initialFocus
                        mode="range"
                        defaultMonth={dateRange?.from}
                        selected={dateRange}
                        onSelect={setDateRange}
                        numberOfMonths={2}
                        className="text-slate-200"
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <div className="text-sm text-slate-400">
                  Selected period:{" "}
                  {dateRange?.from && dateRange?.to
                    ? Math.ceil((dateRange.to.getTime() - dateRange.from.getTime()) / (1000 * 60 * 60 * 24))
                    : 0}{" "}
                  days
                </div>
              </CardContent>
            </Card>

            {/* Advanced Options */}
            <Card className="bg-slate-800/60 backdrop-blur-md border border-slate-700/50">
              <CardHeader>
                <CardTitle className="text-white flex items-center space-x-2">
                  <Settings className="h-5 w-5 text-purple-400" />
                  <span>Advanced Options</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-slate-200">Data Compression</Label>
                      <p className="text-sm text-slate-400">Reduce file size by up to 60%</p>
                    </div>
                    <Switch checked={compressionEnabled} onCheckedChange={setCompressionEnabled} />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-slate-200">Include Metadata</Label>
                      <p className="text-sm text-slate-400">Add data source information</p>
                    </div>
                    <Switch checked={includeMetadata} onCheckedChange={setIncludeMetadata} />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-slate-200">Email Delivery</Label>
                      <p className="text-sm text-slate-400">Send export via email</p>
                    </div>
                    <Switch checked={emailDelivery} onCheckedChange={setEmailDelivery} />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-slate-400">Custom Filename</Label>
                  <Input
                    placeholder="Enter custom filename (optional)"
                    value={customFilename}
                    onChange={(e) => setCustomFilename(e.target.value)}
                    className="bg-slate-700/50 border-slate-600 text-white placeholder-slate-400"
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Panel - Data Selection & Preview (60%) */}
          <div className="col-span-3 space-y-6">
            {/* Data Field Selection */}
            <Card className="bg-slate-800/60 backdrop-blur-md border border-slate-700/50">
              <CardHeader>
                <CardTitle className="text-white flex items-center space-x-2">
                  <Eye className="h-5 w-5 text-orange-400" />
                  <span>Data Field Selection</span>
                </CardTitle>
                <CardDescription className="text-slate-400">
                  Choose which data fields to include in your export
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-6">
                  {Object.entries(dataFieldCategories).map(([categoryKey, category]) => (
                    <div key={categoryKey} className="space-y-3">
                      <div className="flex items-center justify-between">
                        <Label className="text-slate-200 font-medium">{category.name}</Label>
                        <div className="flex space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => selectAllFields(categoryKey)}
                            className="text-xs bg-slate-700/50 border-slate-600 text-slate-300 hover:bg-slate-600/50"
                          >
                            All
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => selectNoneFields(categoryKey)}
                            className="text-xs bg-slate-700/50 border-slate-600 text-slate-300 hover:bg-slate-600/50"
                          >
                            None
                          </Button>
                        </div>
                      </div>
                      <div className="space-y-2">
                        {category.fields.map((field) => (
                          <div key={field.id} className="flex items-center space-x-2">
                            <Checkbox
                              id={`${categoryKey}-${field.id}`}
                              checked={selectedFields[categoryKey as keyof typeof selectedFields].includes(field.id)}
                              onCheckedChange={() => toggleFieldSelection(categoryKey, field.id)}
                            />
                            <div className="flex-1">
                              <Label
                                htmlFor={`${categoryKey}-${field.id}`}
                                className="text-slate-200 text-sm cursor-pointer"
                              >
                                {field.name}
                              </Label>
                              <p className="text-xs text-slate-400">{field.description}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 pt-4 border-t border-slate-700/50">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Selected Fields: {getTotalSelectedFields()}</span>
                    <span className="text-slate-400">Estimated Size: ~{getEstimatedSize().toFixed(1)} MB</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Export Preview & Actions */}
            <Card className="bg-slate-800/60 backdrop-blur-md border border-slate-700/50">
              <CardHeader>
                <CardTitle className="text-white flex items-center space-x-2">
                  <Zap className="h-5 w-5 text-yellow-400" />
                  <span>Export Preview</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Format:</span>
                      <span className="text-slate-200">{selectedFormat.toUpperCase()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Fields:</span>
                      <span className="text-slate-200">{getTotalSelectedFields()} selected</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Compression:</span>
                      <span className="text-slate-200">{compressionEnabled ? "Enabled" : "Disabled"}</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Date Range:</span>
                      <span className="text-slate-200">
                        {dateRange?.from && dateRange?.to
                          ? Math.ceil((dateRange.to.getTime() - dateRange.from.getTime()) / (1000 * 60 * 60 * 24))
                          : 0}{" "}
                        days
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Est. Records:</span>
                      <span className="text-slate-200">~{(getTotalSelectedFields() * 240).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">File Size:</span>
                      <span className="text-slate-200">~{getEstimatedSize().toFixed(1)} MB</span>
                    </div>
                  </div>
                </div>

                {isExporting && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-200">Exporting...</span>
                      <span className="text-slate-200">{exportProgress}%</span>
                    </div>
                    <Progress value={exportProgress} className="w-full" />
                    <div className="flex justify-between text-xs text-slate-400">
                      <span>Processing data fields...</span>
                      <span>ETA: {Math.max(0, Math.ceil(((100 - exportProgress) / 8) * 0.4))}s</span>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-3">
                  <Button
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                    onClick={startExport}
                    disabled={isExporting || getTotalSelectedFields() === 0}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    {isExporting ? "Exporting..." : "Start Export"}
                  </Button>
                  <Button
                    variant="outline"
                    className="bg-slate-700/50 border-slate-600 text-slate-200 hover:bg-slate-600/50"
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    Preview Data
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Bottom Section - Export History & Progress */}
        <Card className="bg-slate-800/60 backdrop-blur-md border border-slate-700/50">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-white flex items-center space-x-2">
                <Clock className="h-5 w-5 text-indigo-400" />
                <span>Export History & Queue</span>
              </CardTitle>
              <div className="flex items-center space-x-2">
                <div className="relative">
                  <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
                  <Input
                    placeholder="Search exports..."
                    className="pl-10 w-64 bg-slate-700/50 border-slate-600 text-white placeholder-slate-400"
                  />
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="bg-slate-700/50 border-slate-600 text-slate-200 hover:bg-slate-600/50"
                >
                  <Filter className="h-4 w-4 mr-2" />
                  Filter
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {exportHistory.map((export_) => (
                <div
                  key={export_.id}
                  className="p-4 rounded-lg border border-slate-700/50 bg-slate-700/30 hover:bg-slate-700/50 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="p-2 bg-slate-600/50 rounded-lg">
                        {export_.status === "completed" && <CheckCircle className="h-6 w-6 text-green-400" />}
                        {export_.status === "processing" && <Clock className="h-6 w-6 text-orange-400 animate-pulse" />}
                        {export_.status === "failed" && <XCircle className="h-6 w-6 text-red-400" />}
                      </div>
                      <div>
                        <h4 className="font-semibold text-slate-200">{export_.name}</h4>
                        <div className="flex items-center space-x-4 text-sm text-slate-400 mt-1">
                          <span>{export_.format}</span>
                          <span>{export_.size}</span>
                          <span>{export_.created}</span>
                          {export_.status === "completed" && (
                            <Badge variant="outline" className="text-xs text-slate-300 border-slate-600">
                              Expires in {export_.expiresIn}
                            </Badge>
                          )}
                        </div>
                        {export_.status === "processing" && export_.progress && (
                          <Progress value={export_.progress} className="w-48 mt-2" />
                        )}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {export_.status === "completed" && (
                        <>
                          <Button
                            size="sm"
                            variant="outline"
                            className="bg-slate-700/50 border-slate-600 text-slate-200 hover:bg-slate-600/50"
                          >
                            <Download className="h-4 w-4 mr-2" />
                            Download
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="bg-slate-700/50 border-slate-600 text-slate-200 hover:bg-slate-600/50"
                          >
                            <Mail className="h-4 w-4" />
                          </Button>
                        </>
                      )}
                      {export_.status === "processing" && (
                        <Button
                          size="sm"
                          variant="outline"
                          className="bg-slate-700/50 border-slate-600 text-slate-200 hover:bg-slate-600/50"
                        >
                          <Pause className="h-4 w-4" />
                        </Button>
                      )}
                      {export_.status === "failed" && (
                        <Button
                          size="sm"
                          variant="outline"
                          className="bg-slate-700/50 border-slate-600 text-slate-200 hover:bg-slate-600/50"
                        >
                          <RotateCcw className="h-4 w-4 mr-2" />
                          Retry
                        </Button>
                      )}
                      <Button
                        size="sm"
                        variant="outline"
                        className="bg-slate-700/50 border-slate-600 text-slate-200 hover:bg-slate-600/50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
