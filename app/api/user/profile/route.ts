import { NextRequest, NextResponse } from 'next/server';
// Instead of: import { SupabaseDatabaseClient } from '@/lib/database/client';
// Use this:
import { getDbClient } from '@/lib/database/client';
const dbClient = getDbClient();
import { Database } from '@/lib/types/database';
import { ApiResponse } from '@/lib/types/settings';

// PUT /api/user/profile - Update user profile
export async function PUT(request: NextRequest) {
  try {
    const userId = 'user-1'; // Mock user ID for development
    const updates = await request.json();

    const userUpdates: Database['public']['Tables']['users']['Update'] = {
      first_name: updates.firstName,
      last_name: updates.lastName,
      phone: updates.phone,
    };

    const updatedUser = await dbClient.updateUser(userId, userUpdates);

    if (!updatedUser) {
      return NextResponse.json<ApiResponse<void>>({
        success: false,
        error: 'Failed to update profile',
      }, { status: 500 });
    }

    return NextResponse.json<ApiResponse<void>>({
      success: true,
    });
  } catch (error) {
    console.error('Error updating profile:', error);
    return NextResponse.json<ApiResponse<void>>({
      success: false,
      error: 'Internal server error',
    }, { status: 500 });
  }
}