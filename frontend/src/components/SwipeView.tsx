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
  const [showPreferences, setShowPreferences] = useState(false);
  const [showLikedView, setShowLikedView] = useState(false);
  const [filteredProperties, setFilteredProperties] = useState<Property[]>(properties);
  const [preferences, setPreferences] = useState<UserPreferences>({
    minPrice: 0,
    maxPrice: 10000000,
    minBedrooms: 0,
    minBathrooms: 0,
    propertyTypes: [],
    states: [],
    cities: [],
    mustHaveFeatures: [],
  });

  // Filter properties based on preferences
  useEffect(() => {
    const filtered = properties.filter((property) => {
      // Price filter
      if (property.price < preferences.minPrice || property.price > preferences.maxPrice) {
        return false;
      }

      // Bedrooms filter
      if (property.bedrooms < preferences.minBedrooms) {
        return false;
      }

      // Bathrooms filter
      if (property.bathrooms < preferences.minBathrooms) {
        return false;
      }

      // Property type filter
      if (preferences.propertyTypes.length > 0 && !preferences.propertyTypes.includes(property.propertyType)) {
        return false;
      }

      // State filter
      if (preferences.states.length > 0 && !preferences.states.includes(property.state)) {
        return false;
      }

      // Must-have features filter
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
  };

  if (currentIndex >= filteredProperties.length) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-50 p-8">
        <h2 className="text-4xl font-bold text-gray-900 mb-4">No More Properties!</h2>
        <p className="text-gray-600 mb-8">You've reviewed all available properties.</p>
        <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
          <h3 className="text-xl font-semibold mb-4">Your Stats:</h3>
          <div className="space-y-2">
            <p className="text-gray-700">
              <span className="font-semibold">Liked:</span> {likedProperties.length} properties
            </p>
            <p className="text-gray-700">
              <span className="font-semibold">Passed:</span> {passedProperties.length} properties
            </p>
          </div>
          <button
            onClick={() => {
              setCurrentIndex(0);
              setLikedProperties([]);
              setPassedProperties([]);
            }}
            className="mt-6 w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            Start Over
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 pt-8">
      {/* Header Stats */}
      <div className="w-full max-w-md mb-4">
        <div className="flex justify-between items-center text-sm text-gray-600 bg-white/60 backdrop-blur-sm rounded-lg px-4 py-2 shadow-sm">
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

      {/* Property Card */}
      <PropertyCard
        property={filteredProperties[currentIndex]}
        onLove={handleLove}
        onHate={handleHate}
      />

      {/* View Liked Button */}
      {likedProperties.length > 0 && (
        <div className="mt-6">
          <button
            onClick={() => setShowLikedView(true)}
            className="text-blue-600 hover:text-blue-700 font-semibold"
          >
            View {likedProperties.length} Liked Properties
          </button>
        </div>
      )}

      {/* Preferences Modal */}
      <PreferencesModal
        isOpen={showPreferences}
        onClose={() => setShowPreferences(false)}
        onSave={handleSavePreferences}
        initialPreferences={preferences}
      />

      {/* Liked Properties View */}
      {showLikedView && (
        <LikedPropertiesView
          likedProperties={likedProperties}
          onClose={() => setShowLikedView(false)}
        />
      )}
    </div>
  );
};
