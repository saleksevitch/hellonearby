export type Gender = 'man' | 'woman' | 'non-binary' | 'other';
export type Ethnicity = 'asian' | 'black' | 'hispanic' | 'white' | 'middle-eastern' | 'mixed' | 'other' | 'prefer-not-to-say';

export interface User {
  id: string;
  name: string;
  age: number;
  bio: string;
  photoUrl: string;
  height: number; // in cm
  gender: Gender;
  ethnicity?: Ethnicity;
  distance?: number; // in meters, mocked for v1
  isDiscoverable: boolean;
  preferences: UserPreferences;
}

export interface UserPreferences {
  ageRange: [number, number]; // [min, max]
  genders: Gender[]; // who you want to meet
  heightRange: [number, number]; // [min, max] in cm
  ethnicities?: Ethnicity[]; // optional filter
}

export interface Geomatch {
  userId: string;
  user: User;
  caughtAt: Date;
  isEphemeral: boolean; // true if still in range
}

export interface GeomatchQuota {
  used: number;
  total: number;
  resetTime: Date; // when quota resets (weekly)
}
