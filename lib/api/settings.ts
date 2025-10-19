import { UserSettings, ApiResponse, SettingsUpdateRequest } from '@/lib/types/settings';

class SettingsApi {
  private baseUrl = '/api';

  async getUserSettings(): Promise<UserSettings> {
    try {
      const response = await fetch(`${this.baseUrl}/settings`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result: ApiResponse<UserSettings> = await response.json();
      
      if (!result.success || !result.data) {
        throw new Error(result.error || 'Failed to fetch user settings');
      }

      return result.data;
    } catch (error) {
      console.error('API Error in getUserSettings:', error);
      throw new Error('Unable to connect to server. Please check your connection and try again.');
    }
  }

  async updateSettings(update: SettingsUpdateRequest): Promise<UserSettings> {
    try {
      const response = await fetch(`${this.baseUrl}/settings`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(update),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result: ApiResponse<UserSettings> = await response.json();
      
      if (!result.success || !result.data) {
        throw new Error(result.error || 'Failed to update settings');
      }

      return result.data;
    } catch (error) {
      console.error('API Error in updateSettings:', error);
      throw new Error('Unable to save settings. Please check your connection and try again.');
    }
  }

  // ... rest of the methods with similar error handling
  async updateUserProfile(profile: Partial<UserSettings['profile']>): Promise<UserSettings> {
    return this.updateSettings({
      type: 'profile',
      data: profile,
    });
  }

  async updateHealthProfile(health: Partial<UserSettings['health']>): Promise<UserSettings> {
    return this.updateSettings({
      type: 'health',
      data: health,
    });
  }

  async updateNotificationSettings(notifications: Partial<UserSettings['notifications']>): Promise<UserSettings> {
    return this.updateSettings({
      type: 'notifications',
      data: notifications,
    });
  }

  async updatePrivacySettings(privacy: Partial<UserSettings['privacy']>): Promise<UserSettings> {
    return this.updateSettings({
      type: 'privacy',
      data: privacy,
    });
  }

  async updateDisplaySettings(display: Partial<UserSettings['display']>): Promise<UserSettings> {
    return this.updateSettings({
      type: 'display',
      data: display,
    });
  }

  async updateLocationSettings(location: Partial<UserSettings['location']>): Promise<UserSettings> {
    return this.updateSettings({
      type: 'location',
      data: location,
    });
  }

  async uploadProfilePicture(file: File): Promise<{ url: string }> {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch(`${this.baseUrl}/user/avatar`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result: ApiResponse<{ url: string }> = await response.json();
      
      if (!result.success || !result.data) {
        throw new Error(result.error || 'Failed to upload profile picture');
      }

      return result.data;
    } catch (error) {
      console.error('API Error in uploadProfilePicture:', error);
      throw new Error('Unable to upload profile picture. Please try again.');
    }
  }

  async changePassword(currentPassword: string, newPassword: string): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}/user/password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result: ApiResponse<void> = await response.json();
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to change password');
      }
    } catch (error) {
      console.error('API Error in changePassword:', error);
      throw new Error('Unable to change password. Please try again.');
    }
  }

  async exportUserData(): Promise<Blob> {
    try {
      const response = await fetch(`${this.baseUrl}/user/export`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return response.blob();
    } catch (error) {
      console.error('API Error in exportUserData:', error);
      throw new Error('Unable to export data. Please try again.');
    }
  }

  async deleteAccount(): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}/user/delete`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result: ApiResponse<void> = await response.json();
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to delete account');
      }
    } catch (error) {
      console.error('API Error in deleteAccount:', error);
      throw new Error('Unable to delete account. Please try again.');
    }
  }
}

export const settingsApi = new SettingsApi();