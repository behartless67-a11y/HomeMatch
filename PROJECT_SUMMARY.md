# HomeMatch - House Hunting App

## Project Overview
A Tinder-style web application for browsing houses, designed to search and display properties from multiple real estate sources. Users can browse properties with a Love/Hate interface and filter by preferences.

**Current Status**: Frontend prototype with mock data completed
**Platform**: Web-based (planned iOS migration later)
**Tech Stack**: React + TypeScript + Vite + Tailwind CSS

---

## Features Implemented

### ✅ Core Functionality
- **Property Browsing**: Card-based interface showing one property at a time
- **Love/Hate Actions**: Simple button interface to like or pass on properties
- **Image Carousel**: Navigate through multiple property images with arrow buttons and dot indicators
- **Liked Properties Dashboard**: View all properties marked as "Love"
- **Preference Filtering**: Filter properties by:
  - Price range (min/max)
  - Bedrooms (min)
  - Bathrooms (min)
  - Property types (house, condo, townhouse, apartment)
  - States/locations
  - Features (pool, garage, etc.)

### 🎨 UI/UX Features
- Modern card design with rounded corners and shadows
- Responsive layout (max-width: 448px)
- Clean, flat design (no gradients per user preference)
- Compact image height (224px)
- Property type badge on image
- Days on market indicator
- Abbreviated stats (bd/ba/sqft)
- Rounded pill-style feature tags
- Hover effects and active button animations
- Icons in action buttons (✕ Pass, ♥ Love)

---

## Project Structure

```
HomeMatch/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── PropertyCard.tsx         # Main property display card
│   │   │   ├── SwipeView.tsx            # Main browsing interface
│   │   │   ├── PreferencesModal.tsx     # Filter settings modal
│   │   │   └── LikedPropertiesView.tsx  # Dashboard for liked properties
│   │   ├── types/
│   │   │   ├── Property.ts              # Property & UserPreferences types
│   │   │   └── index.ts                 # Type exports
│   │   ├── data/
│   │   │   └── mockProperties.ts        # 6 demo properties
│   │   ├── App.tsx                      # Main app component
│   │   └── main.tsx                     # Entry point
│   ├── postcss.config.js                # PostCSS config (Tailwind v4)
│   ├── tailwind.config.js               # Tailwind configuration
│   ├── vite.config.ts                   # Vite build config
│   └── package.json
└── PROJECT_SUMMARY.md                   # This file
```

---

## Technical Implementation

### Data Model (`types/Property.ts`)
```typescript
interface Property {
  id: string;
  price: number;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  bedrooms: number;
  bathrooms: number;
  squareFeet: number;
  propertyType: 'house' | 'condo' | 'townhouse' | 'apartment';
  yearBuilt: number;
  images: string[];
  description: string;
  features: string[];
  lotSize?: number;
  daysOnMarket: number;
}

interface UserPreferences {
  minPrice?: number;
  maxPrice?: number;
  minBedrooms?: number;
  minBathrooms?: number;
  propertyTypes: string[];
  states: string[];
  features: string[];
}
```

### Component Architecture

**PropertyCard.tsx** - [frontend/src/components/PropertyCard.tsx](frontend/src/components/PropertyCard.tsx)
- Displays single property with image carousel
- Image navigation arrows and dot indicators
- Property details: price, location, stats, features
- Love/Hate action buttons
- Compact layout (h-56 image, max-w-md card)

**SwipeView.tsx** - [frontend/src/components/SwipeView.tsx](frontend/src/components/SwipeView.tsx)
- Main browsing interface
- Manages current property index
- Handles Love/Hate actions (adds to liked list, advances to next)
- Integrates preferences modal
- Shows "No more properties" when finished

**PreferencesModal.tsx** - [frontend/src/components/PreferencesModal.tsx](frontend/src/components/PreferencesModal.tsx)
- Filter UI with price sliders, dropdowns, checkboxes
- Updates UserPreferences state
- Filters properties in real-time

**LikedPropertiesView.tsx** - [frontend/src/components/LikedPropertiesView.tsx](frontend/src/components/LikedPropertiesView.tsx)
- Grid display of all liked properties
- Shows thumbnails with key details

### Mock Data
6 properties across different states:
1. Austin, TX - Modern house ($450K)
2. Miami, FL - Luxury condo ($725K)
3. Denver, CO - Mountain townhouse ($520K)
4. San Francisco, CA - Victorian house ($1.2M)
5. Seattle, WA - Urban apartment ($485K)
6. Raleigh, NC - Family home ($385K)

---

## Technical Issues Resolved

### 1. PostCSS/Tailwind Configuration Error
**Problem**: `It looks like you're trying to use 'tailwindcss' directly as a PostCSS plugin`
**Solution**: Installed `@tailwindcss/postcss` and updated `postcss.config.js`:
```javascript
export default {
  plugins: {
    '@tailwindcss/postcss': {},
    autoprefixer: {},
  },
}
```

### 2. TypeScript Module Export Error
**Problem**: `The requested module '/src/types/Property.ts' does not provide an export named 'Property'`
**Solution**: Created `types/index.ts` with re-exports and changed all imports to use `import type` syntax

### 3. UI Sizing Issues
**Problem**: UI elements too large, not fitting on screen
**Iterations**:
- Card width: max-w-2xl → max-w-lg → max-w-md → max-w-sm → max-w-md (final)
- Image height: aspect-[4/3] → h-64 → h-80 → h-48 → h-56 (final: 224px)
- Padding and text sizes reduced throughout
- Final: `max-w-md` card with `h-56` image, compact spacing

### 4. Swipe Functionality Complexity
**Problem**: Framer Motion swipe implementation caused overlapping cards
**Solution**: User pivoted to Love/Hate button interface (simpler, cleaner)

### 5. Design Preferences
**Problem**: User didn't want gradient backgrounds
**Solution**: Removed all gradients, using solid colors (`bg-red-500`, `bg-green-500`)

---

## Key Dependencies

```json
{
  "dependencies": {
    "react": "^18.3.1",
    "react-dom": "^18.3.1"
  },
  "devDependencies": {
    "@types/react": "^18.3.17",
    "@types/react-dom": "^18.3.5",
    "@vitejs/plugin-react": "^4.3.4",
    "typescript": "~5.6.2",
    "vite": "^6.0.11",
    "tailwindcss": "^4.1.0",
    "@tailwindcss/postcss": "^4.1.0",
    "autoprefixer": "^10.4.20"
  }
}
```

---

## Future Roadmap

### Phase 1: Backend Integration
- [ ] Set up Node.js + Express backend
- [ ] Set up PostgreSQL database
- [ ] Integrate real estate APIs:
  - RapidAPI Realtor Data API (100 free requests/month)
  - RentCast API (alternative)
- [ ] Daily data refresh cron job
- [ ] Manual refresh endpoint

### Phase 2: User System
- [ ] User authentication (signup/login)
- [ ] Save user preferences to database
- [ ] Persist liked properties per user
- [ ] User dashboard

### Phase 3: Advanced Features
- [ ] Real-time property updates
- [ ] Notifications for new properties matching preferences
- [ ] Property comparison tool
- [ ] Save searches
- [ ] Share properties

### Phase 4: Mobile
- [ ] iOS app development
- [ ] Cross-platform state sync

### Phase 5: Monetization
- [ ] Premium features (unlimited likes, advanced filters)
- [ ] Real estate agent partnerships
- [ ] Affiliate commissions

---

## Running the Project

### Development Server
```bash
cd frontend
npm install
npm run dev
```
Access at: `http://localhost:5173`

### Build for Production
```bash
npm run build
npm run preview
```

---

## Design Decisions

1. **No Swipe Gestures**: Simplified to buttons for faster development and better UX clarity
2. **No Gradients**: Clean, flat design per user preference
3. **Compact Layout**: All content fits on screen without scrolling (h-56 image, max-w-md card)
4. **Mock Data First**: Prototype with realistic data before API integration
5. **Tailwind v4**: Modern utility-first CSS framework
6. **TypeScript**: Type safety for better code quality

---

## Notes

- Current implementation uses Unsplash placeholder images
- All data is mock data stored in `mockProperties.ts`
- No backend or database yet - all state is client-side
- No user authentication - single session only
- Filters work on the mock dataset only
- Daily refresh feature not yet implemented (requires backend)

---

**Last Updated**: 2025-10-23
**Status**: Frontend MVP Complete, Ready for Backend Integration
