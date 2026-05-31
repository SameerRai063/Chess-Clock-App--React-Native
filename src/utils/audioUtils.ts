import { useAppStore } from "@/store/appStore";
import { Audio } from "expo-av";

const SOUND_FILES = {
  classic_tick: require("../../assets/sounds/classic-tick.wav"),
  wood_knock: require("../../assets/sounds/wood-knock.wav"),
  digital_beep: require("../../assets/sounds/digital-beep.wav"),
  soft_bell: require("../../assets/sounds/soft-bell.wav"),
};

export const playMoveSound = async (muted: boolean) => {
  if (muted) return;

  try {
    const { selectedSound, customSounds } = useAppStore.getState();

    let soundSource: any;

    if (selectedSound.startsWith("custom_")) {
      const customSound = customSounds.find((s) => s.id === selectedSound);
      if (!customSound) return;
      soundSource = { uri: customSound.uri };
    } else {
      soundSource = SOUND_FILES[selectedSound as keyof typeof SOUND_FILES];
    }

    if (!soundSource) return;

    const { sound } = await Audio.Sound.createAsync(soundSource);
    await sound.playAsync();

    // Schedule cleanup after sound finishes
    setTimeout(() => {
      sound.unloadAsync().catch(() => {});
    }, 1000);
  } catch (error) {
    console.error("Error playing sound:", error);
  }
};

export const previewSound = async (soundId: string) => {
  try {
    const { customSounds } = useAppStore.getState();

    let soundSource: any;

    if (soundId.startsWith("custom_")) {
      const customSound = customSounds.find((s) => s.id === soundId);
      if (!customSound) return;
      soundSource = { uri: customSound.uri };
    } else {
      soundSource = SOUND_FILES[soundId as keyof typeof SOUND_FILES];
    }

    if (!soundSource) return;

    const { sound } = await Audio.Sound.createAsync(soundSource);
    await sound.playAsync();

    // Schedule cleanup after sound finishes
    setTimeout(() => {
      sound.unloadAsync().catch(() => {});
    }, 1500);
  } catch (error) {
    console.error("Error previewing sound:", error);
  }
};
