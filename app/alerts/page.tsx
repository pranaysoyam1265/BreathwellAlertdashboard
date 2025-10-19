"use client"

import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Bell,
  BellRing,
  Heart,
  TrendingUp,
  MapPin,
  Calendar,
  Settings,
  Plus,
  X,
  Check,
  AlertTriangle,
  Info,
  AlertCircle,
  Zap,
  Clock,
  Mail,
  Smartphone,
  Volume2,
  VolumeX,
  Filter,
  Trash2,
  Eye,
  EyeOff,
} from "lucide-react"
import { useState } from "react"

export default function AlertsPage() {
  const [activeTab, setActiveTab] = useState("active")
  const [notifications, setNotifications] = useState({
    browser: true,
    email: false,
    sound: true,
  })
  const [thresholds, setThresholds] = useState({
    pm25: [35],
    pm10: [50],
    ozone: [70],
    no2: [40],
  })
  const [quietHours, setQuietHours] = useState({ start: "22:00", end: "07:00" })
  const [selectedAlerts, setSelectedAlerts] = useState<string[]>([])

  const activeAlerts = [
    {
      id: "1",
      type: "critical",
      category: "health",
      title: "Unhealthy Air Quality Alert",
      message: "PM2.5 levels have reached 85 μg/m³ in Downtown. Sensitive individuals should avoid outdoor activities.",
      location: "Downtown",
      timestamp: "2 minutes ago",
      pollutant: "PM2.5",
      value: 85,
      isRead: false,
    },
    {
      id: "2",
      type: "warning",
      category: "spike",
      title: "Pollution Spike Detected",
      message: "Sudden increase in NO2 levels detected. Current reading: 65 μg/m³",
      location: "Industrial District",
      timestamp: "15 minutes ago",
      pollutant: "NO2",
      value: 65,
      isRead: false,
    },
    {
      id: "3",
      type: "info",
      category: "forecast",
      title: "Tomorrow's Air Quality Forecast",
      message: "Moderate air quality expected tomorrow morning. Good conditions by afternoon.",
      location: "City Center",
      timestamp: "1 hour ago",
      pollutant: "AQI",
      value: 75,
      isRead: true,
    },
  ]

  const alertHistory = [
    {
      id: "h1",
      type: "danger",
      category: "health",
      title: "Very Unhealthy Air Quality",
      message: "PM2.5 reached hazardous levels. All outdoor activities should be avoided.",
      location: "East Side",
      timestamp: "Yesterday, 3:45 PM",
      isRead: true,
    },
    {
      id: "h2",
      type: "warning",
      category: "location",
      title: "Location Alert: Home",
      message: "Air quality at your home location has deteriorated to unhealthy levels.",
      location: "Home",
      timestamp: "2 days ago, 8:30 AM",
      isRead: true,
    },
  ]

  const getSeverityIcon = (type: string) => {
    switch (type) {
      case "critical":
        return <AlertCircle className="h-4 w-4" />
      case "danger":
        return <AlertTriangle className="h-4 w-4" />
      case "warning":
        return <AlertTriangle className="h-4 w-4" />
      case "info":
        return <Info className="h-4 w-4" />
      default:
        return <Bell className="h-4 w-4" />
    }
  }

  const getSeverityColor = (type: string) => {
    switch (type) {
      case "critical":
        return "bg-red-600 text-white"
      case "danger":
        return "bg-red-500 text-white"
      case "warning":
        return "bg-orange-500 text-white"
      case "info":
        return "bg-blue-500 text-white"
      default:
        return "bg-gray-500 text-white"
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "health":
        return <Heart className="h-4 w-4" />
      case "spike":
        return <TrendingUp className="h-4 w-4" />
      case "forecast":
        return <Calendar className="h-4 w-4" />
      case "location":
        return <MapPin className="h-4 w-4" />
      default:
        return <Bell className="h-4 w-4" />
    }
  }

  const markAsRead = (alertId: string) => {
    // Implementation for marking alerts as read
    console.log("Marking alert as read:", alertId)
  }

  const dismissAlert = (alertId: string) => {
    // Implementation for dismissing alerts
    console.log("Dismissing alert:", alertId)
  }

  const toggleAlertSelection = (alertId: string) => {
    setSelectedAlerts((prev) => (prev.includes(alertId) ? prev.filter((id) => id !== alertId) : [...prev, alertId]))
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Alerts & Notifications</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Manage your air quality alerts and notification preferences
            </p>
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Plus className="h-4 w-4 mr-2" />
                Create Alert
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Create Custom Alert</DialogTitle>
                <DialogDescription>Set up a custom alert with specific conditions and thresholds</DialogDescription>
              </DialogHeader>
              <div className="space-y-6 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Alert Name</Label>
                    <Input placeholder="Enter alert name" />
                  </div>
                  <div className="space-y-2">
                    <Label>Category</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="health">Health Alert</SelectItem>
                        <SelectItem value="spike">Pollution Spike</SelectItem>
                        <SelectItem value="forecast">Forecast Alert</SelectItem>
                        <SelectItem value="location">Location Alert</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Pollutant</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select pollutant" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pm25">PM2.5</SelectItem>
                      <SelectItem value="pm10">PM10</SelectItem>
                      <SelectItem value="ozone">Ozone</SelectItem>
                      <SelectItem value="no2">NO2</SelectItem>
                      <SelectItem value="aqi">Overall AQI</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Threshold (μg/m³)</Label>
                  <Slider
                    value={[50]}
                    onValueChange={(value) => console.log(value)}
                    max={200}
                    step={5}
                    className="w-full"
                  />
                  <div className="flex justify-between text-sm text-gray-500">
                    <span>0</span>
                    <span>50 μg/m³</span>
                    <span>200</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Message</Label>
                  <Textarea placeholder="Enter custom alert message" />
                </div>
                <div className="flex justify-end space-x-2">
                  <Button variant="outline">Cancel</Button>
                  <Button className="bg-blue-600 hover:bg-blue-700">Create Alert</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Alert Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Active Alerts</p>
                  <p className="text-2xl font-bold text-red-600">3</p>
                </div>
                <div className="p-3 bg-red-100 dark:bg-red-900/20 rounded-full">
                  <BellRing className="h-6 w-6 text-red-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">This Week</p>
                  <p className="text-2xl font-bold text-orange-600">12</p>
                </div>
                <div className="p-3 bg-orange-100 dark:bg-orange-900/20 rounded-full">
                  <Calendar className="h-6 w-6 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Health Alerts</p>
                  <p className="text-2xl font-bold text-pink-600">5</p>
                </div>
                <div className="p-3 bg-pink-100 dark:bg-pink-900/20 rounded-full">
                  <Heart className="h-6 w-6 text-pink-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Locations</p>
                  <p className="text-2xl font-bold text-blue-600">8</p>
                </div>
                <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-full">
                  <MapPin className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="active">Active Alerts</TabsTrigger>
            <TabsTrigger value="history">Alert History</TabsTrigger>
            <TabsTrigger value="settings">Preferences</TabsTrigger>
          </TabsList>

          {/* Active Alerts Tab */}
          <TabsContent value="active" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center space-x-2">
                      <BellRing className="h-5 w-5 text-red-600" />
                      <span>Active Alerts</span>
                    </CardTitle>
                    <CardDescription>Current air quality alerts requiring attention</CardDescription>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm">
                      <Filter className="h-4 w-4 mr-2" />
                      Filter
                    </Button>
                    {selectedAlerts.length > 0 && (
                      <Button variant="outline" size="sm">
                        <Check className="h-4 w-4 mr-2" />
                        Mark Read ({selectedAlerts.length})
                      </Button>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {activeAlerts.map((alert) => (
                    <div
                      key={alert.id}
                      className={`p-4 rounded-lg border transition-all hover:shadow-md ${
                        alert.isRead ? "bg-gray-50 dark:bg-gray-800/50" : "bg-white dark:bg-gray-800"
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-3 flex-1">
                          <input
                            type="checkbox"
                            checked={selectedAlerts.includes(alert.id)}
                            onChange={() => toggleAlertSelection(alert.id)}
                            className="mt-1"
                          />
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-2">
                              <Badge className={getSeverityColor(alert.type)}>
                                {getSeverityIcon(alert.type)}
                                <span className="ml-1 capitalize">{alert.type}</span>
                              </Badge>
                              <Badge variant="outline" className="text-xs">
                                {getCategoryIcon(alert.category)}
                                <span className="ml-1 capitalize">{alert.category}</span>
                              </Badge>
                              {!alert.isRead && <Badge className="bg-blue-600 text-white text-xs">New</Badge>}
                            </div>
                            <h4 className="font-semibold text-gray-900 dark:text-white mb-1">{alert.title}</h4>
                            <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">{alert.message}</p>
                            <div className="flex items-center space-x-4 text-xs text-gray-500">
                              <span className="flex items-center">
                                <MapPin className="h-3 w-3 mr-1" />
                                {alert.location}
                              </span>
                              <span className="flex items-center">
                                <Clock className="h-3 w-3 mr-1" />
                                {alert.timestamp}
                              </span>
                              <span className="flex items-center">
                                <Zap className="h-3 w-3 mr-1" />
                                {alert.pollutant}: {alert.value} μg/m³
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button variant="ghost" size="sm" onClick={() => markAsRead(alert.id)}>
                            {alert.isRead ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => dismissAlert(alert.id)}>
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Alert History Tab */}
          <TabsContent value="history" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Clock className="h-5 w-5 text-gray-600" />
                  <span>Alert History</span>
                </CardTitle>
                <CardDescription>Previous alerts and notifications timeline</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {alertHistory.map((alert) => (
                    <div
                      key={alert.id}
                      className="flex items-start space-x-4 p-4 rounded-lg bg-gray-50 dark:bg-gray-800/50"
                    >
                      <div className={`p-2 rounded-full ${getSeverityColor(alert.type)}`}>
                        {getSeverityIcon(alert.type)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <h4 className="font-medium text-gray-900 dark:text-white">{alert.title}</h4>
                          <Badge variant="outline" className="text-xs">
                            {getCategoryIcon(alert.category)}
                            <span className="ml-1 capitalize">{alert.category}</span>
                          </Badge>
                        </div>
                        <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">{alert.message}</p>
                        <div className="flex items-center space-x-4 text-xs text-gray-500">
                          <span className="flex items-center">
                            <MapPin className="h-3 w-3 mr-1" />
                            {alert.location}
                          </span>
                          <span className="flex items-center">
                            <Clock className="h-3 w-3 mr-1" />
                            {alert.timestamp}
                          </span>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Preferences Tab */}
          <TabsContent value="settings" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Notification Preferences */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Settings className="h-5 w-5 text-blue-600" />
                    <span>Notification Preferences</span>
                  </CardTitle>
                  <CardDescription>Configure how you receive alerts</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Smartphone className="h-5 w-5 text-blue-600" />
                      <div>
                        <p className="font-medium">Browser Notifications</p>
                        <p className="text-sm text-gray-500">Receive alerts in your browser</p>
                      </div>
                    </div>
                    <Switch
                      checked={notifications.browser}
                      onCheckedChange={(checked) => setNotifications((prev) => ({ ...prev, browser: checked }))}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Mail className="h-5 w-5 text-green-600" />
                      <div>
                        <p className="font-medium">Email Notifications</p>
                        <p className="text-sm text-gray-500">Get alerts via email</p>
                      </div>
                    </div>
                    <Switch
                      checked={notifications.email}
                      onCheckedChange={(checked) => setNotifications((prev) => ({ ...prev, email: checked }))}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      {notifications.sound ? (
                        <Volume2 className="h-5 w-5 text-orange-600" />
                      ) : (
                        <VolumeX className="h-5 w-5 text-gray-400" />
                      )}
                      <div>
                        <p className="font-medium">Sound Alerts</p>
                        <p className="text-sm text-gray-500">Play sound for critical alerts</p>
                      </div>
                    </div>
                    <Switch
                      checked={notifications.sound}
                      onCheckedChange={(checked) => setNotifications((prev) => ({ ...prev, sound: checked }))}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Alert Thresholds */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <AlertTriangle className="h-5 w-5 text-orange-600" />
                    <span>Alert Thresholds</span>
                  </CardTitle>
                  <CardDescription>Set custom thresholds for different pollutants</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <Label>PM2.5 Threshold</Label>
                        <span className="text-sm font-medium">{thresholds.pm25[0]} μg/m³</span>
                      </div>
                      <Slider
                        value={thresholds.pm25}
                        onValueChange={(value) => setThresholds((prev) => ({ ...prev, pm25: value }))}
                        max={100}
                        step={5}
                        className="w-full"
                      />
                    </div>
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <Label>PM10 Threshold</Label>
                        <span className="text-sm font-medium">{thresholds.pm10[0]} μg/m³</span>
                      </div>
                      <Slider
                        value={thresholds.pm10}
                        onValueChange={(value) => setThresholds((prev) => ({ ...prev, pm10: value }))}
                        max={150}
                        step={5}
                        className="w-full"
                      />
                    </div>
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <Label>Ozone Threshold</Label>
                        <span className="text-sm font-medium">{thresholds.ozone[0]} μg/m³</span>
                      </div>
                      <Slider
                        value={thresholds.ozone}
                        onValueChange={(value) => setThresholds((prev) => ({ ...prev, ozone: value }))}
                        max={200}
                        step={5}
                        className="w-full"
                      />
                    </div>
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <Label>NO2 Threshold</Label>
                        <span className="text-sm font-medium">{thresholds.no2[0]} μg/m³</span>
                      </div>
                      <Slider
                        value={thresholds.no2}
                        onValueChange={(value) => setThresholds((prev) => ({ ...prev, no2: value }))}
                        max={100}
                        step={5}
                        className="w-full"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Quiet Hours */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Clock className="h-5 w-5 text-purple-600" />
                    <span>Quiet Hours</span>
                  </CardTitle>
                  <CardDescription>Set times when alerts should be silenced</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Start Time</Label>
                      <Input
                        type="time"
                        value={quietHours.start}
                        onChange={(e) => setQuietHours((prev) => ({ ...prev, start: e.target.value }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>End Time</Label>
                      <Input
                        type="time"
                        value={quietHours.end}
                        onChange={(e) => setQuietHours((prev) => ({ ...prev, end: e.target.value }))}
                      />
                    </div>
                  </div>
                  <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <p className="text-sm text-blue-700 dark:text-blue-300">
                      Only critical health alerts will be shown during quiet hours
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Alert Categories */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Bell className="h-5 w-5 text-green-600" />
                    <span>Alert Categories</span>
                  </CardTitle>
                  <CardDescription>Enable or disable specific alert types</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Heart className="h-5 w-5 text-pink-600" />
                      <div>
                        <p className="font-medium">Health Alerts</p>
                        <p className="text-sm text-gray-500">Alerts for sensitive individuals</p>
                      </div>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <TrendingUp className="h-5 w-5 text-red-600" />
                      <div>
                        <p className="font-medium">Pollution Spikes</p>
                        <p className="text-sm text-gray-500">Sudden air quality changes</p>
                      </div>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Calendar className="h-5 w-5 text-blue-600" />
                      <div>
                        <p className="font-medium">Forecast Alerts</p>
                        <p className="text-sm text-gray-500">Upcoming air quality predictions</p>
                      </div>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <MapPin className="h-5 w-5 text-green-600" />
                      <div>
                        <p className="font-medium">Location Alerts</p>
                        <p className="text-sm text-gray-500">Alerts for saved locations</p>
                      </div>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
