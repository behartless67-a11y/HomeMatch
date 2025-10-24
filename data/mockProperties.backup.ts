import type { Property } from '../types';

export const mockProperties: Property[] = [
  {
    id: '1',
    price: 875000,
    address: '123 Main Street',
    city: 'Charlottesville',
    state: 'VA',
    zipCode: '22902',
    bedrooms: 3,
    bathrooms: 2.5,
    squareFeet: 2400,
    propertyType: 'townhouse',
    yearBuilt: 2020,
    images: [
      'https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6?w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&auto=format&fit=crop',
    ],
    description: 'Modern downtown townhouse with rooftop terrace, walking distance to UVA and the Downtown Mall.',
    features: ['Rooftop Deck', 'Hardwood Floors', 'Granite Countertops', 'Smart Home', 'Garage'],
    daysOnMarket: 8,
  },
