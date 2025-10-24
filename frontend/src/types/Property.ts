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
}

export interface UserPreferences {
  minPrice: number;
  maxPrice: number;
  minBedrooms: number;
  minBathrooms: number;
  propertyTypes: string[];
  states: string[];
  cities: string[];
  mustHaveFeatures: string[];
}
