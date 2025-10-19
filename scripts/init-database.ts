// Load environment variables FIRST
import 'dotenv/config';
import { getDbClient } from '@/lib/database/client';
const dbClient = getDbClient();

async function initDatabase() {
  console.log('🔌 Testing database connection...');
  
  // Check environment variables
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    console.error('❌ Missing Supabase environment variables');
    console.log('Please check your .env.local file');
    process.exit(1);
  }
  
  const isConnected = await dbClient.testConnection();
  
  if (!isConnected) {
    console.error('❌ Database connection failed');
    process.exit(1);
  }
  
  console.log('✅ Database connection successful');
  
  // Initialize demo user if needed
  const demoUserId = 'demo-user-123';
  const demoEmail = 'demo@example.com';
  
  console.log('🚀 Initializing demo user...');
  const result = await dbClient.initializeDemoUser(demoUserId, demoEmail);
  
  if (result.settings.error || result.healthProfile.error || result.alertThresholds.error) {
    console.error('❌ Failed to initialize demo user');
    process.exit(1);
  }
  
  console.log('✅ Demo user initialized successfully');
  console.log('🎉 Database initialization complete!');
  
  process.exit(0);
}

// Run if this script is executed directly
if (require.main === module) {
  initDatabase().catch(console.error);
}

export { initDatabase };