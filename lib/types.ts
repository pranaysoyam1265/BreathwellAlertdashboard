// lib/types.ts
export interface DashboardData {
  weather: {
    temperature: number;
    humidity: number;
    windSpeed: number;
    visibility: number;
    uvIndex: number;
    pressure: number;
    condition: string;
    location: string;
  };
  airQuality: {
    aqi: number;
    pm25: number;
    pm10: number;
    no2: number;
    so2: number;
    o3: number;
    co: number;
  };
  locations: number;
  activeAlerts: number;
  healthScore: number;
  lastUpdated: string;
  isMockData?: boolean;
}

export interface ApiError {
  message: string;
  service: string;
  timestamp: string;
}