import { NextRequest, NextResponse } from 'next/server';
import { getDbClient } from '@/lib/database/client';
const dbClient = getDbClient();

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    // Fetch all user data
    const [userResult, settingsResult, healthResult, thresholdsResult, contactsResult] = await Promise.all([
      dbClient.getUserById(userId),
      dbClient.getUserSettings(userId),
      dbClient.getUserHealthProfile(userId),
      dbClient.getUserAlertThresholds(userId),
      dbClient.getEmergencyContacts(userId)
    ]);

    const exportData = {
      user: userResult.data,
      settings: settingsResult.data,
      healthProfile: healthResult.data,
      alertThresholds: thresholdsResult.data,
      emergencyContacts: contactsResult.data
    };

    return NextResponse.json(exportData);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to export user data' },
      { status: 500 }
    );
  }
}