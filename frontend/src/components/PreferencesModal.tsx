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
  const stateOptions = ['CA', 'TX', 'FL', 'NY', 'WA', 'CO', 'NC'];
  const featureOptions = [
    'Pool',
    'Garage',
    'Hardwood Floors',
    'Smart Home',
    'Central AC',
    'Fireplace',
    'Deck',
    'Ocean View',
    'Mountain View',
  ];

  const toggleArrayItem = (array: string[], item: string) => {
    if (array.includes(item)) {
      return array.filter((i) => i !== item);
    }
    return [...array, item];
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Set Your Preferences</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-2xl"
            >
              ×
            </button>
          </div>

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
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'bg-white text-gray-700 border-gray-300 hover:border-blue-400'
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
                      ? 'bg-emerald-500 text-white border-emerald-500 shadow-sm'
                      : 'bg-white text-gray-700 border-gray-300 hover:border-emerald-400'
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
                      ? 'bg-emerald-500 text-white border-emerald-500 shadow-sm'
                      : 'bg-white text-gray-700 border-gray-300 hover:border-emerald-400'
                  }`}
                >
                  {feature}
                </button>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4 border-t border-gray-200">
            <button
              onClick={onClose}
              className="flex-1 px-6 py-3 bg-white border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-all active:scale-95"
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
