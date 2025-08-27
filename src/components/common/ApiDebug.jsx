import React from 'react';
import { useGetEventsQuery } from '@api/eventApi';

export default function ApiDebug() {
  const { data, isLoading, error } = useGetEventsQuery({ page: 0, size: 10 });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {JSON.stringify(error)}</div>;

  return (
    <div className="p-4 bg-white rounded-lg shadow">
      <h2 className="text-lg font-bold mb-4">API Debug Info</h2>
      <div className="mb-4">
        <h3 className="font-semibold">Raw Data:</h3>
        <pre className="bg-gray-100 p-2 rounded text-xs overflow-auto">
          {JSON.stringify(data, null, 2)}
        </pre>
      </div>
      <div className="mb-4">
        <h3 className="font-semibold">Data Type: {typeof data}</h3>
        <p>Is Array: {Array.isArray(data) ? 'Yes' : 'No'}</p>
        <p>Has content property: {data && data.content ? 'Yes' : 'No'}</p>
      </div>
      {data && (
        <div>
          <h3 className="font-semibold">First Event (if exists):</h3>
          <pre className="bg-gray-100 p-2 rounded text-xs overflow-auto">
            {JSON.stringify(Array.isArray(data) ? data[0] : data.content?.[0], null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
} 