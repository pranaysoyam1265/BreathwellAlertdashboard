"use client"

import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Checkbox } from "@/components/ui/checkbox"
import { Slider } from "@/components/ui/slider"
import { Progress } from "@/components/ui/progress"
import {
  User,
  Settings,
  Shield,
  Heart,
  Camera,
  Lock,
  Smartphone,
  Download,
  Trash2,
  Eye,
  EyeOff,
  Plus,
  X,
  Bell,
  MapPin,
  Palette,
  Clock,
  Globe,
  Moon,
  Sun,
  Monitor,
  Upload,
  Check,
  AlertTriangle,
  Loader2,
  Save,
  RotateCcw,
} from "lucide-react"
import { useState, useEffect, useRef } from "react"
import { useSettings } from "@/hooks/useSettings"
import { toast } from "sonner"

export default function SettingsPage() {
  const {
    settings,
    loading,
    error,
    updateProfile,
    updateHealth,
    updateNotifications,
    updatePrivacy,
    updateDisplay,
    updateLocation,
    uploadProfilePicture,
    changePassword,
    exportData,
    deleteAccount,
    refreshSettings,
  } = useSettings()

  // Local state for form inputs
  const [activeTab, setActiveTab] = useState("profile")
  const [showPassword, setShowPassword] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
  
  // Profile state
  const [profile, setProfile] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    profilePicture: "",
  })
  
  // Health state
  const [health, setHealth] = useState({
    age: 25,
    activityLevel: "moderate",
    healthConditions: {
      asthma: false,
      copd: false,
      heartDisease: false,
      diabetes: false,
      pregnancy: false,
      elderly: false,
    },
    medications: "",
    emergencyContacts: [] as Array<{ name: string; phone: string; relation: string }>,
  })
  
  // Notifications state
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    sms: false,
    alerts: true,
    browser: true,
    sound: true,
    vibration: true,
    frequency: "immediate",
    quietHours: { start: "22:00", end: "07:00" },
  })
  
  // Privacy state
  const [privacy, setPrivacyState] = useState({
    locationTracking: true,
    analytics: false,
    dataSharing: false,
    autoRefresh: true,
    dataRetention: "1year",
    refreshInterval: 5,
  })
  
  // Display state
  const [display, setDisplay] = useState({
    theme: "dark",
    language: "english",
    temperatureUnit: "celsius",
    distanceUnit: "kilometers",
    dateFormat: "mdy",
  })
  
  // Location state
  const [location, setLocation] = useState({
    defaultLocation: {
      city: "New York",
      country: "USA",
      coordinates: { lat: 40.7128, lng: -74.0060 },
    },
    autoDetectLocation: true,
    gpsAccuracy: "high",
    saveLocationHistory: true,
    locationHistoryRetention: "30days",
  })

  // Password state
  const [password, setPassword] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })

  const fileInputRef = useRef<HTMLInputElement>(null)

  // Initialize form data when settings load
  useEffect(() => {
    if (settings) {
      setProfile({
        firstName: settings.profile.firstName,
        lastName: settings.profile.lastName,
        email: settings.profile.email,
        phone: settings.profile.phone,
        profilePicture: settings.profile.profilePicture || "",
      })
      
      setHealth({
        age: settings.health.age,
        activityLevel: settings.health.activityLevel,
        healthConditions: {
          asthma: settings.health.healthConditions?.asthma ?? false,
          copd: settings.health.healthConditions?.copd ?? false,
          heartDisease: settings.health.healthConditions?.heartDisease ?? false,
          diabetes: settings.health.healthConditions?.diabetes ?? false,
          pregnancy: settings.health.healthConditions?.pregnancy ?? false,
          elderly: settings.health.healthConditions?.elderly ?? false,
        },
        medications: settings.health.medications,
        emergencyContacts: settings.health.emergencyContacts,
      })
      
      setNotifications(settings.notifications)
      setPrivacyState(settings.privacy)
      setDisplay(settings.display)
      setLocation({
        ...settings.location,
        defaultLocation: {
          ...settings.location.defaultLocation,
          coordinates: settings.location.defaultLocation.coordinates || { lat: 40.7128, lng: -74.0060 }
        }
      })
    }
  }, [settings])

  // Track unsaved changes
  useEffect(() => {
    if (settings) {
      const hasChanges = 
        JSON.stringify(profile) !== JSON.stringify({
          firstName: settings.profile.firstName,
          lastName: settings.profile.lastName,
          email: settings.profile.email,
          phone: settings.profile.phone,
          profilePicture: settings.profile.profilePicture || "",
        }) ||
        JSON.stringify(health) !== JSON.stringify(settings.health) ||
        JSON.stringify(notifications) !== JSON.stringify(settings.notifications) ||
        JSON.stringify(privacy) !== JSON.stringify(settings.privacy) ||
        JSON.stringify(display) !== JSON.stringify(settings.display) ||
        JSON.stringify(location) !== JSON.stringify(settings.location)
      
      setHasUnsavedChanges(hasChanges)
    }
  }, [profile, health, notifications, privacy, display, location, settings])

  // Handle profile picture upload
  const handleProfilePictureUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    try {
      setIsSaving(true)
      const result = await uploadProfilePicture(file)
      setProfile(prev => ({ ...prev, profilePicture: result.url }))
      toast.success("Profile picture updated successfully")
    } catch (error) {
      toast.error("Failed to upload profile picture")
      console.error("Upload error:", error)
    } finally {
      setIsSaving(false)
    }
  }

  // Handle password change
  const handlePasswordChange = async () => {
    if (password.newPassword !== password.confirmPassword) {
      toast.error("Passwords don't match")
      return
    }

    try {
      setIsSaving(true)
      await changePassword(password.currentPassword, password.newPassword)
      setPassword({ currentPassword: "", newPassword: "", confirmPassword: "" })
      toast.success("Password changed successfully")
    } catch (error) {
      toast.error("Failed to change password")
      console.error("Password change error:", error)
    } finally {
      setIsSaving(false)
    }
  }

  // Handle data export
  const handleExportData = async () => {
    try {
      const blob = await exportData()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `breathewell-alert-data-${new Date().toISOString().split('T')[0]}.json`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
      toast.success("Data exported successfully")
    } catch (error) {
      toast.error("Failed to export data")
      console.error("Export error:", error)
    }
  }

  // Handle account deletion
  const handleDeleteAccount = async () => {
    if (confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
      try {
        await deleteAccount()
        toast.success("Account deleted successfully")
        // Redirect to home page or login page
        window.location.href = "/"
      } catch (error) {
        toast.error("Failed to delete account")
        console.error("Delete error:", error)
      }
    }
  }

  // Save settings for current tab
  const saveCurrentTab = async () => {
    try {
      setIsSaving(true)
      
      switch (activeTab) {
        case "profile":
          await updateProfile(profile)
          break
        case "health":
          await updateHealth(health)
          break
        case "notifications":
          await updateNotifications(notifications)
          break
        case "privacy":
          await updatePrivacy(privacy)
          break
        case "display":
          await updateDisplay(display)
          break
        case "location":
          await updateLocation(location)
          break
      }
      
      toast.success("Settings saved successfully")
      await refreshSettings() // Refresh to get latest data
    } catch (error) {
      toast.error("Failed to save settings")
      console.error("Save error:", error)
    } finally {
      setIsSaving(false)
    }
  }

  // Reset current tab to saved values
  const resetCurrentTab = () => {
    if (!settings) return

    switch (activeTab) {
      case "profile":
        setProfile({
          firstName: settings.profile.firstName,
          lastName: settings.profile.lastName,
          email: settings.profile.email,
          phone: settings.profile.phone,
          profilePicture: settings.profile.profilePicture || "",
        })
        break
      case "health":
        setHealth({
          age: settings.health.age,
          activityLevel: settings.health.activityLevel,
          healthConditions: {
            asthma: settings.health.healthConditions?.asthma ?? false,
            copd: settings.health.healthConditions?.copd ?? false,
            heartDisease: settings.health.healthConditions?.heartDisease ?? false,
            diabetes: settings.health.healthConditions?.diabetes ?? false,
            pregnancy: settings.health.healthConditions?.pregnancy ?? false,
            elderly: settings.health.healthConditions?.elderly ?? false,
          },
          medications: settings.health.medications,
          emergencyContacts: settings.health.emergencyContacts,
        })
        break
      case "notifications":
        setNotifications(settings.notifications)
        break
      case "privacy":
        setPrivacyState(settings.privacy)
        break
      case "display":
        setDisplay(settings.display)
        break
      case "location":
        setLocation({
          ...settings.location,
          defaultLocation: {
            ...settings.location.defaultLocation,
            coordinates: settings.location.defaultLocation.coordinates || { lat: 40.7128, lng: -74.0060 }
          }
        })
        break
    }
    
    toast.info("Changes reset")
  }

  // Helper functions
  const addEmergencyContact = () => {
    setHealth(prev => ({
      ...prev,
      emergencyContacts: [...prev.emergencyContacts, { name: "", phone: "", relation: "" }]
    }))
  }

  const removeEmergencyContact = (index: number) => {
    setHealth(prev => ({
      ...prev,
      emergencyContacts: prev.emergencyContacts.filter((_, i) => i !== index)
    }))
  }

  const handleHealthConditionChange = (condition: string, checked: boolean) => {
    setHealth(prev => ({
      ...prev,
      healthConditions: { ...prev.healthConditions, [condition]: checked }
    }))
  }

  // Calculate profile completion percentage
  const calculateProfileCompletion = () => {
    if (!settings) return 0
    
    let completed = 0
    const total = 6 // Number of profile fields
    
    if (settings.profile.firstName) completed++
    if (settings.profile.lastName) completed++
    if (settings.profile.email) completed++
    if (settings.profile.phone) completed++
    if (settings.profile.profilePicture) completed++
    if (settings.health.age > 0) completed++
    
    return Math.round((completed / total) * 100)
  }

  if (loading && !settings) {
    return (
      <DashboardLayout>
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 flex items-center justify-center">
          <div className="flex items-center space-x-3">
            <Loader2 className="h-8 w-8 text-blue-400 animate-spin" />
            <span className="text-white text-lg">Loading settings...</span>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  if (error && !settings) {
    return (
      <DashboardLayout>
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 flex items-center justify-center">
          <div className="text-center space-y-4">
            <AlertTriangle className="h-12 w-12 text-red-400 mx-auto" />
            <h2 className="text-white text-xl">Failed to load settings</h2>
            <p className="text-slate-400">{error}</p>
            <Button onClick={refreshSettings} className="bg-blue-600 hover:bg-blue-700">
              <RotateCcw className="h-4 w-4 mr-2" />
              Retry
            </Button>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900">
        <div className="space-y-8 py-8 w-[90%] mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-lg bg-slate-800/60 backdrop-blur-md border border-slate-700/50">
                <Settings className="h-6 w-6 text-blue-400" />
              </div>
              <h1 className="text-3xl font-bold text-white text-balance">Settings & Profile</h1>
            </div>
            
            {hasUnsavedChanges && (
              <Badge variant="outline" className="bg-yellow-500/20 text-yellow-400 border-yellow-500/50">
                Unsaved Changes
              </Badge>
            )}
          </div>

          {/* Two-column layout via Tabs root: left = nav, right = content */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="grid gap-6 grid-cols-1 lg:grid-cols-[0.3fr_0.7fr]">
            {/* Left Navigation Sidebar */}
            <TabsList className="flex flex-col h-full min-h-[70vh] w-full rounded-xl bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 p-2 gap-2">
              <TabsTrigger
                value="profile"
                className="w-full justify-start gap-3 rounded-md px-3 py-2 text-slate-300 data-[state=active]:bg-blue-600/80 data-[state=active]:text-white hover:bg-blue-500/5 transition-colors"
              >
                <User className="h-4 w-4" />
                <span>User Profile</span>
              </TabsTrigger>
              <TabsTrigger
                value="health"
                className="w-full justify-start gap-3 rounded-md px-3 py-2 text-slate-300 data-[state=active]:bg-emerald-600/80 data-[state=active]:text-white hover:bg-blue-500/10 transition-colors"
              >
                <Heart className="h-4 w-4" />
                <span>Health Profile</span>
              </TabsTrigger>
              <TabsTrigger
                value="notifications"
                className="w-full justify-start gap-3 rounded-md px-3 py-2 text-slate-300 data-[state=active]:bg-orange-600/80 data-[state=active]:text-white hover:bg-blue-500/10 transition-colors"
              >
                <Bell className="h-4 w-4" />
                <span>Notifications</span>
              </TabsTrigger>
              <TabsTrigger
                value="privacy"
                className="w-full justify-start gap-3 rounded-md px-3 py-2 text-slate-300 data-[state=active]:bg-sky-600/80 data-[state=active]:text-white hover:bg-blue-500/10 transition-colors"
              >
                <Shield className="h-4 w-4" />
                <span>Data & Privacy</span>
              </TabsTrigger>
              <TabsTrigger
                value="display"
                className="w-full justify-start gap-3 rounded-md px-3 py-2 text-slate-300 data-[state=active]:bg-pink-600/80 data-[state=active]:text-white hover:bg-blue-500/10 transition-colors"
              >
                <Palette className="h-4 w-4" />
                <span>Display</span>
              </TabsTrigger>
              <TabsTrigger
                value="location"
                className="w-full justify-start gap-3 rounded-md px-3 py-2 text-slate-300 data-[state=active]:bg-teal-600/80 data-[state=active]:text-white hover:bg-blue-500/10 transition-colors"
              >
                <MapPin className="h-4 w-4" />
                <span>Location</span>
              </TabsTrigger>
            </TabsList>

            {/* Right Content Column */}
            <div className="space-y-6">
              {/* User Profile */}
              <TabsContent value="profile" className="space-y-6 mt-0">
                <Card className="bg-slate-800/60 backdrop-blur-md border border-slate-700/50 hover:shadow-xl hover:shadow-blue-500/10">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <User className="h-5 w-5 text-blue-400" />
                      <span>Personal Information</span>
                    </CardTitle>
                    <CardDescription className="text-slate-400">
                      Update your personal details and profile picture
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="flex items-center gap-6">
                      <div className="relative">
                        <Avatar className="h-24 w-24 border-2 border-slate-600">
                          <AvatarImage src={profile.profilePicture || "/abstract-profile.png"} />
                          <AvatarFallback className="bg-slate-700 text-white text-lg">
                            {profile.firstName?.[0]}{profile.lastName?.[0]}
                          </AvatarFallback>
                        </Avatar>
                        <Button
                          size="sm"
                          className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full bg-blue-600 hover:bg-blue-700 p-0 hover:shadow-lg hover:shadow-blue-500/20"
                          onClick={() => fileInputRef.current?.click()}
                          disabled={isSaving}
                        >
                          {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Camera className="h-4 w-4" />}
                        </Button>
                        <input
                          type="file"
                          ref={fileInputRef}
                          className="hidden"
                          accept="image/*"
                          onChange={handleProfilePictureUpload}
                        />
                      </div>
                      <div className="space-y-2">
                        <Button
                          variant="outline"
                          className="bg-slate-700/50 border-slate-600 text-white hover:bg-slate-600 hover:shadow-lg hover:shadow-blue-500/20"
                          onClick={() => fileInputRef.current?.click()}
                          disabled={isSaving}
                        >
                          <Upload className="h-4 w-4 mr-2" />
                          {isSaving ? "Uploading..." : "Upload Photo"}
                        </Button>
                        <div className="space-y-1">
                          <Label className="text-slate-400 text-sm">Profile Completion</Label>
                          <Progress value={calculateProfileCompletion()} className="h-2" />
                          <p className="text-xs text-slate-500">{calculateProfileCompletion()}% complete</p>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="text-slate-200">First Name</Label>
                        <Input
                          value={profile.firstName}
                          onChange={(e) => setProfile(prev => ({ ...prev, firstName: e.target.value }))}
                          className="bg-slate-700/50 border-slate-600 text-white placeholder-slate-400 focus-visible:ring-blue-300 focus-visible:ring-2 focus-visible:border-blue-300"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-slate-200">Last Name</Label>
                        <Input
                          value={profile.lastName}
                          onChange={(e) => setProfile(prev => ({ ...prev, lastName: e.target.value }))}
                          className="bg-slate-700/50 border-slate-600 text-white placeholder-slate-400 focus-visible:ring-blue-300 focus-visible:ring-2 focus-visible:border-blue-300"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-slate-200">Email Address</Label>
                      <div className="relative">
                        <Input
                          type="email"
                          value={profile.email}
                          onChange={(e) => setProfile(prev => ({ ...prev, email: e.target.value }))}
                          className="bg-slate-700/50 border-slate-600 text-white placeholder-slate-400 pr-10 focus-visible:ring-blue-300 focus-visible:ring-2 focus-visible:border-blue-300"
                        />
                        <Check className="absolute right-3 top-3 h-4 w-4 text-green-400" />
                      </div>
                      <p className="text-xs text-green-400 flex items-center gap-1">
                        <Check className="h-3 w-3" />
                        <span>Verified</span>
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-slate-200">Phone Number</Label>
                      <Input
                        type="tel"
                        value={profile.phone}
                        onChange={(e) => setProfile(prev => ({ ...prev, phone: e.target.value }))}
                        className="bg-slate-700/50 border-slate-600 text-white placeholder-slate-400 focus-visible:ring-blue-300 focus-visible:ring-2 focus-visible:border-blue-300"
                      />
                    </div>

                    <Card className="bg-slate-700/30 border-slate-600/50 hover:shadow-blue-500/10">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-white text-lg flex items-center gap-2">
                          <Lock className="h-4 w-4 text-orange-400" />
                          <span>Change Password</span>
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="space-y-2">
                          <Label className="text-slate-200">Current Password</Label>
                          <div className="relative">
                            <Input
                              type={showPassword ? "text" : "password"}
                              value={password.currentPassword}
                              onChange={(e) => setPassword(prev => ({ ...prev, currentPassword: e.target.value }))}
                              placeholder="Enter current password"
                              className="bg-slate-700/50 border-slate-600 text-white placeholder-slate-400 pr-10 focus-visible:ring-blue-300 focus-visible:ring-2 focus-visible:border-blue-300"
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="absolute right-0 top-0 h-full px-3 hover:bg-transparent text-slate-400"
                              onClick={() => setShowPassword(!showPassword)}
                            >
                              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </Button>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label className="text-slate-200">New Password</Label>
                            <Input
                              type="password"
                              value={password.newPassword}
                              onChange={(e) => setPassword(prev => ({ ...prev, newPassword: e.target.value }))}
                              placeholder="Enter new password"
                              className="bg-slate-700/50 border-slate-600 text-white placeholder-slate-400 focus-visible:ring-blue-300 focus-visible:ring-2 focus-visible:border-blue-300"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label className="text-slate-200">Confirm Password</Label>
                            <Input
                              type="password"
                              value={password.confirmPassword}
                              onChange={(e) => setPassword(prev => ({ ...prev, confirmPassword: e.target.value }))}
                              placeholder="Confirm new password"
                              className="bg-slate-700/50 border-slate-600 text-white placeholder-slate-400 focus-visible:ring-blue-300 focus-visible:ring-2 focus-visible:border-blue-300"
                            />
                          </div>
                        </div>

                        <Button
                          onClick={handlePasswordChange}
                          disabled={isSaving || !password.currentPassword || !password.newPassword || !password.confirmPassword}
                          className="bg-orange-600 hover:bg-orange-700 text-white"
                        >
                          {isSaving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Lock className="h-4 w-4 mr-2" />}
                          Change Password
                        </Button>
                      </CardContent>
                    </Card>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Health Profile - Updated to use API-connected state */}
              <TabsContent value="health" className="space-y-6 mt-0">
                <Card className="bg-slate-800/60 backdrop-blur-md border border-slate-700/50 hover:shadow-green-500/10">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <Heart className="h-5 w-5 text-red-400" />
                      <span>Health Profile</span>
                    </CardTitle>
                    <CardDescription className="text-slate-400">
                      Help us provide personalized air quality recommendations
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <div className="space-y-3">
                        <Label className="text-slate-200">Age: {health.age} years</Label>
                        <Slider 
                          value={[health.age]} 
                          onValueChange={(value) => setHealth(prev => ({ ...prev, age: value[0] }))} 
                          max={100} 
                          min={1} 
                          step={1} 
                          className="w-full" 
                        />
                        <div className="flex justify-between text-xs text-slate-500">
                          <span>1</span>
                          <span>50</span>
                          <span>100</span>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <Label className="text-slate-200">Activity Level</Label>
                        <div className="grid grid-cols-1 gap-2">
                          {[
                            { value: "sedentary", label: "Sedentary", desc: "Mostly sitting, minimal exercise" },
                            { value: "light", label: "Light", desc: "Light exercise 1-3 days/week" },
                            { value: "moderate", label: "Moderate", desc: "Moderate exercise 3-5 days/week" },
                            { value: "high", label: "High", desc: "Heavy exercise 6-7 days/week" },
                            { value: "athletic", label: "Athletic", desc: "Professional/competitive level" },
                          ].map((level) => (
                            <div
                              key={level.value}
                              className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                                health.activityLevel === level.value
                                  ? "bg-emerald-600/20 border-emerald-500 text-white"
                                  : "bg-slate-700/30 border-slate-600 text-slate-300 hover:bg-slate-600/30"
                              }`}
                              onClick={() => setHealth(prev => ({ ...prev, activityLevel: level.value }))}
                            >
                              <div className="flex items-center space-x-3">
                                <div
                                  className={`w-4 h-4 rounded-full border-2 ${
                                    health.activityLevel === level.value
                                      ? "bg-emerald-500 border-emerald-500"
                                      : "border-slate-500"
                                  }`}
                                />
                                <div>
                                  <p className="font-medium">{level.label}</p>
                                  <p className="text-sm text-slate-400">{level.desc}</p>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-slate-800/60 backdrop-blur-md border border-slate-700/50">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <AlertTriangle className="h-5 w-5 text-yellow-400" />
                      <span>Health Conditions</span>
                    </CardTitle>
                    <CardDescription className="text-slate-400">
                      Select conditions that may be affected by air quality
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {[
                        { key: "asthma", label: "Asthma", severity: "high" },
                        { key: "copd", label: "COPD", severity: "high" },
                        { key: "heartDisease", label: "Heart Disease", severity: "medium" },
                        { key: "diabetes", label: "Diabetes", severity: "low" },
                        { key: "pregnancy", label: "Pregnancy", severity: "medium" },
                        { key: "elderly", label: "Elderly (65+)", severity: "medium" },
                      ].map((condition) => (
                        <div
                          key={condition.key}
                          className="flex items-center justify-between p-3 rounded-lg bg-slate-700/30 border border-slate-600/50"
                        >
                          <div className="flex items-center space-x-3">
                            <Checkbox
                              id={condition.key}
                              checked={health.healthConditions[condition.key as keyof typeof health.healthConditions]}
                              onCheckedChange={(checked) =>
                                handleHealthConditionChange(condition.key, checked as boolean)
                              }
                              className="border-slate-500 data-[state=checked]:bg-emerald-600 data-[state=checked]:border-emerald-600"
                            />
                            <Label htmlFor={condition.key} className="text-slate-200 cursor-pointer">
                              {condition.label}
                            </Label>
                          </div>
                          <Badge
                            variant={
                              condition.severity === "high"
                                ? "destructive"
                                : condition.severity === "medium"
                                  ? "default"
                                  : "secondary"
                            }
                            className="text-xs"
                          >
                            {condition.severity}
                          </Badge>
                        </div>
                      ))}
                    </div>

                    <div className="space-y-2">
                      <Label className="text-slate-200">Medication Tracking</Label>
                      <Textarea
                        value={health.medications}
                        onChange={(e) => setHealth(prev => ({ ...prev, medications: e.target.value }))}
                        placeholder="List medications that may be affected by air quality..."
                        className="bg-slate-700/50 border-slate-600 text-white placeholder-slate-400 min-h-[80px] focus-visible:ring-green-300 focus-visible:ring-2 focus-visible:border-green-300"
                      />
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-slate-800/60 backdrop-blur-md border border-slate-700/50 hover:shadow-xl hover:shadow-blue-500/10">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <Smartphone className="h-5 w-5 text-blue-400" />
                      <span>Emergency Contacts</span>
                    </CardTitle>
                    <CardDescription className="text-slate-400">
                      Healthcare providers and emergency contacts
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {health.emergencyContacts.map((contact, index) => (
                      <div
                        key={index}
                        className="flex items-center space-x-2 p-3 rounded-lg bg-slate-700/30 border border-slate-600/50"
                      >
                        <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-2">
                          <Input
                            placeholder="Name"
                            value={contact.name}
                            onChange={(e) => {
                              const updated = [...health.emergencyContacts]
                              updated[index].name = e.target.value
                              setHealth(prev => ({ ...prev, emergencyContacts: updated }))
                            }}
                            className="bg-slate-700/50 border-slate-600 text-white placeholder-slate-400 focus-visible:ring-blue-300 focus-visible:ring-2 focus-visible:border-blue-300"
                          />
                          <Input
                            placeholder="Phone"
                            value={contact.phone}
                            onChange={(e) => {
                              const updated = [...health.emergencyContacts]
                              updated[index].phone = e.target.value
                              setHealth(prev => ({ ...prev, emergencyContacts: updated }))
                            }}
                            className="bg-slate-700/50 border-slate-600 text-white placeholder-slate-400 focus-visible:ring-blue-300 focus-visible:ring-2 focus-visible:border-blue-300"
                          />
                          <Input
                            placeholder="Relation"
                            value={contact.relation}
                            onChange={(e) => {
                              const updated = [...health.emergencyContacts]
                              updated[index].relation = e.target.value
                              setHealth(prev => ({ ...prev, emergencyContacts: updated }))
                            }}
                            className="bg-slate-700/50 border-slate-600 text-white placeholder-slate-400 focus-visible:ring-blue-300 focus-visible:ring-2 focus-visible:border-blue-300"
                          />
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeEmergencyContact(index)}
                          className="text-red-400 hover:text-red-300 hover:bg-red-900/20"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}

                    <Button
                      variant="outline"
                      onClick={addEmergencyContact}
                      className="w-full bg-slate-700/50 border-slate-600 text-white hover:bg-slate-600 hover:shadow-lg hover:shadow-blue-500/20"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Emergency Contact
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Notifications - Updated to use API-connected state */}
              <TabsContent value="notifications" className="space-y-6 mt-0">
                <Card className="bg-slate-800/60 backdrop-blur-md border border-slate-700/50 hover:shadow-xl hover:shadow-orange-500/10">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <Bell className="h-5 w-5 text-orange-400" />
                      <span>Alert Types</span>
                    </CardTitle>
                    <CardDescription className="text-slate-400">
                      Choose which types of alerts you want to receive
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {[
                      {
                        key: "alerts",
                        label: "Health Alerts",
                        desc: "Air quality warnings for your health conditions",
                      },
                      {
                        key: "email",
                        label: "Pollution Warnings",
                        desc: "Notifications when pollution levels are high",
                      },
                      {
                        key: "push",
                        label: "Forecast Alerts",
                        desc: "Daily air quality forecasts and predictions",
                      },
                    ].map((alert) => (
                      <div
                        key={alert.key}
                        className="flex items-center justify-between p-4 rounded-lg bg-slate-700/30 border border-slate-600/50"
                      >
                        <div className="space-y-1">
                          <Label className="text-slate-200 font-medium">{alert.label}</Label>
                          <p className="text-sm text-slate-400">{alert.desc}</p>
                        </div>
                        <Switch
                          checked={notifications[alert.key as keyof typeof notifications] as boolean}
                          onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, [alert.key]: checked }))}
                          className="data-[state=checked]:bg-orange-600"
                        />
                      </div>
                    ))}
                  </CardContent>
                </Card>

                <Card className="bg-slate-800/60 backdrop-blur-md border border-slate-700/50 hover:shadow-xl hover:shadow-green-500/10">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <Smartphone className="h-5 w-5 text-green-400" />
                      <span>Delivery Methods</span>
                    </CardTitle>
                    <CardDescription className="text-slate-400">How you want to receive notifications</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-3 gap-4">
                      {[
                        { key: "browser", label: "Browser", icon: Monitor },
                        { key: "email", label: "Email", icon: Bell },
                        { key: "sms", label: "SMS", icon: Smartphone },
                      ].map((method) => (
                        <div
                          key={method.key}
                          className={`p-4 rounded-lg border cursor-pointer transition-colors ${
                            notifications[method.key as keyof typeof notifications]
                              ? "bg-emerald-600/20 border-emerald-500"
                              : "bg-slate-700/30 border-slate-600 hover:bg-slate-600/30"
                          }`}
                          onClick={() =>
                            setNotifications(prev => ({
                              ...prev,
                              [method.key]: !prev[method.key as keyof typeof prev],
                            }))
                          }
                        >
                          <div className="flex flex-col items-center space-y-2">
                            <method.icon
                              className={`h-6 w-6 ${
                                notifications[method.key as keyof typeof notifications]
                                  ? "text-emerald-400"
                                  : "text-slate-400"
                              }`}
                            />
                            <span
                              className={`text-sm font-medium ${
                                notifications[method.key as keyof typeof notifications]
                                  ? "text-white"
                                  : "text-slate-300"
                              }`}
                            >
                              {method.label}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label className="text-slate-200">Quiet Hours</Label>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-1">
                            <Label className="text-slate-400 text-sm">Start Time</Label>
                            <Input
                              type="time"
                              value={notifications.quietHours.start}
                              onChange={(e) =>
                                setNotifications(prev => ({
                                  ...prev,
                                  quietHours: { ...prev.quietHours, start: e.target.value },
                                }))
                              }
                              className="bg-slate-700/50 border-slate-600 text-white focus-visible:ring-orange-300 focus-visible:ring-2 focus-visible:border-orange-300"
                            />
                          </div>
                          <div className="space-y-1">
                            <Label className="text-slate-400 text-sm">End Time</Label>
                            <Input
                              type="time"
                              value={notifications.quietHours.end}
                              onChange={(e) =>
                                setNotifications(prev => ({
                                  ...prev,
                                  quietHours: { ...prev.quietHours, end: e.target.value },
                                }))
                              }
                              className="bg-slate-700/50 border-slate-600 text-white focus-visible:ring-orange-300 focus-visible:ring-2 focus-visible:border-orange-300"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <Label className="text-slate-200">Notification Sound</Label>
                          <p className="text-sm text-slate-400">Play sound for notifications</p>
                        </div>
                        <Switch
                          checked={notifications.sound}
                          onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, sound: checked }))}
                          className="data-[state=checked]:bg-blue-600"
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <Label className="text-slate-200">Vibration</Label>
                          <p className="text-sm text-slate-400">Vibrate for mobile notifications</p>
                        </div>
                        <Switch
                          checked={notifications.vibration}
                          onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, vibration: checked }))}
                          className="data-[state=checked]:bg-purple-600"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Data & Privacy - Updated to use API-connected state */}
              <TabsContent value="privacy" className="space-y-6 mt-0">
                <Card className="bg-slate-800/60 backdrop-blur-md border border-slate-700/50 hover:shadow-xl hover:shadow-purple-500/10">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <Clock className="h-5 w-5 text-purple-400" />
                      <span>Data Refresh</span>
                    </CardTitle>
                    <CardDescription className="text-slate-400">Control how often data is updated</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <Label className="text-slate-200">Auto-refresh interval: {privacy.refreshInterval} minutes</Label>
                      <Slider
                        value={[privacy.refreshInterval]}
                        onValueChange={(value) => setPrivacyState(prev => ({ ...prev, refreshInterval: value[0] }))}
                        max={60}
                        min={1}
                        step={1}
                        className="w-full"
                      />
                      <div className="flex justify-between text-xs text-slate-500">
                        <span>30s</span>
                        <span>5m</span>
                        <span>15m</span>
                        <span>60m</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <Label className="text-slate-200">Auto-update Data</Label>
                        <p className="text-sm text-slate-400">Automatically refresh air quality data</p>
                      </div>
                      <Switch
                        checked={privacy.autoRefresh}
                        onCheckedChange={(checked) => setPrivacyState(prev => ({ ...prev, autoRefresh: checked }))}
                        className="data-[state=checked]:bg-purple-600"
                      />
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-slate-800/60 backdrop-blur-md border border-slate-700/50 hover:shadow-xl hover:shadow-green-500/10">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <Shield className="h-5 w-5 text-green-400" />
                      <span>Privacy Controls</span>
                    </CardTitle>
                    <CardDescription className="text-slate-400">
                      Manage your data and privacy preferences
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {[
                      {
                        key: "locationTracking",
                        label: "Location Tracking",
                        desc: "Allow GPS location detection for local air quality data",
                        checked: privacy.locationTracking,
                      },
                      {
                        key: "analytics",
                        label: "Analytics & Usage Data",
                        desc: "Share anonymous usage data to help improve our service",
                        checked: privacy.analytics,
                      },
                      {
                        key: "dataSharing",
                        label: "Data Sharing",
                        desc: "Allow sharing anonymized data with research institutions",
                        checked: privacy.dataSharing,
                      },
                    ].map((setting) => (
                      <div
                        key={setting.key}
                        className="flex items-center justify-between p-4 rounded-lg bg-slate-700/30 border border-slate-600/50"
                      >
                        <div className="space-y-1">
                          <Label className="text-slate-200 font-medium">{setting.label}</Label>
                          <p className="text-sm text-slate-400">{setting.desc}</p>
                        </div>
                        <Switch
                          checked={setting.checked}
                          onCheckedChange={(checked) => setPrivacyState(prev => ({ ...prev, [setting.key]: checked }))}
                          className="data-[state=checked]:bg-green-600"
                        />
                      </div>
                    ))}

                    <div className="space-y-2">
                      <Label className="text-slate-200">Data Retention Period</Label>
                      <Select 
                        value={privacy.dataRetention} 
                        onValueChange={(value) => setPrivacyState(prev => ({ ...prev, dataRetention: value }))}
                      >
                        <SelectTrigger className="bg-slate-700/50 border-slate-600 text-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-800 border-slate-700">
                          <SelectItem value="3months">3 months</SelectItem>
                          <SelectItem value="6months">6 months</SelectItem>
                          <SelectItem value="1year">1 year</SelectItem>
                          <SelectItem value="2years">2 years</SelectItem>
                          <SelectItem value="forever">Forever</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        onClick={handleExportData}
                        className="bg-slate-700/50 border-slate-600 text-white hover:bg-slate-600 hover:shadow-lg hover:shadow-blue-500/20"
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Export My Data
                      </Button>
                      <Button 
                        variant="destructive" 
                        onClick={handleDeleteAccount}
                        className="hover:shadow-lg hover:shadow-red-500/20"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete Account
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Display - Updated to use API-connected state */}
              <TabsContent value="display" className="space-y-6 mt-0">
                <Card className="bg-slate-800/60 backdrop-blur-md border border-slate-700/50 hover:shadow-xl hover:shadow-pink-500/10">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <Palette className="h-5 w-5 text-pink-400" />
                      <span>Theme Selection</span>
                    </CardTitle>
                    <CardDescription className="text-slate-400">
                      Choose your preferred theme with live preview
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-3 gap-4">
                      {[
                        { value: "light", label: "Light", icon: Sun },
                        { value: "dark", label: "Dark", icon: Moon },
                        { value: "system", label: "System", icon: Monitor },
                      ].map((themeOption) => (
                        <div
                          key={themeOption.value}
                          className={`p-4 rounded-lg border cursor-pointer transition-colors ${
                            display.theme === themeOption.value
                              ? "bg-pink-600/20 border-pink-500"
                              : "bg-slate-700/30 border-slate-600 hover:bg-slate-600/30"
                          }`}
                          onClick={() => setDisplay(prev => ({ ...prev, theme: themeOption.value }))}
                        >
                          <div className="flex flex-col items-center space-y-2">
                            <themeOption.icon
                              className={`h-6 w-6 ${display.theme === themeOption.value ? "text-pink-400" : "text-slate-400"}`}
                            />
                            <span
                              className={`text-sm font-medium ${
                                display.theme === themeOption.value ? "text-white" : "text-slate-300"
                              }`}
                            >
                              {themeOption.label}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="p-4 rounded-lg bg-slate-700/30 border border-slate-600/50">
                      <Label className="text-slate-400 text-sm mb-2 block">Live Preview</Label>
                      <div className="bg-slate-900 p-4 rounded border border-slate-600">
                        <div className="flex items-center space-x-2 mb-3">
                          <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                          <div className="text-sm font-medium text-white">Dashboard Preview</div>
                        </div>
                        <div className="text-xs text-slate-400">
                          This is how your dashboard will look with the selected theme
                        </div>
                        <div className="mt-2 flex space-x-2">
                          <div className="w-8 h-2 bg-blue-600 rounded"></div>
                          <div className="w-6 h-2 bg-green-600 rounded"></div>
                          <div className="w-4 h-2 bg-slate-600 rounded"></div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-slate-800/60 backdrop-blur-md border border-slate-700/50 hover:shadow-xl hover:shadow-blue-500/10">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <Globe className="h-5 w-5 text-blue-400" />
                      <span>Language & Units</span>
                    </CardTitle>
                    <CardDescription className="text-slate-400">
                      Set your preferred language and measurement units
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label className="text-slate-200">Language</Label>
                      <Select value={display.language} onValueChange={(value) => setDisplay(prev => ({ ...prev, language: value }))}>
                        <SelectTrigger className="bg-slate-700/50 border-slate-600 text-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-800 border-slate-700">
                          <SelectItem value="english">English</SelectItem>
                          <SelectItem value="spanish">Español</SelectItem>
                          <SelectItem value="french">Français</SelectItem>
                          <SelectItem value="german">Deutsch</SelectItem>
                          <SelectItem value="chinese">中文</SelectItem>
                          <SelectItem value="japanese">日本語</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="text-slate-200">Temperature</Label>
                        <Select
                          value={display.temperatureUnit}
                          onValueChange={(value) => setDisplay(prev => ({ ...prev, temperatureUnit: value }))}
                        >
                          <SelectTrigger className="bg-slate-700/50 border-slate-600 text-white">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="bg-slate-800 border-slate-700">
                            <SelectItem value="celsius">Celsius (°C)</SelectItem>
                            <SelectItem value="fahrenheit">Fahrenheit (°F)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label className="text-slate-200">Distance</Label>
                        <Select
                          value={display.distanceUnit}
                          onValueChange={(value) => setDisplay(prev => ({ ...prev, distanceUnit: value }))}
                        >
                          <SelectTrigger className="bg-slate-700/50 border-slate-600 text-white">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="bg-slate-800 border-slate-700">
                            <SelectItem value="kilometers">Kilometers</SelectItem>
                            <SelectItem value="miles">Miles</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-slate-200">Date Format</Label>
                      <Select 
                        value={display.dateFormat} 
                        onValueChange={(value) => setDisplay(prev => ({ ...prev, dateFormat: value }))}
                      >
                        <SelectTrigger className="bg-slate-700/50 border-slate-600 text-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-800 border-slate-700">
                          <SelectItem value="mdy">MM/DD/YYYY</SelectItem>
                          <SelectItem value="dmy">DD/MM/YYYY</SelectItem>
                          <SelectItem value="ymd">YYYY-MM-DD</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Location - Updated to use API-connected state */}
              <TabsContent value="location" className="space-y-6 mt-0">
                <Card className="bg-slate-800/60 backdrop-blur-md border border-slate-700/50 hover:shadow-xl hover:shadow-teal-500/10">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <MapPin className="h-5 w-5 text-teal-400" />
                      <span>Default Location</span>
                    </CardTitle>
                    <CardDescription className="text-slate-400">
                      Set your primary location for air quality monitoring
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label className="text-slate-200">Primary City</Label>
                      <Select 
                        value={location.defaultLocation.city} 
                        onValueChange={(value) => setLocation(prev => ({ 
                          ...prev, 
                          defaultLocation: { ...prev.defaultLocation, city: value } 
                        }))}
                      >
                        <SelectTrigger className="bg-slate-700/50 border-slate-600 text-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-800 border-slate-700">
                          <SelectItem value="New York">New York, NY</SelectItem>
                          <SelectItem value="Los Angeles">Los Angeles, CA</SelectItem>
                          <SelectItem value="Chicago">Chicago, IL</SelectItem>
                          <SelectItem value="Houston">Houston, TX</SelectItem>
                          <SelectItem value="Phoenix">Phoenix, AZ</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="flex items-center justify-between p-4 rounded-lg bg-slate-700/30 border border-slate-600/50">
                      <div className="space-y-1">
                        <Label className="text-slate-200 font-medium">Auto-detect Location</Label>
                        <p className="text-sm text-slate-400">Use GPS to automatically detect your current location</p>
                      </div>
                      <Switch 
                        checked={location.autoDetectLocation} 
                        onCheckedChange={(checked) => setLocation(prev => ({ ...prev, autoDetectLocation: checked }))}
                        className="data-[state=checked]:bg-teal-600" 
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-slate-200">GPS Accuracy</Label>
                      <Select 
                        value={location.gpsAccuracy} 
                        onValueChange={(value) => setLocation(prev => ({ ...prev, gpsAccuracy: value }))}
                      >
                        <SelectTrigger className="bg-slate-700/50 border-slate-600 text-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-800 border-slate-700">
                          <SelectItem value="low">Low (City level)</SelectItem>
                          <SelectItem value="medium">Medium (Neighborhood)</SelectItem>
                          <SelectItem value="high">High (Precise location)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-slate-800/60 backdrop-blur-md border border-slate-700/50 hover:shadow-xl hover:shadow-orange-500/10">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <Clock className="h-5 w-5 text-orange-400" />
                      <span>Location History</span>
                    </CardTitle>
                    <CardDescription className="text-slate-400">Manage your saved and recent locations</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <Label className="text-slate-200 font-medium">Save Location History</Label>
                        <p className="text-sm text-slate-400">Keep track of previously viewed locations</p>
                      </div>
                      <Switch 
                        checked={location.saveLocationHistory} 
                        onCheckedChange={(checked) => setLocation(prev => ({ ...prev, saveLocationHistory: checked }))}
                        className="data-[state=checked]:bg-orange-600" 
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-slate-200">History Retention</Label>
                      <Select 
                        value={location.locationHistoryRetention} 
                        onValueChange={(value) => setLocation(prev => ({ ...prev, locationHistoryRetention: value }))}
                      >
                        <SelectTrigger className="bg-slate-700/50 border-slate-600 text-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-800 border-slate-700">
                          <SelectItem value="7days">7 days</SelectItem>
                          <SelectItem value="30days">30 days</SelectItem>
                          <SelectItem value="90days">90 days</SelectItem>
                          <SelectItem value="1year">1 year</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <Button
                      variant="outline"
                      className="w-full bg-slate-700/50 border-slate-600 text-white hover:bg-slate-600 hover:shadow-lg hover:shadow-blue-500/20"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Clear Location History
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>
            </div>
          </Tabs>

          {/* Bottom Action Buttons */}
          <div className="flex justify-end gap-4 pt-6 border-t border-slate-700/50">
            <Button
              variant="outline"
              onClick={resetCurrentTab}
              disabled={!hasUnsavedChanges || isSaving}
              className="bg-slate-700/50 border-slate-600 text-white hover:bg-slate-600 hover:shadow-lg hover:shadow-blue-500/20"
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              Reset Changes
            </Button>
            <Button
              onClick={saveCurrentTab}
              disabled={!hasUnsavedChanges || isSaving}
              className="bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-700 hover:to-emerald-700 text-white hover:shadow-lg hover:shadow-blue-500/20"
            >
              {isSaving ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Save className="h-4 w-4 mr-2" />
              )}
              {isSaving ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}