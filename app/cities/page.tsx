"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import {
  Building2,
  TrendingUp,
  TrendingDown,
  Minus,
  RefreshCw,
  Download,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Search,
  Plus,
  X,
  Map,
  Grid3X3,
  Table,
  Filter,
  Layers,
  Navigation,
  Zap,
  Wind,
  Thermometer,
  Droplets,
  BarChart3,
  Globe,
} from "lucide-react"

const cities = [
  {
    id: "delhi",
    name: "Delhi",
    aqi: 168,
    category: "Unhealthy",
    temp: 28,
    humidity: 65,
    wind: 12,
    pm25: 89,
    pm10: 145,
    so2: 15,
    no2: 42,
    co: 1.2,
    o3: 35,
    trend: "up",
    coordinates: { lat: 28.6139, lng: 77.209 },
    population: 32900000,
    region: "North",
    isCapital: true,
    forecast24h: 175,
    forecast48h: 162,
    accuracy: 92,
  },
  {
    id: "mumbai",
    name: "Mumbai",
    aqi: 142,
    category: "Unhealthy for Sensitive Groups",
    temp: 32,
    humidity: 78,
    wind: 8,
    pm25: 67,
    pm10: 98,
    so2: 12,
    no2: 38,
    co: 0.9,
    o3: 28,
    trend: "down",
    coordinates: { lat: 19.076, lng: 72.8777 },
    population: 20400000,
    region: "West",
    isCapital: false,
    forecast24h: 138,
    forecast48h: 145,
    accuracy: 89,
  },
  {
    id: "bangalore",
    name: "Bangalore",
    aqi: 95,
    category: "Moderate",
    temp: 26,
    humidity: 58,
    wind: 15,
    pm25: 45,
    pm10: 72,
    so2: 8,
    no2: 25,
    co: 0.6,
    o3: 22,
    trend: "stable",
    coordinates: { lat: 12.9716, lng: 77.5946 },
    population: 13200000,
    region: "South",
    isCapital: false,
    forecast24h: 98,
    forecast48h: 92,
    accuracy: 94,
  },
  {
    id: "chennai",
    name: "Chennai",
    aqi: 118,
    category: "Unhealthy for Sensitive Groups",
    temp: 34,
    humidity: 82,
    wind: 6,
    pm25: 58,
    pm10: 85,
    so2: 10,
    no2: 32,
    co: 0.8,
    o3: 31,
    trend: "up",
    coordinates: { lat: 13.0827, lng: 80.2707 },
    population: 11000000,
    region: "South",
    isCapital: false,
    forecast24h: 125,
    forecast48h: 115,
    accuracy: 91,
  },
  {
    id: "kolkata",
    name: "Kolkata",
    aqi: 156,
    category: "Unhealthy",
    temp: 30,
    humidity: 75,
    wind: 9,
    pm25: 78,
    pm10: 125,
    so2: 14,
    no2: 45,
    co: 1.1,
    o3: 29,
    trend: "down",
    coordinates: { lat: 22.5726, lng: 88.3639 },
    population: 14850000,
    region: "East",
    isCapital: false,
    forecast24h: 149,
    forecast48h: 158,
    accuracy: 87,
  },
  {
    id: "hyderabad",
    name: "Hyderabad",
    aqi: 108,
    category: "Unhealthy for Sensitive Groups",
    temp: 29,
    humidity: 62,
    wind: 11,
    pm25: 52,
    pm10: 78,
    so2: 9,
    no2: 28,
    co: 0.7,
    o3: 26,
    trend: "stable",
    coordinates: { lat: 17.385, lng: 78.4867 },
    population: 10500000,
    region: "South",
    isCapital: false,
    forecast24h: 112,
    forecast48h: 105,
    accuracy: 88,
  },
  {
    id: "pune",
    name: "Pune",
    aqi: 89,
    category: "Moderate",
    temp: 27,
    humidity: 55,
    wind: 14,
    pm25: 42,
    pm10: 65,
    so2: 7,
    no2: 22,
    co: 0.5,
    o3: 24,
    trend: "down",
    coordinates: { lat: 18.5204, lng: 73.8567 },
    population: 7400000,
    region: "West",
    isCapital: false,
    forecast24h: 85,
    forecast48h: 91,
    accuracy: 90,
  },
  {
    id: "ahmedabad",
    name: "Ahmedabad",
    aqi: 134,
    category: "Unhealthy for Sensitive Groups",
    temp: 35,
    humidity: 48,
    wind: 10,
    pm25: 63,
    pm10: 92,
    so2: 11,
    no2: 35,
    co: 0.9,
    o3: 33,
    trend: "up",
    coordinates: { lat: 23.0225, lng: 72.5714 },
    population: 8450000,
    region: "West",
    isCapital: false,
    forecast24h: 141,
    forecast48h: 128,
    accuracy: 86,
  },
  {
    id: "lucknow",
    name: "Lucknow",
    aqi: 178,
    category: "Unhealthy",
    temp: 31,
    humidity: 68,
    wind: 7,
    pm25: 95,
    pm10: 158,
    so2: 16,
    no2: 48,
    co: 1.3,
    o3: 32,
    trend: "up",
    coordinates: { lat: 26.8467, lng: 80.9462 },
    population: 3500000,
    region: "North",
    isCapital: true,
    forecast24h: 185,
    forecast48h: 172,
    accuracy: 83,
  },
  {
    id: "jaipur",
    name: "Jaipur",
    aqi: 145,
    category: "Unhealthy for Sensitive Groups",
    temp: 33,
    humidity: 52,
    wind: 12,
    pm25: 72,
    pm10: 118,
    so2: 13,
    no2: 39,
    co: 1.0,
    o3: 30,
    trend: "stable",
    coordinates: { lat: 26.9124, lng: 75.7873 },
    population: 3900000,
    region: "North",
    isCapital: true,
    forecast24h: 152,
    forecast48h: 138,
    accuracy: 85,
  },
  {
    id: "bhopal",
    name: "Bhopal",
    aqi: 112,
    category: "Unhealthy for Sensitive Groups",
    temp: 29,
    humidity: 61,
    wind: 9,
    pm25: 55,
    pm10: 82,
    so2: 9,
    no2: 29,
    co: 0.7,
    o3: 27,
    trend: "down",
    coordinates: { lat: 23.2599, lng: 77.4126 },
    population: 2400000,
    region: "Central",
    isCapital: true,
    forecast24h: 108,
    forecast48h: 115,
    accuracy: 89,
  },
  {
    id: "indore",
    name: "Indore",
    aqi: 98,
    category: "Moderate",
    temp: 28,
    humidity: 58,
    wind: 11,
    pm25: 48,
    pm10: 75,
    so2: 8,
    no2: 26,
    co: 0.6,
    o3: 25,
    trend: "stable",
    coordinates: { lat: 22.7196, lng: 75.8577 },
    population: 3300000,
    region: "Central",
    isCapital: false,
    forecast24h: 102,
    forecast48h: 95,
    accuracy: 91,
  },
  {
    id: "patna",
    name: "Patna",
    aqi: 189,
    category: "Unhealthy",
    temp: 32,
    humidity: 72,
    wind: 6,
    pm25: 102,
    pm10: 165,
    so2: 17,
    no2: 51,
    co: 1.4,
    o3: 28,
    trend: "up",
    coordinates: { lat: 25.5941, lng: 85.1376 },
    population: 2500000,
    region: "East",
    isCapital: true,
    forecast24h: 195,
    forecast48h: 182,
    accuracy: 81,
  },
  {
    id: "surat",
    name: "Surat",
    aqi: 124,
    category: "Unhealthy for Sensitive Groups",
    temp: 34,
    humidity: 65,
    wind: 8,
    pm25: 61,
    pm10: 89,
    so2: 11,
    no2: 34,
    co: 0.8,
    o3: 29,
    trend: "down",
    coordinates: { lat: 21.1702, lng: 72.8311 },
    population: 6500000,
    region: "West",
    isCapital: false,
    forecast24h: 118,
    forecast48h: 129,
    accuracy: 88,
  },
  {
    id: "kanpur",
    name: "Kanpur",
    aqi: 195,
    category: "Unhealthy",
    temp: 30,
    humidity: 69,
    wind: 5,
    pm25: 108,
    pm10: 172,
    so2: 18,
    no2: 53,
    co: 1.5,
    o3: 26,
    trend: "up",
    coordinates: { lat: 26.4499, lng: 80.3319 },
    population: 3200000,
    region: "North",
    isCapital: false,
    forecast24h: 202,
    forecast48h: 188,
    accuracy: 79,
  },
  {
    id: "nagpur",
    name: "Nagpur",
    aqi: 105,
    category: "Unhealthy for Sensitive Groups",
    temp: 31,
    humidity: 59,
    wind: 10,
    pm25: 51,
    pm10: 79,
    so2: 9,
    no2: 27,
    co: 0.7,
    o3: 28,
    trend: "stable",
    coordinates: { lat: 21.1458, lng: 79.0882 },
    population: 2500000,
    region: "Central",
    isCapital: false,
    forecast24h: 109,
    forecast48h: 102,
    accuracy: 89,
  },
  {
    id: "visakhapatnam",
    name: "Visakhapatnam",
    aqi: 87,
    category: "Moderate",
    temp: 29,
    humidity: 76,
    wind: 13,
    pm25: 41,
    pm10: 68,
    so2: 7,
    no2: 23,
    co: 0.5,
    o3: 26,
    trend: "down",
    coordinates: { lat: 17.6868, lng: 83.2185 },
    population: 2000000,
    region: "South",
    isCapital: false,
    forecast24h: 82,
    forecast48h: 89,
    accuracy: 93,
  },
]

const getAQIColor = (aqi: number) => {
  if (aqi <= 50) return "bg-green-500"
  if (aqi <= 100) return "bg-yellow-500"
  if (aqi <= 150) return "bg-orange-500"
  if (aqi <= 200) return "bg-red-500"
  if (aqi <= 300) return "bg-purple-500"
  return "bg-red-800"
}

const getAQIBorderColor = (aqi: number) => {
  if (aqi <= 50) return "border-green-500"
  if (aqi <= 100) return "border-yellow-500"
  if (aqi <= 150) return "border-orange-500"
  if (aqi <= 200) return "border-red-500"
  if (aqi <= 300) return "border-purple-500"
  return "border-red-800"
}

const getTrendIcon = (trend: string) => {
  switch (trend) {
    case "up":
      return <TrendingUp className="h-4 w-4 text-red-500" />
    case "down":
      return <TrendingDown className="h-4 w-4 text-green-500" />
    default:
      return <Minus className="h-4 w-4 text-gray-500" />
  }
}

export default function CitiesPage() {
  const [selectedCities, setSelectedCities] = useState<string[]>(["delhi", "mumbai", "bangalore", "chennai"])
  const [viewMode, setViewMode] = useState("grid")
  const [sortBy, setSortBy] = useState("worst-aqi")
  const [aqiRange, setAqiRange] = useState([0, 300])
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [sortColumn, setSortColumn] = useState<string>("")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")
  const [searchQuery, setSearchQuery] = useState("")
  const [showAddCity, setShowAddCity] = useState(false)
  const [newCityName, setNewCityName] = useState("")
  const [mapView, setMapView] = useState("heatmap") // heatmap, pins, hybrid
  const [showHeatmapLayers, setShowHeatmapLayers] = useState(true)
  const [selectedRegion, setSelectedRegion] = useState("all")
  const [showCapitalsOnly, setShowCapitalsOnly] = useState(false)
  const [populationFilter, setPopulationFilter] = useState([0, 35])

  const handleCityToggle = (cityId: string) => {
    setSelectedCities((prev) => (prev.includes(cityId) ? prev.filter((id) => id !== cityId) : [...prev, cityId]))
  }

  const handleRefresh = () => {
    setIsRefreshing(true)
    setTimeout(() => setIsRefreshing(false), 2000)
  }

  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortColumn(column)
      setSortDirection("asc")
    }
  }

  const handleAddCity = () => {
    if (newCityName.trim()) {
      // In a real app, this would make an API call to add the city
      console.log(`Adding city: ${newCityName}`)
      setNewCityName("")
      setShowAddCity(false)
    }
  }

  const getSortedCities = () => {
    const filtered = cities.filter(
      (city) =>
        city.aqi >= aqiRange[0] &&
        city.aqi <= aqiRange[1] &&
        city.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
        (selectedRegion === "all" || city.region.toLowerCase() === selectedRegion) &&
        (!showCapitalsOnly || city.isCapital) &&
        city.population / 1000000 >= populationFilter[0] &&
        city.population / 1000000 <= populationFilter[1],
    )

    if (sortBy === "best-aqi") {
      filtered.sort((a, b) => a.aqi - b.aqi)
    } else if (sortBy === "worst-aqi") {
      filtered.sort((a, b) => b.aqi - a.aqi)
    } else if (sortBy === "temperature") {
      filtered.sort((a, b) => b.temp - a.temp)
    } else if (sortBy === "alphabetical") {
      filtered.sort((a, b) => a.name.localeCompare(b.name))
    } else if (sortBy === "population") {
      filtered.sort((a, b) => b.population - a.population)
    }

    if (sortColumn) {
      filtered.sort((a, b) => {
        const aVal = a[sortColumn as keyof typeof a] as number
        const bVal = b[sortColumn as keyof typeof b] as number
        return sortDirection === "asc" ? aVal - bVal : bVal - aVal
      })
    }

    return filtered
  }

  const sortedCities = getSortedCities()
  const selectedCitiesData = cities.filter((city) => selectedCities.includes(city.id))

  const exportData = () => {
    const exportData = {
      metadata: {
        title: "Indian Cities Air Quality Data",
        exportedAt: new Date().toISOString(),
        totalCities: cities.length,
        selectedCities: selectedCities.length,
        filters: {
          aqiRange,
          selectedRegion,
          showCapitalsOnly,
          populationFilter,
          searchQuery,
        },
      },
      cities: selectedCitiesData.map((city) => ({
        ...city,
        populationInMillions: (city.population / 1000000).toFixed(1),
      })),
      statistics: {
        averageAQI: Math.round(selectedCitiesData.reduce((sum, city) => sum + city.aqi, 0) / selectedCitiesData.length),
        worstCity: selectedCitiesData.reduce((max, city) => (city.aqi > max.aqi ? city : max)),
        bestCity: selectedCitiesData.reduce((min, city) => (city.aqi < min.aqi ? city : min)),
        regionDistribution: selectedCitiesData.reduce(
          (acc, city) => {
            acc[city.region] = (acc[city.region] || 0) + 1
            return acc
          },
          {} as Record<string, number>,
        ),
      },
    }

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `indian-cities-aqi-data-${new Date().toISOString().split("T")[0]}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <DashboardLayout>
      <div className="min-h-screen w-full bg-gradient-to-br from-slate-900 via-slate-800 to-slate-700">
        <div className="space-y-6 p-6">
          <Card className="bg-slate-800/60 backdrop-blur-md border border-slate-700/50">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-white">
                <Building2 className="h-5 w-5 text-blue-400" />
                <span>Multi-City Air Quality Comparison Dashboard</span>
              </CardTitle>
              <CardDescription className="text-slate-300">
                Compare air quality metrics across {cities.length} Indian cities with real-time monitoring and advanced
                filtering
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Enhanced Search and Add City */}
              <div className="flex flex-wrap gap-4 items-center">
                <div className="flex-1 min-w-[300px]">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input
                      placeholder="Search cities by name, region, or characteristics..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 bg-slate-700/50 border-slate-600 text-white placeholder-slate-400"
                    />
                  </div>
                </div>
                <Button
                  onClick={() => setShowAddCity(!showAddCity)}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add City
                </Button>
                <Button
                  onClick={exportData}
                  variant="outline"
                  className="border-slate-600 text-slate-200 hover:bg-slate-700 bg-transparent"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Export Data
                </Button>
              </div>

              {/* Add City Form */}
              {showAddCity && (
                <Card className="bg-slate-700/50 border-slate-600">
                  <CardContent className="p-4">
                    <div className="flex gap-3 items-center">
                      <Input
                        placeholder="Enter city name..."
                        value={newCityName}
                        onChange={(e) => setNewCityName(e.target.value)}
                        className="bg-slate-600/50 border-slate-500 text-white placeholder-slate-400"
                        onKeyPress={(e) => e.key === "Enter" && handleAddCity()}
                      />
                      <Button onClick={handleAddCity} size="sm" className="bg-green-600 hover:bg-green-700">
                        Add
                      </Button>
                      <Button
                        onClick={() => setShowAddCity(false)}
                        size="sm"
                        variant="outline"
                        className="border-slate-500 text-slate-300 hover:bg-slate-600"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Enhanced Filters */}
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label className="text-slate-200 text-sm font-medium">Region Filter</Label>
                  <Select value={selectedRegion} onValueChange={setSelectedRegion}>
                    <SelectTrigger className="bg-slate-700/50 border-slate-600 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-slate-700">
                      <SelectItem value="all">All Regions</SelectItem>
                      <SelectItem value="north">North India</SelectItem>
                      <SelectItem value="south">South India</SelectItem>
                      <SelectItem value="east">East India</SelectItem>
                      <SelectItem value="west">West India</SelectItem>
                      <SelectItem value="central">Central India</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-slate-200 text-sm font-medium">Population Range (M)</Label>
                  <Slider
                    value={populationFilter}
                    onValueChange={setPopulationFilter}
                    max={35}
                    min={0}
                    step={1}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-slate-400">
                    <span>{populationFilter[0]}M</span>
                    <span>{populationFilter[1]}M</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-slate-200 text-sm font-medium">AQI Range</Label>
                  <Slider value={aqiRange} onValueChange={setAqiRange} max={300} step={10} className="w-full" />
                  <div className="flex justify-between text-xs text-slate-400">
                    <span>{aqiRange[0]}</span>
                    <span>{aqiRange[1]}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-slate-200 text-sm font-medium">Special Filters</Label>
                  <div className="flex items-center space-x-2">
                    <Switch checked={showCapitalsOnly} onCheckedChange={setShowCapitalsOnly} id="capitals-only" />
                    <Label htmlFor="capitals-only" className="text-slate-300 text-sm">
                      Capital Cities Only
                    </Label>
                  </div>
                </div>
              </div>

              {/* City Selection Grid */}
              <div>
                <h3 className="text-sm font-medium mb-3 text-slate-200 flex items-center gap-2">
                  <Filter className="h-4 w-4" />
                  Select Cities to Compare ({selectedCities.length} selected from {sortedCities.length} filtered)
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
                  {sortedCities.map((city) => (
                    <div key={city.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={city.id}
                        checked={selectedCities.includes(city.id)}
                        onCheckedChange={() => handleCityToggle(city.id)}
                        className="border-slate-500 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                      />
                      <label
                        htmlFor={city.id}
                        className="text-sm font-medium cursor-pointer text-slate-200 flex items-center gap-1"
                      >
                        <div className={`w-2 h-2 rounded-full ${getAQIColor(city.aqi)}`} />
                        <span>{city.name}</span>
                        {city.isCapital && <Badge className="text-xs bg-purple-600 px-1 py-0">C</Badge>}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Controls Row */}
              <div className="flex flex-wrap items-center gap-4">
                <div className="flex items-center space-x-2">
                  <label className="text-sm font-medium text-slate-200">Sort by:</label>
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-48 bg-slate-700/50 border-slate-600 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-slate-700">
                      <SelectItem value="worst-aqi">Worst AQI</SelectItem>
                      <SelectItem value="best-aqi">Best AQI</SelectItem>
                      <SelectItem value="temperature">Temperature</SelectItem>
                      <SelectItem value="population">Population</SelectItem>
                      <SelectItem value="alphabetical">Alphabetical</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleRefresh}
                  disabled={isRefreshing}
                  className="border-slate-600 text-slate-200 hover:bg-slate-700 bg-transparent"
                >
                  <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`} />
                  Refresh
                </Button>

                <Badge className="bg-green-600 text-white">{selectedCities.length} cities selected</Badge>

                <Badge variant="outline" className="border-slate-500 text-slate-300">
                  Avg AQI:{" "}
                  {Math.round(
                    selectedCitiesData.reduce((sum, city) => sum + city.aqi, 0) / selectedCitiesData.length || 0,
                  )}
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Tabs value={viewMode} onValueChange={setViewMode} className="w-full">
            <TabsList className="grid w-full grid-cols-3 bg-slate-800/40">
              <TabsTrigger
                value="grid"
                className="data-[state=active]:bg-slate-700/80 data-[state=active]:text-white text-slate-300 flex items-center gap-2"
              >
                <Grid3X3 className="h-4 w-4" />
                Grid View
              </TabsTrigger>
              <TabsTrigger
                value="table"
                className="data-[state=active]:bg-slate-700/80 data-[state=active]:text-white text-slate-300 flex items-center gap-2"
              >
                <Table className="h-4 w-4" />
                Table View
              </TabsTrigger>
              <TabsTrigger
                value="map"
                className="data-[state=active]:bg-slate-700/80 data-[state=active]:text-white text-slate-300 flex items-center gap-2"
              >
                <Map className="h-4 w-4" />
                Enhanced Map
              </TabsTrigger>
            </TabsList>

            {/* Enhanced Grid View */}
            <TabsContent value="grid" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {selectedCitiesData.map((city) => (
                  <Card
                    key={city.id}
                    className={`cursor-pointer transition-all hover:shadow-lg hover:shadow-black/25 border-2 ${getAQIBorderColor(city.aqi)} bg-slate-800/60 backdrop-blur-md hover:scale-105`}
                    onClick={() => handleCityToggle(city.id)}
                  >
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <CardTitle className="text-lg text-white">{city.name}</CardTitle>
                          {city.isCapital && <Badge className="text-xs bg-purple-600">Capital</Badge>}
                        </div>
                        {getTrendIcon(city.trend)}
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs border-slate-500 text-slate-400">
                          {city.region}
                        </Badge>
                        <Badge variant="outline" className="text-xs border-slate-500 text-slate-400">
                          {(city.population / 1000000).toFixed(1)}M
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="text-center">
                        <div className="text-3xl font-bold text-white">{city.aqi}</div>
                        <Badge className={`${getAQIColor(city.aqi)} text-white`}>{city.category}</Badge>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div className="flex items-center gap-1">
                          <Thermometer className="h-3 w-3 text-red-400" />
                          <span className="text-slate-400">Temp:</span>
                          <span className="ml-1 font-medium text-slate-200">{city.temp}°C</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Droplets className="h-3 w-3 text-blue-400" />
                          <span className="text-slate-400">Humidity:</span>
                          <span className="ml-1 font-medium text-slate-200">{city.humidity}%</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Wind className="h-3 w-3 text-green-400" />
                          <span className="text-slate-400">Wind:</span>
                          <span className="ml-1 font-medium text-slate-200">{city.wind} km/h</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Zap className="h-3 w-3 text-purple-400" />
                          <span className="text-slate-400">PM2.5:</span>
                          <span className="ml-1 font-medium text-slate-200">{city.pm25}</span>
                        </div>
                      </div>

                      <div className="pt-2 border-t border-slate-700">
                        <div className="flex justify-between text-xs">
                          <span className="text-slate-400">24h Forecast:</span>
                          <span className="font-medium text-slate-200">{city.forecast24h}</span>
                        </div>
                        <div className="flex justify-between text-xs">
                          <span className="text-slate-400">Accuracy:</span>
                          <span className="font-medium text-green-400">{city.accuracy}%</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Enhanced Table View */}
            <TabsContent value="table">
              <Card className="bg-slate-800/60 backdrop-blur-md border border-slate-700/50">
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-slate-800/40">
                        <tr>
                          <th className="px-4 py-3 text-left">
                            <Checkbox
                              checked={selectedCities.length === cities.length}
                              onCheckedChange={(checked) => {
                                setSelectedCities(checked ? cities.map((c) => c.id) : [])
                              }}
                              className="border-slate-500 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                            />
                          </th>
                          {[
                            "City",
                            "Region",
                            "AQI",
                            "PM2.5",
                            "PM10",
                            "SO2",
                            "NO2",
                            "CO",
                            "O3",
                            "Temp",
                            "Humidity",
                            "Population",
                            "Forecast",
                            "Accuracy",
                          ].map((column) => (
                            <th
                              key={column}
                              className="px-4 py-3 text-left cursor-pointer hover:bg-slate-700/60 text-slate-200"
                              onClick={() => handleSort(column.toLowerCase())}
                            >
                              <div className="flex items-center space-x-1">
                                <span>{column}</span>
                                {sortColumn === column.toLowerCase() ? (
                                  sortDirection === "asc" ? (
                                    <ArrowUp className="h-3 w-3" />
                                  ) : (
                                    <ArrowDown className="h-3 w-3" />
                                  )
                                ) : (
                                  <ArrowUpDown className="h-3 w-3 opacity-50" />
                                )}
                              </div>
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {selectedCitiesData.map((city) => (
                          <tr key={city.id} className="border-t border-slate-700/50 hover:bg-slate-800/40">
                            <td className="px-4 py-3">
                              <Checkbox
                                checked={selectedCities.includes(city.id)}
                                onCheckedChange={() => handleCityToggle(city.id)}
                                className="border-slate-500 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                              />
                            </td>
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-2">
                                <span className="font-medium text-slate-200">{city.name}</span>
                                {city.isCapital && <Badge className="text-xs bg-purple-600">C</Badge>}
                              </div>
                            </td>
                            <td className="px-4 py-3">
                              <Badge variant="outline" className="border-slate-500 text-slate-300">
                                {city.region}
                              </Badge>
                            </td>
                            <td className="px-4 py-3">
                              <Badge className={`${getAQIColor(city.aqi)} text-white`}>{city.aqi}</Badge>
                            </td>
                            <td className="px-4 py-3 text-slate-200">{city.pm25}</td>
                            <td className="px-4 py-3 text-slate-200">{city.pm10}</td>
                            <td className="px-4 py-3 text-slate-200">{city.so2}</td>
                            <td className="px-4 py-3 text-slate-200">{city.no2}</td>
                            <td className="px-4 py-3 text-slate-200">{city.co}</td>
                            <td className="px-4 py-3 text-slate-200">{city.o3}</td>
                            <td className="px-4 py-3 text-slate-200">{city.temp}°C</td>
                            <td className="px-4 py-3 text-slate-200">{city.humidity}%</td>
                            <td className="px-4 py-3 text-slate-200">{(city.population / 1000000).toFixed(1)}M</td>
                            <td className="px-4 py-3 text-slate-200">{city.forecast24h}</td>
                            <td className="px-4 py-3 text-green-400">{city.accuracy}%</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Enhanced Map View */}
            <TabsContent value="map">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Enhanced Map Section */}
                <Card className="lg:col-span-2 bg-slate-800/60 backdrop-blur-md border border-slate-700/50">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-white flex items-center gap-2">
                          <Globe className="h-5 w-5 text-blue-400" />
                          Interactive Air Quality Map of India
                        </CardTitle>
                        <CardDescription className="text-slate-300">
                          Real-time AQI visualization with advanced filtering and heatmap overlays
                        </CardDescription>
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
                    </div>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="h-96 bg-gradient-to-br from-slate-800 to-slate-700 rounded-lg flex items-center justify-center relative overflow-hidden border border-slate-600">
                      {/* Enhanced India Map Background */}
                      <div className="absolute inset-0 opacity-20">
                        <svg viewBox="0 0 400 300" className="w-full h-full">
                          <path
                            d="M50 150 Q100 100 150 120 Q200 140 250 130 Q300 120 350 140 L350 200 Q300 220 250 210 Q200 200 150 190 Q100 180 50 170 Z"
                            fill="#475569"
                            stroke="#64748b"
                            strokeWidth="2"
                          />
                        </svg>
                      </div>

                      {/* Enhanced City Markers */}
                      <div className="absolute inset-0">
                        {selectedCitiesData.map((city, index) => {
                          // Calculate position based on coordinates (simplified)
                          const x = ((city.coordinates.lng - 68) / (97 - 68)) * 100
                          const y = ((35 - city.coordinates.lat) / (35 - 8)) * 100

                          return (
                            <div
                              key={city.id}
                              className="absolute transform -translate-x-1/2 -translate-y-1/2"
                              style={{
                                left: `${Math.max(10, Math.min(90, x))}%`,
                                top: `${Math.max(10, Math.min(90, y))}%`,
                              }}
                            >
                              <div className="relative group">
                                <div
                                  className={`w-8 h-8 rounded-full ${getAQIColor(city.aqi)} border-2 border-white shadow-lg cursor-pointer flex items-center justify-center transition-transform hover:scale-110 relative`}
                                >
                                  <span className="text-white text-xs font-bold">{city.aqi}</span>
                                  {city.isCapital && (
                                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-purple-600 rounded-full border border-white"></div>
                                  )}
                                </div>
                                <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 bg-slate-900/95 backdrop-blur-md text-white px-3 py-2 rounded-lg text-xs opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap border border-slate-700 shadow-xl z-10">
                                  <div className="font-semibold flex items-center gap-1">
                                    {city.name}
                                    {city.isCapital && <Badge className="text-xs bg-purple-600">Capital</Badge>}
                                  </div>
                                  <div className="space-y-1">
                                    <div>
                                      AQI: {city.aqi} ({city.category})
                                    </div>
                                    <div>PM2.5: {city.pm25} μg/m³</div>
                                    <div>Temperature: {city.temp}°C</div>
                                    <div>Population: {(city.population / 1000000).toFixed(1)}M</div>
                                    <div>24h Forecast: {city.forecast24h}</div>
                                    <div>Accuracy: {city.accuracy}%</div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          )
                        })}
                      </div>

                      {/* Heatmap overlay simulation */}
                      {mapView === "heatmap" && showHeatmapLayers && (
                        <div className="absolute inset-0 opacity-30">
                          <div className="w-full h-full bg-gradient-radial from-red-500/40 via-orange-500/20 to-transparent"></div>
                        </div>
                      )}

                      {/* Enhanced Legend */}
                      <div className="absolute bottom-4 left-4 bg-slate-900/95 backdrop-blur-md border border-slate-700/50 p-4 rounded-lg shadow-xl">
                        <h4 className="font-semibold mb-3 text-white flex items-center gap-2">
                          <BarChart3 className="h-4 w-4" />
                          AQI Legend
                        </h4>
                        <div className="space-y-2 text-xs">
                          <div className="flex items-center space-x-2">
                            <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                            <span className="text-slate-200">Good (0-50)</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <div className="w-4 h-4 bg-yellow-500 rounded-full"></div>
                            <span className="text-slate-200">Moderate (51-100)</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <div className="w-4 h-4 bg-orange-500 rounded-full"></div>
                            <span className="text-slate-200">Unhealthy for Sensitive (101-150)</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <div className="w-4 h-4 bg-red-500 rounded-full"></div>
                            <span className="text-slate-200">Unhealthy (151-200)</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <div className="w-4 h-4 bg-purple-500 rounded-full"></div>
                            <span className="text-slate-200">Very Unhealthy (201-300)</span>
                          </div>
                          <div className="flex items-center space-x-2 pt-2 border-t border-slate-600">
                            <div className="w-3 h-3 bg-purple-600 rounded-full"></div>
                            <span className="text-slate-200">Capital City</span>
                          </div>
                        </div>
                      </div>

                      {/* Map Controls */}
                      <div className="absolute top-4 right-4 bg-slate-900/95 backdrop-blur-md border border-slate-700/50 p-3 rounded-lg shadow-xl">
                        <div className="flex items-center space-x-2 mb-2">
                          <Switch
                            checked={showHeatmapLayers}
                            onCheckedChange={setShowHeatmapLayers}
                            id="heatmap-toggle"
                          />
                          <Label htmlFor="heatmap-toggle" className="text-slate-200 text-xs">
                            Heatmap Overlay
                          </Label>
                        </div>
                        <div className="text-xs text-slate-400">{selectedCities.length} cities shown</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Enhanced City List Sidebar */}
                <Card className="bg-slate-800/60 backdrop-blur-md border border-slate-700/50">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <Building2 className="h-5 w-5 text-green-400" />
                      Selected Cities Ranking
                    </CardTitle>
                    <CardDescription className="text-slate-300">
                      {selectedCities.length} cities selected • Sorted by AQI
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3 max-h-96 overflow-y-auto">
                    {selectedCitiesData
                      .sort((a, b) => b.aqi - a.aqi)
                      .map((city, index) => (
                        <div
                          key={city.id}
                          className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg border border-slate-600/50 hover:bg-slate-700/50 transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <div className="text-lg font-bold text-white">#{index + 1}</div>
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-medium text-slate-200">{city.name}</span>
                                {city.isCapital && <Badge className="text-xs bg-purple-600">C</Badge>}
                              </div>
                              <div className="text-xs text-slate-400">
                                {city.region} • {(city.population / 1000000).toFixed(1)}M • {city.accuracy}% accuracy
                              </div>
                              <div className="text-xs text-slate-400">
                                PM2.5: {city.pm25} • Temp: {city.temp}°C • Forecast: {city.forecast24h}
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div
                              className={`text-lg font-bold ${
                                city.aqi <= 50
                                  ? "text-green-400"
                                  : city.aqi <= 100
                                    ? "text-yellow-400"
                                    : city.aqi <= 150
                                      ? "text-orange-400"
                                      : city.aqi <= 200
                                        ? "text-red-400"
                                        : "text-purple-400"
                              }`}
                            >
                              {city.aqi}
                            </div>
                            <div className="text-xs text-slate-400">{city.category}</div>
                            {getTrendIcon(city.trend)}
                          </div>
                        </div>
                      ))}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </DashboardLayout>
  )
}
