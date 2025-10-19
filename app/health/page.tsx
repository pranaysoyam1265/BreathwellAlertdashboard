"use client"

import { useState, useEffect } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { healthData } from "@/lib/health-data"
import {
  Heart,
  Activity,
  Shield,
  Thermometer,
  Wind,
  Stethoscope,
  Pill,
  Phone,
  AlertTriangle,
  TrendingUp,
  User,
  Clock,
  Download,
  Eye,
  Droplets,
} from "lucide-react"

const AnimatedRiskGauge = ({ score, maxScore = 10 }: { score: number; maxScore?: number }) => {
  const [animatedScore, setAnimatedScore] = useState(0)
  const [isPulsing, setIsPulsing] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedScore(score)
      setIsPulsing(score > 7)
    }, 100)
    return () => clearTimeout(timer)
  }, [score])

  const percentage = (animatedScore / maxScore) * 100
  const strokeDasharray = 2 * Math.PI * 45 // circumference for r=45
  const strokeDashoffset = strokeDasharray - (strokeDasharray * percentage) / 100

  const getRiskColor = (score: number) => {
    if (score <= 3) return { stroke: "#10b981", glow: "#10b981", bg: "from-green-500/20 to-green-600/20" } // green
    if (score <= 5) return { stroke: "#f59e0b", glow: "#f59e0b", bg: "from-yellow-500/20 to-yellow-600/20" } // yellow
    if (score <= 7) return { stroke: "#f97316", glow: "#f97316", bg: "from-orange-500/20 to-orange-600/20" } // orange
    return { stroke: "#ef4444", glow: "#ef4444", bg: "from-red-500/20 to-red-600/20" } // red
  }

  const colors = getRiskColor(animatedScore)

  return (
    <div className="relative w-32 h-32 mx-auto">
      <div
        className={`absolute inset-0 rounded-full bg-gradient-to-br ${colors.bg} ${isPulsing ? "animate-pulse" : ""}`}
      ></div>

      <svg className="w-full h-full transform -rotate-90 relative z-10" viewBox="0 0 100 100">
        {/* Background circle */}
        <circle cx="50" cy="50" r="45" fill="none" stroke="#374151" strokeWidth="8" />
        {/* Animated progress circle */}
        <circle
          cx="50"
          cy="50"
          r="45"
          fill="none"
          stroke={colors.stroke}
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={strokeDasharray}
          strokeDashoffset={strokeDashoffset}
          className="transition-all duration-1500 ease-out"
          style={{
            filter: `drop-shadow(0 0 8px ${colors.glow}40)`,
          }}
        />
        {isPulsing && (
          <>
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke={colors.stroke}
              strokeWidth="2"
              opacity="0.6"
              className="animate-ping"
            />
            <circle
              cx="50"
              cy="50"
              r="35"
              fill="none"
              stroke={colors.stroke}
              strokeWidth="1"
              opacity="0.4"
              className="animate-pulse"
            />
          </>
        )}
      </svg>
      <div className="absolute inset-0 flex items-center justify-center z-20">
        <div className="text-center">
          <div className="text-3xl font-bold text-white">{animatedScore.toFixed(1)}</div>
          <div className="text-xs text-slate-400">/ {maxScore}</div>
        </div>
      </div>
    </div>
  )
}

const AQISensitivityChip = ({ aqi, userSensitivity }: { aqi: number; userSensitivity: number }) => {
  const getSensitivityStatus = (aqi: number, sensitivity: number) => {
    const threshold = sensitivity === 0 ? 100 : sensitivity === 1 ? 75 : 50

    if (aqi > threshold + 50)
      return {
        label: "Critical Risk",
        color: "bg-red-600 border-red-500",
        icon: "🚨",
        pulse: true,
      }
    if (aqi > threshold)
      return {
        label: "High Risk",
        color: "bg-orange-600 border-orange-500",
        icon: "⚠️",
        pulse: false,
      }
    if (aqi > threshold - 25)
      return {
        label: "Moderate Risk",
        color: "bg-yellow-600 border-yellow-500",
        icon: "⚡",
        pulse: false,
      }
    return {
      label: "Low Risk",
      color: "bg-green-600 border-green-500",
      icon: "✅",
      pulse: false,
    }
  }

  const status = getSensitivityStatus(aqi, userSensitivity)

  return (
    <div
      className={`inline-flex items-center space-x-2 px-3 py-2 rounded-full border ${status.color} ${status.pulse ? "animate-pulse" : ""}`}
    >
      <span className="text-sm">{status.icon}</span>
      <span className="text-white font-medium text-sm">{status.label}</span>
      <span className="text-white/80 text-xs">AQI {aqi}</span>
    </div>
  )
}

export default function HealthPage() {
  const [age, setAge] = useState([35])
  const [sensitivity, setSensitivity] = useState([2])
  const [activityLevel, setActivityLevel] = useState("moderate")
  const [healthConditions, setHealthConditions] = useState({
    asthma: true,
    copd: false,
    heartDisease: false,
    diabetes: false,
    pregnancy: false,
    elderly: false,
  })
  const [medicationReminders, setMedicationReminders] = useState(true)
  const [healthAlerts, setHealthAlerts] = useState(true)
  const [isHealthDashboardOpen, setIsHealthDashboardOpen] = useState(false)

  const [symptomLogs, setSymptomLogs] = useState([
    {
      id: 1,
      date: "2024-01-15",
      time: "14:30",
      symptom: "Shortness of breath",
      severity: 3,
      notes: "After outdoor walk",
      aqi: 78,
      triggers: ["outdoor activity", "high AQI"],
    },
    {
      id: 2,
      date: "2024-01-15",
      time: "09:15",
      symptom: "Cough",
      severity: 2,
      notes: "Morning symptoms",
      aqi: 65,
      triggers: ["morning air", "allergens"],
    },
    {
      id: 3,
      date: "2024-01-14",
      time: "18:45",
      symptom: "Chest tightness",
      severity: 4,
      notes: "High AQI day",
      aqi: 95,
      triggers: ["high pollution", "PM2.5"],
    },
    {
      id: 4,
      date: "2024-01-14",
      time: "12:00",
      symptom: "Wheezing",
      severity: 2,
      notes: "Mild episode",
      aqi: 72,
      triggers: ["dust", "moderate AQI"],
    },
  ])

  const [medicationLogs, setMedicationLogs] = useState([
    {
      id: 1,
      date: "2024-01-15",
      time: "14:45",
      medication: "Albuterol",
      dosage: "2 puffs",
      notes: "Relief inhaler",
      adherence: "taken",
      effectiveness: 4,
    },
    {
      id: 2,
      date: "2024-01-15",
      time: "08:00",
      medication: "Budesonide",
      dosage: "1 puff",
      notes: "Daily controller",
      adherence: "taken",
      effectiveness: 5,
    },
    {
      id: 3,
      date: "2024-01-14",
      time: "19:00",
      medication: "Albuterol",
      dosage: "2 puffs",
      notes: "Evening rescue",
      adherence: "taken",
      effectiveness: 3,
    },
    {
      id: 4,
      date: "2024-01-14",
      time: "08:00",
      medication: "Budesonide",
      dosage: "1 puff",
      notes: "Morning dose",
      adherence: "missed",
      effectiveness: null,
    },
  ])

  const currentAQI = 78

  const calculateRiskScore = () => {
    let score = 3

    if (age[0] > 65) score += 2
    else if (age[0] > 50) score += 1

    const conditionCount = Object.values(healthConditions).filter(Boolean).length
    score += conditionCount * 1.5

    score += sensitivity[0]

    if (activityLevel === "sedentary") score += 1
    else if (activityLevel === "high") score -= 0.5

    return Math.min(Math.max(score, 1), 10)
  }

  const riskScore = calculateRiskScore()

  const getRiskCategory = (score: number) => {
    if (score <= 3) return { label: "Low Risk", color: "bg-green-500", textColor: "text-green-400" }
    if (score <= 5) return { label: "Moderate Risk", color: "bg-yellow-500", textColor: "text-yellow-400" }
    if (score <= 7) return { label: "High Risk", color: "bg-orange-500", textColor: "text-orange-400" }
    return { label: "Very High Risk", color: "bg-red-500", textColor: "text-red-400" }
  }

  const riskCategory = getRiskCategory(riskScore)

  const recommendations = [
    {
      id: 1,
      title: "Avoid Outdoor Exercise",
      description: "Stay indoors until AQI improves",
      priority: "critical",
      icon: AlertTriangle,
      color: "bg-red-900/30 border-red-500",
      textColor: "text-red-400",
    },
    {
      id: 2,
      title: "Keep Rescue Inhaler Nearby",
      description: "Have medication readily available",
      priority: "high",
      icon: Pill,
      color: "bg-orange-900/30 border-orange-500",
      textColor: "text-orange-400",
    },
    {
      id: 3,
      title: "Close Windows & Doors",
      description: "Prevent outdoor air infiltration",
      priority: "medium",
      icon: Shield,
      color: "bg-yellow-900/30 border-yellow-500",
      textColor: "text-yellow-400",
    },
    {
      id: 4,
      title: "Use Air Purifier",
      description: "Improve indoor air quality",
      priority: "medium",
      icon: Wind,
      color: "bg-blue-900/30 border-blue-500",
      textColor: "text-blue-400",
    },
    {
      id: 5,
      title: "Stay Hydrated",
      description: "Drink plenty of water",
      priority: "low",
      icon: Droplets,
      color: "bg-green-900/30 border-green-500",
      textColor: "text-green-400",
    },
    {
      id: 6,
      title: "Monitor Symptoms",
      description: "Track any changes in breathing",
      priority: "low",
      icon: Heart,
      color: "bg-purple-900/30 border-purple-500",
      textColor: "text-purple-400",
    },
  ]

  const HealthDashboardModal = () => (
    <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto bg-slate-900/95 backdrop-blur-md border border-slate-700/50 text-white">
      <DialogHeader>
        <DialogTitle className="text-2xl font-bold text-white flex items-center space-x-2">
          <Heart className="h-6 w-6 text-red-500" />
          <span>Personal Health Dashboard</span>
        </DialogTitle>
      </DialogHeader>

      <div className="space-y-6">
        {/* Personal Health Profile Section */}
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
                <Checkbox
                  checked={healthConditions.asthma}
                  readOnly
                  className="border-slate-500 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                />
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
                <Badge className="ml-2 bg-red-600 text-white">High</Badge>
              </div>
            </CardContent>
          </Card>

          {/* Real-time Health Risk Assessment */}
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
                  <Badge className="bg-red-600 text-white flex items-center space-x-1">
                    <AlertTriangle className="h-3 w-3" />
                    <span>HIGH RISK</span>
                  </Badge>
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

        {/* Health Recommendations Grid */}
        <Card className="bg-slate-800/60 backdrop-blur-md border border-slate-700/50">
          <CardHeader>
            <CardTitle className="text-white flex items-center space-x-2">
              <Activity className="h-5 w-5 text-green-400" />
              <span>Health Recommendations</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {recommendations.map((rec) => (
                <div key={rec.id} className={`p-4 ${rec.color} rounded-lg`}>
                  <div className="flex items-center space-x-2 mb-2">
                    <rec.icon className="h-5 w-5" />
                    <span className="font-medium">{rec.title}</span>
                  </div>
                  <h4 className="font-medium text-white">{rec.description}</h4>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Health Timeline Chart & Medication Tracker */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="bg-slate-800/60 backdrop-blur-md border border-slate-700/50">
            <CardHeader>
              <CardTitle className="text-white flex items-center space-x-2">
                <TrendingUp className="h-5 w-5 text-purple-400" />
                <span>7-Day Health Risk Trend</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={healthData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="date" stroke="#9CA3AF" />
                  <YAxis stroke="#9CA3AF" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1F2937",
                      border: "1px solid #374151",
                      borderRadius: "8px",
                      color: "#F3F4F6",
                    }}
                  />
                  <Line type="monotone" dataKey="riskScore" stroke="#EF4444" strokeWidth={2} name="Risk Score" />
                  <Line type="monotone" dataKey="aqi" stroke="#F59E0B" strokeWidth={2} name="AQI" />
                  <Line type="monotone" dataKey="symptoms" stroke="#8B5CF6" strokeWidth={2} name="Symptoms" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/60 backdrop-blur-md border border-slate-700/50">
            <CardHeader>
              <CardTitle className="text-white flex items-center space-x-2">
                <Pill className="h-5 w-5 text-blue-400" />
                <span>Medication & Symptom Tracker</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-slate-200">
              <div className="p-3 bg-blue-900/30 rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Albuterol</span>
                  <span className="text-xs text-blue-400">Last used: 2 hours ago</span>
                </div>
              </div>

              <div className="p-3 bg-orange-900/30 rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Shortness of breath</span>
                  <Badge className="bg-orange-600 text-white">Moderate (3/5)</Badge>
                </div>
              </div>

              <div className="p-3 bg-red-900/30 rounded-lg">
                <div className="text-sm">
                  <span className="font-medium">PM2.5 sensitivity threshold:</span>
                  <span className="ml-2 text-red-400">50 μg/m³</span>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-700">
                <Button className="w-full bg-red-600 hover:bg-red-700 text-white flex items-center space-x-2">
                  <Phone className="h-4 w-4" />
                  <span>Emergency Contact: Healthcare Provider</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Health Action Plan */}
        <Card className="bg-slate-800/60 backdrop-blur-md border border-slate-700/50">
          <CardHeader>
            <CardTitle className="text-white flex items-center space-x-2">
              <Stethoscope className="h-5 w-5 text-green-400" />
              <span>Health Action Plan</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-slate-200">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-4 bg-orange-900/30 border border-orange-500 rounded-lg">
                <h4 className="font-medium text-white mb-2">Current Status</h4>
                <p className="text-sm">Unhealthy for Sensitive Groups</p>
              </div>

              <div className="p-4 bg-red-900/30 border border-red-500 rounded-lg">
                <h4 className="font-medium text-white mb-2">Immediate Actions</h4>
                <p className="text-sm">Stay indoors, use medication if needed</p>
              </div>

              <div className="p-4 bg-yellow-900/30 border border-yellow-500 rounded-lg">
                <h4 className="font-medium text-white mb-2">Next 6 Hours</h4>
                <p className="text-sm">Risk expected to increase - avoid all outdoor activities</p>
              </div>

              <div className="p-4 bg-purple-900/30 border border-purple-500 rounded-lg">
                <h4 className="font-medium text-white mb-2">Emergency Threshold</h4>
                <p className="text-sm">Seek medical help if AQI exceeds 150</p>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-700">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white flex items-center space-x-2">
                <Download className="h-4 w-4" />
                <span>Export Health Report</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DialogContent>
  )

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-white">Health Dashboard</h1>
          <AQISensitivityChip aqi={currentAQI} userSensitivity={sensitivity[0]} />
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          <div className="w-full lg:w-[30%] space-y-6">
            <Card className="bg-slate-800/60 backdrop-blur-md border border-slate-700/50">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-white">
                  <User className="h-5 w-5 text-blue-400" />
                  <span>Health Profile</span>
                </CardTitle>
                <CardDescription className="text-slate-300">Configure your personal health information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Age Slider */}
                <div className="space-y-3">
                  <Label className="text-sm font-medium text-slate-200">Age: {age[0]} years</Label>
                  <Slider value={age} onValueChange={setAge} max={100} min={0} step={1} className="w-full" />
                </div>

                {/* Health Conditions */}
                <div className="space-y-3">
                  <Label className="text-sm font-medium text-slate-200">Health Conditions</Label>
                  <div className="grid grid-cols-1 gap-3">
                    {[
                      { key: "asthma", label: "Asthma", icon: Wind },
                      { key: "copd", label: "COPD", icon: Activity },
                      { key: "heartDisease", label: "Heart Disease", icon: Heart },
                      { key: "diabetes", label: "Diabetes", icon: Thermometer },
                      { key: "pregnancy", label: "Pregnancy", icon: Shield },
                      { key: "elderly", label: "Elderly (65+)", icon: User },
                    ].map(({ key, label, icon: Icon }) => (
                      <div key={key} className="flex items-center space-x-2">
                        <Checkbox
                          id={key}
                          checked={healthConditions[key as keyof typeof healthConditions]}
                          onCheckedChange={(checked) => setHealthConditions((prev) => ({ ...prev, [key]: checked }))}
                          className="border-slate-500 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                        />
                        <Label htmlFor={key} className="flex items-center space-x-1 text-xs text-slate-200">
                          <Icon className="h-3 w-3" />
                          <span>{label}</span>
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Activity Level */}
                <div className="space-y-3">
                  <Label className="text-sm font-medium text-slate-200">Activity Level</Label>
                  <RadioGroup value={activityLevel} onValueChange={setActivityLevel}>
                    {[
                      { value: "sedentary", label: "Sedentary" },
                      { value: "light", label: "Light" },
                      { value: "moderate", label: "Moderate" },
                      { value: "high", label: "High" },
                    ].map(({ value, label }) => (
                      <div key={value} className="flex items-center space-x-2">
                        <RadioGroupItem value={value} id={value} className="border-slate-500 text-blue-600" />
                        <Label htmlFor={value} className="text-sm text-slate-200">
                          {label}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>

                {/* Sensitivity Level */}
                <div className="space-y-3">
                  <Label className="text-sm font-medium text-slate-200">
                    Air Quality Sensitivity: {["Low", "Medium", "High"][sensitivity[0]]}
                  </Label>
                  <Slider
                    value={sensitivity}
                    onValueChange={setSensitivity}
                    max={2}
                    min={0}
                    step={1}
                    className="w-full"
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="flex-1 space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="lg:col-span-1 bg-slate-800/60 backdrop-blur-md border border-slate-700/50">
                <CardHeader className="text-center">
                  <CardTitle className="flex items-center justify-center space-x-2 text-white">
                    <Shield className="h-5 w-5 text-blue-400" />
                    <span>Risk Score</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <AnimatedRiskGauge score={riskScore} />
                  <Badge className={`${riskCategory.color} text-white mt-4`}>{riskCategory.label}</Badge>
                </CardContent>
              </Card>

              <Card className="lg:col-span-2 bg-slate-800/60 backdrop-blur-md border border-slate-700/50">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 text-white">
                    <TrendingUp className="h-5 w-5 text-orange-400" />
                    <span>Risk Factors</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-200">Age Impact</span>
                      <div className="flex items-center space-x-2">
                        <Progress value={age[0] > 65 ? 80 : age[0] > 50 ? 50 : 20} className="w-20" />
                        <span className="text-xs text-slate-400">
                          {age[0] > 65 ? "High" : age[0] > 50 ? "Medium" : "Low"}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-200">Health Conditions</span>
                      <div className="flex items-center space-x-2">
                        <Progress
                          value={Object.values(healthConditions).filter(Boolean).length * 20}
                          className="w-20"
                        />
                        <span className="text-xs text-slate-400">
                          {Object.values(healthConditions).filter(Boolean).length} conditions
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-200">Current AQI Impact</span>
                      <div className="flex items-center space-x-2">
                        <Progress value={65} className="w-20" />
                        <span className="text-xs text-slate-400">Moderate</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-200">Sensitivity Level</span>
                      <div className="flex items-center space-x-2">
                        <Progress value={(sensitivity[0] + 1) * 33} className="w-20" />
                        <span className="text-xs text-slate-400">{["Low", "Medium", "High"][sensitivity[0]]}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recommendations Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Activity Recommendations */}
              <Card className="bg-slate-800/60 backdrop-blur-md border border-slate-700/50">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 text-white">
                    <Activity className="h-5 w-5 text-green-400" />
                    <span>Activity Recommendations</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      {
                        name: "Exercise",
                        icon: "🏋️",
                        status: riskScore <= 4 ? "Safe" : "Caution",
                        color: riskScore <= 4 ? "text-green-400" : "text-yellow-400",
                      },
                      {
                        name: "Walking",
                        icon: "🚶",
                        status: riskScore <= 6 ? "Safe" : "Indoor Only",
                        color: riskScore <= 6 ? "text-green-400" : "text-red-400",
                      },
                      {
                        name: "Cycling",
                        icon: "🚴",
                        status: riskScore <= 3 ? "Safe" : "Not Recommended",
                        color: riskScore <= 3 ? "text-green-400" : "text-red-400",
                      },
                      {
                        name: "Sports",
                        icon: "⚽",
                        status: riskScore <= 3 ? "Safe" : "Avoid",
                        color: riskScore <= 3 ? "text-green-400" : "text-red-400",
                      },
                    ].map((activity) => (
                      <div
                        key={activity.name}
                        className="p-3 border border-slate-600 rounded-lg hover:bg-slate-700/50 transition-colors"
                      >
                        <div className="text-center">
                          <div className="text-2xl mb-1">{activity.icon}</div>
                          <div className="text-sm font-medium text-slate-200">{activity.name}</div>
                          <div className={`${activity.color}`}>{activity.status}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Health Management */}
              <Card className="bg-slate-800/60 backdrop-blur-md border border-slate-700/50">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 text-white">
                    <Heart className="h-5 w-5 text-red-400" />
                    <span>Health Management</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Settings */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="medication-reminders" className="flex items-center space-x-2 text-slate-200">
                        <Pill className="h-4 w-4" />
                        <span>Medication Reminders</span>
                      </Label>
                      <Switch
                        id="medication-reminders"
                        checked={medicationReminders}
                        onCheckedChange={setMedicationReminders}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="health-alerts" className="flex items-center space-x-2 text-slate-200">
                        <AlertTriangle className="h-4 w-4" />
                        <span>Health Alerts</span>
                      </Label>
                      <Switch id="health-alerts" checked={healthAlerts} onCheckedChange={setHealthAlerts} />
                    </div>
                  </div>

                  {/* Emergency Contacts */}
                  <div className="pt-4 border-t border-slate-700">
                    <h4 className="font-medium mb-3 flex items-center space-x-2 text-slate-200">
                      <Phone className="h-4 w-4" />
                      <span>Emergency Contacts</span>
                    </h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-slate-400">Emergency Services</span>
                        <span className="font-mono text-slate-200">911</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Poison Control</span>
                        <span className="font-mono text-slate-200">1-800-222-1222</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Primary Care</span>
                        <span className="font-mono text-slate-200">Contact Doctor</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Health Advice */}
            <Card className="bg-slate-800/60 backdrop-blur-md border border-slate-700/50">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-white">
                  <Stethoscope className="h-5 w-5 text-blue-400" />
                  <span>Personalized Health Advice</span>
                </CardTitle>
                <CardDescription className="text-slate-300">Color-coded by priority and severity</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {recommendations.map((rec) => (
                    <div
                      key={rec.id}
                      className={`p-4 ${rec.color} rounded-lg hover:scale-105 transition-all duration-200 cursor-pointer`}
                    >
                      <div className="flex items-center space-x-2 mb-2">
                        <rec.icon className={`h-5 w-5 ${rec.textColor}`} />
                        <Badge
                          className={`text-xs ${
                            rec.priority === "critical"
                              ? "bg-red-600"
                              : rec.priority === "high"
                                ? "bg-orange-600"
                                : rec.priority === "medium"
                                  ? "bg-yellow-600"
                                  : "bg-green-600"
                          }`}
                        >
                          {rec.priority}
                        </Badge>
                      </div>
                      <h4 className="font-medium text-white mb-1">{rec.title}</h4>
                      <p className="text-sm text-slate-300">{rec.description}</p>
                    </div>
                  ))}
                </div>

                {/* View Health Dashboard button */}
                <div className="mt-6 pt-4 border-t border-slate-700">
                  <Dialog open={isHealthDashboardOpen} onOpenChange={setIsHealthDashboardOpen}>
                    <DialogTrigger asChild>
                      <Button className="w-full bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white flex items-center space-x-2">
                        <Eye className="h-4 w-4" />
                        <span>View Health Dashboard</span>
                      </Button>
                    </DialogTrigger>
                    <HealthDashboardModal />
                  </Dialog>
                </div>
              </CardContent>
            </Card>

            {/* Symptom and Medication Logs Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Symptom Log */}
              <Card className="bg-slate-800/60 backdrop-blur-md border border-slate-700/50">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 text-white">
                    <Activity className="h-5 w-5 text-red-400" />
                    <span>Symptom Log</span>
                  </CardTitle>
                  <CardDescription className="text-slate-300">Track symptoms and identify patterns</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 max-h-64 overflow-y-auto">
                    {symptomLogs.map((log) => (
                      <div
                        key={log.id}
                        className="flex flex-col sm:flex-row sm:items-center justify-between p-3 bg-slate-700/30 rounded-lg border border-slate-600/50 hover:bg-slate-700/50 transition-colors"
                      >
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <span className="font-medium text-white text-sm">{log.symptom}</span>
                            <Badge
                              className={`text-xs ${
                                log.severity >= 4
                                  ? "bg-red-600"
                                  : log.severity >= 3
                                    ? "bg-orange-600"
                                    : log.severity >= 2
                                      ? "bg-yellow-600"
                                      : "bg-green-600"
                              }`}
                            >
                              {log.severity}/5
                            </Badge>
                          </div>
                          <div className="text-xs text-slate-400">
                            {log.date} at {log.time} • AQI: {log.aqi}
                          </div>
                          <div className="text-xs text-slate-500 mt-1">{log.notes}</div>
                          <div className="flex flex-wrap gap-1 mt-2">
                            {log.triggers.map((trigger, idx) => (
                              <Badge key={idx} variant="outline" className="text-xs border-slate-600 text-slate-400">
                                {trigger}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <Button className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white">Add New Symptom</Button>
                </CardContent>
              </Card>

              {/* Medication Adherence Log */}
              <Card className="bg-slate-800/60 backdrop-blur-md border border-slate-700/50">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 text-white">
                    <Pill className="h-5 w-5 text-blue-400" />
                    <span>Medication Adherence</span>
                  </CardTitle>
                  <CardDescription className="text-slate-300">Track medication usage and effectiveness</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 max-h-64 overflow-y-auto">
                    {medicationLogs.map((log) => (
                      <div
                        key={log.id}
                        className="flex flex-col sm:flex-row sm:items-center justify-between p-3 bg-slate-700/30 rounded-lg border border-slate-600/50 hover:bg-slate-700/50 transition-colors"
                      >
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <span className="font-medium text-white text-sm">{log.medication}</span>
                            <Badge className={`text-xs ${log.adherence === "taken" ? "bg-green-600" : "bg-red-600"}`}>
                              {log.adherence}
                            </Badge>
                          </div>
                          <div className="text-xs text-slate-400">
                            {log.date} at {log.time} • {log.dosage}
                          </div>
                          <div className="text-xs text-slate-500 mt-1">{log.notes}</div>
                          {log.effectiveness && (
                            <div className="flex items-center space-x-2 mt-2">
                              <span className="text-xs text-slate-400">Effectiveness:</span>
                              <div className="flex space-x-1">
                                {[1, 2, 3, 4, 5].map((star) => (
                                  <div
                                    key={star}
                                    className={`w-2 h-2 rounded-full ${
                                      star <= log.effectiveness ? "bg-yellow-400" : "bg-slate-600"
                                    }`}
                                  />
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                  <Button className="w-full mt-4 bg-green-600 hover:bg-green-700 text-white">Log Medication</Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
