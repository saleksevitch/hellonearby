# HelloNearby

An IRL dating app MVP built with Expo + React Native. Match nearby, get close, say hello! 👋

## Product Concept

HelloNearby brings the scavenger-hunt energy of Pokémon Go to IRL dating:

1. **Swipe on people nearby** - Like or pass on profiles
2. **Mutual like required** - Both parties must like each other to match
3. **Proximity unlocks connection** - Get within ~500m to unlock photo & ping
4. **Meet IRL** - No endless chat, just a ping when you're ready to say hello!

## MVP Features

✅ **Profile Screen** - Edit your name, age, bio (photo placeholder for v1)  
✅ **Swipe Screen** - Like or pass on mock nearby users  
✅ **Matches Screen** - View mutual matches and their proximity  
✅ **Proximity Ping** - Unlock photo & ping when within ~500m (mocked distance)  
✅ **Block/Report** - Safety stubs with UI handlers  

## Tech Stack

- **Expo SDK 57** (latest stable)
- **React Native 0.86**
- **TypeScript**
- **React Navigation** (Native Stack + Bottom Tabs)
- **Mock data** for users and location (no backend required)

## Installation

### Prerequisites

- Node.js 16+ and npm
- iOS Simulator (Xcode) or Android Emulator
- Expo Go app (for physical device testing)

### Setup

```bash
# Clone and navigate to the project
cd hellonearby

# Install dependencies
npm install

# Start the Expo development server
npm start
```

## Running the App

### Option 1: iOS Simulator (macOS only)

```bash
npm run ios
```

Or press `i` in the Expo dev server terminal.

### Option 2: Android Emulator

```bash
npm run android
```

Or press `a` in the Expo dev server terminal.

### Option 3: Expo Go (Physical Device)

1. Install the **Expo Go** app from the App Store (iOS) or Google Play (Android)
2. Run `npm start`
3. Scan the QR code displayed in your terminal or browser

## Project Structure

```
hellonearby/
├── App.tsx                    # Root component with navigation
├── src/
│   ├── screens/               # Main app screens
│   │   ├── ProfileScreen.tsx  # User profile editing
│   │   ├── SwipeScreen.tsx    # Swipe on nearby users
│   │   ├── MatchesScreen.tsx  # View mutual matches
│   │   └── ProximityPingScreen.tsx  # Ping UI when nearby
│   ├── navigation/            # Navigation setup
│   │   ├── MainTabs.tsx       # Bottom tab navigator
│   │   └── types.ts           # Navigation type definitions
│   ├── components/            # Reusable components (empty for v1)
│   ├── utils/
│   │   ├── AppContext.tsx     # Global state management
│   │   └── config.ts          # App configuration (name, proximity threshold)
│   ├── types/
│   │   └── index.ts           # TypeScript types
│   └── data/
│       └── mockUsers.ts       # Mock nearby users for swipe screen
├── assets/                    # App icons and splash screen
└── package.json
```

## What's Real vs Mocked

### ✅ Real Features (Functional)
- Profile editing with local state
- Swipe gestures and animations
- Match creation logic (30% mock mutual like rate)
- Navigation between screens
- Block/report UI handlers

### 🎭 Mocked for V1
- **User data** - 5 mock users with placeholder photos (picsum.photos)
- **Location/distance** - Hardcoded distances in meters, no GPS required
- **Proximity detection** - Uses mocked distance values (<= 500m threshold)
- **Mutual likes** - 30% chance to simulate mutual like when you like someone
- **Block/report** - Actions log to console, no backend persistence

## Product Rules

1. **Photo & ping unlock only after mutual like** ✅  
   Users must match before accessing the proximity ping feature

2. **~500m proximity gate** ✅  
   Photos and ping are locked until users are within 500 meters (mocked for v1)

3. **No endless chat** ✅  
   The app focuses on IRL meetups, not messaging

4. **Scavenger-hunt energy** ✅  
   Users discover matches and unlock features through proximity

## Development Notes

### Customization

The app name and proximity threshold are configurable in `src/utils/config.ts`:

```typescript
export const APP_CONFIG = {
  appName: 'HelloNearby',  // Change this to rebrand
  proximityThreshold: 500, // meters
  proximityThresholdDisplay: '~500m',
};
```

### Adding Real Features

To upgrade from mock to real:

1. **GPS/Location** - Use `expo-location` for real proximity detection
2. **Backend** - Add auth, user profiles, and match storage (e.g., Firebase, Supabase)
3. **Photo Upload** - Use `expo-image-picker` + cloud storage
4. **Push Notifications** - Add ping alerts via `expo-notifications`

## Known Limitations

- No authentication or user accounts
- All data resets on app restart (no persistence)
- Mock mutual match rate (30% for demo purposes)
- Placeholder photos from picsum.photos
- No actual GPS or location services
- Block/report actions are non-functional (UI only)

## Future Roadmap (Out of Scope for MVP)

- Real authentication (email, phone, social login)
- Backend API and database
- Real-time location tracking
- Push notifications for matches and pings
- In-app messaging
- Photo upload from camera/library
- App Store / TestFlight submission

## Troubleshooting

### Port already in use
```bash
# Kill existing Expo process
killall node
npm start
```

### Metro bundler issues
```bash
# Clear cache and restart
npx expo start --clear
```

### Dependencies not found
```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

## License

MIT

## Support

For questions or issues, please open a GitHub issue or contact the development team.

---

**Ready to ship!** Stefan can now run this app, swipe on profiles, create matches, and explore the proximity ping UI. 🚀
