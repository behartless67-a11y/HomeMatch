export interface Property {
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
  hasHOA?: boolean;
  hoaFee?: number;
  petFriendly?: boolean;
  latitude?: number;
  longitude?: number;
}

export interface UserPreferences {
  minPrice: number;
  maxPrice: number;
  minBedrooms: number;
  minBathrooms: number;
  minSquareFeet: number;
  maxSquareFeet: number;
  minYearBuilt: number;
  minLotSize: number;
  maxDaysOnMarket: number;
  noHOA: boolean;
  petFriendly: boolean;
  minParkingSpots: number;
  singleStoryOnly: boolean;
  newConstructionOnly: boolean;
  propertyTypes: string[];
  states: string[];
  cities: string[];
  mustHaveFeatures: string[];
  sortBy: 'price-asc' | 'price-desc' | 'newest' | 'sqft-desc' | 'price-per-sqft';
}

export interface SavedSearch {
  id: string;
  name: string;
  preferences: UserPreferences;
  createdAt: Date;
}
