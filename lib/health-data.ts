export const healthData = [
  { date: "Sep 05", riskScore: 4.2, aqi: 50, symptoms: 1 },
  { date: "Sep 06", riskScore: 5.1, aqi: 55, symptoms: 2 },
  { date: "Sep 07", riskScore: 6.8, aqi: 60, symptoms: 2 },
  { date: "Sep 08", riskScore: 7.2, aqi: 65, symptoms: 3 },
  { date: "Sep 09", riskScore: 8.9, aqi: 70, symptoms: 4 },
  { date: "Sep 10", riskScore: 8.5, aqi: 75, symptoms: 3 },
  { date: "Sep 11", riskScore: 7.2, aqi: 78, symptoms: 3 },
]

export interface HealthDataPoint {
  date: string
  riskScore: number
  aqi: number
  symptoms: number
}
