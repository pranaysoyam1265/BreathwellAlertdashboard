"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  MapPin,
  Plus,
  Star,
  StarOff,
  Navigation,
  Search,
  Edit,
  Download,
  Upload,
  Target,
  RefreshCw,
  Filter,
  TrendingUp,
  TrendingDown,
  Minus,
  Map,
  Globe,
  Layers,
} from "lucide-react"

// Enhanced mock data for demonstration
const mockLocations = [
  {
    id: 1,
    name: "Home",
    address: "Connaught Place, New Delhi, India",
    coordinates: { lat: 28.6304, lng: 77.2177 },
    aqi: 145,
    status: "Unhealthy for Sensitive Groups",
    isFavorite: true,
    lastUpdated: "2 minutes ago",
    alerts: true,
    category: "residential",
    pm25: 78,
    pm10: 125,
    temp: 28,
    humidity: 65,
    wind: 12,
    trend: "up",
    forecast24h: 152,
    accuracy: 92,
  },
  {
    id: 2,
    name: "Office",
    address: "Bandra Kurla Complex, Mumbai, India",
    coordinates: { lat: 19.0596, lng: 72.8656 },
    aqi: 98,
    status: "Moderate",
    isFavorite: true,
    lastUpdated: "5 minutes ago",
    alerts: false,
    category: "commercial",
    pm25: 58,
    pm10: 85,
    temp: 32,
    humidity: 78,
    wind: 8,
    trend: "down",
    forecast24h: 92,
    accuracy: 89,
  },
  {
    id: 3,
    name: "Gym",
    address: "Koramangala, Bangalore, India",
    coordinates: { lat: 12.9279, lng: 77.6271 },
    aqi: 75,
    status: "Moderate",
    isFavorite: false,
    lastUpdated: "10 minutes ago",
    alerts: true,
    category: "fitness",
    pm25: 45,
    pm10: 68,
    temp: 26,
    humidity: 58,
    wind: 15,
    trend: "stable",
    forecast24h: 78,
    accuracy: 94,
  },
  {
    id: 4,
    name: "School",
    address: "Anna Nagar, Chennai, India",
    coordinates: { lat: 13.0843, lng: 80.2705 },
    aqi: 112,
    status: "Unhealthy for Sensitive Groups",
    isFavorite: true,
    lastUpdated: "15 minutes ago",
    alerts: true,
    category: "education",
    pm25: 65,
    pm10: 95,
    temp: 34,
    humidity: 82,
    wind: 6,
    trend: "up",
    forecast24h: 118,
    accuracy: 91,
  },
  {
    id: 5,
    name: "Park",
    address: "Lodhi Gardens, New Delhi, India",
    coordinates: { lat: 28.5918, lng: 77.2273 },
    aqi: 89,
    status: "Moderate",
    isFavorite: false,
    lastUpdated: "20 minutes ago",
    alerts: false,
    category: "recreation",
    pm25: 52,
    pm10: 75,
    temp: 29,
    humidity: 62,
    wind: 14,
    trend: "down",
    forecast24h: 85,
    accuracy: 88,
  },
]

const mockRecentLocations = [
  { name: "India Gate", address: "New Delhi, India", timestamp: "1 hour ago", aqi: 152, category: "monument" },
  { name: "Marine Drive", address: "Mumbai, India", timestamp: "3 hours ago", aqi: 108, category: "recreation" },
  { name: "Cubbon Park", address: "Bangalore, India", timestamp: "1 day ago", aqi: 71, category: "recreation" },
  { name: "Charminar", address: "Hyderabad, India", timestamp: "2 days ago", aqi: 134, category: "monument" },
]

function getAQIColor(aqi: number) {
  if (aqi <= 50) return "bg-green-500"
  if (aqi <= 100) return "bg-yellow-500"
  if (aqi <= 150) return "bg-orange-500"
  if (aqi <= 200) return "bg-red-500"
  if (aqi <= 300) return "bg-purple-500"
  return "bg-red-800"
}

function getAQITextColor(aqi: number) {
  if (aqi <= 50) return "text-green-400"
  if (aqi <= 100) return "text-yellow-400"
  if (aqi <= 150) return "text-orange-400"
  if (aqi <= 200) return "text-red-400"
  if (aqi <= 300) return "text-purple-400"
  return "text-red-400"
}

const getTrendIcon = (trend: string) => {
  switch (trend) {
    case "up":
      return <TrendingUp className="h-3 w-3 text-red-400" />
    case "down":
      return <TrendingDown className="h-3 w-3 text-green-400" />
    default:
      return <Minus className="h-3 w-3 text-gray-400" />
  }
}

const getCategoryIcon = (category: string) => {
  switch (category) {
    case "residential":
      return "🏠"
    case "commercial":
      return "🏢"
    case "fitness":
      return "💪"
    case "education":
      return "🎓"
    case "recreation":
      return "🌳"
    case "monument":
      return "🏛️"
    default:
      return "📍"
  }
}

export default function LocationsPage() {
  const [locations, setLocations] = useState(mockLocations)
  const [recentLocations] = useState(mockRecentLocations)
  const [searchQuery, setSearchQuery] = useState("")
  const [isAddingLocation, setIsAddingLocation] = useState(false)
  const [selectedLocation, setSelectedLocation] = useState<any>(null)
  const [gpsAccuracy, setGpsAccuracy] = useState<number | null>(null)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [aqiFilter, setAqiFilter] = useState([0, 300])
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false)
  const [mapView, setMapView] = useState("pins")
  const [showHeatmapLayers, setShowHeatmapLayers] = useState(true)
  const [newLocation, setNewLocation] = useState({
    name: "",
    address: "",
    coordinates: { lat: "", lng: "" },
    alerts: true,
    category: "residential",
  })

  const detectCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude, accuracy } = position.coords
          setNewLocation((prev) => ({
            ...prev,
            coordinates: { lat: latitude.toString(), lng: longitude.toString() },
          }))
          setGpsAccuracy(accuracy)
          // Mock reverse geocoding
          setNewLocation((prev) => ({
            ...prev,
            address: `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`,
          }))
        },
        (error) => {
          console.error("GPS Error:", error)
        },
        { enableHighAccuracy: true },
      )
    }
  }

  const toggleFavorite = (id: number) => {
    setLocations((prev) => prev.map((loc) => (loc.id === id ? { ...loc, isFavorite: !loc.isFavorite } : loc)))
  }

  const deleteLocation = (id: number) => {
    setLocations((prev) => prev.filter((loc) => loc.id !== id))
  }

  const saveLocation = () => {
    const newLoc = {
      id: Date.now(),
      name: newLocation.name || "Unnamed Location",
      address: newLocation.address,
      coordinates: {
        lat: Number.parseFloat(newLocation.coordinates.lat),
        lng: Number.parseFloat(newLocation.coordinates.lng),
      },
      aqi: Math.floor(Math.random() * 200) + 1,
      status: "Good",
      isFavorite: false,
      lastUpdated: "Just now",
      alerts: newLocation.alerts,
      category: newLocation.category,
      pm25: Math.floor(Math.random() * 100) + 20,
      pm10: Math.floor(Math.random() * 150) + 30,
      temp: Math.floor(Math.random() * 20) + 20,
      humidity: Math.floor(Math.random() * 40) + 40,
      wind: Math.floor(Math.random() * 20) + 5,
      trend: ["up", "down", "stable"][Math.floor(Math.random() * 3)],
      forecast24h: Math.floor(Math.random() * 200) + 1,
      accuracy: Math.floor(Math.random() * 20) + 80,
    }
    setLocations((prev) => [...prev, newLoc])
    setNewLocation({ name: "", address: "", coordinates: { lat: "", lng: "" }, alerts: true, category: "residential" })
    setIsAddingLocation(false)
    setGpsAccuracy(null)
  }

  const handleRefresh = () => {
    setIsRefreshing(true)
    // Simulate data refresh
    setTimeout(() => {
      setLocations((prev) =>
        prev.map((loc) => ({
          ...loc,
          aqi: Math.max(20, loc.aqi + (Math.random() - 0.5) * 20),
          lastUpdated: "Just now",
        })),
      )
      setIsRefreshing(false)
    }, 2000)
  }

  const exportData = () => {
    const exportData = {
      metadata: {
        title: "My Air Quality Locations",
        exportedAt: new Date().toISOString(),
        totalLocations: locations.length,
        favoriteLocations: locations.filter((loc) => loc.isFavorite).length,
      },
      locations: locations,
      recentLocations: recentLocations,
      statistics: {
        averageAQI: Math.round(locations.reduce((sum, loc) => sum + loc.aqi, 0) / locations.length || 0),
        worstLocation: locations.reduce((max, loc) => (loc.aqi > max.aqi ? loc : max)),
        bestLocation: locations.reduce((min, loc) => (loc.aqi < min.aqi ? loc : min)),
        categoryDistribution: locations.reduce(
          (acc, loc) => {
            acc[loc.category] = (acc[loc.category] || 0) + 1
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
    a.download = `my-locations-${new Date().toISOString().split("T")[0]}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  const filteredLocations = locations.filter(
    (location) =>
      (location.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        location.address.toLowerCase().includes(searchQuery.toLowerCase())) &&
      location.aqi >= aqiFilter[0] &&
      location.aqi <= aqiFilter[1] &&
      (categoryFilter === "all" || location.category === categoryFilter) &&
      (!showFavoritesOnly || location.isFavorite),
  )

  return (
    <DashboardLayout>
      <div className="space-y-8 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-700 min-h-screen p-6">
        {/* Enhanced header with better statistics and controls */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white flex items-center gap-2">
              <MapPin className="h-8 w-8 text-blue-400" />
              My Air Quality Locations
            </h1>
            <p className="text-slate-300 mt-1">
              Manage your saved locations and monitor air quality across {locations.length} tracked places
            </p>
          </div>
          <div className="flex gap-2">
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
            <Button
              variant="outline"
              size="sm"
              className="border-slate-600 text-slate-200 hover:bg-slate-700 bg-transparent"
            >
              <Upload className="h-4 w-4 mr-2" />
              Import
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={exportData}
              className="border-slate-600 text-slate-200 hover:bg-slate-700 bg-transparent"
            >
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Dialog open={isAddingLocation} onOpenChange={setIsAddingLocation}>
              <DialogTrigger asChild>
                <Button className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Location
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md bg-slate-800 border-slate-700">
                <DialogHeader>
                  <DialogTitle className="text-white">Add New Location</DialogTitle>
                  <DialogDescription className="text-slate-300">
                    Add a location to monitor air quality data with enhanced tracking
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="location-name" className="text-slate-200">
                      Location Name
                    </Label>
                    <Input
                      id="location-name"
                      placeholder="e.g., Home, Office, Gym"
                      value={newLocation.name}
                      onChange={(e) => setNewLocation((prev) => ({ ...prev, name: e.target.value }))}
                      className="bg-slate-700/50 border-slate-600 text-white"
                    />
                  </div>
                  <div>
                    <Label htmlFor="location-category" className="text-slate-200">
                      Category
                    </Label>
                    <Select
                      value={newLocation.category}
                      onValueChange={(value) => setNewLocation((prev) => ({ ...prev, category: value }))}
                    >
                      <SelectTrigger className="bg-slate-700/50 border-slate-600 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-800 border-slate-700">
                        <SelectItem value="residential">🏠 Residential</SelectItem>
                        <SelectItem value="commercial">🏢 Commercial</SelectItem>
                        <SelectItem value="fitness">💪 Fitness</SelectItem>
                        <SelectItem value="education">🎓 Education</SelectItem>
                        <SelectItem value="recreation">🌳 Recreation</SelectItem>
                        <SelectItem value="monument">🏛️ Monument</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="location-address" className="text-slate-200">
                      Address
                    </Label>
                    <div className="flex gap-2">
                      <Input
                        id="location-address"
                        placeholder="Enter address or coordinates"
                        value={newLocation.address}
                        onChange={(e) => setNewLocation((prev) => ({ ...prev, address: e.target.value }))}
                        className="bg-slate-700/50 border-slate-600 text-white"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={detectCurrentLocation}
                        title="Use current location"
                        className="border-slate-600 text-slate-200 hover:bg-slate-700 bg-transparent"
                      >
                        <Navigation className="h-4 w-4" />
                      </Button>
                    </div>
                    {gpsAccuracy && (
                      <p className="text-sm text-green-400 mt-1 flex items-center">
                        <Target className="h-3 w-3 mr-1" />
                        GPS accuracy: ±{Math.round(gpsAccuracy)}m
                      </p>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <Label htmlFor="latitude" className="text-slate-200">
                        Latitude
                      </Label>
                      <Input
                        id="latitude"
                        placeholder="28.6139"
                        value={newLocation.coordinates.lat}
                        onChange={(e) =>
                          setNewLocation((prev) => ({
                            ...prev,
                            coordinates: { ...prev.coordinates, lat: e.target.value },
                          }))
                        }
                        className="bg-slate-700/50 border-slate-600 text-white"
                      />
                    </div>
                    <div>
                      <Label htmlFor="longitude" className="text-slate-200">
                        Longitude
                      </Label>
                      <Input
                        id="longitude"
                        placeholder="77.2090"
                        value={newLocation.coordinates.lng}
                        onChange={(e) =>
                          setNewLocation((prev) => ({
                            ...prev,
                            coordinates: { ...prev.coordinates, lng: e.target.value },
                          }))
                        }
                        className="bg-slate-700/50 border-slate-600 text-white"
                      />
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="alerts" className="text-slate-200">
                      Enable Alerts
                    </Label>
                    <Switch
                      id="alerts"
                      checked={newLocation.alerts}
                      onCheckedChange={(checked) => setNewLocation((prev) => ({ ...prev, alerts: checked }))}
                    />
                  </div>
                  <div className="flex gap-2 pt-4">
                    <Button
                      variant="outline"
                      onClick={() => setIsAddingLocation(false)}
                      className="flex-1 border-slate-600 text-slate-200 hover:bg-slate-700"
                    >
                      Cancel
                    </Button>
                    <Button onClick={saveLocation} className="flex-1 bg-blue-600 hover:bg-blue-700">
                      Save Location
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Enhanced Filters Card */}
        <Card className="bg-slate-800/60 backdrop-blur-md border border-slate-700/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <Filter className="h-5 w-5 text-purple-400" />
              Advanced Filters & Search
            </CardTitle>
            <CardDescription className="text-slate-300">
              Filter and search through your {locations.length} saved locations
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                <Input
                  placeholder="Search locations..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-slate-700/50 border-slate-600 text-white"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-slate-200 text-sm">Category</Label>
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger className="bg-slate-700/50 border-slate-600 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-slate-700">
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="residential">🏠 Residential</SelectItem>
                    <SelectItem value="commercial">🏢 Commercial</SelectItem>
                    <SelectItem value="fitness">💪 Fitness</SelectItem>
                    <SelectItem value="education">🎓 Education</SelectItem>
                    <SelectItem value="recreation">🌳 Recreation</SelectItem>
                    <SelectItem value="monument">🏛️ Monument</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-slate-200 text-sm">AQI Range</Label>
                <Slider value={aqiFilter} onValueChange={setAqiFilter} max={300} step={10} className="w-full" />
                <div className="flex justify-between text-xs text-slate-400">
                  <span>{aqiFilter[0]}</span>
                  <span>{aqiFilter[1]}</span>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-slate-200 text-sm">Quick Filters</Label>
                <div className="flex items-center space-x-2">
                  <Switch checked={showFavoritesOnly} onCheckedChange={setShowFavoritesOnly} id="favorites-only" />
                  <Label htmlFor="favorites-only" className="text-slate-300 text-sm">
                    Favorites Only
                  </Label>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4 pt-2 border-t border-slate-700">
              <Badge className="bg-blue-600 text-white">{filteredLocations.length} locations shown</Badge>
              <Badge variant="outline" className="border-slate-500 text-slate-300">
                {locations.filter((loc) => loc.isFavorite).length} favorites
              </Badge>
              <Badge variant="outline" className="border-slate-500 text-slate-300">
                Avg AQI:{" "}
                {Math.round(filteredLocations.reduce((sum, loc) => sum + loc.aqi, 0) / filteredLocations.length || 0)}
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-slate-800/40">
            <TabsTrigger
              value="all"
              className="data-[state=active]:bg-slate-700/80 data-[state=active]:text-white text-slate-300"
            >
              All Locations
            </TabsTrigger>
            <TabsTrigger
              value="favorites"
              className="data-[state=active]:bg-slate-700/80 data-[state=active]:text-white text-slate-300"
            >
              Favorites
            </TabsTrigger>
            <TabsTrigger
              value="recent"
              className="data-[state=active]:bg-slate-700/80 data-[state=active]:text-white text-slate-300"
            >
              Recent
            </TabsTrigger>
            <TabsTrigger
              value="map"
              className="data-[state=active]:bg-slate-700/80 data-[state=active]:text-white text-slate-300"
            >
              Map View
            </TabsTrigger>
          </TabsList>

          {/* Enhanced All Locations Tab */}
          <TabsContent value="all" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredLocations.map((location) => (
                <Card
                  key={location.id}
                  className="hover:shadow-md transition-shadow cursor-pointer bg-slate-800/60 backdrop-blur-md border border-slate-700/50"
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center space-x-2">
                        <span className="text-lg">{getCategoryIcon(location.category)}</span>
                        <div>
                          <h3 className="font-semibold text-white">{location.name}</h3>
                          <Badge variant="outline" className="text-xs border-slate-500 text-slate-400 mt-1">
                            {location.category}
                          </Badge>
                        </div>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleFavorite(location.id)}
                          className="h-8 w-8 p-0"
                        >
                          {location.isFavorite ? (
                            <Star className="h-4 w-4 text-yellow-500 fill-current" />
                          ) : (
                            <StarOff className="h-4 w-4 text-slate-400" />
                          )}
                        </Button>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <Edit className="h-4 w-4 text-slate-400" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="bg-slate-800 border-slate-700">
                            <DialogHeader>
                              <DialogTitle className="text-white">Location Details - {location.name}</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4">
                              <div>
                                <h4 className="font-medium mb-2 text-white">Air Quality Metrics</h4>
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                  <div className="space-y-2">
                                    <div className="flex justify-between">
                                      <span className="text-slate-400">Current AQI:</span>
                                      <span className={getAQITextColor(location.aqi)}>{location.aqi}</span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span className="text-slate-400">PM2.5:</span>
                                      <span className="text-slate-200">{location.pm25} μg/m³</span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span className="text-slate-400">PM10:</span>
                                      <span className="text-slate-200">{location.pm10} μg/m³</span>
                                    </div>
                                  </div>
                                  <div className="space-y-2">
                                    <div className="flex justify-between">
                                      <span className="text-slate-400">Temperature:</span>
                                      <span className="text-slate-200">{location.temp}°C</span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span className="text-slate-400">Humidity:</span>
                                      <span className="text-slate-200">{location.humidity}%</span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span className="text-slate-400">Wind:</span>
                                      <span className="text-slate-200">{location.wind} km/h</span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                  <span className="text-slate-400">24h Forecast:</span>
                                  <span className={getAQITextColor(location.forecast24h)}> {location.forecast24h}</span>
                                </div>
                                <div>
                                  <span className="text-slate-400">Accuracy:</span>
                                  <span className="text-green-400"> {location.accuracy}%</span>
                                </div>
                              </div>
                              <div>
                                <h4 className="font-medium mb-2 text-white">Location Info</h4>
                                <p className="text-sm text-slate-300">{location.address}</p>
                                <p className="text-xs text-slate-400 mt-1">
                                  {location.coordinates.lat.toFixed(4)}, {location.coordinates.lng.toFixed(4)}
                                </p>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </div>

                    <p className="text-sm text-slate-400 mb-3 truncate">{location.address}</p>

                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-2">
                        <div className={`w-3 h-3 rounded-full ${getAQIColor(location.aqi)}`} />
                        <span className={`text-2xl font-bold ${getAQITextColor(location.aqi)}`}>{location.aqi}</span>
                        {getTrendIcon(location.trend)}
                      </div>
                      <Badge variant="outline" className={`text-xs ${getAQITextColor(location.aqi)} border-current`}>
                        {location.status}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-3 gap-2 text-xs text-slate-400 mb-3">
                      <div>
                        <span className="block">PM2.5</span>
                        <span className="text-white font-medium">{location.pm25}</span>
                      </div>
                      <div>
                        <span className="block">Temp</span>
                        <span className="text-white font-medium">{location.temp}°C</span>
                      </div>
                      <div>
                        <span className="block">Accuracy</span>
                        <span className="text-green-400 font-medium">{location.accuracy}%</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-500">Updated {location.lastUpdated}</span>
                      {location.alerts && (
                        <Badge className="bg-orange-600/20 text-orange-400 border-orange-600/30">Alerts On</Badge>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Favorites Tab */}
          <TabsContent value="favorites" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {locations
                .filter((loc) => loc.isFavorite)
                .map((location) => (
                  <Card
                    key={location.id}
                    className="hover:shadow-md transition-shadow cursor-pointer bg-slate-800/60 backdrop-blur-md border border-slate-700/50"
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center space-x-2">
                          <span className="text-lg">{getCategoryIcon(location.category)}</span>
                          <div>
                            <h3 className="font-semibold text-white flex items-center gap-1">
                              {location.name}
                              <Star className="h-4 w-4 text-yellow-500 fill-current" />
                            </h3>
                            <Badge variant="outline" className="text-xs border-slate-500 text-slate-400 mt-1">
                              {location.category}
                            </Badge>
                          </div>
                        </div>
                      </div>

                      <p className="text-sm text-slate-400 mb-3 truncate">{location.address}</p>

                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-2">
                          <div className={`w-3 h-3 rounded-full ${getAQIColor(location.aqi)}`} />
                          <span className={`text-2xl font-bold ${getAQITextColor(location.aqi)}`}>{location.aqi}</span>
                          {getTrendIcon(location.trend)}
                        </div>
                        <Badge variant="outline" className={`text-xs ${getAQITextColor(location.aqi)} border-current`}>
                          {location.status}
                        </Badge>
                      </div>

                      <div className="grid grid-cols-3 gap-2 text-xs text-slate-400 mb-3">
                        <div>
                          <span className="block">PM2.5</span>
                          <span className="text-white font-medium">{location.pm25}</span>
                        </div>
                        <div>
                          <span className="block">Temp</span>
                          <span className="text-white font-medium">{location.temp}°C</span>
                        </div>
                        <div>
                          <span className="block">Accuracy</span>
                          <span className="text-green-400 font-medium">{location.accuracy}%</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-500">Updated {location.lastUpdated}</span>
                        {location.alerts && (
                          <Badge className="bg-orange-600/20 text-orange-400 border-orange-600/30">Alerts On</Badge>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </div>
            {locations.filter((loc) => loc.isFavorite).length === 0 && (
              <Card className="bg-slate-800/60 backdrop-blur-md border border-slate-700/50">
                <CardContent className="p-8 text-center">
                  <Star className="h-12 w-12 text-slate-600 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-white mb-2">No Favorite Locations</h3>
                  <p className="text-slate-400 mb-4">Mark locations as favorites to see them here</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Recent Locations Tab */}
          <TabsContent value="recent" className="space-y-4">
            <Card className="bg-slate-800/60 backdrop-blur-md border border-slate-700/50">
              <CardHeader>
                <CardTitle className="text-white">Recently Visited</CardTitle>
                <CardDescription className="text-slate-300">Locations you've checked recently</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recentLocations.map((location, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 rounded-lg bg-slate-700/30 hover:bg-slate-700/50 transition-colors"
                    >
                      <div className="flex items-center space-x-3">
                        <span className="text-lg">{getCategoryIcon(location.category)}</span>
                        <div>
                          <h4 className="font-medium text-white">{location.name}</h4>
                          <p className="text-sm text-slate-400">{location.address}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="text-right">
                          <div className={`text-lg font-bold ${getAQITextColor(location.aqi)}`}>{location.aqi}</div>
                          <div className="text-xs text-slate-500">{location.timestamp}</div>
                        </div>
                        <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white">
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Enhanced Map View Tab */}
          <TabsContent value="map" className="space-y-4">
            <Card className="bg-slate-800/60 backdrop-blur-md border border-slate-700/50">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2 text-white">
                      <Map className="h-5 w-5 text-blue-400" />
                      Interactive Map View
                    </CardTitle>
                    <CardDescription className="text-slate-300">
                      Visualize all your locations on an interactive map with air quality heatmap
                    </CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Select value={mapView} onValueChange={setMapView}>
                      <SelectTrigger className="w-32 bg-slate-700/50 border-slate-600 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-800 border-slate-700">
                        <SelectItem value="pins">📍 Pins</SelectItem>
                        <SelectItem value="heatmap">🔥 Heatmap</SelectItem>
                        <SelectItem value="both">🗺️ Both</SelectItem>
                      </SelectContent>
                    </Select>
                    <div className="flex items-center space-x-2">
                      <Switch checked={showHeatmapLayers} onCheckedChange={setShowHeatmapLayers} id="heatmap-layers" />
                      <Label htmlFor="heatmap-layers" className="text-slate-300 text-sm">
                        <Layers className="h-4 w-4" />
                      </Label>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="bg-slate-900/50 rounded-lg p-8 text-center border border-slate-700/50">
                  <Globe className="h-16 w-16 text-slate-600 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-white mb-2">Interactive Map</h3>
                  <p className="text-slate-400 mb-4">
                    Map integration would display your {locations.length} locations with real-time air quality data
                  </p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                    {locations.slice(0, 4).map((location) => (
                      <div key={location.id} className="bg-slate-800/50 rounded-lg p-3 border border-slate-700/30">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm">{getCategoryIcon(location.category)}</span>
                          <div className={`w-2 h-2 rounded-full ${getAQIColor(location.aqi)}`} />
                        </div>
                        <h4 className="font-medium text-white text-sm">{location.name}</h4>
                        <p className={`text-lg font-bold ${getAQITextColor(location.aqi)}`}>{location.aqi}</p>
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-slate-500 mt-4">
                    Map features: Drag to compare, zoom controls, layer toggles, real-time updates
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
