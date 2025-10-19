"use client"

import { Label } from "@/components/ui/label"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import {
  Zap,
  Clock,
  MapPin,
  Download,
  TrendingUp,
  Cloud,
  Thermometer,
  Droplets,
  Wind,
  Eye,
  ChevronLeft,
  ChevronRight,
  Search,
  Plus,
  X,
  Navigation,
  Layers,
} from "lucide-react"
import { useState, useEffect } from "react"
import {
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Area,
  ComposedChart,
  ReferenceLine,
} from "recharts"

const indianCities = [
  {
    name: "Delhi",
    lat: 28.6139,
    lng: 77.209,
    currentAQI: 287,
    forecast24h: 295,
    forecast48h: 278,
    forecast72h: 265,
    pm25: 145,
    pm10: 198,
    no2: 67,
    o3: 45,
    trend: "up",
    accuracy: 92,
    population: 32900000,
    region: "North",
    isCapital: true,
  },
  {
    name: "Mumbai",
    lat: 19.076,
    lng: 72.8777,
    currentAQI: 156,
    forecast24h: 162,
    forecast48h: 149,
    forecast72h: 158,
    pm25: 78,
    pm10: 112,
    no2: 45,
    o3: 52,
    trend: "up",
    accuracy: 89,
    population: 20400000,
    region: "West",
    isCapital: false,
  },
  {
    name: "Kolkata",
    lat: 22.5726,
    lng: 88.3639,
    currentAQI: 198,
    forecast24h: 205,
    forecast48h: 189,
    forecast72h: 195,
    pm25: 98,
    pm10: 145,
    no2: 56,
    o3: 38,
    trend: "up",
    accuracy: 87,
    population: 14850000,
    region: "East",
    isCapital: false,
  },
  {
    name: "Chennai",
    lat: 13.0827,
    lng: 80.2707,
    currentAQI: 134,
    forecast24h: 128,
    forecast48h: 142,
    forecast72h: 135,
    pm25: 65,
    pm10: 89,
    no2: 38,
    o3: 48,
    trend: "down",
    accuracy: 91,
    population: 11000000,
    region: "South",
    isCapital: false,
  },
  {
    name: "Bangalore",
    lat: 12.9716,
    lng: 77.5946,
    currentAQI: 112,
    forecast24h: 118,
    forecast48h: 105,
    forecast72h: 115,
    pm25: 54,
    pm10: 76,
    no2: 32,
    o3: 41,
    trend: "up",
    accuracy: 94,
    population: 13200000,
    region: "South",
    isCapital: false,
  },
  {
    name: "Hyderabad",
    lat: 17.385,
    lng: 78.4867,
    currentAQI: 145,
    forecast24h: 139,
    forecast48h: 152,
    forecast72h: 148,
    pm25: 71,
    pm10: 98,
    no2: 41,
    o3: 44,
    trend: "down",
    accuracy: 88,
    population: 10500000,
    region: "South",
    isCapital: false,
  },
  {
    name: "Pune",
    lat: 18.5204,
    lng: 73.8567,
    currentAQI: 167,
    forecast24h: 174,
    forecast48h: 159,
    forecast72h: 168,
    pm25: 82,
    pm10: 118,
    no2: 48,
    o3: 39,
    trend: "up",
    accuracy: 90,
    population: 7400000,
    region: "West",
    isCapital: false,
  },
  {
    name: "Ahmedabad",
    lat: 23.0225,
    lng: 72.5714,
    currentAQI: 189,
    forecast24h: 195,
    forecast48h: 182,
    forecast72h: 191,
    pm25: 92,
    pm10: 134,
    no2: 52,
    o3: 43,
    trend: "up",
    accuracy: 86,
    population: 8450000,
    region: "West",
    isCapital: false,
  },
  {
    name: "Jaipur",
    lat: 26.9124,
    lng: 75.7873,
    currentAQI: 178,
    forecast24h: 185,
    forecast48h: 172,
    forecast72h: 180,
    pm25: 88,
    pm10: 125,
    no2: 49,
    o3: 41,
    trend: "up",
    accuracy: 85,
    population: 3900000,
    region: "North",
    isCapital: true,
  },
  {
    name: "Lucknow",
    lat: 26.8467,
    lng: 80.9462,
    currentAQI: 234,
    forecast24h: 241,
    forecast48h: 228,
    forecast72h: 235,
    pm25: 118,
    pm10: 167,
    no2: 61,
    o3: 38,
    trend: "up",
    accuracy: 83,
    population: 3500000,
    region: "North",
    isCapital: true,
  },
  {
    name: "Kanpur",
    lat: 26.4499,
    lng: 80.3319,
    currentAQI: 256,
    forecast24h: 263,
    forecast48h: 249,
    forecast72h: 258,
    pm25: 128,
    pm10: 178,
    no2: 65,
    o3: 35,
    trend: "up",
    accuracy: 81,
    population: 3200000,
    region: "North",
    isCapital: false,
  },
  {
    name: "Nagpur",
    lat: 21.1458,
    lng: 79.0882,
    currentAQI: 143,
    forecast24h: 148,
    forecast48h: 138,
    forecast72h: 145,
    pm25: 69,
    pm10: 95,
    no2: 39,
    o3: 46,
    trend: "up",
    accuracy: 89,
    population: 2500000,
    region: "Central",
    isCapital: false,
  },
]

// Generate forecast timeline data for Indian cities
const generateIndianForecastData = (hours: number, temperature: number, humidity: number, windSpeed: number) => {
  const data = []
  const now = new Date()

  for (let i = 0; i < hours; i++) {
    const time = new Date(now.getTime() + i * 60 * 60 * 1000)

    // Simulate Indian pollution patterns (higher in morning/evening, lower at night)
    const hourOfDay = time.getHours()
    let baseAQI = 120

    if (hourOfDay >= 6 && hourOfDay <= 10) baseAQI += 40 // Morning rush
    if (hourOfDay >= 17 && hourOfDay <= 21) baseAQI += 50 // Evening rush
    if (hourOfDay >= 22 || hourOfDay <= 5) baseAQI -= 30 // Night time

    // Weather impact on AQI
    const tempImpact = (temperature - 25) * 2 // Higher temp = higher AQI
    const humidityImpact = (humidity - 50) * 0.5 // Higher humidity = slightly higher AQI
    const windImpact = -(windSpeed - 10) * 3 // Higher wind = lower AQI

    const finalAQI = Math.max(50, baseAQI + tempImpact + humidityImpact + windImpact + (Math.random() - 0.5) * 30)
    const confidence = Math.max(0.6, 1 - (i / hours) * 0.4)

    data.push({
      time: time.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }),
      fullTime: time,
      aqi: Math.round(finalAQI),
      aqiUpper: Math.round(finalAQI + (1 - confidence) * 35),
      aqiLower: Math.round(Math.max(0, finalAQI - (1 - confidence) * 35)),
      pm25: Math.round(finalAQI * 0.6),
      pm10: Math.round(finalAQI * 0.8),
      no2: Math.round(finalAQI * 0.3),
      o3: Math.round(finalAQI * 0.25),
      temperature: Math.round(temperature + Math.sin(i / 8) * 5 + Math.random() * 3),
      humidity: Math.round(humidity + Math.sin(i / 12) * 15 + Math.random() * 8),
      windSpeed: Math.round(windSpeed + Math.random() * 5),
      confidence: confidence,
      alert: finalAQI > 200 ? "very unhealthy" : finalAQI > 150 ? "unhealthy" : finalAQI > 100 ? "moderate" : "good",
    })
  }

  return data
}

export default function ForecastingPage() {
  const [forecastHours, setForecastHours] = useState([48])
  const [selectedCity, setSelectedCity] = useState("Delhi")
  const [weatherToggle, setWeatherToggle] = useState(true)
  const [alertThreshold, setAlertThreshold] = useState([150])
  const [currentCityIndex, setCurrentCityIndex] = useState(0)
  const [searchQuery, setSearchQuery] = useState("")
  const [filteredCities, setFilteredCities] = useState(indianCities)
  const [selectedCities, setSelectedCities] = useState(["Delhi", "Mumbai", "Kolkata", "Chennai"])
  const [mapView, setMapView] = useState("heatmap") // heatmap, pins, hybrid
  const [showHeatmapLayers, setShowHeatmapLayers] = useState(true)

  // Weather parameter controls
  const [temperature, setTemperature] = useState([28])
  const [humidity, setHumidity] = useState([65])
  const [windSpeed, setWindSpeed] = useState([8])
  const [visibility, setVisibility] = useState([5])

  const forecastData = generateIndianForecastData(forecastHours[0], temperature[0], humidity[0], windSpeed[0])
  const upcomingAlerts = forecastData.filter((d) => d.aqi > alertThreshold[0])

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredCities(indianCities)
    } else {
      const filtered = indianCities.filter(
        (city) =>
          city.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          city.region.toLowerCase().includes(searchQuery.toLowerCase()),
      )
      setFilteredCities(filtered)
    }
  }, [searchQuery])

  const getAQIColor = (aqi: number) => {
    if (aqi <= 50) return "#10b981" // green
    if (aqi <= 100) return "#f59e0b" // yellow
    if (aqi <= 150) return "#f97316" // orange
    if (aqi <= 200) return "#ef4444" // red
    if (aqi <= 300) return "#7c2d12" // dark red
    return "#450a0a" // very dark red
  }

  const getAQICategory = (aqi: number) => {
    if (aqi <= 50) return "Good"
    if (aqi <= 100) return "Moderate"
    if (aqi <= 150) return "Unhealthy for Sensitive Groups"
    if (aqi <= 200) return "Unhealthy"
    if (aqi <= 300) return "Very Unhealthy"
    return "Hazardous"
  }

  const nextCity = () => {
    setCurrentCityIndex((prev) => (prev + 1) % indianCities.length)
  }

  const prevCity = () => {
    setCurrentCityIndex((prev) => (prev - 1 + indianCities.length) % indianCities.length)
  }

  const exportForecast = () => {
    const exportData = {
      metadata: {
        title: "Indian Cities Air Quality Forecast",
        generatedAt: new Date().toISOString(),
        forecastPeriod: `${forecastHours[0]} hours`,
        selectedCities: selectedCities,
        totalCities: indianCities.length,
      },
      weatherParameters: {
        temperature: temperature[0],
        humidity: humidity[0],
        windSpeed: windSpeed[0],
        visibility: visibility[0],
      },
      forecast: {
        primaryCity: selectedCity,
        timelineData: forecastData,
        alerts: upcomingAlerts,
        alertThreshold: alertThreshold[0],
      },
      multiCityComparison: indianCities.map((city) => ({
        ...city,
        isSelected: selectedCities.includes(city.name),
        category: getAQICategory(city.currentAQI),
      })),
      statistics: {
        averageAQI: Math.round(indianCities.reduce((sum, city) => sum + city.currentAQI, 0) / indianCities.length),
        citiesAboveThreshold: indianCities.filter((city) => city.currentAQI > alertThreshold[0]).length,
        mostPolluted: indianCities.reduce((max, city) => (city.currentAQI > max.currentAQI ? city : max)),
        leastPolluted: indianCities.reduce((min, city) => (city.currentAQI < min.currentAQI ? city : min)),
      },
    }

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `indian-cities-forecast-comprehensive-${new Date().toISOString().split("T")[0]}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  const toggleCitySelection = (cityName: string) => {
    setSelectedCities((prev) =>
      prev.includes(cityName) ? prev.filter((name) => name !== cityName) : [...prev, cityName],
    )
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header Controls */}
        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2 text-white">
              <Zap className="h-8 w-8 text-blue-400" />
              Indian Cities Air Quality Forecasting
            </h1>
            <p className="text-slate-300 mt-1">
              Predictive models for major Indian metropolitan areas with interactive maps
            </p>
          </div>

          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-slate-400" />
              <span className="text-sm font-medium text-slate-200">Forecast Period:</span>
              <span className="text-sm text-blue-400 font-semibold">{forecastHours[0]} hours</span>
            </div>
            <Badge className="bg-green-600 text-white">{selectedCities.length} Cities Selected</Badge>
            <Button
              onClick={exportForecast}
              variant="outline"
              size="sm"
              className="border-slate-600 text-slate-200 hover:bg-slate-700 bg-transparent"
            >
              <Download className="h-4 w-4 mr-2" />
              Export Forecast
            </Button>
          </div>
        </div>

        {/* City Search and Selection */}
        <Card className="bg-slate-800/60 backdrop-blur-md border border-slate-700/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <Search className="h-5 w-5 text-green-400" />
              <span>City Search & Selection</span>
            </CardTitle>
            <CardDescription className="text-slate-300">
              Search and add any Indian city to your forecast comparison dashboard
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input
                    placeholder="Search Indian cities by name or region..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 bg-slate-700/50 border-slate-600 text-white"
                  />
                </div>

                {searchQuery && (
                  <div className="mt-2 max-h-32 overflow-y-auto bg-slate-700/50 rounded-lg border border-slate-600">
                    {filteredCities.map((city) => (
                      <div
                        key={city.name}
                        className="flex items-center justify-between p-2 hover:bg-slate-600/50 cursor-pointer"
                        onClick={() => {
                          toggleCitySelection(city.name)
                          setSearchQuery("")
                        }}
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-white font-medium">{city.name}</span>
                          <Badge variant="outline" className="text-xs border-slate-500 text-slate-400">
                            {city.region}
                          </Badge>
                          {city.isCapital && <Badge className="text-xs bg-purple-600">Capital</Badge>}
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge style={{ backgroundColor: getAQIColor(city.currentAQI) }} className="text-white">
                            {city.currentAQI}
                          </Badge>
                          {selectedCities.includes(city.name) ? (
                            <Badge className="bg-green-600 text-white">Selected</Badge>
                          ) : (
                            <Button size="sm" variant="outline" className="h-6 px-2 text-xs bg-transparent">
                              <Plus className="h-3 w-3" />
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex flex-wrap gap-2">
                {selectedCities.map((cityName) => {
                  const city = indianCities.find((c) => c.name === cityName)
                  return (
                    <Badge key={cityName} className="bg-blue-600 text-white flex items-center gap-1 px-3 py-1">
                      {cityName}
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-4 w-4 p-0 hover:bg-blue-700"
                        onClick={() => toggleCitySelection(cityName)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </Badge>
                  )
                })}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Multi-City Forecast Comparison - Enhanced */}
        <Card className="bg-slate-800/60 backdrop-blur-md border border-slate-700/50">
          <CardHeader>
            <CardTitle className="flex items-center justify-between text-white">
              <div className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-purple-400" />
                <span>Multi-City Forecast Comparison (Next 24-72h)</span>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={prevCity}
                  className="text-slate-400 hover:text-white hover:bg-slate-700"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={nextCity}
                  className="text-slate-400 hover:text-white hover:bg-slate-700"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </CardTitle>
            <CardDescription className="text-slate-300">
              Real-time AQI forecasts for selected Indian cities with enhanced pollutant breakdown
            </CardDescription>
          </CardHeader>

          <CardContent>
            {/* Desktop Grid View - Show only selected cities */}
            <div className="hidden lg:grid grid-cols-4 gap-4">
              {indianCities
                .filter((city) => selectedCities.includes(city.name))
                .map((city) => (
                  <div
                    key={city.name}
                    className="p-4 bg-slate-700/50 backdrop-blur-md border border-slate-600/50 rounded-lg hover:bg-slate-700/70 transition-colors cursor-pointer"
                    onClick={() => setSelectedCity(city.name)}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h3 className="font-semibold text-white">{city.name}</h3>
                        <div className="flex items-center gap-1 mt-1">
                          <Badge variant="outline" className="text-xs border-slate-500 text-slate-400">
                            {city.region}
                          </Badge>
                          {city.isCapital && <Badge className="text-xs bg-purple-600">Capital</Badge>}
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        {city.trend === "up" ? (
                          <TrendingUp className="h-4 w-4 text-red-400" />
                        ) : (
                          <TrendingUp className="h-4 w-4 text-green-400 rotate-180" />
                        )}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-slate-300">Current AQI</span>
                        <Badge
                          className="text-white font-bold"
                          style={{ backgroundColor: getAQIColor(city.currentAQI) }}
                        >
                          {city.currentAQI}
                        </Badge>
                      </div>

                      <div className="flex justify-between">
                        <span className="text-sm text-slate-300">24h Forecast</span>
                        <Badge
                          className="text-white font-bold"
                          style={{ backgroundColor: getAQIColor(city.forecast24h) }}
                        >
                          {city.forecast24h}
                        </Badge>
                      </div>

                      <div className="flex justify-between">
                        <span className="text-sm text-slate-300">48h Forecast</span>
                        <Badge
                          className="text-white font-bold"
                          style={{ backgroundColor: getAQIColor(city.forecast48h) }}
                        >
                          {city.forecast48h}
                        </Badge>
                      </div>

                      <div className="flex justify-between">
                        <span className="text-sm text-slate-300">72h Forecast</span>
                        <Badge
                          className="text-white font-bold"
                          style={{ backgroundColor: getAQIColor(city.forecast72h) }}
                        >
                          {city.forecast72h}
                        </Badge>
                      </div>

                      {/* Pollutant Breakdown */}
                      <div className="pt-2 border-t border-slate-600">
                        <div className="grid grid-cols-2 gap-1 text-xs">
                          <div className="flex justify-between">
                            <span className="text-slate-400">PM2.5:</span>
                            <span className="text-slate-200">{city.pm25}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-400">PM10:</span>
                            <span className="text-slate-200">{city.pm10}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-400">NO2:</span>
                            <span className="text-slate-200">{city.no2}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-400">O3:</span>
                            <span className="text-slate-200">{city.o3}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex justify-between items-center pt-1">
                        <span className="text-xs text-slate-400">Accuracy</span>
                        <span className="text-xs font-medium text-green-400">{city.accuracy}%</span>
                      </div>

                      <div className="flex justify-between items-center">
                        <span className="text-xs text-slate-400">Population</span>
                        <span className="text-xs font-medium text-blue-400">
                          {(city.population / 1000000).toFixed(1)}M
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
            </div>

            {/* Mobile Carousel View */}
            <div className="lg:hidden">
              <div className="flex overflow-x-auto gap-4 pb-4">
                {indianCities
                  .filter((city) => selectedCities.includes(city.name))
                  .map((city, index) => (
                    <div
                      key={city.name}
                      className="flex-shrink-0 w-64 p-4 bg-slate-700/50 backdrop-blur-md border border-slate-600/50 rounded-lg"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-semibold text-white">{city.name}</h3>
                        <div className="flex items-center gap-1">
                          {city.trend === "up" ? (
                            <TrendingUp className="h-4 w-4 text-red-400" />
                          ) : (
                            <TrendingUp className="h-4 w-4 text-green-400 rotate-180" />
                          )}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm text-slate-300">Current</span>
                          <Badge
                            className="text-white font-bold"
                            style={{ backgroundColor: getAQIColor(city.currentAQI) }}
                          >
                            {city.currentAQI}
                          </Badge>
                        </div>

                        <div className="flex justify-between">
                          <span className="text-sm text-slate-300">24h</span>
                          <Badge
                            className="text-white font-bold"
                            style={{ backgroundColor: getAQIColor(city.forecast24h) }}
                          >
                            {city.forecast24h}
                          </Badge>
                        </div>

                        <div className="flex justify-between">
                          <span className="text-sm text-slate-300">48h</span>
                          <Badge
                            className="text-white font-bold"
                            style={{ backgroundColor: getAQIColor(city.forecast48h) }}
                          >
                            {city.forecast48h}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Enhanced Map Overlay and Timeline Chart */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Enhanced Interactive Map */}
          <Card className="flex-1 bg-slate-800/60 backdrop-blur-md border border-slate-700/50">
            <CardHeader>
              <CardTitle className="flex items-center justify-between text-white">
                <div className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-green-400" />
                  <span>Interactive AQI Map</span>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant={mapView === "heatmap" ? "default" : "outline"}
                    onClick={() => setMapView("heatmap")}
                    className="text-xs"
                  >
                    <Layers className="h-3 w-3 mr-1" />
                    Heatmap
                  </Button>
                  <Button
                    size="sm"
                    variant={mapView === "pins" ? "default" : "outline"}
                    onClick={() => setMapView("pins")}
                    className="text-xs"
                  >
                    <Navigation className="h-3 w-3 mr-1" />
                    Pins
                  </Button>
                </div>
              </CardTitle>
              <CardDescription className="text-slate-300">
                Drag city pins to compare, pan and zoom for detailed regional analysis
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80 bg-gradient-to-br from-slate-700/50 to-slate-600/50 rounded-lg flex items-center justify-center border-2 border-dashed border-slate-600 relative overflow-hidden">
                <div className="absolute inset-0 p-4">
                  {/* Simulated India map background */}
                  <div className="w-full h-full relative bg-gradient-to-br from-slate-800/30 to-slate-700/30 rounded-lg">
                    {/* City pins positioned approximately */}
                    {selectedCities.map((cityName) => {
                      const city = indianCities.find((c) => c.name === cityName)
                      if (!city) return null

                      // Approximate positioning based on lat/lng (simplified for demo)
                      const x = ((city.lng - 68) / (97 - 68)) * 100 // Normalize longitude
                      const y = ((35 - city.lat) / (35 - 6)) * 100 // Normalize latitude (inverted)

                      return (
                        <div
                          key={city.name}
                          className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer group"
                          style={{
                            left: `${Math.max(10, Math.min(90, x))}%`,
                            top: `${Math.max(10, Math.min(90, y))}%`,
                          }}
                          onClick={() => setSelectedCity(city.name)}
                        >
                          <div
                            className="w-4 h-4 rounded-full border-2 border-white shadow-lg transition-all duration-200 group-hover:scale-125"
                            style={{ backgroundColor: getAQIColor(city.currentAQI) }}
                          />
                          <div className="absolute top-5 left-1/2 transform -translate-x-1/2 bg-slate-900/90 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                            {city.name}: {city.currentAQI} AQI
                          </div>
                        </div>
                      )
                    })}

                    {/* Heatmap overlay simulation */}
                    {mapView === "heatmap" && showHeatmapLayers && (
                      <div className="absolute inset-0 opacity-30">
                        <div className="w-full h-full bg-gradient-radial from-red-500/40 via-orange-500/20 to-transparent"></div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="text-center space-y-4 z-10">
                  <MapPin className="h-12 w-12 text-slate-400 mx-auto" />
                  <div>
                    <p className="text-lg font-medium text-white">Interactive AQI Map of India</p>
                    <p className="text-sm text-slate-300">Click city pins for detailed forecasts</p>
                  </div>

                  {/* Enhanced Map Legend */}
                  <div className="flex justify-center space-x-4 text-xs">
                    <div className="flex items-center space-x-1">
                      <div className="w-3 h-3 rounded-full bg-green-500"></div>
                      <span className="text-slate-300">Good (0-50)</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                      <span className="text-slate-300">Moderate (51-100)</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <div className="w-3 h-3 rounded-full bg-orange-500"></div>
                      <span className="text-slate-300">Unhealthy (101-150)</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <div className="w-3 h-3 rounded-full bg-red-500"></div>
                      <span className="text-slate-300">Very Unhealthy (151+)</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Enhanced Map Controls */}
              <div className="mt-4 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                <div className="flex items-center space-x-4">
                  <Select value={selectedCity} onValueChange={setSelectedCity}>
                    <SelectTrigger className="w-40 bg-slate-700/50 border-slate-600 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-slate-700">
                      {indianCities
                        .filter((city) => selectedCities.includes(city.name))
                        .map((city) => (
                          <SelectItem key={city.name} value={city.name} className="text-white hover:bg-slate-700">
                            {city.name}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>

                  <div className="flex items-center space-x-2">
                    <Switch checked={showHeatmapLayers} onCheckedChange={setShowHeatmapLayers} id="heatmap-toggle" />
                    <Label htmlFor="heatmap-toggle" className="text-slate-200 text-sm">
                      Heatmap Overlay
                    </Label>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Badge className="bg-blue-600 text-white">
                    {getAQICategory(indianCities.find((c) => c.name === selectedCity)?.currentAQI || 0)}
                  </Badge>
                  <Badge variant="outline" className="border-slate-500 text-slate-300">
                    {selectedCities.length} cities shown
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="flex-1 bg-slate-800/60 backdrop-blur-md border border-slate-700/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <Cloud className="h-5 w-5 text-blue-400" />
                <span>Weather Parameter Controls</span>
              </CardTitle>
              <CardDescription className="text-slate-300">
                Adjust weather conditions to see dynamic impact on AQI forecasts
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Temperature Slider */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="flex items-center space-x-2 text-slate-200">
                    <Thermometer className="h-4 w-4 text-red-400" />
                    <span>Temperature</span>
                  </Label>
                  <span className="text-white font-medium">{temperature[0]}°C</span>
                </div>
                <Slider
                  value={temperature}
                  onValueChange={setTemperature}
                  max={45}
                  min={10}
                  step={1}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-slate-400">
                  <span>10°C</span>
                  <span>25°C</span>
                  <span>45°C</span>
                </div>
              </div>

              {/* Humidity Slider */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="flex items-center space-x-2 text-slate-200">
                    <Droplets className="h-4 w-4 text-blue-400" />
                    <span>Humidity</span>
                  </Label>
                  <span className="text-white font-medium">{humidity[0]}%</span>
                </div>
                <Slider value={humidity} onValueChange={setHumidity} max={95} min={20} step={5} className="w-full" />
                <div className="flex justify-between text-xs text-slate-400">
                  <span>20%</span>
                  <span>60%</span>
                  <span>95%</span>
                </div>
              </div>

              {/* Wind Speed Slider */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="flex items-center space-x-2 text-slate-200">
                    <Wind className="h-4 w-4 text-green-400" />
                    <span>Wind Speed</span>
                  </Label>
                  <span className="text-white font-medium">{windSpeed[0]} km/h</span>
                </div>
                <Slider value={windSpeed} onValueChange={setWindSpeed} max={30} min={0} step={1} className="w-full" />
                <div className="flex justify-between text-xs text-slate-400">
                  <span>0 km/h</span>
                  <span>15 km/h</span>
                  <span>30 km/h</span>
                </div>
              </div>

              {/* Visibility Slider */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="flex items-center space-x-2 text-slate-200">
                    <Eye className="h-4 w-4 text-purple-400" />
                    <span>Visibility</span>
                  </Label>
                  <span className="text-white font-medium">{visibility[0]} km</span>
                </div>
                <Slider
                  value={visibility}
                  onValueChange={setVisibility}
                  max={15}
                  min={1}
                  step={0.5}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-slate-400">
                  <span>1 km</span>
                  <span>8 km</span>
                  <span>15 km</span>
                </div>
              </div>

              {/* Enhanced Weather Impact Summary */}
              <div className="pt-4 border-t border-slate-700">
                <h4 className="font-medium text-white mb-2">Real-time Weather Impact on AQI</h4>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-300">Temperature Effect:</span>
                    <span className={temperature[0] > 30 ? "text-red-400" : "text-green-400"}>
                      {temperature[0] > 30 ? "+15%" : temperature[0] < 20 ? "-10%" : "Neutral"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-300">Wind Effect:</span>
                    <span className={windSpeed[0] > 15 ? "text-green-400" : "text-red-400"}>
                      {windSpeed[0] > 15 ? "-20%" : windSpeed[0] < 5 ? "+25%" : "Moderate"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-300">Humidity Effect:</span>
                    <span className={humidity[0] > 80 ? "text-orange-400" : "text-blue-400"}>
                      {humidity[0] > 80 ? "+8%" : humidity[0] < 40 ? "-5%" : "Neutral"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-300">Visibility Impact:</span>
                    <span
                      className={
                        visibility[0] < 3 ? "text-red-400" : visibility[0] > 10 ? "text-green-400" : "text-yellow-400"
                      }
                    >
                      {visibility[0] < 3 ? "High Pollution" : visibility[0] > 10 ? "Clear Air" : "Moderate"}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="bg-slate-800/60 backdrop-blur-md border border-slate-700/50">
          <CardHeader>
            <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2 text-white">
                  <TrendingUp className="h-5 w-5 text-blue-400" />
                  <span>Indian Cities Forecast Timeline - {selectedCity}</span>
                </CardTitle>
                <CardDescription className="text-slate-300">
                  Detailed AQI and pollutant predictions with confidence intervals and weather overlay
                </CardDescription>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Cloud className="h-4 w-4 text-slate-400" />
                  <span className="text-sm text-slate-200">Weather Overlay</span>
                  <Switch checked={weatherToggle} onCheckedChange={setWeatherToggle} />
                </div>
              </div>
            </div>

            {/* Forecast Duration Slider */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-200">Forecast Duration</span>
                <span className="text-white font-medium">{forecastHours[0]} hours</span>
              </div>
              <Slider
                value={forecastHours}
                onValueChange={setForecastHours}
                max={72}
                min={12}
                step={6}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-slate-400">
                <span>12h</span>
                <span>24h</span>
                <span>48h</span>
                <span>72h</span>
              </div>
            </div>
          </CardHeader>

          <CardContent>
            <div className="h-96">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={forecastData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis
                    dataKey="time"
                    tick={{ fontSize: 12, fill: "#9CA3AF" }}
                    interval="preserveStartEnd"
                    stroke="#9CA3AF"
                  />
                  <YAxis yAxisId="aqi" orientation="left" stroke="#9CA3AF" />
                  {weatherToggle && <YAxis yAxisId="weather" orientation="right" stroke="#9CA3AF" />}

                  <Tooltip
                    content={({ active, payload, label }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="bg-slate-900/95 backdrop-blur-md border border-slate-700/50 p-3 rounded-lg shadow-lg text-white">
                            <p className="font-medium">{label}</p>
                            {payload.map((entry, index) => (
                              <p key={index} style={{ color: entry.color }}>
                                {entry.name}: {entry.value}
                                {entry.dataKey === "aqi" &&
                                  ` (±${Math.round((entry.payload.aqiUpper - entry.payload.aqiLower) / 2)})`}
                              </p>
                            ))}
                            <p className="text-sm text-slate-300">
                              Confidence: {Math.round(payload[0]?.payload?.confidence * 100)}%
                            </p>
                            <p className="text-sm text-slate-300">
                              Category: {getAQICategory(payload[0]?.payload?.aqi)}
                            </p>
                          </div>
                        )
                      }
                      return null
                    }}
                  />

                  <Legend />

                  {/* Confidence interval area */}
                  <Area
                    yAxisId="aqi"
                    type="monotone"
                    dataKey="aqiUpper"
                    stackId="1"
                    stroke="none"
                    fill="#3b82f6"
                    fillOpacity={0.1}
                  />
                  <Area
                    yAxisId="aqi"
                    type="monotone"
                    dataKey="aqiLower"
                    stackId="1"
                    stroke="none"
                    fill="#ffffff"
                    fillOpacity={1}
                  />

                  {/* Main AQI line */}
                  <Line
                    yAxisId="aqi"
                    type="monotone"
                    dataKey="aqi"
                    stroke="#3b82f6"
                    strokeWidth={3}
                    dot={{ fill: "#3b82f6", strokeWidth: 2, r: 4 }}
                    name="AQI"
                  />

                  {/* Pollutant lines */}
                  <Line
                    yAxisId="aqi"
                    type="monotone"
                    dataKey="pm25"
                    stroke="#ef4444"
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    name="PM2.5"
                  />
                  <Line
                    yAxisId="aqi"
                    type="monotone"
                    dataKey="pm10"
                    stroke="#f97316"
                    strokeWidth={2}
                    strokeDasharray="3 3"
                    name="PM10"
                  />

                  {/* Weather data */}
                  {weatherToggle && (
                    <>
                      <Line
                        yAxisId="weather"
                        type="monotone"
                        dataKey="temperature"
                        stroke="#f59e0b"
                        strokeWidth={2}
                        strokeDasharray="8 4"
                        name="Temperature (°C)"
                      />
                      <Line
                        yAxisId="weather"
                        type="monotone"
                        dataKey="humidity"
                        stroke="#10b981"
                        strokeWidth={2}
                        strokeDasharray="4 4"
                        name="Humidity (%)"
                      />
                    </>
                  )}

                  {/* Alert threshold line */}
                  <ReferenceLine
                    yAxisId="aqi"
                    y={alertThreshold[0]}
                    stroke="#ef4444"
                    strokeDasharray="8 8"
                    label="Alert Threshold"
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>

            {/* Enhanced Current Conditions Summary */}
            <div className="mt-6 grid grid-cols-2 lg:grid-cols-5 gap-4">
              <div className="text-center p-3 bg-slate-700/50 rounded-lg">
                <div className="text-2xl font-bold text-blue-400">
                  {indianCities.find((c) => c.name === selectedCity)?.currentAQI}
                </div>
                <div className="text-sm text-slate-300">Current AQI</div>
              </div>
              <div className="text-center p-3 bg-slate-700/50 rounded-lg">
                <div className="text-2xl font-bold text-orange-400">
                  {indianCities.find((c) => c.name === selectedCity)?.forecast24h}
                </div>
                <div className="text-sm text-slate-300">24h Forecast</div>
              </div>
              <div className="text-center p-3 bg-slate-700/50 rounded-lg">
                <div className="text-2xl font-bold text-purple-400">
                  {indianCities.find((c) => c.name === selectedCity)?.accuracy}%
                </div>
                <div className="text-sm text-slate-300">Accuracy</div>
              </div>
              <div className="text-center p-3 bg-slate-700/50 rounded-lg">
                <div className="text-2xl font-bold text-green-400">{upcomingAlerts.length}</div>
                <div className="text-sm text-slate-300">Alerts</div>
              </div>
              <div className="text-center p-3 bg-slate-700/50 rounded-lg">
                <div className="text-2xl font-bold text-cyan-400">{selectedCities.length}</div>
                <div className="text-sm text-slate-300">Cities Tracked</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
