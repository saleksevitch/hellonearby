# Development Notes

## Quick Start

```bash
npm install
npm start
```

Then press `i` for iOS Simulator, `a` for Android Emulator, or scan QR code with Expo Go.

## Architecture Overview

### Navigation Structure
- **Root Navigator** (Native Stack)
  - Main (Tab Navigator)
    - Swipe Screen (default)
    - Matches Screen
    - Profile Screen
  - Proximity Ping Screen (Modal)

### State Management
- React Context (`AppContext.tsx`) for global state
- Local component state for UI interactions
- No external state management library needed for MVP

### Key Components

#### ProfileScreen
- Edit user profile (name, age, bio)
- Displays app info and product rules
- Local state with mock data

#### SwipeScreen
- Card-based swipe interface
- Like/pass gestures with animations
- Filters out already-swiped users
- 30% mock mutual like rate for demo

#### MatchesScreen
- Lists all mutual matches
- Shows proximity status (nearby badge when < 500m)
- Block user functionality
- Navigate to proximity ping screen

#### ProximityPingScreen
- Shows locked state when > 500m away
- Unlocks photo and ping button when within proximity threshold
- Animated pulse effect when unlocked
- Report user functionality

## Mock Data

### Users (`src/data/mockUsers.ts`)
- 5 pre-defined users with random distances (280m-520m)
- Photos from picsum.photos placeholder service
- Mix of distances above/below 500m threshold for testing

### Location/Proximity
- Distances are hardcoded in mock user data
- No actual GPS or location services used
- Proximity check is simple comparison: `distance <= 500`

### Match Logic
- When user likes someone: 30% chance of mutual match
- Real app would check if other user previously liked you
- Matches stored in app context state (resets on app restart)

## Product Rules Implementation

1. **Mutual Like Required** ✅
   - Matches only created when handleSwipe action is 'like'
   - Mock 30% chance simulates mutual like
   - Only matched users appear in Matches screen

2. **Proximity Gate (~500m)** ✅
   - Threshold defined in `src/utils/config.ts`
   - ProximityPingScreen shows locked/unlocked states
   - Photo and ping button only available when `distance <= 500`
   - Clear UI messaging about proximity requirement

3. **No Endless Chat** ✅
   - No chat/messaging UI implemented
   - Single ping button for IRL meetup initiation
   - Focus on proximity-based connection

## Configuration

### Renameable App (`src/utils/config.ts`)
```typescript
export const APP_CONFIG = {
  appName: 'HelloNearby',
  proximityThreshold: 500,
  proximityThresholdDisplay: '~500m',
};
```

To rebrand: update `APP_CONFIG.appName` and it will reflect throughout the app.

## Safety Features

### Block User
- Remove user from matches list
- Console logs block action
- Alert confirmation before blocking
- Real implementation would persist to backend

### Report User
- Multiple report reasons (inappropriate, spam, other)
- Console logs report action
- Alert confirmation after reporting
- Real implementation would send to moderation system

## Future Enhancements

### Near-term (Post-MVP)
- [ ] Real location services (expo-location)
- [ ] Backend API for user profiles and matches
- [ ] Photo upload (expo-image-picker)
- [ ] Push notifications for pings
- [ ] Persistent storage (AsyncStorage or SQLite)

### Long-term
- [ ] Real-time proximity updates
- [ ] In-app messaging after ping
- [ ] User authentication
- [ ] Profile verification
- [ ] Safety features (blocking, reporting to backend)
- [ ] App Store deployment

## Testing Locally

### iOS Simulator (macOS only)
```bash
npm run ios
```

### Android Emulator
```bash
npm run android
```

### Physical Device
1. Install Expo Go from App Store / Play Store
2. Run `npm start`
3. Scan QR code with camera (iOS) or Expo Go (Android)

## Known Issues / Limitations

- No data persistence - all state resets on app restart
- Mock mutual match rate is random (30%)
- Placeholder photos may fail to load if picsum.photos is down
- No error handling for network issues
- Block/report only log to console
- No user authentication
- No backend integration

## Dependencies

### Core
- Expo SDK 57 (latest stable)
- React Native 0.86
- TypeScript 6.0

### Navigation
- @react-navigation/native
- @react-navigation/native-stack
- @react-navigation/bottom-tabs
- react-native-screens
- react-native-safe-area-context

## Code Style

- TypeScript for type safety
- Functional components with hooks
- StyleSheet for styles (no styled-components)
- Dark theme UI (#0a0a0a background, #6C63FF accent)
- Consistent naming: PascalCase for components, camelCase for functions

## Contributing

1. Keep code simple and readable
2. Follow existing patterns and file structure
3. Update this doc if adding new features
4. Test on both iOS and Android when possible
5. Keep mock data clearly labeled
