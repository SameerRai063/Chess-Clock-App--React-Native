# Quick Start Guide

## 30-Second Setup

1. **Download Font**

   ```bash
   # Download BebasNeue-Regular.ttf from:
   # https://fonts.google.com/specimen/Bebas+Neue
   # Place in: assets/fonts/BebasNeue-Regular.ttf
   ```

2. **Download Sounds**
   Add 4 MP3 files to `assets/sounds/`:
   - `classic-tick.mp3`
   - `wood-knock.mp3`
   - `digital-beep.mp3`
   - `soft-bell.mp3`

3. **Run the App**
   ```bash
   npm start
   ```
   Then press `i` (iOS), `a` (Android), or `w` (web)

## File Structure

```
chessClockApp/
├── src/
│   ├── app/
│   │   ├── _layout.tsx         # Main layout with Stack nav
│   │   ├── index.tsx           # Home/Menu screen
│   │   ├── clock.tsx           # Chess clock screen
│   │   └── sound.tsx           # Sound settings screen
│   ├── components/
│   │   └── TimePresetsBottomSheet.tsx
│   ├── store/
│   │   └── appStore.ts         # Zustand state
│   └── utils/
│       ├── audioUtils.ts
│       └── timeUtils.ts
├── assets/
│   ├── fonts/                  # Add BebasNeue-Regular.ttf
│   └── sounds/                 # Add 4 MP3 files
├── app.json                    # App configuration
└── package.json
```

## What's Built

✅ **Home Screen**

- Custom dark header with chess theme
- Navigation to Clock and Sound screens
- Smooth button animations

✅ **Chess Clock**

- Two time displays (one rotated)
- Move counter per player
- Play/Pause/Reset controls
- Time presets (1-30 minutes)
- Mute toggle
- Color-coded time warnings
- Sound on move switch

✅ **Sound Customization**

- 4 built-in sounds
- Import custom sounds from device
- Max 4 custom sounds (4 sec each)
- Sound preview on selection
- Time preset editor

✅ **State Management**

- Zustand with AsyncStorage persistence
- Automatic settings saving
- Custom sound library management

## Keyboard Shortcuts (Dev Mode)

- `i` → iOS Simulator
- `a` → Android Emulator
- `w` → Web Browser
- `r` → Reload
- `o` → Open DevTools

## Troubleshooting

| Issue              | Solution                                          |
| ------------------ | ------------------------------------------------- |
| App won't start    | Run `npm install` and `npx expo start --clear`    |
| Font not showing   | Download BebasNeue-Regular.ttf to `assets/fonts/` |
| Sounds not playing | Add MP3 files to `assets/sounds/`                 |
| TypeScript errors  | Run `npx tsc --noEmit` to check                   |

## Key Technologies

- **Expo Router** - File-based navigation
- **Zustand** - State management
- **expo-av** - Audio playback
- **expo-document-picker** - File import
- **React Native** - Cross-platform UI
- **AsyncStorage** - Data persistence

## Next Steps

See `SETUP_GUIDE.md` for detailed configuration and customization options.

Need help? Check the Expo docs: https://docs.expo.dev/
