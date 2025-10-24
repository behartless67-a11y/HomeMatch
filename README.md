# HomeMatch 🏡

**"No Commitment Issues Here - Unless It's a 30-Year Mortgage"**

A Tinder-style property browsing app that makes house hunting fun! Swipe right to like properties, left to pass. Built with Next.js 14, React 18, and Framer Motion.

🚀 **[Live on Vercel](https://home-match-gevu.vercel.app)** (Update with your actual URL)

## ✨ Features

### Core Functionality
- 🔄 **Tinder-Style Swiping** - Drag anywhere on photos (40px threshold + velocity detection)
- ⌨️ **Keyboard Shortcuts** - Arrow keys for quick browsing
- 📱 **Mobile Optimized** - Touch gestures, responsive design, no horizontal scroll
- 🎯 **Advanced Filtering** - 20+ filter options (price, beds, baths, features, etc.)
- ♥️ **Like Management** - Save and review favorite properties
- ↩️ **Undo Button** - Changed your mind? Go back one swipe
- 🎉 **Match Celebrations** - Fun animations with bouncing emojis when you like
- 👆 **Double-Tap to Like** - Quick gesture support with heart animation
- 🎴 **Card Stack Preview** - See next properties stacked behind current card

### Polish & UX
- ✨ Beautiful loading states ("Finding your perfect home...")
- 🏚️ Fun completion screens with personality ("Tough Crowd!")
- 💚 Teal & orange brand colors from logo
- ✍️ Handwritten tagline font (Caveat)
- 🌓 Background images on all screens
- 📊 Property counter and stats
- 🔍 LIKE/NOPE overlays during swipe
- 💫 Smooth fade-in animations throughout

## 🛠️ Tech Stack

- **Framework**: Next.js 14.2.5 (App Router)
- **UI Library**: React 18.3.1
- **Animation**: Framer Motion 12.23.24
- **Styling**: Tailwind CSS 3.4.17
- **TypeScript**: Full type safety
- **Icons**: Lucide React, React Icons
- **Deployment**: Vercel (automatic from GitHub)
- **Fonts**: Google Fonts (Caveat for tagline)
- **API**: RapidAPI Realtor (optional, currently using mock data)

## Getting Started

### Prerequisites

- Node.js 18+ and npm installed
- Git

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd HomeMatch
```

2. Install frontend dependencies:
```bash
cd frontend
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to:
```
http://localhost:5173
```

## Current Status

### Completed Features
- Swipe interface with drag-and-drop functionality
- Property cards with image galleries
- User preference filtering system
- Liked properties dashboard
- Responsive design
- Mock data for 6 properties across multiple states

### Demo Data
The app currently uses mock property data for demonstration purposes. Properties include listings from:
- Austin, TX
- Miami, FL
- Denver, CO
- San Francisco, CA
- Seattle, WA
- Raleigh, NC

## Integrating Real Estate APIs

The app is designed to integrate with real estate APIs. Here are the recommended options:

### Free API Options

1. **RapidAPI - Realtor Data API**
   - Free tier: 100 requests/month
   - Coverage: US-wide property listings
   - Setup:
     ```bash
     # Install axios for API calls
     npm install axios
     ```
   - Add to your `.env` file:
     ```
     VITE_RAPIDAPI_KEY=your_api_key_here
     VITE_RAPIDAPI_HOST=realtor-data-api.rapidapi.com
     ```

2. **RentCast API** (formerly Realty Mole)
   - Free tier available
   - Comprehensive property data
   - Good for rental and sale listings

### Integration Steps

1. Create a backend service (Node.js/Express):
```bash
# In the root directory
mkdir backend
cd backend
npm init -y
npm install express axios cors dotenv
```

2. Create an API service file (`backend/src/services/realEstateService.ts`):
```typescript
import axios from 'axios';

export const fetchProperties = async (filters: any) => {
  const options = {
    method: 'GET',
    url: 'https://realtor-data-api.rapidapi.com/listings',
    params: {
      city: filters.city,
      state: filters.state,
      price_min: filters.minPrice,
      price_max: filters.maxPrice,
      beds_min: filters.minBedrooms,
      baths_min: filters.minBathrooms,
      limit: 50
    },
    headers: {
      'X-RapidAPI-Key': process.env.RAPIDAPI_KEY,
      'X-RapidAPI-Host': process.env.RAPIDAPI_HOST
    }
  };

  try {
    const response = await axios.request(options);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
```

3. Update frontend to fetch from your backend:
```typescript
// frontend/src/services/propertyService.ts
export const getProperties = async (preferences: UserPreferences) => {
  const response = await fetch('http://localhost:3000/api/properties', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(preferences)
  });
  return response.json();
};
```

### Data Refresh Strategy

For daily updates:
```typescript
// Backend cron job example
import cron from 'node-cron';

// Refresh properties daily at 6 AM
cron.schedule('0 6 * * *', async () => {
  console.log('Refreshing property data...');
  await fetchAndCacheProperties();
});
```

## Project Structure

```
HomeMatch/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── PropertyCard.tsx       # Swipeable property card
│   │   │   ├── SwipeView.tsx          # Main swipe interface
│   │   │   ├── PreferencesModal.tsx   # Filter preferences
│   │   │   └── LikedPropertiesView.tsx # Liked properties dashboard
│   │   ├── types/
│   │   │   └── Property.ts            # TypeScript interfaces
│   │   ├── data/
│   │   │   └── mockProperties.ts      # Mock data
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── package.json
│   └── tailwind.config.js
└── README.md
```

## Future Enhancements

### Short Term
- [ ] Add backend API integration
- [ ] Implement user authentication
- [ ] Add property detail modal
- [ ] Save liked properties to database
- [ ] Add property comparison feature
- [ ] Implement sharing functionality

### Long Term
- [ ] iOS mobile app (React Native)
- [ ] Android mobile app
- [ ] Machine learning recommendation system
- [ ] Real estate agent contact integration
- [ ] Mortgage calculator
- [ ] Neighborhood information and school ratings
- [ ] Map view of properties
- [ ] Saved searches and alerts

## Legal Considerations

Before launching:

1. **Fair Housing Act Compliance**: Ensure filtering options comply with fair housing laws
2. **Terms of Service**: Review and comply with API provider terms
3. **Data Privacy**: Implement GDPR/CCPA compliant data handling
4. **Licensing**: Check if real estate broker license required in your state

## Business Model Options

1. **Lead Generation**: Charge real estate agents for qualified buyer leads
2. **Freemium**: Basic free, premium features for power users
3. **Agent Partnerships**: White-label solution for real estate brokerages
4. **Advertising**: Display ads from mortgage lenders, moving companies

## Contributing

This is currently a prototype. Contributions welcome!

## License

MIT License - feel free to use for your own projects

## Contact

For questions or collaboration opportunities, please open an issue.

---

Built with React, TypeScript, and Tailwind CSS
