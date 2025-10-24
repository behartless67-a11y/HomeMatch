'use client';

import { useState } from 'react';
import type { UserPreferences } from '../types';

interface PreferencesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (preferences: UserPreferences) => void;
  initialPreferences: UserPreferences;
}

export const PreferencesModal: React.FC<PreferencesModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialPreferences,
}) => {
  const [preferences, setPreferences] = useState<UserPreferences>(initialPreferences);

  if (!isOpen) return null;

  const handleSave = () => {
    onSave(preferences);
    onClose();
  };

  const propertyTypeOptions = ['house', 'condo', 'townhouse', 'apartment'];
  const stateOptions = ['VA', 'CA', 'TX', 'FL', 'NY', 'WA', 'CO', 'NC'];
  const cityOptions = ['Charlottesville', 'Crozet', 'Scottsville', 'Earlysville', 'Keswick', 'White Hall'];
  const featureOptions = [
    'Pool',
    'Garage',
    'Hardwood Floors',
    'Smart Home',
    'Central AC',
    'Fireplace',
    'Deck',
    'Patio',
    'Fenced Yard',
    'Updated Kitchen',
    'Updated Bathrooms',
    'Walk-in Closet',
    'Laundry Room',
    'Basement',
    'Home Office',
    'Ocean View',
    'Mountain View',
    'Lake View',
    'Energy Efficient',
    'Solar Panels',
    'EV Charging',
    'Security System',
    'Gated Community',
  ];
  const sortOptions = [
    { value: 'newest', label: 'Newest First' },
    { value: 'price-asc', label: 'Price: Low to High' },
    { value: 'price-desc', label: 'Price: High to Low' },
    { value: 'sqft-desc', label: 'Largest First' },
    { value: 'price-per-sqft', label: 'Best Value ($/sqft)' },
  ];

  const toggleArrayItem = (array: string[], item: string) => {
    if (array.includes(item)) {
      return array.filter((i) => i !== item);
    }
    return [...array, item];
  };

  return (
    <div
      className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 z-50 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl max-w-6xl w-full max-h-[95vh] my-auto overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.3)] border-4 border-teal-400 touch-none"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with colored background */}
        <div className="bg-gradient-to-r from-teal-500 to-teal-600 p-8 shadow-lg">
          <div className="flex justify-between items-center">
            <h2 className="text-4xl font-bold text-white drop-shadow-lg">Set Your Preferences</h2>
            <button
              onClick={onClose}
              className="text-white hover:text-orange-300 text-4xl font-bold hover:rotate-90 transition-all duration-300"
            >
              ×
            </button>
          </div>
          <p className="text-teal-50 mt-2 text-lg">Customize your property search criteria</p>
        </div>

        <div className="p-8 overflow-y-auto max-h-[calc(95vh-180px)]">

          {/* Price Range */}
          <div className="mb-6">
            <h3 className="font-semibold text-gray-900 mb-3">Price Range</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-600 mb-1">Min Price</label>
                <input
                  type="number"
                  value={preferences.minPrice}
                  onChange={(e) =>
                    setPreferences({ ...preferences, minPrice: Number(e.target.value) })
                  }
                  className="w-full px-3 py-2 border border-gray-300 hover:border-teal-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                  placeholder="100000"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Max Price</label>
                <input
                  type="number"
                  value={preferences.maxPrice}
                  onChange={(e) =>
                    setPreferences({ ...preferences, maxPrice: Number(e.target.value) })
                  }
                  className="w-full px-3 py-2 border border-gray-300 hover:border-teal-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                  placeholder="1000000"
                />
              </div>
            </div>
          </div>

          {/* Bedrooms & Bathrooms */}
          <div className="mb-6">
            <h3 className="font-semibold text-gray-900 mb-3">Minimum Requirements</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-600 mb-1">Min Bedrooms</label>
                <input
                  type="number"
                  value={preferences.minBedrooms}
                  onChange={(e) =>
                    setPreferences({ ...preferences, minBedrooms: Number(e.target.value) })
                  }
                  min="0"
                  className="w-full px-3 py-2 border border-gray-300 hover:border-teal-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Min Bathrooms</label>
                <input
                  type="number"
                  value={preferences.minBathrooms}
                  onChange={(e) =>
                    setPreferences({ ...preferences, minBathrooms: Number(e.target.value) })
                  }
                  min="0"
                  step="0.5"
                  className="w-full px-3 py-2 border border-gray-300 hover:border-teal-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
            </div>
          </div>

          {/* Property Types */}
          <div className="mb-6">
            <h3 className="font-semibold text-gray-900 mb-3">Property Types</h3>
            <div className="flex flex-wrap gap-2">
              {propertyTypeOptions.map((type) => (
                <button
                  key={type}
                  onClick={() =>
                    setPreferences({
                      ...preferences,
                      propertyTypes: toggleArrayItem(preferences.propertyTypes, type),
                    })
                  }
                  className={`px-4 py-2 rounded-lg border-2 font-medium capitalize transition-colors ${
                    preferences.propertyTypes.includes(type)
                      ? 'bg-teal-500 text-white border-teal-500 shadow-md'
                      : 'bg-white text-gray-700 border-gray-300 hover:border-teal-400 hover:border-orange-400'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          {/* States */}
          <div className="mb-6">
            <h3 className="font-semibold text-gray-900 mb-3">States</h3>
            <div className="flex flex-wrap gap-2">
              {stateOptions.map((state) => (
                <button
                  key={state}
                  onClick={() =>
                    setPreferences({
                      ...preferences,
                      states: toggleArrayItem(preferences.states, state),
                    })
                  }
                  className={`px-4 py-2 rounded-lg border-2 font-medium transition-all ${
                    preferences.states.includes(state)
                      ? 'bg-orange-500 text-white border-orange-500 shadow-md'
                      : 'bg-white text-gray-700 border-gray-300 hover:border-teal-400 hover:border-orange-400'
                  }`}
                >
                  {state}
                </button>
              ))}
            </div>
          </div>

          {/* Must-Have Features */}
          <div className="mb-6">
            <h3 className="font-semibold text-gray-900 mb-3">Must-Have Features</h3>
            <div className="flex flex-wrap gap-2">
              {featureOptions.map((feature) => (
                <button
                  key={feature}
                  onClick={() =>
                    setPreferences({
                      ...preferences,
                      mustHaveFeatures: toggleArrayItem(preferences.mustHaveFeatures, feature),
                    })
                  }
                  className={`px-3 py-2 rounded-lg border-2 text-sm font-medium transition-all ${
                    preferences.mustHaveFeatures.includes(feature)
                      ? 'bg-orange-500 text-white border-orange-500 shadow-md'
                      : 'bg-white text-gray-700 border-gray-300 hover:border-teal-400 hover:border-orange-400'
                  }`}
                >
                  {feature}
                </button>
              ))}
            </div>
          </div>

          {/* Square Footage */}
          <div className="mb-6">
            <h3 className="font-semibold text-gray-900 mb-3">Square Footage</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-600 mb-1">Min Sq Ft</label>
                <input
                  type="number"
                  value={preferences.minSquareFeet}
                  onChange={(e) =>
                    setPreferences({ ...preferences, minSquareFeet: Number(e.target.value) })
                  }
                  className="w-full px-3 py-2 border border-gray-300 hover:border-teal-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                  placeholder="0"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Max Sq Ft</label>
                <input
                  type="number"
                  value={preferences.maxSquareFeet}
                  onChange={(e) =>
                    setPreferences({ ...preferences, maxSquareFeet: Number(e.target.value) })
                  }
                  className="w-full px-3 py-2 border border-gray-300 hover:border-teal-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                  placeholder="10000"
                />
              </div>
            </div>
          </div>

          {/* Year Built & Lot Size */}
          <div className="mb-6">
            <h3 className="font-semibold text-gray-900 mb-3">Property Age & Size</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-600 mb-1">Min Year Built</label>
                <input
                  type="number"
                  value={preferences.minYearBuilt}
                  onChange={(e) =>
                    setPreferences({ ...preferences, minYearBuilt: Number(e.target.value) })
                  }
                  className="w-full px-3 py-2 border border-gray-300 hover:border-teal-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                  placeholder="1900"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Min Lot Size (acres)</label>
                <input
                  type="number"
                  value={preferences.minLotSize}
                  onChange={(e) =>
                    setPreferences({ ...preferences, minLotSize: Number(e.target.value) })
                  }
                  step="0.1"
                  className="w-full px-3 py-2 border border-gray-300 hover:border-teal-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                  placeholder="0"
                />
              </div>
            </div>
          </div>

          {/* Days on Market */}
          <div className="mb-6">
            <h3 className="font-semibold text-gray-900 mb-3">Listing Freshness</h3>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Max Days on Market</label>
              <input
                type="number"
                value={preferences.maxDaysOnMarket}
                onChange={(e) =>
                  setPreferences({ ...preferences, maxDaysOnMarket: Number(e.target.value) })
                }
                className="w-full px-3 py-2 border border-gray-300 hover:border-teal-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                placeholder="365"
              />
              <p className="text-xs text-gray-500 mt-1">Find fresh listings or motivated sellers</p>
            </div>
          </div>

          {/* Cities */}
          <div className="mb-6">
            <h3 className="font-semibold text-gray-900 mb-3">Cities/Neighborhoods</h3>
            <div className="flex flex-wrap gap-2">
              {cityOptions.map((city) => (
                <button
                  key={city}
                  onClick={() =>
                    setPreferences({
                      ...preferences,
                      cities: toggleArrayItem(preferences.cities, city),
                    })
                  }
                  className={`px-4 py-2 rounded-lg border-2 font-medium transition-all ${
                    preferences.cities.includes(city)
                      ? 'bg-teal-500 text-white border-teal-500 shadow-md'
                      : 'bg-white text-gray-700 border-gray-300 hover:border-teal-400 hover:border-orange-400'
                  }`}
                >
                  {city}
                </button>
              ))}
            </div>
          </div>

          {/* Parking */}
          <div className="mb-6">
            <h3 className="font-semibold text-gray-900 mb-3">Parking</h3>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Minimum Parking Spots</label>
              <input
                type="number"
                value={preferences.minParkingSpots}
                onChange={(e) =>
                  setPreferences({ ...preferences, minParkingSpots: Number(e.target.value) })
                }
                min="0"
                className="w-full px-3 py-2 border border-gray-300 hover:border-teal-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                placeholder="0"
              />
              <p className="text-xs text-gray-500 mt-1">Garage spots, carport, or driveway spaces</p>
            </div>
          </div>

          {/* Special Filters (Checkboxes) */}
          <div className="mb-6">
            <h3 className="font-semibold text-gray-900 mb-3">Special Requirements</h3>
            <div className="grid grid-cols-2 gap-4">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={preferences.noHOA}
                  onChange={(e) =>
                    setPreferences({ ...preferences, noHOA: e.target.checked })
                  }
                  className="w-5 h-5 text-teal-500 rounded focus:ring-2 focus:ring-teal-500"
                />
                <span className="text-gray-700 font-medium">No HOA</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={preferences.petFriendly}
                  onChange={(e) =>
                    setPreferences({ ...preferences, petFriendly: e.target.checked })
                  }
                  className="w-5 h-5 text-teal-500 rounded focus:ring-2 focus:ring-teal-500"
                />
                <span className="text-gray-700 font-medium">Pet Friendly</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={preferences.singleStoryOnly}
                  onChange={(e) =>
                    setPreferences({ ...preferences, singleStoryOnly: e.target.checked })
                  }
                  className="w-5 h-5 text-teal-500 rounded focus:ring-2 focus:ring-teal-500"
                />
                <span className="text-gray-700 font-medium">Single Story Only</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={preferences.newConstructionOnly}
                  onChange={(e) =>
                    setPreferences({ ...preferences, newConstructionOnly: e.target.checked })
                  }
                  className="w-5 h-5 text-teal-500 rounded focus:ring-2 focus:ring-teal-500"
                />
                <span className="text-gray-700 font-medium">New Construction Only</span>
              </label>
            </div>
          </div>

          {/* Sort By */}
          <div className="mb-6">
            <h3 className="font-semibold text-gray-900 mb-3">Sort By</h3>
            <select
              value={preferences.sortBy}
              onChange={(e) =>
                setPreferences({ ...preferences, sortBy: e.target.value as any })
              }
              className="w-full px-3 py-2 border border-gray-300 hover:border-teal-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4 border-t border-gray-200">
            <button
              onClick={onClose}
              className="flex-1 px-6 py-3 bg-white border-2 border-gray-300 hover:border-teal-400 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-all active:scale-95"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="flex-1 px-6 py-3 bg-emerald-500 text-white rounded-lg font-semibold hover:bg-emerald-600 transition-all shadow-md active:scale-95"
            >
              Apply Filters
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
