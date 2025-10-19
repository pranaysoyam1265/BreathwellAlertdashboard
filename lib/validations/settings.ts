import { z } from 'zod';

export const profileSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().optional(),
});

export const healthSchema = z.object({
  age: z.number().min(1).max(120),
  activityLevel: z.enum(['sedentary', 'light', 'moderate', 'high', 'athletic']),
  healthConditions: z.record(z.boolean()),
  medications: z.string().optional(),
  emergencyContacts: z.array(z.object({
    name: z.string().min(1, 'Name is required'),
    phone: z.string().min(1, 'Phone is required'),
    relation: z.string().min(1, 'Relation is required'),
  })).optional(),
});

export const notificationSchema = z.object({
  email: z.boolean(),
  push: z.boolean(),
  sms: z.boolean(),
  alerts: z.boolean(),
  browser: z.boolean(),
  sound: z.boolean(),
  vibration: z.boolean(),
  frequency: z.enum(['immediate', 'hourly', 'daily']),
  quietHours: z.object({
    start: z.string(),
    end: z.string(),
  }),
});

export const privacySchema = z.object({
  locationTracking: z.boolean(),
  analytics: z.boolean(),
  dataSharing: z.boolean(),
  autoRefresh: z.boolean(),
  dataRetention: z.enum(['3months', '6months', '1year', '2years', 'forever']),
  refreshInterval: z.number().min(1).max(60),
});

export const displaySchema = z.object({
  theme: z.enum(['light', 'dark', 'system']),
  language: z.enum(['english', 'spanish', 'french', 'german', 'chinese', 'japanese']),
  temperatureUnit: z.enum(['celsius', 'fahrenheit']),
  distanceUnit: z.enum(['kilometers', 'miles']),
  dateFormat: z.enum(['mdy', 'dmy', 'ymd']),
});

export const locationSchema = z.object({
  defaultLocation: z.object({
    city: z.string().min(1, 'City is required'),
    country: z.string().min(1, 'Country is required'),
    coordinates: z.object({
      lat: z.number(),
      lng: z.number(),
    }).optional(),
  }),
  autoDetectLocation: z.boolean(),
  gpsAccuracy: z.enum(['low', 'medium', 'high']),
  saveLocationHistory: z.boolean(),
  locationHistoryRetention: z.enum(['7days', '30days', '90days', '1year']),
});

export const passwordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});