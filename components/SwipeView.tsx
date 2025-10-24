'use client';

import { useState, useEffect } from 'react';
import { PropertyCard } from './PropertyCard';
import { PreferencesModal } from './PreferencesModal';
import { LikedPropertiesView } from './LikedPropertiesView';
import type { Property, UserPreferences } from '../types';

interface SwipeViewProps {
  properties: Property[];
}

export const SwipeView: React.FC<SwipeViewProps> = ({ properties }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [likedProperties, setLikedProperties] = useState<Property[]>([]);
  const [passedProperties, setPassedProperties] = useState<Property[]>([]);
  const [showPreferences, setShowPreferences] = useState(true);
  const [showLikedView, setShowLikedView] = useState(false);
  const [hasSetPreferences, setHasSetPreferences] = useState(false);
  const [filteredProperties, setFilteredProperties] = useState<Property[]>(properties);
  const [preferences, setPreferences] = useState<UserPreferences>({
    minPrice: 0,
    maxPrice: 10000000,
    minBedrooms: 0,
    minBathrooms: 0,
    minSquareFeet: 0,
    maxSquareFeet: 10000,
    minYearBuilt: 1900,
    minLotSize: 0,
    maxDaysOnMarket: 365,
    noHOA: false,
    petFriendly: false,
    propertyTypes: [],
    states: [],
    cities: [],
    mustHaveFeatures: [],
    sortBy: 'newest',
  });

  useEffect(() => {
    let filtered = properties.filter((property) => {
      if (property.price < preferences.minPrice || property.price > preferences.maxPrice) {
        return false;
      }
      if (property.bedrooms < preferences.minBedrooms) {
        return false;
      }
      if (property.bathrooms < preferences.minBathrooms) {
        return false;
      }
      if (property.squareFeet < preferences.minSquareFeet || property.squareFeet > preferences.maxSquareFeet) {
        return false;
      }
      if (property.yearBuilt < preferences.minYearBuilt) {
        return false;
      }
      if (preferences.minLotSize > 0 && property.lotSize && property.lotSize < preferences.minLotSize) {
        return false;
      }
      if (property.daysOnMarket > preferences.maxDaysOnMarket) {
        return false;
      }
      if (preferences.noHOA && property.hasHOA) {
        return false;
      }
      if (preferences.petFriendly && !property.petFriendly) {
        return false;
      }
      if (preferences.propertyTypes.length > 0 && !preferences.propertyTypes.includes(property.propertyType)) {
        return false;
      }
      if (preferences.states.length > 0 && !preferences.states.includes(property.state)) {
        return false;
      }
      if (preferences.cities.length > 0 && !preferences.cities.includes(property.city)) {
        return false;
      }
      if (preferences.mustHaveFeatures.length > 0) {
        const hasAllFeatures = preferences.mustHaveFeatures.every((feature) =>
          property.features.includes(feature)
        );
        if (!hasAllFeatures) {
          return false;
        }
      }
      return true;
    });

    switch (preferences.sortBy) {
      case 'price-asc':
        filtered = filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        filtered = filtered.sort((a, b) => b.price - a.price);
        break;
      case 'newest':
        filtered = filtered.sort((a, b) => a.daysOnMarket - b.daysOnMarket);
        break;
      case 'sqft-desc':
        filtered = filtered.sort((a, b) => b.squareFeet - a.squareFeet);
        break;
      case 'price-per-sqft':
        filtered = filtered.sort((a, b) => (a.price / a.squareFeet) - (b.price / b.squareFeet));
        break;
    }

    setFilteredProperties(filtered);
    setCurrentIndex(0);
  }, [preferences, properties]);

  const handleLove = () => {
    const currentProperty = filteredProperties[currentIndex];
    setLikedProperties([...likedProperties, currentProperty]);
    setCurrentIndex(currentIndex + 1);
  };

  const handleHate = () => {
    const currentProperty = filteredProperties[currentIndex];
    setPassedProperties([...passedProperties, currentProperty]);
    setCurrentIndex(currentIndex + 1);
  };

  const handleSavePreferences = (newPreferences: UserPreferences) => {
    setPreferences(newPreferences);
    setHasSetPreferences(true);
  };

  if (currentIndex >= filteredProperties.length) {
    if (likedProperties.length > 0) {
      return (
        <div className="flex flex-col items-center justify-center h-screen relative p-8">
          <div
            className="absolute inset-0 bg-cover bg-center opacity-20"
            style={{ backgroundImage: 'url(/requirements-to-buy-a-house.webp)' }}
          />
          <div className="relative z-10 flex flex-col items-center">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">All Done! 🎉</h2>
            <p className="text-gray-600 mb-8">You&apos;ve reviewed all available properties.</p>
            <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
              <h3 className="text-xl font-semibold mb-4">Your Stats:</h3>
              <div className="space-y-2 mb-6">
                <p className="text-gray-700">
                  <span className="font-semibold">Liked:</span> {likedProperties.length} properties ♥
                </p>
                <p className="text-gray-700">
                  <span className="font-semibold">Passed:</span> {passedProperties.length} properties
                </p>
              </div>
              <button
                onClick={() => setShowLikedView(true)}
                className="w-full bg-emerald-500 hover:bg-emerald-600 text-white py-3 px-6 rounded-lg font-semibold transition-colors shadow-md mb-3"
              >
                View My {likedProperties.length} Liked Properties
              </button>
              <button
                onClick={() => {
                  setCurrentIndex(0);
                  setLikedProperties([]);
                  setPassedProperties([]);
                }}
                className="w-full bg-white border-2 border-gray-300 text-gray-700 py-3 px-6 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
              >
                Start Over
              </button>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="flex flex-col items-center justify-center h-screen relative p-8">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{ backgroundImage: 'url(/requirements-to-buy-a-house.webp)' }}
        />
        <div className="relative z-10 flex flex-col items-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">All Done!</h2>
          <p className="text-gray-600 mb-8">You&apos;ve reviewed all available properties.</p>
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
            <p className="text-gray-700 mb-6">
              You didn&apos;t like any properties. Try adjusting your filters?
            </p>
            <button
              onClick={() => {
                setCurrentIndex(0);
                setLikedProperties([]);
                setPassedProperties([]);
              }}
              className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Start Over
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!hasSetPreferences) {
    return (
      <div className="h-full flex flex-col items-center justify-center py-4 relative">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{ backgroundImage: 'url(/requirements-to-buy-a-house.webp)' }}
        />
        <div className="relative z-10 flex flex-col items-center">
          <div className="mb-8">
            <img src="/logo.png" alt="HomeMatch" className="h-64 w-auto" />
          </div>

          <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-2xl p-8 max-w-md text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Welcome to HomeMatch!</h2>
            <p className="text-gray-600 mb-6">
              Find your dream home by swiping through properties that match your preferences.
            </p>
            <p className="text-gray-700 font-medium mb-8">
              Let&apos;s start by setting your search criteria
            </p>
            <button
              onClick={() => setShowPreferences(true)}
              className="w-full bg-emerald-500 hover:bg-emerald-600 text-white py-4 px-8 rounded-lg font-bold text-lg transition-all shadow-lg active:scale-95"
            >
              Set My Preferences
            </button>
          </div>

          <PreferencesModal
            isOpen={showPreferences}
            onClose={() => setShowPreferences(false)}
            onSave={handleSavePreferences}
            initialPreferences={preferences}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col items-center py-4 overflow-y-auto relative">
      <div
        className="absolute inset-0 bg-cover bg-center opacity-20"
        style={{ backgroundImage: 'url(/requirements-to-buy-a-house.webp)' }}
      />
      <div className="relative z-10 flex flex-col items-center w-full">
        <div className="mb-2 flex-shrink-0">
          <img src="/logo.png" alt="HomeMatch" className="h-64 w-auto" />
        </div>

        <div className="flex-shrink-0">
          <PropertyCard
            property={filteredProperties[currentIndex]}
            onLove={handleLove}
            onHate={handleHate}
          />
        </div>

        <div className="w-full max-w-[1000px] mt-3 flex-shrink-0">
          <div className="flex justify-between items-center text-sm text-gray-600 bg-white/80 backdrop-blur-sm rounded-lg px-4 py-2 shadow-sm">
            <span>Property {currentIndex + 1} of {filteredProperties.length}</span>
            <button
              onClick={() => setShowPreferences(true)}
              className="px-3 py-1 bg-white border border-gray-300 text-gray-700 rounded-lg text-xs font-medium hover:bg-gray-50 transition-colors"
            >
              ⚙ Filters
            </button>
            <span className="text-emerald-600 font-semibold">{likedProperties.length} ♥</span>
          </div>
        </div>

        {likedProperties.length > 0 && (
          <div className="mt-3 flex-shrink-0 mb-4">
            <button
              onClick={() => setShowLikedView(true)}
              className="text-blue-600 hover:text-blue-700 font-semibold text-sm"
            >
              View {likedProperties.length} Liked Properties
            </button>
          </div>
        )}

        <PreferencesModal
          isOpen={showPreferences}
          onClose={() => setShowPreferences(false)}
          onSave={handleSavePreferences}
          initialPreferences={preferences}
        />

        {showLikedView && (
          <LikedPropertiesView
            likedProperties={likedProperties}
            onClose={() => setShowLikedView(false)}
          />
        )}
      </div>
    </div>
  );
};
