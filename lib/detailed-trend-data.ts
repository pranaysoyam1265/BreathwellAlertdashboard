export const detailedTrendData = [
  { date: "Sep 04", pm25: 45, pm10: 70, o3: 30, no2: 25, so2: 10, co: 1.2, healthRisk: "Low" },
  { date: "Sep 05", pm25: 50, pm10: 75, o3: 35, no2: 28, so2: 12, co: 1.4, healthRisk: "Low" },
  { date: "Sep 06", pm25: 55, pm10: 82, o3: 42, no2: 32, so2: 15, co: 1.6, healthRisk: "Moderate" },
  { date: "Sep 07", pm25: 62, pm10: 95, o3: 38, no2: 35, so2: 18, co: 1.8, healthRisk: "Moderate" },
  { date: "Sep 08", pm25: 68, pm10: 105, o3: 45, no2: 40, so2: 20, co: 2.1, healthRisk: "Moderate" },
  { date: "Sep 09", pm25: 78, pm10: 125, o3: 52, no2: 45, so2: 23, co: 2.5, healthRisk: "High" },
  { date: "Sep 10", pm25: 72, pm10: 115, o3: 48, no2: 42, so2: 21, co: 2.2, healthRisk: "Moderate" },
  { date: "Sep 11", pm25: 65, pm10: 98, o3: 40, no2: 38, so2: 17, co: 1.9, healthRisk: "Moderate" },
]

export type TrendDataPoint = {
  date: string
  pm25: number
  pm10: number
  o3: number
  no2: number
  so2: number
  co: number
  healthRisk: "Low" | "Moderate" | "High"
}
