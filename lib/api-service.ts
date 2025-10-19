// lib/api-service.ts

// API Configuration
const API_CONFIG = {
  WEATHER: {
    BASE_URL: 'https://api.openweathermap.org/data/2.5',
    KEY: process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY || 'your_openweather_api_key_here'
  },
  AIR_QUALITY: {
    BASE_URL: 'https://api.waqi.info',
    KEY: process.env.NEXT_PUBLIC_AQICN_API_KEY || 'your_aqicn_api_key_here'
  },
  LOCATION: {
    BASE_URL: 'https://api.bigdatacloud.net/data/reverse-geocode-client'
  }
};

// Types for API responses
export interface WeatherResponse {
  main: {
    temp: number;
    humidity: number;
    pressure: number;
  };
  wind: {
    speed: number;
  };
  visibility: number;
  weather: Array<{
    main: string;
    description: string;
  }>;
  name: string;
}

export interface AirQualityResponse {
  data: {
    aqi: number;
    city: {
      name: string;
    };
    iaqi: {
      pm25?: { v: number };
      pm10?: { v: number };
      no2?: { v: number };
      so2?: { v: number };
      o3?: { v: number };
      co?: { v: number };
    };
    time: {
      s: string; // timestamp
    };
  };
  status: string;
}

export interface LocationData {
  latitude: number;
  longitude: number;
  city: string;
  country: string;
}

// Utility functions
const handleApiError = (error: any, service: string) => {
  console.error(`API Error (${service}):`, error);
  throw new Error(`Failed to fetch ${service} data: ${error.message}`);
};

const fetchWithTimeout = async (url: string, options: RequestInit = {}, timeout = 10000) => {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);
  
  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal
    });
    clearTimeout(id);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return response;
  } catch (error) {
    clearTimeout(id);
    throw error;
  }
};

// Location Services
export const getCurrentLocation = (): Promise<LocationData> => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported by this browser'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          
          // Get city name using reverse geocoding
          const response = await fetchWithTimeout(
            `${API_CONFIG.LOCATION.BASE_URL}?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
          );
          const locationData = await response.json();
          
          resolve({
            latitude,
            longitude,
            city: locationData.city || locationData.locality || 'Unknown',
            country: locationData.countryName || 'Unknown'
          });
        } catch (error) {
          // If reverse geocoding fails, still return coordinates
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            city: 'Unknown',
            country: 'Unknown'
          });
        }
      },
      (error) => {
        reject(new Error(`Geolocation error: ${error.message}`));
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 5 * 60 * 1000 // 5 minutes
      }
    );
  });
};

// Weather API Services
export const fetchCurrentWeather = async (lat: number, lon: number): Promise<WeatherResponse> => {
  try {
    const response = await fetchWithTimeout(
      `${API_CONFIG.WEATHER.BASE_URL}/weather?lat=${lat}&lon=${lon}&appid=${API_CONFIG.WEATHER.KEY}&units=metric`
    );
    const data = await response.json();
    return data;
  } catch (error) {
    return handleApiError(error, 'weather');
  }
};

export const fetchWeatherForecast = async (lat: number, lon: number) => {
  try {
    const response = await fetchWithTimeout(
      `${API_CONFIG.WEATHER.BASE_URL}/forecast?lat=${lat}&lon=${lon}&appid=${API_CONFIG.WEATHER.KEY}&units=metric`
    );
    const data = await response.json();
    return data;
  } catch (error) {
    return handleApiError(error, 'weather forecast');
  }
};

// Air Quality API Services
export const fetchAirQuality = async (lat: number, lon: number): Promise<AirQualityResponse> => {
  try {
    const response = await fetchWithTimeout(
      `${API_CONFIG.AIR_QUALITY.BASE_URL}/feed/geo:${lat};${lon}/?token=${API_CONFIG.AIR_QUALITY.KEY}`
    );
    const data = await response.json();
    
    if (data.status !== 'ok') {
      throw new Error('Air quality data not available');
    }
    
    return data;
  } catch (error) {
    return handleApiError(error, 'air quality');
  }
};

// Fallback mock data for development
export const getMockWeatherData = (): WeatherResponse => ({
  main: {
    temp: 24,
    humidity: 62,
    pressure: 1013
  },
  wind: {
    speed: 8
  },
  visibility: 12000,
  weather: [
    {
      main: 'Partly Cloudy',
      description: 'partly cloudy'
    }
  ],
  name: 'Current Location'
});

export const getMockAirQualityData = (): AirQualityResponse => ({
  data: {
    aqi: 42,
    city: {
      name: 'Current Location'
    },
    iaqi: {
      pm25: { v: 18 },
      pm10: { v: 22 },
      no2: { v: 12 },
      so2: { v: 5 },
      o3: { v: 45 },
      co: { v: 0.5 }
    },
    time: {
      s: new Date().toISOString()
    }
  },
  status: 'ok'
});

// Combined data fetcher
export const fetchAllData = async (lat: number, lon: number) => {
  try {
    const [weatherData, airQualityData] = await Promise.all([
      fetchCurrentWeather(lat, lon),
      fetchAirQuality(lat, lon)
    ]);
    
    return {
      weather: weatherData,
      airQuality: airQualityData,
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    console.error('Failed to fetch all data:', error);
    
    // Return mock data as fallback
    return {
      weather: getMockWeatherData(),
      airQuality: getMockAirQualityData(),
      timestamp: new Date().toISOString(),
      isMockData: true
    };
  }
};