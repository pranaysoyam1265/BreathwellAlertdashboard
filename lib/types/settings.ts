// lib/types/settings.ts
export interface UserProfile {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  profilePicture: string | null;
  emailVerified: boolean;
}

export interface HealthProfile {
  age: number;
  activityLevel: string;
  healthConditions: Record<string, boolean>;
  medications: string;
  emergencyContacts: Array<{
    name: string;
    phone: string;
    relation: string;
  }>;
}

export interface NotificationSettings {
  email: boolean;
  push: boolean;
  sms: boolean;
  alerts: boolean;
  browser: boolean;
  sound: boolean;
  vibration: boolean;
  frequency: string;
  quietHours: {
    start: string;
    end: string;
  };
}

export interface PrivacySettings {
  locationTracking: boolean;
  analytics: boolean;
  dataSharing: boolean;
  autoRefresh: boolean;
  dataRetention: string;
  refreshInterval: number;
}

export interface DisplaySettings {
  theme: string;
  language: string;
  temperatureUnit: string;
  distanceUnit: string;
  dateFormat: string;
}

export interface LocationSettings {
  defaultLocation: {
    city: string;
    country: string;
    coordinates?: { lat: number; lng: number };
  };
  autoDetectLocation: boolean;
  gpsAccuracy: string;
  saveLocationHistory: boolean;
  locationHistoryRetention: string;
}

export interface UserSettings {
  profile: UserProfile;
  health: HealthProfile;
  notifications: NotificationSettings;
  privacy: PrivacySettings;
  display: DisplaySettings;
  location: LocationSettings;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface SettingsUpdateRequest {
  type: 'profile' | 'health' | 'notifications' | 'privacy' | 'display' | 'location';
  data: Partial<UserSettings[keyof UserSettings]>;
}