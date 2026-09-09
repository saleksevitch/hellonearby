# HelloNearby

Ephemeral geomatch dating app built with Expo + React Native. Catch people in range like Pokémon GO — no swipe deck, no endless chat. 👋

## Product Concept

HelloNearby is a location-based dating app with **scavenger-hunt energy**:

1. **Turn on discoverable** - Appear on others' radar
2. **Set two-way filters** - Age, gender, height, ethnicity (mutual matching only)
3. **Catch people on radar** - Mystery encounters within ~500m
4. **Limited weekly quota** - Free: 1/week, Paid: 5/week (use wisely!)
5. **Ephemeral connections** - Geomatches vanish when out of range
6. **Meet IRL** - No messaging, just proximity-based hellos

## New Product Model (Post-Swipe Pivot)

### ❌ Removed (Old MVP)
- Swipe deck / Tinder-style cards
- Unlimited matching
- Messaging system

### ✅ New Features

#### Discoverable Toggle
- **On**: Appear on others' radar when in range and filters match
- **Off**: Hidden from everyone's radar
- Set in Profile screen

#### Two-Way Filters (Mutual Matching Only)
You only see/are shown to people who mutually match these filters:
- **Age range** (e.g., 23-35)
- **Gender** (who you want to meet: man, woman, non-binary, other)
- **Height range** (in cm)
- **Ethnicity** (optional filter: asian, black, hispanic, white, etc.)

Both users must match each other's criteria to appear on radar.

#### Geomatch Quota System (Weekly Limits)
- **Free tier**: 1 geomatch per week
- **Paid tier**: 5 geomatches per week
- Resets every 7 days
- Mock toggle in Profile screen (no real payments)

#### Radar / Nearby Encounters
- No swipe cards — radar shows mystery "?" circles for in-range people
- Must be within ~500m and match filters to appear
- Tap to "catch" — consumes 1 geomatch from weekly quota
- Catch-or-miss: they vanish when they leave range

#### Ephemeral Geomatches
- Caught geomatches appear in Geomatches tab
- **In range** (≤500m): Photo visible, can reconnect
- **Out of range** (>500m): "Vanished" badge, must get close again
- No chat — proximity creates the connection

## MVP Features Delivered

✅ **Profile Screen**
- Edit: name, age, bio, height, gender, ethnicity
- Discoverable on/off toggle
- Filter preferences (age/gender/height/ethnicity)
- View weekly quota status (X/Y geomatches left)
- Mock free/paid tier toggle

✅ **Radar Screen**
- Shows mystery encounters within ~500m who match filters
- Filter check: discoverable + two-way filter match + in range
- Tap to catch (uses 1 geomatch)
- Quota display in header

✅ **Geomatches Screen**
- Lists all caught geomatches
- Shows in-range vs vanished status
- Tap to view full profile

✅ **Geomatch Detail Screen**
- Full profile when caught (photo, bio, height, gender, ethnicity)
- Ephemeral indicator if out of range
- Block/report functionality

✅ **Block/Report Stubs**
- Block removes from geomatches
- Report with multiple reasons
- Console logging (no backend)

## Tech Stack

- **Expo SDK 57** (latest stable)
- **React Native 0.86**
- **TypeScript** (fully type-safe)
- **React Navigation** (Native Stack + Bottom Tabs)
- **Mock data** (6 users with full profiles, no backend required)

## Installation

### Prerequisites

- Node.js 16+ and npm
- iOS Simulator (Xcode) or Android Emulator
- Expo Go app (for physical device testing)

### Setup

```bash
# Navigate to the project
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
├── App.tsx                         # Root with navigation
├── README.md                       # This file
├── DEVELOPMENT.md                  # Architecture & dev notes
├── src/
│   ├── screens/
│   │   ├── ProfileScreen.tsx       # Profile + filters + quota
│   │   ├── RadarScreen.tsx         # Mystery encounters + catch
│   │   ├── MatchesScreen.tsx       # Geomatches list (ephemeral status)
│   │   └── GeomatchDetailScreen.tsx # Full caught profile
│   ├── navigation/
│   │   ├── MainTabs.tsx            # Bottom tabs (Radar/Geomatches/Profile)
│   │   └── types.ts                # Navigation types
│   ├── utils/
│   │   ├── AppContext.tsx          # Global state + quota + filters
│   │   └── config.ts               # App config (name, quotas, threshold)
│   ├── types/index.ts              # TypeScript types
│   └── data/mockUsers.ts           # 6 mock users with profiles
├── package.json
└── assets/                         # Expo default assets
```

## What's Real vs Mocked

### ✅ Real Features (Functional)
- Profile editing with all new fields
- Discoverable toggle
- Filter preferences (age/gender/height/ethnicity)
- Two-way filter matching logic
- Weekly geomatch quota system (1 free, 5 paid)
- Radar filtering (discoverable + filters + in-range)
- Catch/consume quota flow
- Ephemeral status (in-range vs vanished)
- Block/report handlers

### 🎭 Mocked for V1
- **User data**: 6 mock users with full profiles (height, gender, ethnicity)
- **Location/distance**: Hardcoded distances (280-520m), no GPS
- **Proximity detection**: Simple comparison (distance <= 500m)
- **Quota reset**: Manual "Reset Quota" button (no automatic 7-day timer)
- **Free/Paid toggle**: Local state switch (no payments/subscriptions)
- **Block/report**: Console logs only (no backend persistence)

## Product Rules Enforced

1. **Discoverable Required** ✅
   - Users with discoverable OFF don't appear on any radar
   - Toggle in Profile screen

2. **Two-Way Filter Matching** ✅
   - Both users must match each other's age/gender/height/ethnicity filters
   - Implemented in `doFiltersMatch()` function

3. **Weekly Quota Limits** ✅
   - Free: 1 geomatch per week
   - Paid: 5 geomatches per week
   - Catching consumes quota
   - No quota = can't catch (alert shown)

4. **~500m Proximity Gate** ✅
   - Only in-range users appear on radar
   - Geomatches show "vanished" when out of range
   - Mocked for v1 (no real GPS)

5. **No Swipe Deck / No Messaging** ✅
   - Radar replaces swipe cards
   - No chat interface
   - Proximity creates the connection

## Configuration

### Renameable App (`src/utils/config.ts`)
```typescript
export const APP_CONFIG = {
  appName: 'HelloNearby',
  proximityThreshold: 500, // meters
  proximityThresholdDisplay: '~500m',
  freeGeomatchesPerWeek: 1,
  paidGeomatchesPerWeek: 5,
};
```

To rebrand: update `APP_CONFIG.appName` and it reflects app-wide.

## Testing the Pivot

### Test Free Tier (1/week)
1. Profile → Ensure "Free (1/week)" badge shown
2. Radar → Catch 1 person → Quota shows 0/1
3. Try to catch another → Alert: "No geomatches left"
4. Profile → "Reset Quota" button → Back to 1/1

### Test Paid Tier (5/week)
1. Profile → Toggle "Switch to Paid (Demo)"
2. Badge changes to "Paid (5/week)"
3. Quota updates to X/5
4. Catch up to 5 people from radar

### Test Two-Way Filters
1. Profile → Edit filters (e.g., age 25-30, women only)
2. Radar → Only see users who:
   - Are discoverable
   - Match YOUR filters (age/gender/height/ethnicity)
   - You match THEIR filters
3. Example: Taylor (not discoverable) never appears

### Test Ephemeral Status
1. Catch someone in range (e.g., Sam at 280m)
2. Geomatches → Shows "In range!" badge
3. Mock moving out of range: user's distance becomes >500m
4. Geomatches → Shows "Out of range" badge

## Safety Features

### Block User
- Removes from geomatches list
- Alert confirmation before blocking
- Console logs action
- Real implementation would persist to backend

### Report User
- Multiple report reasons (inappropriate, spam, other)
- Alert confirmation after reporting
- Console logs action
- Real implementation would send to moderation system

## Future Enhancements

### Near-term (Post-MVP)
- [ ] Real location services (expo-location)
- [ ] Automatic weekly quota reset (7-day timer)
- [ ] Backend API for profiles and geomatches
- [ ] Photo upload (expo-image-picker)
- [ ] Push notifications for in-range geomatches
- [ ] Real payments/subscriptions (Stripe/RevenueCat)

### Long-term
- [ ] Real-time proximity updates
- [ ] Ping/nudge system when in range
- [ ] User authentication
- [ ] Profile verification
- [ ] Safety features (persistent blocking/reporting)
- [ ] App Store deployment

## Known Issues / Limitations

- No data persistence — all state resets on app restart
- Quota reset is manual (button, not automatic 7-day timer)
- Mock free/paid toggle (no real subscriptions)
- Placeholder photos may fail if picsum.photos is down
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

## Troubleshooting

### Port already in use
```bash
killall node
npm start
```

### Metro bundler issues
```bash
npx expo start --clear
```

### Dependencies not found
```bash
rm -rf node_modules package-lock.json
npm install
```

## License

MIT

## Support

For questions or issues, please open a GitHub issue.

---

**Product Pivot Complete!** No more swipe deck. Ephemeral geomatch flow with weekly quota limits (1 free, 5 paid) and two-way filter matching. Ready to catch! 🎯
