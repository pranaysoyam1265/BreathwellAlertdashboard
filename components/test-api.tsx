// components/test-api.tsx
'use client';

import { useState } from 'react';
import { getCurrentLocation, fetchAllData } from '@/lib/api-service';

export function TestApi() {
  const [status, setStatus] = useState<string>('Idle');
  const [data, setData] = useState<any>(null);

  const testApis = async () => {
    setStatus('Getting location...');
    try {
      const location = await getCurrentLocation();
      setStatus(`Location: ${location.city}, ${location.country}`);
      
      setStatus('Fetching weather and air quality...');
      const allData = await fetchAllData(location.latitude, location.longitude);
      
      setData(allData);
      setStatus('Success! Data loaded');
    } catch (error) {
      setStatus(`Error: ${error instanceof Error ? error.message : 'An unknown error occurred'}`);
    }
  };

  return (
    <div className="p-4 border rounded-lg">
      <h3 className="text-lg font-semibold mb-2">API Test</h3>
      <button 
        onClick={testApis}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Test APIs
      </button>
      <div className="mt-2">
        <p>Status: {status}</p>
        {data && (
          <pre className="text-xs mt-2">
            {JSON.stringify(data, null, 2)}
          </pre>
        )}
      </div>
    </div>
  );
}