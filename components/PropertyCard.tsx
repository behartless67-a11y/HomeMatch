'use client';

import { useState } from 'react';
import { Share2 } from 'lucide-react';
import type { Property } from '../types';

interface PropertyCardProps {
  property: Property;
  onLove: () => void;
  onHate: () => void;
}

export const PropertyCard: React.FC<PropertyCardProps> = ({ property, onLove, onHate }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showShareMenu, setShowShareMenu] = useState(false);

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

  const handleShare = async (method: 'copy' | 'email' | 'text') => {
    const shareUrl = `${window.location.origin}/property/${property.id}`;
    const shareText = `Check out this property: ${property.address}, ${property.city}, ${property.state} - ${formatPrice(property.price)}`;

    if (method === 'copy') {
      await navigator.clipboard.writeText(shareUrl);
      alert('Link copied to clipboard!');
    } else if (method === 'email') {
      window.location.href = `mailto:?subject=Property%20Listing&body=${encodeURIComponent(shareText + '\n' + shareUrl)}`;
    } else if (method === 'text') {
      window.location.href = `sms:?body=${encodeURIComponent(shareText + ' ' + shareUrl)}`;
    }
    setShowShareMenu(false);
  };

  return (
    <div className="w-[1000px] bg-white rounded-xl shadow-lg overflow-hidden flex relative">
      {/* Share Button - Top Right */}
      <div className="absolute top-4 right-4 z-10">
        <button
          onClick={() => setShowShareMenu(!showShareMenu)}
          className="bg-white/90 backdrop-blur-sm p-2 rounded-full shadow-md hover:bg-white transition-all"
        >
          <Share2 className="w-5 h-5 text-gray-700" />
        </button>

        {/* Share Menu */}
        {showShareMenu && (
          <div className="absolute right-0 mt-2 bg-white rounded-lg shadow-xl border border-gray-200 py-2 w-48">
            <button
              onClick={() => handleShare('copy')}
              className="w-full px-4 py-2 text-left hover:bg-gray-100 transition-colors text-sm"
            >
              📋 Copy Link
            </button>
            <button
              onClick={() => handleShare('email')}
              className="w-full px-4 py-2 text-left hover:bg-gray-100 transition-colors text-sm"
            >
              ✉️ Share via Email
            </button>
            <button
              onClick={() => handleShare('text')}
              className="w-full px-4 py-2 text-left hover:bg-gray-100 transition-colors text-sm"
            >
              💬 Share via Text
            </button>
          </div>
        )}
      </div>

      {/* Info Section - Left Side */}
      <div className="w-[400px] p-6 flex flex-col flex-shrink-0">
        <h3 className="text-3xl font-bold mb-1">{formatPrice(property.price)}</h3>
        <p className="text-sm text-gray-600 mb-3">{property.city}, {property.state}</p>

        <div className="flex gap-4 text-base mb-3">
          <span className="font-medium">{property.bedrooms} bed</span>
          <span className="font-medium">{property.bathrooms} bath</span>
          <span className="font-medium">{property.squareFeet} sqft</span>
        </div>

        {/* Description */}
        <div className="flex-1 mb-3">
          <p className="text-sm text-gray-700 leading-relaxed">{property.description}</p>
        </div>

        {/* Buttons */}
        <div className="flex gap-3 mt-auto">
          <button
            onClick={onHate}
            className="flex-1 bg-white border-2 border-red-400 text-red-500 hover:bg-red-50 py-3 rounded-lg font-semibold transition-all active:scale-95"
          >
            ✕ Pass
          </button>
          <button
            onClick={onLove}
            className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white py-3 rounded-lg font-semibold transition-all active:scale-95 shadow-md"
          >
            ♥ Love
          </button>
        </div>
      </div>

      {/* Image Section - Right Side */}
      <div className="relative w-[600px] h-[400px] bg-gray-200 flex-shrink-0">
        <img
          src={property.images[currentImageIndex]}
          alt={property.address}
          className="w-full h-full object-cover"
        />

        {/* Nav Arrows */}
        {property.images.length > 1 && (
          <>
            <button onClick={prevImage} className="absolute left-2 top-[176px] w-12 h-12 bg-white rounded-full shadow flex items-center justify-center text-3xl hover:bg-gray-100">‹</button>
            <button onClick={nextImage} className="absolute right-2 top-[176px] w-12 h-12 bg-white rounded-full shadow flex items-center justify-center text-3xl hover:bg-gray-100">›</button>
          </>
        )}
      </div>
    </div>
  );
};
