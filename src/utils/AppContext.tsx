import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { User, Geomatch, GeomatchQuota, Gender, Ethnicity, UserPreferences, ApplicationStatus, ApplicationData, CityCapacity } from '../types';
import { APP_CONFIG } from './config';
import { MOCK_CITY_CAPACITY } from '../data/mockCities';

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
  applicationData: ApplicationData;
  updateApplicationData: (data: Partial<ApplicationData>) => void;
  setApplicationStatus: (status: ApplicationStatus) => void; // for demo/testing
  activateSubscription: () => void; // mock subscription activation
  cityCapacities: CityCapacity[];
  getCityCapacity: (city: string) => CityCapacity | undefined;
  hasAvailableSeat: (city: string, gender: 'man' | 'woman') => boolean;
  checkInactivityStatus: () => void; // check and update inactivity state
  simulateLastActive: (daysAgo: number) => void; // demo control
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
  const [cityCapacities, setCityCapacities] = useState<CityCapacity[]>(MOCK_CITY_CAPACITY);
  
  const [applicationData, setApplicationData] = useState<ApplicationData>({
    status: 'draft',
    name: '',
    dateOfBirth: new Date(1995, 0, 1),
    isOver18: false,
    city: '',
    bio: '',
    gender: 'man',
    height: 175,
    ethnicity: undefined,
    preferences: {
      ageRange: [23, 35],
      genders: ['woman'], // v1: heterosexual only - man seeks woman
      heightRange: [160, 185],
      ethnicities: undefined,
    },
    referralCode: undefined,
    communityStandardsAccepted: false,
    verificationStatus: 'pending',
    lastActiveAt: new Date(),
    inactivityWarningShown: false,
    isSubscribed: false,
  });

  const [profile, setProfile] = useState<Profile>({
    name: 'Your Name',
    age: 28,
    bio: 'Your bio goes here...',
    photoUrl: 'https://picsum.photos/seed/you/400/600',
    height: 175,
    gender: 'man',
    ethnicity: 'white',
    isDiscoverable: false, // default off until approved + subscribed + active seat
    preferences: {
      ageRange: [23, 35],
      genders: ['woman'], // v1: heterosexual only - man seeks woman
      heightRange: [160, 185],
      ethnicities: undefined,
    },
  });

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
    total: APP_CONFIG.geomatchesPerWeek,
    resetTime: getResetTime(),
  });

  const updateProfile = (updates: Partial<Profile>) => {
    setProfile((prev) => ({ ...prev, ...updates }));
  };

  const updateApplicationData = (updates: Partial<ApplicationData>) => {
    setApplicationData((prev) => ({ ...prev, ...updates }));
  };

  const setApplicationStatus = (status: ApplicationStatus) => {
    const now = new Date();
    setApplicationData((prev) => ({
      ...prev,
      status,
      submittedAt: status === 'submitted' || status === 'under_review' ? prev.submittedAt || now : prev.submittedAt,
      reviewedAt: status === 'approved' || status === 'waitlisted' || status === 'declined' ? now : prev.reviewedAt,
    }));
  };

  const getCityCapacity = (city: string): CityCapacity | undefined => {
    return cityCapacities.find((c) => c.city === city);
  };

  const hasAvailableSeat = (city: string, gender: 'man' | 'woman'): boolean => {
    const capacity = getCityCapacity(city);
    if (!capacity) return false;
    
    if (gender === 'man') {
      return capacity.menOccupied < capacity.menTotal;
    } else {
      return capacity.womenOccupied < capacity.womenTotal;
    }
  };

  const checkInactivityStatus = () => {
    const now = new Date();
    const daysSinceActive = Math.floor(
      (now.getTime() - applicationData.lastActiveAt.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (applicationData.status === 'approved') {
      if (daysSinceActive >= 21) {
        // Release seat and move to waitlist
        setApplicationStatus('waitlisted');
        setProfile((prev) => ({ ...prev, isDiscoverable: false }));
        console.log('Inactivity: Released seat after 21 days');
      } else if (daysSinceActive >= 14 && !applicationData.inactivityWarningShown) {
        // Auto-pause discoverable and show warning
        setProfile((prev) => ({ ...prev, isDiscoverable: false }));
        setApplicationData((prev) => ({ ...prev, inactivityWarningShown: true }));
        console.log('Inactivity: Auto-paused discoverable after 14 days');
      }
    }
  };

  const simulateLastActive = (daysAgo: number) => {
    const date = new Date();
    date.setDate(date.getDate() - daysAgo);
    setApplicationData((prev) => ({
      ...prev,
      lastActiveAt: date,
      inactivityWarningShown: false,
    }));
  };

  // Check inactivity on mount and when status changes
  useEffect(() => {
    checkInactivityStatus();
  }, [applicationData.status]);

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

  const activateSubscription = () => {
    setApplicationData((prev) => ({
      ...prev,
      isSubscribed: true,
      subscriptionActivatedAt: new Date(),
    }));
  };

  const resetQuota = () => {
    setQuota({
      used: 0,
      total: APP_CONFIG.geomatchesPerWeek,
      resetTime: getResetTime(),
    });
  };

  return (
    <AppContext.Provider
      value={{
        profile,
        updateProfile,
        applicationData,
        updateApplicationData,
        setApplicationStatus,
        activateSubscription,
        cityCapacities,
        getCityCapacity,
        hasAvailableSeat,
        checkInactivityStatus,
        simulateLastActive,
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
