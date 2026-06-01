import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export interface CustomSound {
  id: string;
  name: string;
  uri: string;
  duration: number;
  clipStartMillis?: number;
  clipDurationMillis?: number;
}

export interface AppState {
  selectedSound: string;
  customSounds: CustomSound[];
  minutes: number;
  incrementSeconds: number;
  setSelectedSound: (id: string) => void;
  addCustomSound: (s: CustomSound) => void;
  removeCustomSound: (id: string) => void;
  setMinutes: (n: number) => void;
  setIncrementSeconds: (n: number) => void;
}

const BUILT_IN_SOUNDS = [
  "classic_tick",
  "wood_knock",
  "digital_beep",
  "soft_bell",
];

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      selectedSound: "classic_tick",
      customSounds: [],
      minutes: 10,
      incrementSeconds: 0,
      setSelectedSound: (id: string) => set({ selectedSound: id }),
      addCustomSound: (s: CustomSound) =>
        set((state) => ({
          customSounds: [...state.customSounds, s],
        })),
      removeCustomSound: (id: string) =>
        set((state) => ({
          customSounds: state.customSounds.filter((s) => s.id !== id),
        })),
      setMinutes: (n: number) => set({ minutes: n }),
      setIncrementSeconds: (n: number) => set({ incrementSeconds: n }),
    }),
    {
      name: "app-storage",
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);

export const SOUND_LABELS = {
  classic_tick: "Classic Tick",
  wood_knock: "Wood Knock",
  digital_beep: "Digital Beep",
  soft_bell: "Soft Bell",
};

export const isBuiltInSound = (id: string) => BUILT_IN_SOUNDS.includes(id);
