import React, { createContext, useContext, useState, ReactNode } from 'react';
import { User, Match, SwipeAction } from '../types';

interface Profile {
  name: string;
  age: number;
  bio: string;
  photoUrl: string;
}

interface AppContextType {
  profile: Profile;
  updateProfile: (profile: Partial<Profile>) => void;
  matches: Match[];
  swipedUsers: Set<string>;
  handleSwipe: (userId: string, action: 'like' | 'pass', user: User) => void;
  blockUser: (userId: string) => void;
  reportUser: (userId: string, reason: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [profile, setProfile] = useState<Profile>({
    name: 'Your Name',
    age: 25,
    bio: 'Your bio goes here...',
    photoUrl: 'https://picsum.photos/seed/you/400/600',
  });

  const [matches, setMatches] = useState<Match[]>([]);
  const [swipedUsers, setSwipedUsers] = useState<Set<string>>(new Set());
  const [likedUsers, setLikedUsers] = useState<Set<string>>(new Set());

  const updateProfile = (updates: Partial<Profile>) => {
    setProfile((prev) => ({ ...prev, ...updates }));
  };

  const handleSwipe = (userId: string, action: 'like' | 'pass', user: User) => {
    setSwipedUsers((prev) => new Set(prev).add(userId));

    if (action === 'like') {
      setLikedUsers((prev) => new Set(prev).add(userId));
      
      // Mock: simulate mutual like (30% chance for demo purposes)
      const isMutualLike = Math.random() < 0.3;
      
      if (isMutualLike) {
        const newMatch: Match = {
          userId,
          user,
          matchedAt: new Date(),
          proximityUnlocked: false,
        };
        setMatches((prev) => [...prev, newMatch]);
      }
    }
  };

  const blockUser = (userId: string) => {
    // Mock: just remove from matches and show toast
    setMatches((prev) => prev.filter((m) => m.userId !== userId));
    console.log(`Blocked user: ${userId}`);
  };

  const reportUser = (userId: string, reason: string) => {
    // Mock: just log for v1
    console.log(`Reported user ${userId}: ${reason}`);
  };

  return (
    <AppContext.Provider
      value={{
        profile,
        updateProfile,
        matches,
        swipedUsers,
        handleSwipe,
        blockUser,
        reportUser,
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
