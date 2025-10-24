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
  const [showPreferences, setShowPreferences] = useState(false);
  const [showLikedView, setShowLikedView] = useState(false);
  const [hasSetPreferences, setHasSetPreferences] = useState(false);
  const [filteredProperties, setFilteredProperties] = useState<Property[]>(properties);
  const [lastAction, setLastAction] = useState<'love' | 'pass' | null>(null);
  const [showCelebration, setShowCelebration] = useState(false);
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
    minParkingSpots: 0,
    singleStoryOnly: false,
    newConstructionOnly: false,
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

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if modal is open or user is typing
      if (showPreferences || showLikedView) return;
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      // Only trigger if we have properties to show
      if (currentIndex >= filteredProperties.length) return;

      switch (e.key) {
        case 'ArrowLeft':
          e.preventDefault();
          handleHate();
          break;
        case 'ArrowRight':
          e.preventDefault();
          handleLove();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, filteredProperties, likedProperties, passedProperties, showPreferences, showLikedView]);

  const handleLove = () => {
    const currentProperty = filteredProperties[currentIndex];
    setLikedProperties([...likedProperties, currentProperty]);
    setLastAction('love');

    // Show celebration
    setShowCelebration(true);
    setTimeout(() => setShowCelebration(false), 2000);

    setCurrentIndex(currentIndex + 1);
  };

  const handleHate = () => {
    const currentProperty = filteredProperties[currentIndex];
    setPassedProperties([...passedProperties, currentProperty]);
    setLastAction('pass');
    setCurrentIndex(currentIndex + 1);
  };

  const handleUndo = () => {
    if (currentIndex > 0 && lastAction) {
      // Go back one property
      setCurrentIndex(currentIndex - 1);

      // Remove from the appropriate list
      if (lastAction === 'love') {
        setLikedProperties(likedProperties.slice(0, -1));
      } else {
        setPassedProperties(passedProperties.slice(0, -1));
      }

      setLastAction(null);
    }
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
            className="fixed inset-0 bg-cover bg-center opacity-20 pointer-events-none"
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
      <div className="flex flex-col items-center justify-center h-screen relative p-4 sm:p-8">
        <div
          className="fixed inset-0 bg-cover bg-center opacity-20 pointer-events-none"
          style={{ backgroundImage: 'url(/requirements-to-buy-a-house.webp)' }}
        />
        <div className="relative z-10 flex flex-col items-center animate-fadeIn">
          <div className="text-6xl sm:text-8xl mb-6 animate-bounce">🏚️</div>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3 text-center">Tough Crowd!</h2>
          <p className="text-gray-600 mb-8 text-center text-base sm:text-lg px-4">You&apos;ve seen all {filteredProperties.length} properties and didn&apos;t fall in love with any.</p>
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-2xl border-2 border-teal-400 p-6 sm:p-8 w-full max-w-md">
            <p className="text-gray-700 mb-6 text-center">
              Maybe it&apos;s time to lower those standards... or adjust your filters? 😉
            </p>
            <div className="flex flex-col gap-3">
              <button
                onClick={() => setShowPreferences(true)}
                className="w-full bg-teal-500 text-white py-3 px-6 rounded-lg font-semibold hover:bg-teal-600 transition-all shadow-md active:scale-95"
              >
                Adjust Filters
              </button>
              <button
                onClick={() => {
                  setCurrentIndex(0);
                  setLikedProperties([]);
                  setPassedProperties([]);
                }}
                className="w-full bg-white border-2 border-gray-300 text-gray-700 py-3 px-6 rounded-lg font-semibold hover:bg-gray-50 transition-all active:scale-95"
              >
                Start Over
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!hasSetPreferences) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-4 sm:py-4 relative">
        <div
          className="fixed inset-0 bg-cover bg-center opacity-20 pointer-events-none"
          style={{ backgroundImage: 'url(/requirements-to-buy-a-house.webp)' }}
        />
        <div className="relative z-10 flex flex-col items-center my-auto">
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-2xl border-4 border-orange-400 p-6 sm:p-8 max-w-2xl text-center mx-4">
            {/* Logo inside the card */}
            <div className="-mb-4 -mt-4">
              <img src="/logo.png" alt="HomeMatch" className="w-full h-auto object-contain" />
            </div>

            <p className="text-gray-800 text-2xl font-bold mb-6" style={{ fontFamily: "'Caveat', cursive" }}>
              No Commitment Issues Here - Unless It&apos;s a 30-Year Mortgage
            </p>
            <button
              onClick={() => setShowPreferences(true)}
              className="w-full bg-teal-500 hover:bg-teal-600 text-white py-4 px-8 rounded-lg font-bold text-lg transition-all shadow-lg active:scale-95"
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
    <div className="h-full flex flex-col items-center justify-center sm:py-4 overflow-y-auto relative">
      <div
        className="fixed inset-0 bg-cover bg-center opacity-20 pointer-events-none"
        style={{ backgroundImage: 'url(/requirements-to-buy-a-house.webp)' }}
      />

      {/* Logo - Fixed Bottom Right (Hidden on mobile) */}
      <div className="hidden sm:block fixed bottom-4 right-4 z-20 pointer-events-none">
        <img src="/logo.png" alt="HomeMatch" className="h-64 w-auto opacity-90" />
      </div>

      <div className="relative z-10 flex flex-col items-center w-full h-full sm:h-auto sm:my-auto">
        {/* Top Bar - Filters and Stats (Desktop Only) */}
        <div className="hidden sm:block w-full max-w-[500px] mb-2 flex-shrink-0">
          <div className="flex justify-between items-center text-sm text-gray-700 bg-white/90 backdrop-blur-sm rounded-full px-6 py-3 shadow-lg">
            <span className="font-semibold">{currentIndex + 1} / {filteredProperties.length}</span>
            <button
              onClick={() => setShowPreferences(true)}
              className="px-4 py-1.5 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-full text-xs font-semibold hover:scale-105 active:scale-95 transition-all shadow-md"
            >
              ⚙ Filters
            </button>
            <span className="text-teal-600 font-bold text-lg">{likedProperties.length} ♥</span>
          </div>
        </div>


        {/* Property Card Stack */}
        <div className="flex-shrink-0 relative w-full sm:max-w-[600px] h-full sm:h-auto" style={{ minHeight: '700px' }}>
          {/* Render up to 3 cards in the stack */}
          {[2, 1, 0].map((offset) => {
            const cardIndex = currentIndex + offset;
            if (cardIndex >= filteredProperties.length) return null;

            const isTopCard = offset === 0;
            // On mobile: no scaling or offsetting for background cards
            const scale = isTopCard ? 1 : 0.92;
            const translateY = offset * -12;
            // Offset background cards to alternate sides (desktop only)
            const translateX = isTopCard ? 0 : (offset === 1 ? 60 : -60);
            const opacity = isTopCard ? 1 : 0.6;
            const zIndex = isTopCard ? 30 : 30 - offset;
            const rotation = isTopCard ? 0 : (offset === 1 ? 8 : -8);

            return (
              <div
                key={cardIndex}
                className="absolute top-0 left-0 sm:left-1/2 w-full sm:w-auto sm:-translate-x-1/2 transition-all duration-300"
                style={{
                  transform: window.innerWidth < 640 ? 'none' : `translateX(calc(-50% + ${translateX}px)) translateY(${translateY}px) scale(${scale}) rotate(${rotation}deg)`,
                  opacity: window.innerWidth < 640 && !isTopCard ? 0 : opacity,
                  zIndex,
                  pointerEvents: isTopCard ? 'auto' : 'none',
                }}
              >
                <PropertyCard
                  property={filteredProperties[cardIndex]}
                  onLove={isTopCard ? handleLove : () => {}}
                  onHate={isTopCard ? handleHate : () => {}}
                  onUndo={isTopCard && currentIndex > 0 && lastAction ? handleUndo : undefined}
                  showButtons={isTopCard}
                  likedCount={likedProperties.length}
                  onViewLiked={() => setShowLikedView(true)}
                />
              </div>
            );
          })}
        </div>

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

        {/* Match Celebration */}
        {showCelebration && (
          <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
            <div className="bg-gradient-to-br from-teal-500 to-teal-600 rounded-3xl shadow-2xl p-8 sm:p-12 animate-slideUp border-4 border-white mx-4">
              <div className="text-center">
                <div className="flex justify-center gap-2 sm:gap-4 mb-4">
                  <span className="text-5xl sm:text-6xl animate-bounce" style={{ animationDelay: '0s' }}>🎉</span>
                  <span className="text-6xl sm:text-8xl animate-bounce" style={{ animationDelay: '0.1s' }}>♥</span>
                  <span className="text-5xl sm:text-6xl animate-bounce" style={{ animationDelay: '0.2s' }}>🏡</span>
                </div>
                <h2 className="text-4xl sm:text-5xl font-bold text-white mb-2 drop-shadow-lg">It&apos;s a Match!</h2>
                <p className="text-lg sm:text-xl text-white/90">You loved this property!</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
