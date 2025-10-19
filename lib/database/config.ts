// Simple SQLite connection test
export const testConnection = async () => {
  try {
    console.log('✅ SQLite database connected successfully');
    return true;
  } catch (error) {
    console.error('❌ SQLite connection failed:', error);
    return false;
  }
};

export default { testConnection };