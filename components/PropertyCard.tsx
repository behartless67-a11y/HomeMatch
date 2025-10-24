'use client';

import { useState } from 'react';
import { motion, useMotionValue, useTransform } from 'framer-motion';
import { Share2, RotateCcw } from 'lucide-react';
import type { Property } from '../types';

interface PropertyCardProps {
  property: Property;
  onLove: () => void;
  onHate: () => void;
  onUndo?: () => void;
  showButtons?: boolean;
  likedCount?: number;
  onViewLiked?: () => void;
}

export const PropertyCard: React.FC<PropertyCardProps> = ({ property, onLove, onHate, onUndo, showButtons = true, likedCount = 0, onViewLiked }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [exitX, setExitX] = useState(0);
  const [showHeartAnimation, setShowHeartAnimation] = useState(false);
  const [lastTap, setLastTap] = useState(0);

  // Framer Motion drag values
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-30, 30]);
  const opacity = useTransform(x, [-200, -150, 0, 150, 200], [0, 1, 1, 1, 0]);
  // Make overlays appear much faster (at 40px) for better mobile feedback
  const likeOpacity = useTransform(x, [0, 40], [0, 1]);
  const nopeOpacity = useTransform(x, [-40, 0], [1, 0]);

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

  const handleDragEnd = (_: any, info: any) => {
    // Super low threshold for mobile - 40px for slow drags, or fast swipe velocity
    const threshold = 40;
    const velocity = Math.abs(info.velocity.x);
    const swipeDistance = Math.abs(info.offset.x);

    // Trigger if: 1) dragged past 40px, OR 2) fast swipe (velocity > 500)
    if (swipeDistance > threshold || velocity > 500) {
      setExitX(info.offset.x > 0 ? 1000 : -1000);
      if (info.offset.x > 0) {
        onLove();
      } else {
        onHate();
      }
    }
  };

  const handleDoubleTap = () => {
    const now = Date.now();
    const DOUBLE_TAP_DELAY = 300;

    if (now - lastTap < DOUBLE_TAP_DELAY) {
      // Double tap detected!
      setShowHeartAnimation(true);
      setTimeout(() => setShowHeartAnimation(false), 1000);
      onLove();
    }

    setLastTap(now);
  };

  return (
    <div className="flex flex-col items-center w-full px-1 sm:px-0">
      {/* Main Card - Tinder Style */}
      <motion.div
        className="w-full max-w-[500px] bg-white rounded-2xl shadow-2xl overflow-hidden relative cursor-pointer"
        style={{ x, rotate, opacity }}
        drag={showButtons ? 'x' : false}
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={1}
        onDragEnd={handleDragEnd}
        onClick={handleDoubleTap}
        animate={exitX !== 0 ? { x: exitX } : {}}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      >
        {/* Double-Tap Heart Animation */}
        {showHeartAnimation && (
          <motion.div
            className="absolute inset-0 flex items-center justify-center z-50 pointer-events-none"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: [0, 1.2, 1], opacity: [0, 1, 0] }}
            transition={{ duration: 1 }}
          >
            <div className="text-9xl">♥</div>
          </motion.div>
        )}
        {/* LIKE Overlay */}
        <motion.div
          className="absolute top-12 sm:top-20 left-4 sm:left-12 z-30 pointer-events-none"
          style={{ opacity: likeOpacity }}
        >
          <div className="border-4 border-green-500 text-green-500 font-bold text-4xl sm:text-6xl px-4 sm:px-6 py-2 rotate-[-20deg]">
            LIKE
          </div>
        </motion.div>

        {/* NOPE Overlay */}
        <motion.div
          className="absolute top-12 sm:top-20 right-4 sm:right-12 z-30 pointer-events-none"
          style={{ opacity: nopeOpacity }}
        >
          <div className="border-4 border-red-500 text-red-500 font-bold text-4xl sm:text-6xl px-4 sm:px-6 py-2 rotate-[20deg]">
            NOPE
          </div>
        </motion.div>

        {/* Swipe Hint - Only show when x is 0 (not being dragged) */}
        <motion.div
          className="absolute bottom-4 sm:bottom-6 left-0 right-0 flex justify-center z-20 pointer-events-none px-4"
          initial={{ opacity: 1 }}
          animate={{ opacity: Math.abs(x.get()) > 10 ? 0 : 1 }}
          transition={{ duration: 0.2 }}
        >
          <div className="bg-black/70 backdrop-blur-sm text-white px-4 sm:px-6 py-2 sm:py-3 rounded-full text-xs sm:text-sm font-medium flex items-center gap-2 shadow-lg">
            <span className="text-base sm:text-lg">←</span>
            <span>Drag to swipe</span>
            <span className="text-base sm:text-lg">→</span>
          </div>
        </motion.div>
        {/* Share Button - Top Right */}
        <div className="absolute top-4 right-4 z-20">
          <button
            onClick={() => setShowShareMenu(!showShareMenu)}
            className="bg-white/90 backdrop-blur-sm p-2.5 rounded-full shadow-lg hover:bg-white hover:scale-110 transition-all duration-200"
          >
            <Share2 className="w-5 h-5 text-gray-700" />
          </button>

          {/* Share Menu */}
          {showShareMenu && (
            <div className="absolute right-0 mt-2 bg-white rounded-xl shadow-xl border border-gray-200 py-2 w-48 animate-fadeIn">
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

        {/* Image Section - Top */}
        <div className="relative w-full h-[60vh] sm:h-[500px] bg-gray-200">
          <img
            src={property.images[currentImageIndex]}
            alt={property.address}
            className="w-full h-full object-cover"
          />

          {/* Image Counter Dots */}
          {property.images.length > 1 && (
            <div className="absolute top-4 left-4 flex gap-1 pointer-events-none">
              {property.images.map((_, idx) => (
                <div
                  key={idx}
                  className={`h-1 rounded-full transition-all ${
                    idx === currentImageIndex ? 'bg-white w-8' : 'bg-white/50 w-1'
                  }`}
                />
              ))}
            </div>
          )}

          {/* Nav Arrows - buttons only intercept clicks */}
          {property.images.length > 1 && (
            <>
              <button
                onClick={(e) => { e.stopPropagation(); prevImage(); }}
                className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 backdrop-blur-sm rounded-full shadow-lg flex items-center justify-center text-2xl hover:bg-white hover:scale-110 transition-all duration-200 z-10"
              >
                ‹
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); nextImage(); }}
                className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 backdrop-blur-sm rounded-full shadow-lg flex items-center justify-center text-2xl hover:bg-white hover:scale-110 transition-all duration-200 z-10"
              >
                ›
              </button>
            </>
          )}

          {/* Price & Location Overlay - Bottom of Image */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-6 text-white pointer-events-none">
            <h3 className="text-4xl font-bold mb-1">{formatPrice(property.price)}</h3>
            <p className="text-lg opacity-90 mb-2">{property.city}, {property.state}</p>
            <div className="flex gap-3 text-sm">
              <span className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full">{property.bedrooms} bed</span>
              <span className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full">{property.bathrooms} bath</span>
              <span className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full">{property.squareFeet} sqft</span>
            </div>
          </div>
        </div>

        {/* Info Section - Below Image */}
        <div className="p-6">
          <p className="text-sm text-gray-700 leading-relaxed line-clamp-3">{property.description}</p>
        </div>
      </motion.div>

      {/* Tinder-Style Action Buttons Below Card */}
      {showButtons && (
        <div className="flex flex-col items-center gap-4 mt-6">
          {/* Main Action Buttons */}
          <div className="flex gap-4 items-center justify-center">
            {/* Pass Button - Updated to teal/coral */}
            <button
              onClick={onHate}
              className="w-16 h-16 bg-white border-3 border-orange-400 text-orange-500 rounded-full shadow-lg hover:scale-110 hover:bg-orange-50 active:scale-95 transition-all duration-200 flex items-center justify-center text-3xl font-bold"
            >
              ✕
            </button>

            {/* Undo Button - Updated to match logo */}
            {onUndo && (
              <button
                onClick={onUndo}
                className="w-12 h-12 bg-white border-2 border-teal-400 text-teal-500 rounded-full shadow-lg hover:scale-110 hover:bg-teal-50 active:scale-95 transition-all duration-200 flex items-center justify-center"
              >
                <RotateCcw className="w-5 h-5" />
              </button>
            )}

            {/* Love Button - Updated to teal */}
            <button
              onClick={onLove}
              className="w-16 h-16 bg-teal-500 text-white rounded-full shadow-lg hover:scale-110 hover:bg-teal-600 active:scale-95 transition-all duration-200 flex items-center justify-center text-3xl font-bold"
            >
              ♥
            </button>
          </div>

          {/* View Liked Properties Button */}
          {likedCount > 0 && onViewLiked && (
            <button
              onClick={onViewLiked}
              className="px-6 py-2 bg-teal-500 hover:bg-teal-600 text-white rounded-full font-semibold text-sm shadow-lg hover:scale-105 active:scale-95 transition-all"
            >
              View {likedCount} Liked {likedCount === 1 ? 'Property' : 'Properties'}
            </button>
          )}
        </div>
      )}
    </div>
  );
};
