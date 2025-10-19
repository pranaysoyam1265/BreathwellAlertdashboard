import { useCallback } from 'react';
import { useSettings as useSettingsContext } from '@/contexts/SettingsContext';
import { SettingsUpdateRequest, UserSettings } from '@/lib/types/settings';
import { settingsApi } from '@/lib/api/settings';

export function useSettings() {
  const context = useSettingsContext();

  const updateProfile = useCallback(async (profile: Partial<UserSettings['profile']>) => {
    return context.updateSettings({
      type: 'profile',
      data: profile,
    });
  }, [context]);

  const updateHealth = useCallback(async (health: Partial<UserSettings['health']>) => {
    return context.updateSettings({
      type: 'health',
      data: health,
    });
  }, [context]);

  const updateNotifications = useCallback(async (notifications: Partial<UserSettings['notifications']>) => {
    return context.updateSettings({
      type: 'notifications',
      data: notifications,
    });
  }, [context]);

  const updatePrivacy = useCallback(async (privacy: Partial<UserSettings['privacy']>) => {
    return context.updateSettings({
      type: 'privacy',
      data: privacy,
    });
  }, [context]);

  const updateDisplay = useCallback(async (display: Partial<UserSettings['display']>) => {
    return context.updateSettings({
      type: 'display',
      data: display,
    });
  }, [context]);

  const updateLocation = useCallback(async (location: Partial<UserSettings['location']>) => {
    return context.updateSettings({
      type: 'location',
      data: location,
    });
  }, [context]);

  const uploadProfilePicture = useCallback(async (file: File) => {
    return settingsApi.uploadProfilePicture(file);
  }, []);

  const changePassword = useCallback(async (currentPassword: string, newPassword: string) => {
    return settingsApi.changePassword(currentPassword, newPassword);
  }, []);

  const exportData = useCallback(async () => {
    return settingsApi.exportUserData();
  }, []);

  const deleteAccount = useCallback(async () => {
    return settingsApi.deleteAccount();
  }, []);

  return {
    ...context,
    updateProfile,
    updateHealth,
    updateNotifications,
    updatePrivacy,
    updateDisplay,
    updateLocation,
    uploadProfilePicture,
    changePassword,
    exportData,
    deleteAccount,
  };
}