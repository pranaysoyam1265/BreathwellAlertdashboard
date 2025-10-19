import { NextRequest, NextResponse } from 'next/server';
// Instead of: import { SupabaseDatabaseClient } from '@/lib/database/client';
// Use this:
import { getDbClient } from '@/lib/database/client';
const dbClient = getDbClient();
import { ApiResponse } from '@/lib/types/settings';

export async function POST(request: NextRequest) {
  try {
    const userId = 'user-1';
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json<ApiResponse<{ url: string }>>({
        success: false,
        error: 'No file provided',
      }, { status: 400 });
    }

    // Mock implementation - in real app, upload to cloud storage
    const mockUrl = `/placeholder-user.jpg`;

    await dbClient.updateUser(userId, {
      profile_picture_url: mockUrl,
    });

    return NextResponse.json<ApiResponse<{ url: string }>>({
      success: true,
      data: { url: mockUrl },
    });
  } catch (error) {
    console.error('Error uploading avatar:', error);
    return NextResponse.json<ApiResponse<{ url: string }>>({
      success: false,
      error: 'Internal server error',
    }, { status: 500 });
  }
}