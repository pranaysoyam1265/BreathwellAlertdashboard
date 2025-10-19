// hooks/useDashboardData.ts
'use client';

import { useState, useEffect, useCallback } from 'react';
import { 
  getCurrentLocation, 
  fetchAllData, 
  getMockWeatherData, 
  getMockAirQualityData 
} from '@/lib/api-service';

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

interface UseDashboardDataReturn {
  data: DashboardData | null;
  loading: boolean;
  error: string | null;
  refreshData: () => Promise<void>;
  lastUpdated: string;
}

// Helper functions for calculations
const calculateHealthScore = (aqi: number, weather: any): number => {
  if (aqi <= 50) return 85 + Math.floor(Math.random() * 10); // 85-95 for good AQI
  if (aqi <= 100) return 70 + Math.floor(Math.random() * 10); // 70-80 for moderate
  if (aqi <= 150) return 55 + Math.floor(Math.random() * 10); // 55-65 for unhealthy for sensitive
  if (aqi <= 200) return 40 + Math.floor(Math.random() * 10); // 40-50 for unhealthy
  return 25 + Math.floor(Math.random() * 10); // 25-35 for hazardous
};

const calculateActiveAlerts = (aqi: number, weather: any): number => {
  let alerts = 0;
  if (aqi > 100) alerts++; // Air quality alert
  if (weather.windSpeed > 20) alerts++; // High wind alert
  if (weather.visibility < 5) alerts++; // Low visibility alert
  return alerts;
};

const calculateUVIndex = (): number => {
  // Simple UV index calculation based on time of day
  const hour = new Date().getHours();
  if (hour >= 10 && hour <= 14) return 6 + Math.floor(Math.random() * 3); // 6-8 during peak hours
  if (hour >= 8 && hour <= 16) return 4 + Math.floor(Math.random() * 3); // 4-6 during daytime
  return 1 + Math.floor(Math.random() * 2); // 1-2 during morning/evening
};

// Transform API data to dashboard format
const transformAPIData = (apiData: any): DashboardData => {
  const { weather, airQuality, isMockData } = apiData;
  
  // Use mock data if real API fails
  const weatherData = weather || getMockWeatherData();
  const aqData = airQuality || getMockAirQualityData();
  
  const aqiValue = aqData.data?.aqi || 42;
  const healthScore = calculateHealthScore(aqiValue, weatherData);
  const activeAlerts = calculateActiveAlerts(aqiValue, weatherData);
  
  return {
    weather: {
      temperature: Math.round(weatherData.main.temp),
      humidity: weatherData.main.humidity,
      windSpeed: Math.round((weatherData.wind.speed || 8) * 3.6), // Convert m/s to km/h
      visibility: Math.round((weatherData.visibility || 12000) / 1000), // Convert meters to km
      uvIndex: calculateUVIndex(),
      pressure: weatherData.main.pressure,
      condition: weatherData.weather?.[0]?.main || 'Partly Cloudy',
      location: weatherData.name || 'Current Location'
    },
    airQuality: {
      aqi: aqiValue,
      pm25: aqData.data?.iaqi?.pm25?.v || 18,
      pm10: aqData.data?.iaqi?.pm10?.v || 22,
      no2: aqData.data?.iaqi?.no2?.v || 12,
      so2: aqData.data?.iaqi?.so2?.v || 5,
      o3: aqData.data?.iaqi?.o3?.v || 45,
      co: aqData.data?.iaqi?.co?.v || 0.5
    },
    locations: 8, // This could be dynamic based on user data
    activeAlerts,
    healthScore,
    lastUpdated: new Date().toISOString(),
    isMockData
  };
};

// Generate 24h trend data based on current AQI
const generateTrendData = (currentAqi: number) => {
  const now = new Date();
  const data = [];
  
  for (let i = 23; i >= 0; i--) {
    const time = new Date(now);
    time.setHours(now.getHours() - i);
    
    // Create realistic fluctuations around current AQI
    const fluctuation = Math.sin(i * 0.3) * 5 + (Math.random() * 4 - 2);
    const aqi = Math.max(0, Math.min(300, Math.round(currentAqi + fluctuation)));
    
    data.push({
      time: time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      aqi,
      pm25: Math.round(aqi * 0.4 + Math.random() * 5),
      temp: 20 + Math.sin(i * 0.2) * 8 + (Math.random() * 2 - 1),
      humidity: 60 + Math.sin(i * 0.5) * 10 + (Math.random() * 4 - 2)
    });
  }
  
  return data;
};

export const useDashboardData = (): UseDashboardDataReturn => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string>('');

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Get user location
      const location = await getCurrentLocation();
      
      // Fetch all data
      const apiData = await fetchAllData(location.latitude, location.longitude);
      
      // Transform to dashboard format
      const dashboardData = transformAPIData(apiData);
      
      setData(dashboardData);
      setLastUpdated(new Date().toISOString());
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
      console.error('Error fetching dashboard data:', err);
      
      // Set fallback data
      const fallbackData = transformAPIData({});
      setData(fallbackData);
    } finally {
      setLoading(false);
    }
  }, []);

  const refreshData = useCallback(async () => {
    await fetchData();
  }, [fetchData]);

  useEffect(() => {
    fetchData();
    
    // Set up auto-refresh every 5 minutes
    const interval = setInterval(fetchData, 5 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, [fetchData]);

  return {
    data,
    loading,
    error,
    refreshData,
    lastUpdated
  };
};

// Export trend data generator separately
export { generateTrendData };