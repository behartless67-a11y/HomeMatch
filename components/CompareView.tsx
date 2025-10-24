'use client';

import type { Property } from '../types';

interface CompareViewProps {
  properties: Property[];
  onClose: () => void;
}

export const CompareView: React.FC<CompareViewProps> = ({ properties, onClose }) => {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(price);
  };

  if (properties.length === 0) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-7xl w-full max-h-[95vh] overflow-y-auto shadow-2xl">
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-900">Compare Properties</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-3xl font-light"
          >
            ×
          </button>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {properties.map((property) => (
              <div key={property.id} className="bg-gray-50 rounded-lg overflow-hidden shadow-md">
                {/* Image */}
                <img
                  src={property.images[0]}
                  alt={property.address}
                  className="w-full h-48 object-cover"
                />

                {/* Details */}
                <div className="p-4 space-y-3">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">{formatPrice(property.price)}</h3>
                    <p className="text-sm text-gray-600">{property.address}</p>
                    <p className="text-sm text-gray-500">{property.city}, {property.state}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="bg-white rounded p-2">
                      <span className="text-gray-500">Bedrooms</span>
                      <p className="font-semibold">{property.bedrooms}</p>
                    </div>
                    <div className="bg-white rounded p-2">
                      <span className="text-gray-500">Bathrooms</span>
                      <p className="font-semibold">{property.bathrooms}</p>
                    </div>
                    <div className="bg-white rounded p-2">
                      <span className="text-gray-500">Sq Ft</span>
                      <p className="font-semibold">{property.squareFeet.toLocaleString()}</p>
                    </div>
                    <div className="bg-white rounded p-2">
                      <span className="text-gray-500">$/Sq Ft</span>
                      <p className="font-semibold">${Math.round(property.price / property.squareFeet)}</p>
                    </div>
                    <div className="bg-white rounded p-2">
                      <span className="text-gray-500">Year Built</span>
                      <p className="font-semibold">{property.yearBuilt}</p>
                    </div>
                    <div className="bg-white rounded p-2">
                      <span className="text-gray-500">Type</span>
                      <p className="font-semibold capitalize">{property.propertyType}</p>
                    </div>
                    {property.lotSize && (
                      <div className="bg-white rounded p-2 col-span-2">
                        <span className="text-gray-500">Lot Size</span>
                        <p className="font-semibold">{property.lotSize} acres</p>
                      </div>
                    )}
                  </div>

                  <div>
                    <p className="text-xs text-gray-500 mb-1">Features</p>
                    <div className="flex flex-wrap gap-1">
                      {property.features.slice(0, 4).map((feature) => (
                        <span
                          key={feature}
                          className="px-2 py-1 bg-emerald-100 text-emerald-700 rounded text-xs"
                        >
                          {feature}
                        </span>
                      ))}
                      {property.features.length > 4 && (
                        <span className="px-2 py-1 bg-gray-200 text-gray-600 rounded text-xs">
                          +{property.features.length - 4} more
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 text-center">
            <button
              onClick={onClose}
              className="px-8 py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg font-semibold transition-all shadow-md"
            >
              Close Comparison
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
