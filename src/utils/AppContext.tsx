import React, { createContext, useContext, useState, ReactNode } from 'react';
import { User, Geomatch, GeomatchQuota, Gender, Ethnicity, UserPreferences } from '../types';
import { APP_CONFIG } from './config';

interface Profile {
  name: string;
  age: number;
  bio: string;
  photoUrl: string;
  height: number;
  gender: Gender;
  ethnicity?: Ethnicity;
  isDiscoverable: boolean;
  preferences: UserPreferences;
}

interface AppContextType {
  profile: Profile;
  updateProfile: (profile: Partial<Profile>) => void;
  isPaid: boolean;
  setIsPaid: (paid: boolean) => void;
  geomatches: Geomatch[];
  quota: GeomatchQuota;
  catchGeomatch: (user: User) => boolean; // returns true if caught, false if no quota
  blockUser: (userId: string) => void;
  reportUser: (userId: string, reason: string) => void;
  resetQuota: () => void; // for testing/demo
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// Helper to check if two users match each other's filters
export const doFiltersMatch = (userA: Profile | User, userB: User): boolean => {
  // Check if userA meets userB's preferences
  const meetsAgeRange = userA.age >= userB.preferences.ageRange[0] && userA.age <= userB.preferences.ageRange[1];
  const meetsGender = userB.preferences.genders.includes(userA.gender);
  const meetsHeight = userA.height >= userB.preferences.heightRange[0] && userA.height <= userB.preferences.heightRange[1];
  
  let meetsEthnicity = true;
  if (userB.preferences.ethnicities && userB.preferences.ethnicities.length > 0 && userA.ethnicity) {
    meetsEthnicity = userB.preferences.ethnicities.includes(userA.ethnicity);
  }

  const userAMeetsB = meetsAgeRange && meetsGender && meetsHeight && meetsEthnicity;

  // Check if userB meets userA's preferences
  const meetsAgeRangeB = userB.age >= userA.preferences.ageRange[0] && userB.age <= userA.preferences.ageRange[1];
  const meetsGenderB = userA.preferences.genders.includes(userB.gender);
  const meetsHeightB = userB.height >= userA.preferences.heightRange[0] && userB.height <= userA.preferences.heightRange[1];
  
  let meetsEthnicityB = true;
  if (userA.preferences.ethnicities && userA.preferences.ethnicities.length > 0 && userB.ethnicity) {
    meetsEthnicityB = userA.preferences.ethnicities.includes(userB.ethnicity);
  }

  const userBMeetsA = meetsAgeRangeB && meetsGenderB && meetsHeightB && meetsEthnicityB;

  return userAMeetsB && userBMeetsA;
};

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [profile, setProfile] = useState<Profile>({
    name: 'Your Name',
    age: 28,
    bio: 'Your bio goes here...',
    photoUrl: 'https://picsum.photos/seed/you/400/600',
    height: 175,
    gender: 'man',
    ethnicity: 'white',
    isDiscoverable: true,
    preferences: {
      ageRange: [23, 35],
      genders: ['woman', 'non-binary'],
      heightRange: [160, 185],
      ethnicities: undefined, // no ethnicity filter
    },
  });

  const [isPaid, setIsPaid] = useState(false);
  const [geomatches, setGeomatches] = useState<Geomatch[]>([]);
  
  // Initialize quota (weekly reset)
  const getResetTime = () => {
    const nextWeek = new Date();
    nextWeek.setDate(nextWeek.getDate() + 7);
    nextWeek.setHours(0, 0, 0, 0);
    return nextWeek;
  };

  const [quota, setQuota] = useState<GeomatchQuota>({
    used: 0,
    total: APP_CONFIG.freeGeomatchesPerWeek,
    resetTime: getResetTime(),
  });

  const updateProfile = (updates: Partial<Profile>) => {
    setProfile((prev) => ({ ...prev, ...updates }));
  };

  const catchGeomatch = (user: User): boolean => {
    // Check if user has quota
    if (quota.used >= quota.total) {
      return false;
    }

    // Consume quota
    setQuota((prev) => ({ ...prev, used: prev.used + 1 }));

    // Add to geomatches
    const isEphemeral = (user.distance || 0) <= APP_CONFIG.proximityThreshold;
    const newGeomatch: Geomatch = {
      userId: user.id,
      user,
      caughtAt: new Date(),
      isEphemeral,
    };
    setGeomatches((prev) => [...prev, newGeomatch]);

    return true;
  };

  const blockUser = (userId: string) => {
    setGeomatches((prev) => prev.filter((g) => g.userId !== userId));
    console.log(`Blocked user: ${userId}`);
  };

  const reportUser = (userId: string, reason: string) => {
    console.log(`Reported user ${userId}: ${reason}`);
  };

  const resetQuota = () => {
    const newTotal = isPaid ? APP_CONFIG.paidGeomatchesPerWeek : APP_CONFIG.freeGeomatchesPerWeek;
    setQuota({
      used: 0,
      total: newTotal,
      resetTime: getResetTime(),
    });
  };

  // Update quota total when isPaid changes
  React.useEffect(() => {
    const newTotal = isPaid ? APP_CONFIG.paidGeomatchesPerWeek : APP_CONFIG.freeGeomatchesPerWeek;
    setQuota((prev) => ({ ...prev, total: newTotal }));
  }, [isPaid]);

  return (
    <AppContext.Provider
      value={{
        profile,
        updateProfile,
        isPaid,
        setIsPaid,
        geomatches,
        quota,
        catchGeomatch,
        blockUser,
        reportUser,
        resetQuota,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
};
