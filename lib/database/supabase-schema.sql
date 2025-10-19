-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (extends Supabase auth.users)
CREATE TABLE users (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  first_name TEXT,
  last_name TEXT,
  phone TEXT,
  profile_picture_url TEXT,
  email_verified BOOLEAN DEFAULT FALSE,
  phone_verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Health profiles for air quality sensitivity
CREATE TABLE user_health_profiles (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  age INTEGER,
  has_asthma BOOLEAN DEFAULT FALSE,
  has_copd BOOLEAN DEFAULT FALSE,
  has_allergies BOOLEAN DEFAULT FALSE,
  has_heart_condition BOOLEAN DEFAULT FALSE,
  is_smoker BOOLEAN DEFAULT FALSE,
  activity_level VARCHAR(20) DEFAULT 'moderate',
  sensitivity_level VARCHAR(20) DEFAULT 'medium',
  medications JSONB DEFAULT '[]',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Air quality alert thresholds
CREATE TABLE user_alert_thresholds (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  pm25_warning INTEGER DEFAULT 35,
  pm25_alert INTEGER DEFAULT 55,
  pm10_warning INTEGER DEFAULT 50,
  pm10_alert INTEGER DEFAULT 100,
  no2_warning INTEGER DEFAULT 100,
  no2_alert INTEGER DEFAULT 200,
  o3_warning INTEGER DEFAULT 100,
  o3_alert INTEGER DEFAULT 150,
  so2_warning INTEGER DEFAULT 75,
  so2_alert INTEGER DEFAULT 125,
  aqi_warning INTEGER DEFAULT 100,
  aqi_alert INTEGER DEFAULT 150,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User settings
CREATE TABLE user_settings (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  notification_settings JSONB DEFAULT '{
    "email": true,
    "push": true,
    "sms": false,
    "browser": true,
    "sound": true,
    "vibration": true
  }',
  alert_frequency VARCHAR(20) DEFAULT 'immediate',
  quiet_hours_start TIME DEFAULT '22:00',
  quiet_hours_end TIME DEFAULT '07:00',
  location_tracking BOOLEAN DEFAULT TRUE,
  data_sharing BOOLEAN DEFAULT FALSE,
  theme VARCHAR(20) DEFAULT 'dark',
  temperature_unit VARCHAR(10) DEFAULT 'celsius',
  air_quality_index VARCHAR(10) DEFAULT 'us',
  default_location JSONB DEFAULT '{}',
  auto_detect_location BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Emergency contacts
CREATE TABLE emergency_contacts (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  relation VARCHAR(100) NOT NULL,
  notify_on_alert BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User sessions for theme/language
CREATE TABLE user_sessions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  theme VARCHAR(20),
  language VARCHAR(10),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_health_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_alert_thresholds ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE emergency_contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_sessions ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view own data" ON users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own data" ON users FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can manage own health profiles" ON user_health_profiles 
FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own alert thresholds" ON user_alert_thresholds 
FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own settings" ON user_settings 
FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own emergency contacts" ON emergency_contacts 
FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own sessions" ON user_sessions 
FOR ALL USING (auth.uid() = user_id);