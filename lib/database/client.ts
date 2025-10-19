import { getSupabaseClient } from '@/lib/supabase/client';

export class SupabaseDatabaseClient {
  private client;

  constructor() {
    // Initialize client when class is instantiated (not at import time)
    this.client = getSupabaseClient();
  }

  // Basic connection test
  async testConnection(): Promise<boolean> {
    try {
      const { data, error } = await this.client.from('users').select('count').limit(1);
      return !error;
    } catch {
      return false;
    }
  }

  // User methods
  async getUserById(userId: string) {
    return this.client.from('users').select('*').eq('id', userId).single();
  }

  async getUserByEmail(email: string) {
    return this.client.from('users').select('*').eq('email', email).single();
  }

  async createUser(userData: any) {
    return this.client.from('users').insert([userData]).select().single();
  }

  async updateUser(userId: string, updates: any) {
    return this.client.from('users').update(updates).eq('id', userId).select().single();
  }

  async deleteUser(userId: string) {
    return this.client.from('users').delete().eq('id', userId);
  }

  // Settings methods
  async getUserSettings(userId: string) {
    return this.client.from('user_settings').select('*').eq('user_id', userId).single();
  }

  async updateUserSettings(userId: string, updates: any) {
    return this.client.from('user_settings').update(updates).eq('user_id', userId).select().single();
  }

  // Emergency contacts
  async getEmergencyContacts(userId: string) {
    return this.client.from('emergency_contacts').select('*').eq('user_id', userId);
  }

  async updateEmergencyContacts(userId: string, contacts: any[]) {
    // First delete existing contacts
    await this.client.from('emergency_contacts').delete().eq('user_id', userId);
    
    // Then insert new ones
    if (contacts.length > 0) {
      const contactsWithUserId = contacts.map(contact => ({
        ...contact,
        user_id: userId
      }));
      return this.client.from('emergency_contacts').insert(contactsWithUserId);
    }
    
    return { data: null, error: null };
  }

  // Health profile
  async getUserHealthProfile(userId: string) {
    return this.client.from('user_health_profiles').select('*').eq('user_id', userId).single();
  }

  async updateUserHealthProfile(userId: string, updates: any) {
    return this.client.from('user_health_profiles').update(updates).eq('user_id', userId).select().single();
  }

  // Alert thresholds
  async getUserAlertThresholds(userId: string) {
    return this.client.from('user_alert_thresholds').select('*').eq('user_id', userId).single();
  }

  async updateUserAlertThresholds(userId: string, updates: any) {
    return this.client.from('user_alert_thresholds').update(updates).eq('user_id', userId).select().single();
  }

  // Demo user initialization
  async initializeDemoUser(userId: string, email: string) {
    // Create default settings
    const defaultSettings = {
      user_id: userId,
      theme: 'light',
      notifications_enabled: true,
      air_quality_threshold: 50,
      location_services: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    // Create default health profile
    const defaultHealthProfile = {
      user_id: userId,
      has_asthma: false,
      has_copd: false,
      sensitivity_level: 'medium',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    // Create default alert thresholds
    const defaultAlertThresholds = {
      user_id: userId,
      aqi_threshold: 100,
      pm25_threshold: 35,
      pollen_threshold: 'medium',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    // Execute all inserts
    const [settingsResult, healthResult, thresholdsResult] = await Promise.all([
      this.client.from('user_settings').insert([defaultSettings]),
      this.client.from('user_health_profiles').insert([defaultHealthProfile]),
      this.client.from('user_alert_thresholds').insert([defaultAlertThresholds])
    ]);

    return {
      settings: settingsResult,
      healthProfile: healthResult,
      alertThresholds: thresholdsResult
    };
  }
}

// Export a function that creates the client when needed
export function createDatabaseClient() {
  return new SupabaseDatabaseClient();
}

// Export a singleton instance (created when first used)
let dbClientInstance: SupabaseDatabaseClient | null = null;
export function getDbClient() {
  if (!dbClientInstance) {
    dbClientInstance = new SupabaseDatabaseClient();
  }
  return dbClientInstance;
}