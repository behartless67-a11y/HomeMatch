'use client';

import { useState } from 'react';
import type { Property } from '../types';
import { CompareView } from './CompareView';

interface LikedPropertiesViewProps {
  likedProperties: Property[];
  onClose: () => void;
}

export const LikedPropertiesView: React.FC<LikedPropertiesViewProps> = ({
  likedProperties,
  onClose,
}) => {
  const [selectedForCompare, setSelectedForCompare] = useState<string[]>([]);
  const [showCompare, setShowCompare] = useState(false);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(price);
  };

  const toggleSelection = (id: string) => {
    if (selectedForCompare.includes(id)) {
      setSelectedForCompare(selectedForCompare.filter((propId) => propId !== id));
    } else {
      if (selectedForCompare.length < 3) {
        setSelectedForCompare([...selectedForCompare, id]);
      }
    }
  };

  const handleCompare = () => {
    setShowCompare(true);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto" style={{
      backgroundImage: 'url(/requirements-to-buy-a-house.webp)',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat'
    }}>
      <div className="fixed inset-0 bg-gray-50/80 backdrop-blur-sm"></div>
      <div className="max-w-4xl mx-auto p-4 relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-6 sticky top-0 bg-gray-50 py-4">
          <h1 className="text-3xl font-bold text-gray-900">
            Liked Properties ({likedProperties.length})
          </h1>
          <div className="flex gap-3">
            {selectedForCompare.length >= 2 && (
              <button
                onClick={handleCompare}
                className="px-6 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg font-semibold transition-all shadow-md"
              >
                Compare {selectedForCompare.length} Properties
              </button>
            )}
            <button
              onClick={onClose}
              className="px-4 py-2 bg-white border-2 border-gray-300 text-gray-700 rounded-lg font-medium hover:border-blue-400 transition-colors"
            >
              Back to Browsing
            </button>
          </div>
        </div>

        {/* Selection Instructions */}
        {likedProperties.length > 1 && (
          <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-800">
              💡 Select 2-3 properties to compare them side-by-side ({selectedForCompare.length}/3 selected)
            </p>
          </div>
        )}

        {/* Properties Grid */}
        {likedProperties.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">No liked properties yet. Start swiping!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {likedProperties.map((property) => (
              <div
                key={property.id}
                className={`bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-all ${
                  selectedForCompare.includes(property.id) ? 'ring-4 ring-emerald-500' : ''
                }`}
              >
                {/* Image */}
                <div className="relative h-48">
                  <img
                    src={property.images[0]}
                    alt={property.address}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 right-3 bg-white px-3 py-1 rounded-full text-sm font-semibold">
                    {property.daysOnMarket} days
                  </div>
                  <div className="absolute top-3 left-3">
                    <label className="flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedForCompare.includes(property.id)}
                        onChange={() => toggleSelection(property.id)}
                        disabled={!selectedForCompare.includes(property.id) && selectedForCompare.length >= 3}
                        className="w-6 h-6 text-emerald-500 rounded focus:ring-2 focus:ring-emerald-500 cursor-pointer"
                      />
                    </label>
                  </div>
                </div>

                {/* Details */}
                <div className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-2xl font-bold text-gray-900">
                      {formatPrice(property.price)}
                    </h3>
                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-medium capitalize">
                      {property.propertyType}
                    </span>
                  </div>

                  <p className="text-gray-600 text-sm mb-3">
                    {property.address}
                    <br />
                    {property.city}, {property.state} {property.zipCode}
                  </p>

                  {/* Stats */}
                  <div className="flex gap-4 mb-3 text-sm">
                    <div className="flex items-center gap-1 text-gray-700">
                      <span className="font-semibold">{property.bedrooms}</span>
                      <span>beds</span>
                    </div>
                    <div className="flex items-center gap-1 text-gray-700">
                      <span className="font-semibold">{property.bathrooms}</span>
                      <span>baths</span>
                    </div>
                    <div className="flex items-center gap-1 text-gray-700">
                      <span className="font-semibold">
                        {property.squareFeet.toLocaleString()}
                      </span>
                      <span>sqft</span>
                    </div>
                  </div>

                  {/* Features */}
                  <div className="flex flex-wrap gap-1">
                    {property.features.slice(0, 3).map((feature, idx) => (
                      <span
                        key={idx}
                        className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs"
                      >
                        {feature}
                      </span>
                    ))}
                    {property.features.length > 3 && (
                      <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
                        +{property.features.length - 3}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Compare View */}
      {showCompare && (
        <CompareView
          properties={likedProperties.filter((p) => selectedForCompare.includes(p.id))}
          onClose={() => setShowCompare(false)}
        />
      )}
    </div>
  );
};
