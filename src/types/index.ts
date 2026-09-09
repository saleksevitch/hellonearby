export interface User {
  id: string;
  name: string;
  age: number;
  bio: string;
  photoUrl: string;
  distance?: number; // in meters, mocked for v1
}

export interface Match {
  userId: string;
  user: User;
  matchedAt: Date;
  proximityUnlocked: boolean;
}

export interface SwipeAction {
  userId: string;
  action: 'like' | 'pass';
}
