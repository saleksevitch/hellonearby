# Development Notes - Geomatch Pivot

## Quick Start

```bash
npm install
npm start
```

Then press `i` for iOS Simulator, `a` for Android Emulator, or scan QR code with Expo Go.

## Architecture Overview

### Product Model: Ephemeral Geomatch System

**Key Differences from Swipe MVP:**
- ❌ No swipe deck / Tinder cards
- ❌ No messaging
- ❌ No unlimited matching
- ✅ Radar-based mystery encounters
- ✅ Weekly quota system (1 free, 5 paid)
- ✅ Two-way filter matching
- ✅ Ephemeral geomatches (vanish when out of range)
- ✅ Discoverable toggle

### Navigation Structure
- **Root Navigator** (Native Stack)
  - Main (Tab Navigator)
    - Radar Screen (default)
    - Geomatches Screen
    - Profile Screen
  - Geomatch Detail Screen (Modal)

### State Management
- React Context (`AppContext.tsx`) for global state
  - User profile with new fields (height, gender, ethnicity)
  - Filter preferences (age/gender/height/ethnicity)
  - Discoverable status
  - Weekly geomatch quota (used/total/resetTime)
  - isPaid mock flag
  - Caught geomatches list
- Two-way filter matching logic (`doFiltersMatch()`)
- No external state management library needed

### Key Components

#### ProfileScreen
- **Profile fields**: name, age, bio, height, gender, ethnicity
- **Discoverable toggle**: on/off to appear on radar
- **Filter preferences**: age range, genders (multi-select), height range, ethnicity (optional)
- **Quota display**: X/Y geomatches left this week
- **Free/Paid toggle**: mock subscription status
- **Reset quota button**: for testing/demo

#### RadarScreen
- **Mystery encounters**: Shows "?" circles for in-range people
- **Filter logic**: Only shows users who:
  1. Are discoverable
  2. Match your filters (age/gender/height/ethnicity)
  3. You match their filters (two-way)
  4. Are within ~500m
  5. Haven't been caught yet
- **Catch action**: Tap → confirm → consumes 1 geomatch
- **Quota check**: Blocks catching when quota exhausted
- **Quota display**: Shows X/Y in header

#### MatchesScreen (renamed to Geomatches)
- Lists all caught geomatches
- **In-range badge**: Green "In range!" when ≤500m
- **Vanished badge**: Gray "Out of range" when >500m
- **Tap to view**: Navigate to detail screen
- Block/remove functionality

#### GeomatchDetailScreen
- **Full profile**: Photo, name, age, bio, height, gender, ethnicity
- **Ephemeral status**: Banner if out of range
- **Caught date**: When geomatch was created
- **In-range indicator**: Badge if currently within 500m
- **Block/report actions**: Remove or report user

## Mock Data

### Users (`src/data/mockUsers.ts`)
- 6 pre-defined users with full profiles:
  - Height (cm), gender, ethnicity (optional)
  - Distance (280-520m, mix of in/out of range)
  - Discoverable status (Taylor is OFF for testing)
  - Filter preferences (different combinations)
- Photos from picsum.photos placeholder service

### Filter Matching Logic
```typescript
// Two-way check:
// 1. Does userA meet userB's filters?
// 2. Does userB meet userA's filters?
// Both must be true to match

const doFiltersMatch = (userA: Profile | User, userB: User): boolean => {
  // Check A meets B's criteria
  const meetsAge = userA.age >= userB.preferences.ageRange[0] && 
                   userA.age <= userB.preferences.ageRange[1];
  const meetsGender = userB.preferences.genders.includes(userA.gender);
  const meetsHeight = userA.height >= userB.preferences.heightRange[0] && 
                      userA.height <= userB.preferences.heightRange[1];
  const meetsEthnicity = !userB.preferences.ethnicities || 
                         userB.preferences.ethnicities.includes(userA.ethnicity);

  // Check B meets A's criteria
  // ... (symmetric check)

  return bothPass;
};
```

### Quota System
- **Weekly reset**: 7 days from last reset
- **Free tier**: 1 geomatch per week
- **Paid tier**: 5 geomatches per week
- **Consumption**: Each "catch" increments `used` counter
- **Blocking**: When `used >= total`, catch button disabled
- **Mock reset**: Manual button in Profile (no auto-reset timer)

## Product Rules Implementation

### 1. Discoverable Toggle ✅
```typescript
// In AppContext
profile.isDiscoverable: boolean

// In RadarScreen filter
if (!user.isDiscoverable) return false;
```

### 2. Two-Way Filter Matching ✅
```typescript
// Both users must match each other's filters
const availableUsers = MOCK_NEARBY_USERS.filter((user) => {
  if (!user.isDiscoverable) return false;
  if ((user.distance || 0) > APP_CONFIG.proximityThreshold) return false;
  if (!doFiltersMatch(profile, user)) return false; // Two-way check
  return true;
});
```

### 3. Weekly Quota Limits ✅
```typescript
// Free: 1/week, Paid: 5/week
export const APP_CONFIG = {
  freeGeomatchesPerWeek: 1,
  paidGeomatchesPerWeek: 5,
};

// Quota state
const [quota, setQuota] = useState<GeomatchQuota>({
  used: 0,
  total: isPaid ? 5 : 1,
  resetTime: getResetTime(), // +7 days
});

// Catch attempt
const catchGeomatch = (user: User): boolean => {
  if (quota.used >= quota.total) return false; // No quota
  setQuota((prev) => ({ ...prev, used: prev.used + 1 }));
  // ... add to geomatches
  return true;
};
```

### 4. ~500m Proximity Gate ✅
```typescript
// In RadarScreen
if ((user.distance || 0) > APP_CONFIG.proximityThreshold) return false;

// In GeomatchDetailScreen
const isInRange = (user.distance || 0) <= APP_CONFIG.proximityThreshold;
const isEphemeral = geomatch.isEphemeral && !isInRange;
```

### 5. No Swipe Deck / No Messaging ✅
- SwipeScreen.tsx deleted
- No chat/messaging UI exists
- Radar shows mystery circles, not cards
- Catch action replaces swiping

## Filter Options

### Gender
```typescript
type Gender = 'man' | 'woman' | 'non-binary' | 'other';
```

### Ethnicity (Optional)
```typescript
type Ethnicity = 
  | 'asian' 
  | 'black' 
  | 'hispanic' 
  | 'white' 
  | 'middle-eastern' 
  | 'mixed' 
  | 'other' 
  | 'prefer-not-to-say';
```

**Not Included (Per Requirements):**
- Dating intentions
- Family plans
- Drinking habits
- Smoking habits

## Configuration

### Quota Settings (`src/utils/config.ts`)
```typescript
export const APP_CONFIG = {
  appName: 'HelloNearby',
  proximityThreshold: 500, // meters
  proximityThresholdDisplay: '~500m',
  freeGeomatchesPerWeek: 1,   // Changed from daily to weekly
  paidGeomatchesPerWeek: 5,   // Changed from daily to weekly
};
```

### Reset Time Calculation
```typescript
// Weekly reset (7 days from now)
const getResetTime = () => {
  const nextWeek = new Date();
  nextWeek.setDate(nextWeek.getDate() + 7);
  nextWeek.setHours(0, 0, 0, 0);
  return nextWeek;
};
```

## Testing Guide

### Test Two-Way Filters

**Scenario 1: Mutual Match**
```
Your profile: Age 28, Man, 175cm, looking for Women 23-35, 160-185cm
User Alex: Age 28, Woman, 175cm, looking for Men 25-35, 165-195cm
Result: ✅ Both match → Alex appears on radar
```

**Scenario 2: One-Way Match (Fails)**
```
Your profile: Age 28, Man, looking for Women only
User Sam: Age 30, Non-binary, looking for Men/Women/Non-binary
Result: ❌ You don't meet Sam's gender filter (Sam wants NB, you're M)
BUT Sam meets yours (NB in your list) → Still fails (not mutual)
Wait, check: You look for Women, Sam is Non-binary
Result: ❌ Sam doesn't meet your gender filter → Sam doesn't appear
```

**Scenario 3: Discoverable OFF**
```
User Taylor: Discoverable = false
Result: ❌ Never appears on any radar, regardless of filters
```

### Test Weekly Quota

**Free Tier (1/week):**
1. Profile → Shows "Free (1/week)" badge
2. Quota display: 1/1 geomatches
3. Radar → Catch 1 person
4. Quota updates: 0/1
5. Try to catch another → Alert: "No geomatches left... Resets in X days"
6. Reset button → Back to 1/1

**Paid Tier (5/week):**
1. Toggle to Paid in Profile
2. Quota updates to 5/5
3. Catch 5 people
4. 6th attempt → blocked

### Test Ephemeral Status

1. Catch someone in range (distance ≤500m)
2. Geomatches screen → "In range!" badge
3. Mock: Change user's distance to >500m (edit mockUsers.ts)
4. Geomatches screen → "Out of range" badge
5. GeomatchDetail → Vanished banner shown

## Code Structure

### Type Definitions
```typescript
// User with full profile
interface User {
  id: string;
  name: string;
  age: number;
  bio: string;
  photoUrl: string;
  height: number; // cm
  gender: Gender;
  ethnicity?: Ethnicity;
  distance?: number; // meters
  isDiscoverable: boolean;
  preferences: UserPreferences;
}

// Filter preferences
interface UserPreferences {
  ageRange: [number, number];
  genders: Gender[]; // multi-select
  heightRange: [number, number];
  ethnicities?: Ethnicity[]; // optional filter
}

// Geomatch (caught person)
interface Geomatch {
  userId: string;
  user: User;
  caughtAt: Date;
  isEphemeral: boolean; // true if still in range
}

// Weekly quota
interface GeomatchQuota {
  used: number;
  total: number;
  resetTime: Date; // next Monday midnight
}
```

### Context API
```typescript
interface AppContextType {
  profile: Profile; // user's own profile
  updateProfile: (updates: Partial<Profile>) => void;
  isPaid: boolean; // mock subscription status
  setIsPaid: (paid: boolean) => void;
  geomatches: Geomatch[]; // caught people
  quota: GeomatchQuota; // weekly limits
  catchGeomatch: (user: User) => boolean;
  blockUser: (userId: string) => void;
  reportUser: (userId: string, reason: string) => void;
  resetQuota: () => void; // for testing
}
```

## Performance Considerations

### Filtering Performance
- `useMemo` for radar user list (recomputes only when profile/geomatches change)
- Two-way filter check is O(1) per user
- Total filter check: O(n) where n = mock users (~6)

### State Updates
- Geomatch catch updates both quota and geomatches list
- Switching free/paid updates quota total via useEffect
- Profile updates trigger radar re-filter

## Future Roadmap (Out of Scope for MVP)

### Near-term
- Real GPS location (expo-location)
- Automatic weekly quota reset (cron/timer)
- Backend API for profiles/geomatches
- Real payments (Stripe/RevenueCat)
- Push notifications for in-range people

### Long-term
- Real-time proximity updates (WebSocket)
- Ping/nudge when both in range
- In-app messaging after mutual ping
- Profile verification
- Safety features (persistent block/report)
- App Store deployment

## Known Limitations

- No data persistence (resets on app restart)
- Manual quota reset (no automatic 7-day timer)
- Mock free/paid toggle (no real subscriptions)
- Hardcoded distances (no GPS)
- Block/report are console logs only
- No authentication
- No backend integration

## Code Style

- TypeScript for type safety
- Functional components with hooks
- StyleSheet for styles (no styled-components)
- Dark theme UI (#0a0a0a background, #6C63FF accent)
- Consistent naming: PascalCase for components, camelCase for functions
- Clear separation: types/, utils/, data/, screens/, navigation/

## Dependencies

Same as before:
- Expo SDK 57
- React Native 0.86
- TypeScript 6.0
- React Navigation (Native Stack + Bottom Tabs)

## Contributing

1. Keep code simple and readable
2. Follow existing patterns and file structure
3. Update this doc if adding new features
4. Test on both iOS and Android when possible
5. Keep mock data clearly labeled
6. Document any new filter logic or quota rules

---

**Product Pivot Architecture Complete!** Swipe-free, ephemeral geomatch system with weekly quotas and two-way filter matching. 🎯
