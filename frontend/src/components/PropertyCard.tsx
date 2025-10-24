import { useState } from 'react';
import type { Property } from '../types';

interface PropertyCardProps {
  property: Property;
  onLove: () => void;
  onHate: () => void;
}

export const PropertyCard: React.FC<PropertyCardProps> = ({ property, onLove, onHate }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(price);
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % property.images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + property.images.length) % property.images.length);
  };

  return (
    <div className="w-80 bg-white rounded-xl shadow-lg overflow-hidden">
      {/* Image */}
      <div className="relative h-48 bg-gray-200">
        <img
          src={property.images[currentImageIndex]}
          alt={property.address}
          className="w-full h-48 object-cover"
        />

        {/* Nav Arrows */}
        {property.images.length > 1 && (
          <>
            <button onClick={prevImage} className="absolute left-2 top-20 w-6 h-6 bg-white rounded-full shadow">‹</button>
            <button onClick={nextImage} className="absolute right-2 top-20 w-6 h-6 bg-white rounded-full shadow">›</button>
          </>
        )}
      </div>

      {/* Info */}
      <div className="p-4">
        <h3 className="text-xl font-bold mb-1">{formatPrice(property.price)}</h3>
        <p className="text-sm text-gray-600 mb-2">{property.city}, {property.state}</p>

        <div className="flex gap-3 text-sm mb-3">
          <span>{property.bedrooms} bed</span>
          <span>{property.bathrooms} bath</span>
          <span>{property.squareFeet} sqft</span>
        </div>

        {/* Buttons */}
        <div className="flex gap-3">
          <button
            onClick={onHate}
            className="flex-1 bg-white border-2 border-red-400 text-red-500 hover:bg-red-50 py-2.5 rounded-lg font-semibold transition-all active:scale-95"
          >
            ✕ Pass
          </button>
          <button
            onClick={onLove}
            className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white py-2.5 rounded-lg font-semibold transition-all active:scale-95 shadow-md"
          >
            ♥ Love
          </button>
        </div>
      </div>
    </div>
  );
};
