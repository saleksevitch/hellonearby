import { CityCapacity } from '../types';

// Mock city capacity data
// Each city capped at 200: 100 men + 100 women
export const MOCK_CITY_CAPACITY: CityCapacity[] = [
  {
    city: 'San Francisco',
    menOccupied: 87,
    menTotal: 100,
    womenOccupied: 92,
    womenTotal: 100,
    menWaitlist: 23,
    womenWaitlist: 31,
  },
  {
    city: 'New York',
    menOccupied: 100,
    menTotal: 100,
    womenOccupied: 98,
    womenTotal: 100,
    menWaitlist: 45,
    womenWaitlist: 38,
  },
  {
    city: 'Los Angeles',
    menOccupied: 95,
    menTotal: 100,
    womenOccupied: 100,
    womenTotal: 100,
    menWaitlist: 18,
    womenWaitlist: 52,
  },
  {
    city: 'Austin',
    menOccupied: 73,
    menTotal: 100,
    womenOccupied: 68,
    womenTotal: 100,
    menWaitlist: 12,
    womenWaitlist: 9,
  },
  {
    city: 'Miami',
    menOccupied: 81,
    menTotal: 100,
    womenOccupied: 85,
    womenTotal: 100,
    menWaitlist: 15,
    womenWaitlist: 19,
  },
];

export const LAUNCH_CITIES = MOCK_CITY_CAPACITY.map((c) => c.city);
