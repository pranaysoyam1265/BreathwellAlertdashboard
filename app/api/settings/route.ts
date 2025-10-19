import { NextRequest, NextResponse } from 'next/server';
// Instead of: import { SupabaseDatabaseClient } from '@/lib/database/client';
// Use this:
import { getDbClient } from '@/lib/database/client';
const dbClient = getDbClient();
import { Database } from '@/lib/types/database';
import { SettingsUpdateRequest, ApiResponse, UserSettings } from '@/lib/types/settings';

// Helper function to transform database settings to frontend settings
async function transformToFrontendSettings(
  user: Database['public']['Tables']['users']['Row'],
  settings: Database['public']['Tables']['user_settings']['Row']
): Promise<UserSettings> {
  // Get emergency contacts from database
  const emergencyContactsRes = await dbClient.getEmergencyContacts(user.id);
  const emergencyContacts = (emergencyContactsRes?.data ?? []) as Array<{
    name: string;
    phone: string;
    relation: string;
  }>;

  return {
    profile: {
      firstName: user.first_name || '',
      lastName: user.last_name || '',
      email: user.email,
      phone: user.phone || '',
      profilePicture: user.profile_picture_url,
      emailVerified: user.email_verified,
    },
    health: {
      age: settings.age || 25,
      activityLevel: settings.activity_level || 'moderate',
      healthConditions: settings.health_conditions || {
        asthma: false,
        copd: false,
        heartDisease: false,
        diabetes: false,
        pregnancy: false,
        elderly: false,
      },
      medications: settings.medications || '',
      emergencyContacts: emergencyContacts || [],
    },
    notifications: {
      email: settings.notification_settings?.email ?? true,
      push: settings.notification_settings?.push ?? true,
      sms: settings.notification_settings?.sms ?? false,
      alerts: settings.notification_settings?.alerts ?? true,
      browser: settings.notification_settings?.browser ?? true,
      sound: settings.notification_settings?.sound ?? true,
      vibration: settings.notification_settings?.vibration ?? true,
      frequency: settings.notification_settings?.frequency || 'immediate',
      quietHours: {
        start: settings.quiet_hours_start || '22:00',
        end: settings.quiet_hours_end || '07:00',
      },
    },
    privacy: {
      locationTracking: settings.privacy_settings?.locationTracking ?? true,
      analytics: settings.privacy_settings?.analytics ?? false,
      dataSharing: settings.privacy_settings?.dataSharing ?? false,
      autoRefresh: settings.privacy_settings?.autoRefresh ?? true,
      dataRetention: settings.data_retention || '1year',
      refreshInterval: settings.refresh_interval || 5,
    },
    display: {
      theme: settings.theme || 'dark',
      language: settings.language || 'english',
      temperatureUnit: settings.temperature_unit || 'celsius',
      distanceUnit: settings.distance_unit || 'kilometers',
      dateFormat: settings.date_format || 'mdy',
    },
    location: {
      defaultLocation: settings.default_location || {
        city: 'New York',
        country: 'USA',
        coordinates: { lat: 40.7128, lng: -74.0060 },
      },
      autoDetectLocation: settings.auto_detect_location ?? true,
      gpsAccuracy: settings.gps_accuracy || 'high',
      saveLocationHistory: settings.save_location_history ?? true,
      locationHistoryRetention: settings.location_history_retention || '30days',
    },
  };
}

// GET /api/settings - Get user settings
export async function GET() {
  try {
    // For now, use demo user - later replace with authenticated user
    const demoUserResponse = await dbClient.getUserByEmail('demo@breathewellalert.com');
    if (!demoUserResponse.data) {
      return NextResponse.json<ApiResponse<UserSettings>>({
        success: false,
        error: 'Demo user not found. Please initialize the database.',
      }, { status: 404 });
    }

    const userId = demoUserResponse.data.id;
    
    const [userResponse, settingsResponse] = await Promise.all([
      dbClient.getUserById(userId),
      dbClient.getUserSettings(userId),
    ]);

    if (!userResponse.data || !settingsResponse.data) {
      return NextResponse.json<ApiResponse<UserSettings>>({
        success: false,
        error: 'User or settings not found',
      }, { status: 404 });
    }

    const frontendSettings = await transformToFrontendSettings(userResponse.data, settingsResponse.data);

    return NextResponse.json<ApiResponse<UserSettings>>({
      success: true,
      data: frontendSettings,
    });
  } catch (error) {
    console.error('Error fetching settings:', error);
    return NextResponse.json<ApiResponse<UserSettings>>({
      success: false,
      error: 'Internal server error',
    }, { status: 500 });
  }
}

// PUT /api/settings - Update user settings
export async function PUT(request: NextRequest) {
  try {
    // For now, use demo user - later replace with authenticated user
    const demoUserResponse = await dbClient.getUserByEmail('demo@breathewellalert.com');
    if (!demoUserResponse.data) {
      return NextResponse.json<ApiResponse<UserSettings>>({
        success: false,
        error: 'Demo user not found',
      }, { status: 404 });
    }

    const userId = demoUserResponse.data.id;
    const update: SettingsUpdateRequest = await request.json();

    let userUpdates: Database['public']['Tables']['users']['Update'] = {};
    let settingsUpdates: Database['public']['Tables']['user_settings']['Update'] = {};

    // Transform frontend data to database format based on update type
    switch (update.type) {
      case 'profile':
        userUpdates = {
          first_name: (update.data as any).firstName,
          last_name: (update.data as any).lastName,
          phone: (update.data as any).phone,
        };
        break;

      case 'health':
        const healthData = update.data as any;
        settingsUpdates = {
          age: healthData.age,
          activity_level: healthData.activityLevel,
          health_conditions: healthData.healthConditions,
          medications: healthData.medications,
        };
        
        // Update emergency contacts separately
        if (healthData.emergencyContacts) {
          await dbClient.updateEmergencyContacts(userId, healthData.emergencyContacts);
        }
        break;

      case 'notifications':
        const notificationData = update.data as any;
        settingsUpdates = {
          notification_settings: {
            email: notificationData.email,
            push: notificationData.push,
            sms: notificationData.sms,
            alerts: notificationData.alerts,
            browser: notificationData.browser,
            sound: notificationData.sound,
            vibration: notificationData.vibration,
            frequency: notificationData.frequency,
          },
          quiet_hours_start: notificationData.quietHours?.start,
          quiet_hours_end: notificationData.quietHours?.end,
        };
        break;

      case 'privacy':
        const privacyData = update.data as any;
        settingsUpdates = {
          privacy_settings: {
            locationTracking: privacyData.locationTracking,
            analytics: privacyData.analytics,
            dataSharing: privacyData.dataSharing,
            autoRefresh: privacyData.autoRefresh,
          },
          data_retention: privacyData.dataRetention,
          refresh_interval: privacyData.refreshInterval,
        };
        break;

      case 'display':
        const displayData = update.data as any;
        settingsUpdates = {
          theme: displayData.theme,
          language: displayData.language,
          temperature_unit: displayData.temperatureUnit,
          distance_unit: displayData.distanceUnit,
          date_format: displayData.dateFormat,
        };
        break;

      case 'location':
        const locationData = update.data as any;
        settingsUpdates = {
          default_location: locationData.defaultLocation,
          auto_detect_location: locationData.autoDetectLocation,
          gps_accuracy: locationData.gpsAccuracy,
          save_location_history: locationData.saveLocationHistory,
          location_history_retention: locationData.locationHistoryRetention,
        };
        break;

      default:
        return NextResponse.json<ApiResponse<UserSettings>>({
          success: false,
          error: 'Invalid update type',
        }, { status: 400 });
    }

    // Update database
    const [updatedUser, updatedSettings] = await Promise.all([
      Object.keys(userUpdates).length > 0 ? dbClient.updateUser(userId, userUpdates) : dbClient.getUserById(userId),
      Object.keys(settingsUpdates).length > 0 ? dbClient.updateUserSettings(userId, settingsUpdates) : dbClient.getUserSettings(userId),
    ]);

    if (!updatedUser?.data || !updatedSettings?.data) {
      return NextResponse.json<ApiResponse<UserSettings>>({
        success: false,
        error: 'Failed to update settings',
      }, { status: 500 });
    }

    const frontendSettings = await transformToFrontendSettings(updatedUser.data, updatedSettings.data);

    return NextResponse.json<ApiResponse<UserSettings>>({
      success: true,
      data: frontendSettings,
    });
  } catch (error) {
    console.error('Error updating settings:', error);
    return NextResponse.json<ApiResponse<UserSettings>>({
      success: false,
      error: 'Internal server error',
    }, { status: 500 });
  }
}