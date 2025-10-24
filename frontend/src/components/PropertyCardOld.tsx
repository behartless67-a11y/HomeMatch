import { useState } from 'react';
import { motion, useMotionValue, useTransform } from 'framer-motion';
import type { Property } from '../types';

interface PropertyCardProps {
  property: Property;
  onSwipe: (direction: 'left' | 'right') => void;
  index: number;
}

export const PropertyCard: React.FC<PropertyCardProps> = ({ property, onSwipe, index }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const x = useMotionValue(0);
  const y = useMotionValue(index * 10);
  const scale = useMotionValue(1 - index * 0.05);
  const rotate = useTransform(x, [-200, 200], [-25, 25]);
  const opacity = useTransform(x, [-200, -100, 0, 100, 200], [0, 1, 1, 1, 0]);

  const handleDragEnd = (_event: any, info: any) => {
    if (Math.abs(info.offset.x) > 100) {
      const direction = info.offset.x > 0 ? 'right' : 'left';
      onSwipe(direction);
    }
  };

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
    <motion.div
      className="absolute w-full h-full"
      style={{
        x: index === 0 ? x : 0,
        y,
        rotate: index === 0 ? rotate : 0,
        scale,
        zIndex: 3 - index,
      }}
      drag={index === 0 ? "x" : false}
      dragConstraints={{ left: 0, right: 0 }}
      onDragEnd={handleDragEnd}
      whileTap={index === 0 ? { cursor: 'grabbing' } : {}}
    >
        <div
          className="relative w-full h-full bg-white rounded-2xl shadow-2xl overflow-hidden cursor-grab active:cursor-grabbing"
          style={{
            border: index === 0 ? '4px solid blue' : index === 1 ? '4px solid green' : '4px solid red',
            pointerEvents: index === 0 ? 'auto' : 'none'
          }}
        >
        {/* Image Section */}
        <div className="relative h-3/5">
          <img
            src={property.images[currentImageIndex]}
            alt={property.address}
            className="w-full h-full object-cover"
          />

          {/* Image Navigation */}
          {property.images.length > 1 && (
            <>
              <button
                onClick={prevImage}
                className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors"
              >
                ‹
              </button>
              <button
                onClick={nextImage}
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors"
              >
                ›
              </button>
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
                {property.images.map((_, idx) => (
                  <div
                    key={idx}
                    className={`w-2 h-2 rounded-full ${
                      idx === currentImageIndex ? 'bg-white' : 'bg-white/50'
                    }`}
                  />
                ))}
              </div>
            </>
          )}

          {/* Days on Market Badge */}
          <div className="absolute top-4 right-4 bg-white px-3 py-1 rounded-full text-sm font-semibold">
            {property.daysOnMarket} days
          </div>
        </div>

        {/* Details Section */}
        <div className="p-6 h-2/5 overflow-y-auto">
          {/* Price */}
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-3xl font-bold text-gray-900">{formatPrice(property.price)}</h2>
            <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium capitalize">
              {property.propertyType}
            </span>
          </div>

          {/* Address */}
          <p className="text-gray-600 mb-4">
            {property.address}
            <br />
            {property.city}, {property.state} {property.zipCode}
          </p>

          {/* Stats */}
          <div className="flex gap-6 mb-4">
            <div className="flex items-center gap-2 text-gray-700">
              <span className="font-semibold text-lg">{property.bedrooms}</span>
              <span className="text-sm">beds</span>
            </div>
            <div className="flex items-center gap-2 text-gray-700">
              <span className="font-semibold text-lg">{property.bathrooms}</span>
              <span className="text-sm">baths</span>
            </div>
            <div className="flex items-center gap-2 text-gray-700">
              <span className="font-semibold text-lg">{property.squareFeet.toLocaleString()}</span>
              <span className="text-sm">sqft</span>
            </div>
          </div>

          {/* Description */}
          <p className="text-gray-600 text-sm mb-4">{property.description}</p>

          {/* Features */}
          <div className="flex flex-wrap gap-2">
            {property.features.slice(0, 5).map((feature, idx) => (
              <span
                key={idx}
                className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs"
              >
                {feature}
              </span>
            ))}
            {property.features.length > 5 && (
              <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs">
                +{property.features.length - 5} more
              </span>
            )}
          </div>
        </div>

        {/* Swipe Indicators */}
        <div
          className="absolute top-1/3 left-8 text-6xl font-bold text-red-500 border-4 border-red-500 px-4 py-2 rotate-[-25deg] opacity-0 pointer-events-none"
          style={{
            opacity: x.get() < -50 ? Math.min(Math.abs(x.get()) / 100, 1) : 0,
          }}
        >
          NOPE
        </div>
        <div
          className="absolute top-1/3 right-8 text-6xl font-bold text-green-500 border-4 border-green-500 px-4 py-2 rotate-[25deg] opacity-0 pointer-events-none"
          style={{
            opacity: x.get() > 50 ? Math.min(x.get() / 100, 1) : 0,
          }}
        >
          LIKE
        </div>
      </div>
    </motion.div>
  );
};
