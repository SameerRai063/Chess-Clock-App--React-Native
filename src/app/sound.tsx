import TimePresetsBottomSheet from "@/components/TimePresetsBottomSheet";
import { SOUND_LABELS, useAppStore } from "@/store/appStore";
import { previewSound } from "@/utils/audioUtils";
import { formatDuration } from "@/utils/timeUtils";
import { MaterialIcons } from "@expo/vector-icons";
import { Audio } from "expo-av";
import * as DocumentPicker from "expo-document-picker";
import { useState } from "react";
import {
  Alert,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const BUILT_IN_SOUNDS = [
  "classic_tick",
  "wood_knock",
  "digital_beep",
  "soft_bell",
];

export default function SoundScreen() {
  const { selectedSound, customSounds, addCustomSound, removeCustomSound } =
    useAppStore();
  const [showPresets, setShowPresets] = useState(false);
  const [pendingClip, setPendingClip] = useState<{
    uri: string;
    name: string;
    fileDuration: number;
    startSeconds: number;
    maxStart: number;
  } | null>(null);

  const handleSelectSound = (soundId: string) => {
    useAppStore.setState({ selectedSound: soundId });
    previewSound(soundId);
  };

  const handleImportSound = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: "audio/*",
        copyToCacheDirectory: true,
      });

      if (!result.assets?.[0]) return;

      const { uri, name } = result.assets[0];

      try {
        const { sound, status } = await Audio.Sound.createAsync({ uri });
        const duration = (status?.durationMillis || 0) / 1000;
        sound.unloadAsync();

        const customSoundName = name.replace(/\.[^/.]+$/, "").substring(0, 22);

        if (duration <= 4) {
          addCustomSound({
            id: `custom_${Date.now()}`,
            name: customSoundName,
            uri,
            duration,
            clipStartMillis: 0,
            clipDurationMillis: Math.round(duration * 1000),
          });
          Alert.alert("Success", "Sound added successfully!");
          return;
        }

        setPendingClip({
          uri,
          name: customSoundName,
          fileDuration: duration,
          startSeconds: 0,
          maxStart: Math.max(0, duration - 4),
        });
      } catch (error) {
        Alert.alert("Error", "Failed to process sound file");
      }
    } catch (error) {
      console.error("Document picker error:", error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerText}>Customize Sound</Text>
        <MaterialIcons name="volume-up" size={24} color="#E8C96D" />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Built-in Sounds */}
        <Text style={styles.sectionTitle}>Built-in Sounds</Text>
        <View style={styles.soundsList}>
          {BUILT_IN_SOUNDS.map((soundId) => (
            <TouchableOpacity
              key={soundId}
              style={[
                styles.soundItem,
                selectedSound === soundId && styles.soundItemActive,
              ]}
              onPress={() => handleSelectSound(soundId)}
            >
              <MaterialIcons
                name={
                  selectedSound === soundId
                    ? "radio-button-checked"
                    : "radio-button-unchecked"
                }
                size={24}
                color="#E8C96D"
              />
              <Text style={styles.soundLabel}>
                {SOUND_LABELS[soundId as keyof typeof SOUND_LABELS]}
              </Text>
              <Text style={styles.defaultBadge}>[Default]</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Custom Sounds */}
        <Text style={styles.sectionTitle}>Custom Sounds</Text>
        {customSounds.length > 0 ? (
          <View style={styles.soundsList}>
            {customSounds.map((sound) => (
              <View key={sound.id} style={styles.soundItem}>
                <TouchableOpacity
                  style={styles.customSoundContent}
                  onPress={() => handleSelectSound(sound.id)}
                >
                  <MaterialIcons
                    name={
                      selectedSound === sound.id
                        ? "radio-button-checked"
                        : "radio-button-unchecked"
                    }
                    size={24}
                    color="#E8C96D"
                  />
                  <View style={styles.customSoundInfo}>
                    <Text style={styles.soundLabel}>{sound.name}</Text>
                    <Text style={styles.soundDuration}>
                      {formatDuration(sound.duration)}
                    </Text>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => removeCustomSound(sound.id)}
                  style={styles.removeButton}
                >
                  <MaterialIcons name="close" size={20} color="#E85D4A" />
                </TouchableOpacity>
              </View>
            ))}
          </View>
        ) : (
          <Text style={styles.emptyText}>No custom sounds yet</Text>
        )}

        {/* Import Button */}
        <TouchableOpacity
          style={styles.importButton}
          onPress={handleImportSound}
        >
          <MaterialIcons name="add" size={24} color="#111" />
          <Text style={styles.importButtonText}>Import Sound from Device</Text>
        </TouchableOpacity>

        {/* Sound Info */}
        <Text style={styles.infoText}>
          Add custom from your device. The sound must be less than 4 seconds
          long.
        </Text>

        <Modal
          visible={!!pendingClip}
          transparent
          animationType="slide"
          onRequestClose={() => setPendingClip(null)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalSheet}>
              <Text style={styles.modalTitle}>Trim a 4-second clip</Text>
              <Text style={styles.modalSubtitle}>
                {pendingClip?.name} •{" "}
                {formatDuration(pendingClip?.fileDuration ?? 0)}
              </Text>
              <Text style={styles.modalLabel}>Selected slice</Text>
              <Text style={styles.modalTimeRange}>
                {pendingClip?.startSeconds.toFixed(1)}s -{" "}
                {((pendingClip?.startSeconds ?? 0) + 4).toFixed(1)}s
              </Text>

              <View style={styles.trimControls}>
                <TouchableOpacity
                  style={[
                    styles.trimButton,
                    pendingClip?.startSeconds === 0 &&
                      styles.trimButtonDisabled,
                  ]}
                  disabled={!pendingClip || pendingClip.startSeconds === 0}
                  onPress={() =>
                    setPendingClip((current) =>
                      current
                        ? {
                            ...current,
                            startSeconds: Math.max(
                              0,
                              Number((current.startSeconds - 0.5).toFixed(1)),
                            ),
                          }
                        : null,
                    )
                  }
                >
                  <Text style={styles.trimButtonText}>-</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.trimButton,
                    pendingClip &&
                      pendingClip.startSeconds >= pendingClip.maxStart &&
                      styles.trimButtonDisabled,
                  ]}
                  disabled={
                    !pendingClip ||
                    pendingClip.startSeconds >= (pendingClip?.maxStart ?? 0)
                  }
                  onPress={() =>
                    setPendingClip((current) =>
                      current
                        ? {
                            ...current,
                            startSeconds: Math.min(
                              current.maxStart,
                              Number((current.startSeconds + 0.5).toFixed(1)),
                            ),
                          }
                        : null,
                    )
                  }
                >
                  <Text style={styles.trimButtonText}>+</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.modalActions}>
                <TouchableOpacity
                  style={styles.previewButton}
                  onPress={async () => {
                    if (!pendingClip) return;
                    const previewSound = await Audio.Sound.createAsync({
                      uri: pendingClip.uri,
                    });
                    await previewSound.sound.setPositionAsync(
                      pendingClip.startSeconds * 1000,
                    );
                    await previewSound.sound.playAsync();
                    setTimeout(() => {
                      previewSound.sound.unloadAsync().catch(() => {});
                    }, 4200);
                  }}
                >
                  <Text style={styles.previewButtonText}>Preview</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.saveTrimButton}
                  onPress={() => {
                    if (!pendingClip) return;
                    addCustomSound({
                      id: `custom_${Date.now()}`,
                      name: pendingClip.name,
                      uri: pendingClip.uri,
                      duration: 4,
                      clipStartMillis: Math.round(
                        pendingClip.startSeconds * 1000,
                      ),
                      clipDurationMillis: 4000,
                    });
                    setPendingClip(null);
                    Alert.alert("Success", "Sound added successfully!");
                  }}
                >
                  <Text style={styles.saveTrimButtonText}>Save Clip</Text>
                </TouchableOpacity>
              </View>

              <TouchableOpacity
                style={styles.cancelTrimButton}
                onPress={() => setPendingClip(null)}
              >
                <Text style={styles.cancelTrimText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        {/* Time Presets */}
        <Text style={styles.sectionTitle}>Time Presets</Text>
        <TouchableOpacity
          style={styles.presetsButton}
          onPress={() => setShowPresets(true)}
        >
          <MaterialIcons name="schedule" size={24} color="#111" />
          <Text style={styles.presetsButtonText}>Edit Time Presets</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Time Presets Bottom Sheet */}
      <TimePresetsBottomSheet
        visible={showPresets}
        onClose={() => setShowPresets(false)}
        onApply={() => setShowPresets(false)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1A1A1A",
  },
  header: {
    backgroundColor: "#111",
    paddingVertical: 16,
    paddingHorizontal: 20,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 12,
  },
  headerText: {
    fontSize: 20,
    fontFamily: "BebasNeue",
    color: "#E8C96D",
    letterSpacing: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: "BebasNeue",
    color: "#E8C96D",
    marginTop: 20,
    marginBottom: 12,
    letterSpacing: 0.5,
  },
  soundsList: {
    gap: 8,
  },
  soundItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#222",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: "#333",
  },
  soundItemActive: {
    borderColor: "#E8C96D",
    backgroundColor: "#2A2A2A",
  },
  soundLabel: {
    fontSize: 14,
    color: "#fff",
    marginLeft: 12,
    flex: 1,
  },
  defaultBadge: {
    fontSize: 12,
    color: "#888",
  },
  customSoundContent: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  customSoundInfo: {
    marginLeft: 12,
    flex: 1,
  },
  soundDuration: {
    fontSize: 12,
    color: "#888",
    marginTop: 4,
  },
  removeButton: {
    marginLeft: 8,
    padding: 4,
  },
  emptyText: {
    fontSize: 14,
    color: "#666",
    fontStyle: "italic",
    textAlign: "center",
    paddingVertical: 12,
  },
  importButton: {
    backgroundColor: "#E8C96D",
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
    marginTop: 16,
  },
  importButtonText: {
    fontSize: 14,
    fontFamily: "BebasNeue",
    color: "#111",
    letterSpacing: 0.5,
  },
  infoText: {
    fontSize: 12,
    color: "#888",
    marginTop: 12,
    textAlign: "center",
  },
  presetsButton: {
    backgroundColor: "#222",
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
    marginTop: 16,
    borderWidth: 1,
    borderColor: "#333",
  },
  presetsButtonText: {
    fontSize: 14,
    fontFamily: "BebasNeue",
    color: "#fff",
    letterSpacing: 0.5,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalSheet: {
    backgroundColor: "#1A1A1A",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: "70%",
  },
  modalTitle: {
    fontSize: 18,
    fontFamily: "BebasNeue",
    color: "#E8C96D",
    marginBottom: 6,
  },
  modalSubtitle: {
    color: "#ccc",
    fontSize: 12,
    marginBottom: 20,
  },
  modalLabel: {
    color: "#ccc",
    fontSize: 13,
    marginBottom: 6,
  },
  modalTimeRange: {
    color: "#fff",
    fontSize: 20,
    fontFamily: "BebasNeue",
    marginBottom: 16,
  },
  trimControls: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
    marginBottom: 20,
  },
  trimButton: {
    flex: 1,
    backgroundColor: "#222",
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#333",
  },
  trimButtonDisabled: {
    opacity: 0.4,
  },
  trimButtonText: {
    color: "#E8C96D",
    fontSize: 24,
    fontFamily: "BebasNeue",
  },
  modalActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
  },
  previewButton: {
    flex: 1,
    backgroundColor: "#222",
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
  },
  previewButtonText: {
    color: "#E8C96D",
    fontSize: 14,
    fontFamily: "BebasNeue",
  },
  saveTrimButton: {
    flex: 1,
    backgroundColor: "#E8C96D",
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
  },
  saveTrimButtonText: {
    color: "#111",
    fontSize: 14,
    fontFamily: "BebasNeue",
  },
  cancelTrimButton: {
    marginTop: 16,
    backgroundColor: "#222",
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#333",
  },
  cancelTrimText: {
    color: "#ccc",
    fontFamily: "BebasNeue",
    fontSize: 14,
  },
});
