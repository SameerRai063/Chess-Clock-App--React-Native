# Chess Clock App - Setup Guide

This guide will help you complete the Chess Clock app setup and get it running.

## Project Structure

```
src/
  app/
    _layout.tsx       # Root layout with Stack navigation and font loading
    index.tsx         # Home screen
    clock.tsx         # Chess clock screen
    sound.tsx         # Sound customization screen
  components/
    TimePresetsBottomSheet.tsx  # Reusable time preset selector
  store/
    appStore.ts       # Zustand state management
  utils/
    audioUtils.ts     # Audio playback utilities
    timeUtils.ts      # Time formatting utilities
  constants/
  hooks/
assets/
  sounds/             # Add sound files here
  fonts/              # Add font files here
```

## Prerequisites

- Node.js and npm installed
- Expo CLI: `npm install -g expo-cli`
- iOS Simulator (macOS) or Android Emulator, or physical device

## Installation Steps

### 1. Install Dependencies

All required npm packages have been installed. To verify:

```bash
npm list expo expo-av expo-document-picker zustand
```

### 2. Download and Add Fonts

1. Download **BebasNeue-Regular.ttf** from Google Fonts:
   https://fonts.google.com/specimen/Bebas+Neue

2. Place the file in:
   ```
   assets/fonts/BebasNeue-Regular.ttf
   ```

### 3. Add Sound Files

Add the following MP3 sound files to `assets/sounds/`:

- **classic-tick.mp3** (< 4 seconds)
- **wood-knock.mp3** (< 4 seconds)
- **digital-beep.mp3** (< 4 seconds)
- **soft-bell.mp3** (< 4 seconds)

You can:

- Download royalty-free sounds from Freesound.org or Zapsplat.com
- Use sound editing software to create or trim sounds to < 4 seconds
- Use these example sources:
  - Classic Tick: Metronome tick sound
  - Wood Knock: Wooden percussion sound
  - Digital Beep: Electronic beep/buzz sound
  - Soft Bell: Gentle bell chime

### 4. Verify File Structure

Check that you have:

```
assets/
  fonts/
    BebasNeue-Regular.ttf
  sounds/
    classic-tick.mp3
    wood-knock.mp3
    digital-beep.mp3
    soft-bell.mp3
```

## Running the App

### Development Mode

```bash
npm start
```

Then press:

- `i` for iOS simulator
- `a` for Android emulator
- `w` for web browser
- `j` to open Expo DevTools

### Building for Distribution

```bash
eas build --platform ios
eas build --platform android
```

## Features Implemented

### Home Screen (index.tsx)

- ✓ Custom header with chess clock title and pawn icon
- ✓ Large queen chess icon
- ✓ Two action buttons with animations
- ✓ Dark theme (#1A1A1A background)
- ✓ Gold accent color (#E8C96D)

### Chess Clock Screen (clock.tsx)

- ✓ Two equal halves (top rotated 180°, bottom normal)
- ✓ Time display in Bebas Neue font (90px)
- ✓ Moves counter for each player
- ✓ Background color changes based on game state
- ✓ Time color changes (white → red (#E85D4A) under 30s, pulse animation under 10s)
- ✓ Tap-to-switch logic with first tap to start
- ✓ Control bar with reset, play/pause, settings, mute buttons
- ✓ Time countdown with automatic game end detection
- ✓ Custom time presets (1, 3, 5, 10, 15, 30 minutes)

### Sound Customization Screen (sound.tsx)

- ✓ Built-in sound selection with radio buttons
- ✓ Custom sound import via document picker
- ✓ Max 4 custom sounds, 4 seconds each
- ✓ Remove custom sounds
- ✓ Sound preview on selection
- ✓ Time presets editor integration
- ✓ Slot counter showing remaining custom sound slots

### Global State Management (appStore.ts)

- ✓ Zustand store with persistence
- ✓ Selected sound tracking
- ✓ Custom sounds storage
- ✓ Minutes setting
- ✓ AsyncStorage integration for persistence

### Audio System

- ✓ Support for built-in sounds and custom sounds
- ✓ Mute toggle functionality
- ✓ Sound preview functionality
- ✓ Automatic audio mode setup (iOS silent mode compatibility)

## Customization

### Colors

Edit color values throughout the code:

- Primary (gold): `#E8C96D`
- Background (dark): `#1A1A1A`
- Secondary (dark gray): `#222`
- Error (red): `#E85D4A`
- Text (white): `#fff`

### Time Presets

Edit the `PRESETS` array in `src/components/TimePresetsBottomSheet.tsx`:

```typescript
const PRESETS = [1, 3, 5, 10, 15, 30];
```

### Default Time

Change in `src/store/appStore.ts`:

```typescript
minutes: 10,  // Change this value
```

## Troubleshooting

### Font not loading

- Ensure `BebasNeue-Regular.ttf` is in `assets/fonts/`
- Clear cache: `npx expo start --clear`
- Rebuild the app

### Sounds not playing

- Verify MP3 files are in `assets/sounds/`
- Check file sizes (should be small, under 100KB each)
- Ensure files are valid MP3 format
- Check app permissions (iOS/Android)

### Import button not appearing

- Verify custom sounds count < 4
- Check state management is working

### App crashes on startup

- Run `npm install` to ensure all dependencies are installed
- Clear Expo cache: `npx expo start --clear`
- Check for TypeScript errors: `npx tsc --noEmit`

## Next Steps (Optional Enhancements)

1. Add themes (light/dark mode toggle)
2. Add game history/statistics
3. Implement sound recording feature
4. Add vibration feedback
5. Create tournament mode
6. Add player names/profiles
7. Implement Bluetooth multiplayer
8. Add sound volume control slider
9. Create settings screen
10. Add analytics/usage tracking

## Dependencies

- `expo` - Core framework
- `expo-router` - File-based routing
- `expo-av` - Audio playback
- `expo-document-picker` - File selection
- `expo-file-system` - File system access
- `expo-font` - Custom font loading
- `expo-status-bar` - Status bar control
- `zustand` - State management
- `@react-native-async-storage/async-storage` - Data persistence
- `@gorhom/bottom-sheet` - Bottom sheet modal
- `react-native-safe-area-context` - Safe area handling
- `@expo/vector-icons` - Icon library

## Support

For issues or questions, refer to:

- Expo Documentation: https://docs.expo.dev/
- React Native Docs: https://reactnative.dev/
- Zustand: https://github.com/pmndrs/zustand
