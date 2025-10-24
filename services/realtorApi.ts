import type { Property } from '../types';

const RAPIDAPI_KEY = process.env.NEXT_PUBLIC_RAPIDAPI_KEY || '';
const RAPIDAPI_HOST = 'realtor.p.rapidapi.com';

interface RealtorProperty {
  property_id: string;
  list_price: number;
  location: {
    address: {
      line: string;
      city: string;
      state_code: string;
      postal_code: string;
      coordinate?: {
        lat: number;
        lon: number;
      };
    };
  };
  description: {
    beds: number;
    baths: number;
    sqft: number;
    lot_sqft?: number;
    type: string;
    year_built?: number;
    text?: string;
  };
  photos?: Array<{ href: string }>;
  tags?: string[];
  list_date?: string;
  hoa?: {
    fee: number;
  };
  pet_policy?: string;
}

interface RealtorSearchResponse {
  data: {
    home_search: {
      results: RealtorProperty[];
    };
  };
}

// Convert Realtor API response to our Property type
function convertToProperty(realtorProp: RealtorProperty): Property {
  const listDate = realtorProp.list_date ? new Date(realtorProp.list_date) : new Date();
  const daysOnMarket = Math.floor((Date.now() - listDate.getTime()) / (1000 * 60 * 60 * 24));

  // Map property type
  const typeMap: { [key: string]: 'house' | 'condo' | 'townhouse' | 'apartment' } = {
    'single_family': 'house',
    'condo': 'condo',
    'townhouse': 'townhouse',
    'townhomes': 'townhouse',
    'apartment': 'apartment',
    'multi_family': 'house',
  };

  const propertyType = typeMap[realtorProp.description.type?.toLowerCase()] || 'house';

  // Extract features from tags and description
  const features: string[] = [];
  if (realtorProp.tags) {
    realtorProp.tags.forEach(tag => {
      if (tag.toLowerCase().includes('pool')) features.push('Pool');
      if (tag.toLowerCase().includes('garage')) features.push('Garage');
      if (tag.toLowerCase().includes('hardwood')) features.push('Hardwood Floors');
      if (tag.toLowerCase().includes('fireplace')) features.push('Fireplace');
      if (tag.toLowerCase().includes('deck') || tag.toLowerCase().includes('patio')) features.push('Deck');
      if (tag.toLowerCase().includes('central') && tag.toLowerCase().includes('air')) features.push('Central AC');
      if (tag.toLowerCase().includes('smart')) features.push('Smart Home');
    });
  }

  // Get images
  const images = realtorProp.photos?.slice(0, 6).map(photo => photo.href) || [
    'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=1200&auto=format&fit=crop'
  ];

  return {
    id: realtorProp.property_id,
    price: realtorProp.list_price,
    address: realtorProp.location.address.line,
    city: realtorProp.location.address.city,
    state: realtorProp.location.address.state_code,
    zipCode: realtorProp.location.address.postal_code,
    bedrooms: realtorProp.description.beds || 0,
    bathrooms: realtorProp.description.baths || 0,
    squareFeet: realtorProp.description.sqft || 0,
    propertyType,
    yearBuilt: realtorProp.description.year_built || 2000,
    images,
    description: realtorProp.description.text || 'Beautiful property in a great location.',
    features,
    lotSize: realtorProp.description.lot_sqft ? realtorProp.description.lot_sqft / 43560 : undefined,
    daysOnMarket,
    hasHOA: !!realtorProp.hoa?.fee,
    hoaFee: realtorProp.hoa?.fee,
    petFriendly: realtorProp.pet_policy?.toLowerCase().includes('allow') || false,
    latitude: realtorProp.location.address.coordinate?.lat,
    longitude: realtorProp.location.address.coordinate?.lon,
  };
}

// Search for properties by location
export async function searchProperties(
  city: string = 'Charlottesville',
  stateCode: string = 'VA',
  limit: number = 30
): Promise<Property[]> {
  if (!RAPIDAPI_KEY) {
    console.warn('RapidAPI key not found. Using mock data.');
    return [];
  }

  try {
    const url = `https://${RAPIDAPI_HOST}/properties/v3/list`;

    const options = {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'X-RapidAPI-Key': RAPIDAPI_KEY,
        'X-RapidAPI-Host': RAPIDAPI_HOST,
      },
      body: JSON.stringify({
        limit: limit,
        offset: 0,
        postal_code: '', // Optional
        status: ['for_sale'],
        sort: {
          direction: 'desc',
          field: 'list_date'
        },
        location: {
          city,
          state_code: stateCode,
        },
      }),
    };

    const response = await fetch(url, options);

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    const data: RealtorSearchResponse = await response.json();

    if (!data.data?.home_search?.results) {
      console.warn('No results found in API response');
      return [];
    }

    const properties = data.data.home_search.results.map(convertToProperty);
    return properties;
  } catch (error) {
    console.error('Error fetching properties from Realtor API:', error);
    throw error;
  }
}

// Get property details by ID
export async function getPropertyDetails(propertyId: string): Promise<Property | null> {
  if (!RAPIDAPI_KEY) {
    console.warn('RapidAPI key not found.');
    return null;
  }

  try {
    const url = `https://${RAPIDAPI_HOST}/properties/v3/detail`;

    const options = {
      method: 'GET',
      headers: {
        'X-RapidAPI-Key': RAPIDAPI_KEY,
        'X-RapidAPI-Host': RAPIDAPI_HOST,
      },
    };

    const response = await fetch(`${url}?property_id=${propertyId}`, options);

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }

    const data = await response.json();

    if (!data.data) {
      return null;
    }

    return convertToProperty(data.data);
  } catch (error) {
    console.error('Error fetching property details:', error);
    return null;
  }
}
