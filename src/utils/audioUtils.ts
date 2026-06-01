import { useAppStore } from "@/store/appStore";
import { Audio } from "expo-av";

const SOUND_FILES = {
  classic_tick: require("../../assets/sounds/classic-tick.wav"),
  wood_knock: require("../../assets/sounds/wood-knock.wav"),
  digital_beep: require("../../assets/sounds/digital-beep.wav"),
  soft_bell: require("../../assets/sounds/soft-bell.wav"),
};

const playSource = async (
  source: any,
  startMillis = 0,
  durationMillis = 1000,
) => {
  const { sound } = await Audio.Sound.createAsync(source);
  if (startMillis > 0) {
    await sound.setPositionAsync(startMillis);
  }
  await sound.playAsync();

  setTimeout(() => {
    sound.unloadAsync().catch(() => {});
  }, durationMillis + 200);
};

export const playMoveSound = async (muted: boolean) => {
  if (muted) return;

  try {
    const { selectedSound, customSounds } = useAppStore.getState();

    let soundSource: any;
    let startMillis = 0;
    let clipDurationMillis = 1000;

    if (selectedSound.startsWith("custom_")) {
      const customSound = customSounds.find((s) => s.id === selectedSound);
      if (!customSound) return;
      soundSource = { uri: customSound.uri };
      startMillis = customSound.clipStartMillis ?? 0;
      clipDurationMillis =
        customSound.clipDurationMillis ??
        Math.round(customSound.duration * 1000);
    } else {
      soundSource = SOUND_FILES[selectedSound as keyof typeof SOUND_FILES];
    }

    if (!soundSource) return;

    await playSource(soundSource, startMillis, clipDurationMillis);
  } catch (error) {
    console.error("Error playing sound:", error);
  }
};

export const previewSound = async (soundId: string) => {
  try {
    const { customSounds } = useAppStore.getState();

    let soundSource: any;
    let startMillis = 0;
    let clipDurationMillis = 1500;

    if (soundId.startsWith("custom_")) {
      const customSound = customSounds.find((s) => s.id === soundId);
      if (!customSound) return;
      soundSource = { uri: customSound.uri };
      startMillis = customSound.clipStartMillis ?? 0;
      clipDurationMillis =
        customSound.clipDurationMillis ??
        Math.round(customSound.duration * 1000);
    } else {
      soundSource = SOUND_FILES[soundId as keyof typeof SOUND_FILES];
    }

    if (!soundSource) return;

    await playSource(soundSource, startMillis, clipDurationMillis);
  } catch (error) {
    console.error("Error previewing sound:", error);
  }
};
