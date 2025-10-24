'use client';

import { useState, useEffect } from 'react';
import { SwipeView } from '@/components/SwipeView';
import { mockProperties } from '@/data/mockProperties';
import { searchProperties } from '@/services/realtorApi';
import type { Property } from '@/types';

export default function Home() {
  const [properties, setProperties] = useState<Property[]>(mockProperties);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [useRealData, setUseRealData] = useState(false);

  useEffect(() => {
    const apiKey = process.env.NEXT_PUBLIC_RAPIDAPI_KEY;
    if (apiKey && useRealData) {
      loadRealProperties();
    }
  }, [useRealData]);

  const loadRealProperties = async () => {
    setLoading(true);
    setError(null);

    try {
      const realProperties = await searchProperties('Charlottesville', 'VA', 30);

      if (realProperties.length > 0) {
        setProperties(realProperties);
      } else {
        setError('No properties found. Using mock data.');
        setProperties(mockProperties);
      }
    } catch (err) {
      console.error('Failed to load properties:', err);
      setError('Failed to load real properties. Using mock data.');
      setProperties(mockProperties);
    } finally {
      setLoading(false);
    }
  };

  const hasApiKey = !!process.env.NEXT_PUBLIC_RAPIDAPI_KEY;

  return (
    <div className="h-screen overflow-hidden relative">
      {/* Background Image - Faded */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-20"
        style={{ backgroundImage: 'url(/requirements-to-buy-a-house.webp)' }}
      />

      {/* Content Overlay */}
      <div className="relative h-full">
        {/* API Toggle - Only show if API key is configured */}
        {hasApiKey && (
          <div className="absolute top-4 right-4 z-50">
            <div className="bg-white/90 backdrop-blur-sm rounded-lg shadow-lg p-3">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={useRealData}
                  onChange={(e) => setUseRealData(e.target.checked)}
                  className="w-4 h-4 text-emerald-500 rounded focus:ring-2 focus:ring-emerald-500"
                />
                <span className="text-sm font-medium text-gray-700">
                  Use Real Listings
                </span>
              </label>
              {loading && (
                <p className="text-xs text-gray-500 mt-1">Loading...</p>
              )}
              {error && (
                <p className="text-xs text-red-500 mt-1">{error}</p>
              )}
            </div>
          </div>
        )}

        {loading ? (
          <div className="h-full flex items-center justify-center">
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500 mb-4"></div>
              <p className="text-gray-700 font-medium">Loading properties...</p>
            </div>
          </div>
        ) : (
          <SwipeView properties={properties} />
        )}
      </div>
    </div>
  );
}
