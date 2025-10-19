export const chartData = [
  { date: "Sep 04", pm25: 45, pm10: 70, o3: 30, aqi: 65 },
  { date: "Sep 05", pm25: 50, pm10: 75, o3: 35, aqi: 70 },
  { date: "Sep 06", pm25: 55, pm10: 80, o3: 40, aqi: 75 },
  { date: "Sep 07", pm25: 60, pm10: 90, o3: 45, aqi: 85 },
  { date: "Sep 08", pm25: 65, pm10: 95, o3: 50, aqi: 90 },
  { date: "Sep 09", pm25: 70, pm10: 100, o3: 55, aqi: 95 },
  { date: "Sep 10", pm25: 75, pm10: 110, o3: 60, aqi: 105 },
  { date: "Sep 11", pm25: 78, pm10: 115, o3: 65, aqi: 110 },
]

export type ChartDataPoint = {
  date: string
  pm25: number
  pm10: number
  o3: number
  aqi: number
}
