# Real Estate API Integration Example

This guide shows you how to integrate a real estate API into HomeMatch.

## Option 1: RapidAPI - Realtor Data API

### Step 1: Get API Key

1. Go to [RapidAPI](https://rapidapi.com/)
2. Sign up for a free account
3. Subscribe to the [Realtor Data API](https://rapidapi.com/datascraper/api/us-real-estate)
4. Copy your API key from the dashboard

### Step 2: Create Environment Variables

Create a `.env` file in the frontend directory:

```env
VITE_RAPIDAPI_KEY=your_api_key_here
VITE_RAPIDAPI_HOST=us-real-estate.p.rapidapi.com
```

### Step 3: Install Axios

```bash
cd frontend
npm install axios
```

### Step 4: Create API Service

Create `frontend/src/services/realEstateAPI.ts`:

```typescript
import axios from 'axios';
import { Property, UserPreferences } from '../types/Property';

const API_KEY = import.meta.env.VITE_RAPIDAPI_KEY;
const API_HOST = import.meta.env.VITE_RAPIDAPI_HOST;

export const fetchPropertiesFromAPI = async (
  preferences: UserPreferences,
  limit: number = 50
): Promise<Property[]> => {
  const options = {
    method: 'GET',
    url: `https://${API_HOST}/listings`,
    params: {
      price_min: preferences.minPrice,
      price_max: preferences.maxPrice,
      beds_min: preferences.minBedrooms,
      baths_min: preferences.minBathrooms,
      state_code: preferences.states[0] || 'CA',
      city: preferences.cities[0] || '',
      limit: limit,
      offset: 0,
      sort: 'relevant'
    },
    headers: {
      'X-RapidAPI-Key': API_KEY,
      'X-RapidAPI-Host': API_HOST
    }
  };

  try {
    const response = await axios.request(options);
    return mapAPIResponseToProperties(response.data);
  } catch (error) {
    console.error('Error fetching properties:', error);
    throw error;
  }
};

// Map API response to our Property interface
const mapAPIResponseToProperties = (apiData: any): Property[] => {
  if (!apiData.data || !Array.isArray(apiData.data)) {
    return [];
  }

  return apiData.data.map((item: any) => ({
    id: item.property_id || item.zpid || String(Math.random()),
    price: item.price || item.list_price || 0,
    address: item.address?.line || item.streetAddress || '',
    city: item.address?.city || '',
    state: item.address?.state_code || item.address?.state || '',
    zipCode: item.address?.postal_code || item.address?.zip || '',
    bedrooms: item.beds || item.bedrooms || 0,
    bathrooms: item.baths || item.bathrooms || 0,
    squareFeet: item.sqft || item.living_area || 0,
    propertyType: mapPropertyType(item.prop_type || item.property_type),
    yearBuilt: item.year_built || 2020,
    images: extractImages(item),
    description: item.description || item.remarks || 'Beautiful property',
    features: extractFeatures(item),
    lotSize: item.lot_sqft || undefined,
    daysOnMarket: item.days_on_mls || item.dom || 0,
  }));
};

const mapPropertyType = (type: string): 'house' | 'condo' | 'townhouse' | 'apartment' => {
  const lowerType = (type || '').toLowerCase();
  if (lowerType.includes('condo')) return 'condo';
  if (lowerType.includes('town')) return 'townhouse';
  if (lowerType.includes('apartment')) return 'apartment';
  return 'house';
};

const extractImages = (item: any): string[] => {
  const images: string[] = [];

  // Different APIs have different image field names
  if (item.photos && Array.isArray(item.photos)) {
    images.push(...item.photos.map((p: any) => p.href || p.url).filter(Boolean));
  } else if (item.thumbnail) {
    images.push(item.thumbnail);
  } else if (item.primary_photo?.href) {
    images.push(item.primary_photo.href);
  }

  // Fallback to placeholder if no images
  if (images.length === 0) {
    images.push('https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800&auto=format&fit=crop');
  }

  return images;
};

const extractFeatures = (item: any): string[] => {
  const features: string[] = [];

  // Extract features from various API fields
  if (item.features && Array.isArray(item.features)) {
    features.push(...item.features);
  }

  // Add common features based on property attributes
  if (item.pool) features.push('Pool');
  if (item.garage) features.push('Garage');
  if (item.fireplace) features.push('Fireplace');
  if (item.ac_type) features.push('Central AC');
  if (item.heating) features.push('Heating');

  return features;
};

// Refresh function to be called daily or manually
export const refreshProperties = async (preferences: UserPreferences): Promise<Property[]> => {
  console.log('Refreshing property data...');
  return fetchPropertiesFromAPI(preferences);
};
```

### Step 5: Update App.tsx to Use Real Data

```typescript
import { useState, useEffect } from 'react';
import { SwipeView } from './components/SwipeView';
import { mockProperties } from './data/mockProperties';
import { fetchPropertiesFromAPI } from './services/realEstateAPI';
import { Property, UserPreferences } from './types/Property';

function App() {
  const [properties, setProperties] = useState<Property[]>(mockProperties);
  const [loading, setLoading] = useState(false);

  const defaultPreferences: UserPreferences = {
    minPrice: 0,
    maxPrice: 10000000,
    minBedrooms: 0,
    minBathrooms: 0,
    propertyTypes: [],
    states: ['CA', 'TX', 'FL'],
    cities: [],
    mustHaveFeatures: [],
  };

  useEffect(() => {
    loadProperties();
  }, []);

  const loadProperties = async () => {
    setLoading(true);
    try {
      const realProperties = await fetchPropertiesFromAPI(defaultPreferences);
      if (realProperties.length > 0) {
        setProperties(realProperties);
      }
    } catch (error) {
      console.error('Failed to load properties, using mock data:', error);
      // Fall back to mock data if API fails
      setProperties(mockProperties);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="text-2xl font-bold text-gray-900 mb-2">Loading Properties...</div>
          <div className="text-gray-600">Finding your perfect home</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <SwipeView properties={properties} onRefresh={loadProperties} />
    </div>
  );
}

export default App;
```

### Step 6: Add Refresh Button to SwipeView

Add this to the header section of SwipeView:

```typescript
<button
  onClick={onRefresh}
  className="px-3 py-2 bg-white border-2 border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:border-blue-400 transition-colors"
>
  Refresh
</button>
```

## Option 2: Using a Backend Service (Recommended for Production)

For production, it's better to have a backend that handles API calls:

### Backend Setup (Node.js + Express)

1. Create backend directory:
```bash
mkdir backend
cd backend
npm init -y
npm install express cors dotenv axios node-cron
npm install -D @types/express @types/cors @types/node typescript ts-node
```

2. Create `backend/src/index.ts`:
```typescript
import express from 'express';
import cors from 'cors';
import cron from 'node-cron';
import { fetchAndCacheProperties } from './services/propertyService';

const app = express();
app.use(cors());
app.use(express.json());

let cachedProperties: any[] = [];

// Endpoint to get properties
app.post('/api/properties', async (req, res) => {
  try {
    const preferences = req.body;

    // If cache is empty, fetch now
    if (cachedProperties.length === 0) {
      cachedProperties = await fetchAndCacheProperties(preferences);
    }

    res.json(cachedProperties);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch properties' });
  }
});

// Manual refresh endpoint
app.post('/api/properties/refresh', async (req, res) => {
  try {
    const preferences = req.body;
    cachedProperties = await fetchAndCacheProperties(preferences);
    res.json({ message: 'Properties refreshed', count: cachedProperties.length });
  } catch (error) {
    res.status(500).json({ error: 'Failed to refresh properties' });
  }
});

// Refresh properties daily at 6 AM
cron.schedule('0 6 * * *', async () => {
  console.log('Daily property refresh at 6 AM');
  try {
    cachedProperties = await fetchAndCacheProperties({});
  } catch (error) {
    console.error('Scheduled refresh failed:', error);
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

## Testing the Integration

1. Start the dev server:
```bash
npm run dev
```

2. Open browser console to see API requests

3. Test with different filters to verify API responses

## Rate Limiting Considerations

Free tier APIs have limits:
- RapidAPI Realtor Data: 100 requests/month
- Cache responses to minimize API calls
- Use backend service to manage rate limits
- Consider implementing pagination

## Error Handling

Always have fallback data:
```typescript
try {
  const data = await fetchPropertiesFromAPI(prefs);
  setProperties(data);
} catch (error) {
  console.error('API error:', error);
  // Fall back to mock data or cached data
  setProperties(mockProperties);
}
```

## Next Steps

1. Set up backend service for production
2. Implement caching strategy (Redis)
3. Add user authentication
4. Store liked properties in database
5. Implement analytics to track user preferences
