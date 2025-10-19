export interface User {
  id: string;
  email: string;
  first_name: string | null;
  last_name: string | null;
  phone: string | null;
  profile_picture_url: string | null;
  email_verified: boolean;
  phone_verified?: boolean; // Added missing field
  created_at: Date;
  updated_at: Date;
}

export interface UserSettings {
  user_id: string;
  // Profile
  age: number | null;
  activity_level: string | null;
  health_conditions: Record<string, boolean> | null;
  medications: string | null;
  emergency_contacts: Array<{
    name: string;
    phone: string;
    relation: string;
  }> | null; // Made nullable to match database
  
  // Notifications
  notification_settings: {
    email: boolean;
    push: boolean;
    sms: boolean;
    alerts: boolean;
    browser: boolean;
    sound: boolean;
    vibration: boolean;
    frequency: string;
  } | null;
  quiet_hours_start: string | null;
  quiet_hours_end: string | null;
  
  // Privacy
  privacy_settings: {
    locationTracking: boolean;
    analytics: boolean;
    dataSharing: boolean;
    autoRefresh: boolean;
  } | null;
  data_retention: string | null;
  refresh_interval: number | null;
  
  // Display
  theme: string | null;
  language: string | null;
  temperature_unit: string | null;
  distance_unit: string | null;
  date_format: string | null;
  
  // Location
  default_location: {
    city: string;
    country: string;
    coordinates?: { lat: number; lng: number };
  } | null;
  auto_detect_location: boolean | null;
  gps_accuracy: string | null;
  save_location_history: boolean | null;
  location_history_retention: string | null;
  
  created_at: Date;
  updated_at: Date;
}

export interface Database {
  public: {
    Tables: {
      users: {
        Row: User;
        Insert: Omit<User, 'id' | 'created_at' | 'updated_at'> & {
          id?: string;
          created_at?: Date;
          updated_at?: Date;
        };
        Update: Partial<Omit<User, 'id' | 'created_at'>> & {
          updated_at?: Date;
        };
      };
      user_settings: {
        Row: UserSettings;
        Insert: Omit<UserSettings, 'created_at' | 'updated_at'> & {
          created_at?: Date;
          updated_at?: Date;
        };
        Update: Partial<Omit<UserSettings, 'user_id' | 'created_at'>> & {
          updated_at?: Date;
        };
      };
    };
  };
}