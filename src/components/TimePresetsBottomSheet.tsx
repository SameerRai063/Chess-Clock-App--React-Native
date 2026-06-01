import { useAppStore } from "@/store/appStore";
import { MaterialIcons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import {
    Alert,
    Modal,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

interface TimePresetsBottomSheetProps {
  visible: boolean;
  onClose: () => void;
  onApply: () => void;
}

const PRESETS = [1, 3, 5, 10, 15, 30];

export default function TimePresetsBottomSheet({
  visible,
  onClose,
  onApply,
}: TimePresetsBottomSheetProps) {
  const minutes = useAppStore((s) => s.minutes);
  const incrementSeconds = useAppStore((s) => s.incrementSeconds);
  const [minutesInput, setMinutesInput] = useState(String(minutes));
  const [incrementInput, setIncrementInput] = useState(
    String(incrementSeconds),
  );

  useEffect(() => {
    if (visible) {
      setMinutesInput(String(minutes));
      setIncrementInput(String(incrementSeconds));
    }
  }, [visible, minutes, incrementSeconds]);

  const handlePresetSelect = (preset: number) => {
    setMinutesInput(String(preset));
  };

  const handleCustomApply = () => {
    const minutesValue = parseInt(minutesInput, 10);
    const incrementValue = parseInt(incrementInput, 10);

    if (isNaN(minutesValue) || minutesValue <= 0 || minutesValue > 120) {
      Alert.alert(
        "Invalid Time",
        "Please enter a number between 1 and 120 minutes.",
      );
      return;
    }

    if (isNaN(incrementValue) || incrementValue < 0 || incrementValue > 60) {
      Alert.alert(
        "Invalid Increment",
        "Please enter a number between 0 and 60 seconds.",
      );
      return;
    }

    setMinutesInput(String(minutesValue));
    setIncrementInput(String(incrementValue));
  };

  const handleApply = () => {
    const minutesValue =
      minutesInput.trim().length > 0 ? parseInt(minutesInput, 10) : minutes;
    const incrementValue =
      incrementInput.trim().length > 0
        ? parseInt(incrementInput, 10)
        : incrementSeconds;

    if (isNaN(minutesValue) || minutesValue <= 0 || minutesValue > 120) {
      Alert.alert(
        "Invalid Time",
        "Please enter a number between 1 and 120 minutes.",
      );
      return;
    }

    if (isNaN(incrementValue) || incrementValue < 0 || incrementValue > 60) {
      Alert.alert(
        "Invalid Increment",
        "Please enter a number between 0 and 60 seconds.",
      );
      return;
    }

    useAppStore.setState({
      minutes: minutesValue,
      incrementSeconds: incrementValue,
    });
    onApply();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.bottomSheet}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Time Presets</Text>
            <TouchableOpacity onPress={onClose}>
              <MaterialIcons name="close" size={24} color="#E8C96D" />
            </TouchableOpacity>
          </View>

          <ScrollView
            style={styles.scrollArea}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            {/* Presets Grid */}
            <View style={styles.presetsGrid}>
              {PRESETS.map((preset) => (
                <TouchableOpacity
                  key={preset}
                  style={[
                    styles.presetCard,
                    parseInt(minutesInput, 10) === preset &&
                      styles.presetCardActive,
                  ]}
                  onPress={() => handlePresetSelect(preset)}
                >
                  <Text
                    style={[
                      styles.presetText,
                      parseInt(minutesInput, 10) === preset &&
                        styles.presetTextActive,
                    ]}
                  >
                    {preset}m
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.sectionSubtitle}>
              Or enter a custom preset below:
            </Text>

            <View style={styles.customSectionHeader}>
              <Text style={styles.customSectionTitle}>
                Custom time + increment
              </Text>
              <Text style={styles.customSectionDescription}>
                Enter your own time and bonus seconds per move.
              </Text>
            </View>

            {/* Custom Input */}
            <View style={styles.customSection}>
              <Text style={styles.customLabel}>Custom Time (minutes)</Text>
              <View style={styles.customInputContainer}>
                <TextInput
                  style={styles.customInput}
                  placeholder="Enter minutes"
                  placeholderTextColor="#666"
                  keyboardType="number-pad"
                  value={minutesInput}
                  onChangeText={setMinutesInput}
                />
                <TouchableOpacity
                  style={styles.customButton}
                  onPress={handleCustomApply}
                >
                  <Text style={styles.customButtonText}>Apply</Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.customSection}>
              <Text style={styles.customLabel}>
                Increment per move (seconds)
              </Text>
              <View style={styles.customInputContainer}>
                <TextInput
                  style={styles.customInput}
                  placeholder="0"
                  placeholderTextColor="#666"
                  keyboardType="number-pad"
                  value={incrementInput}
                  onChangeText={setIncrementInput}
                />
                <TouchableOpacity
                  style={styles.customButton}
                  onPress={handleCustomApply}
                >
                  <Text style={styles.customButtonText}>Apply</Text>
                </TouchableOpacity>
              </View>
            </View>

            <Text style={styles.infoText}>
              Choose a preset or enter a custom time. Then click Change to apply
              the selected preset.
            </Text>
          </ScrollView>

          {/* Change Button */}
          <TouchableOpacity style={styles.applyButton} onPress={handleApply}>
            <Text style={styles.applyButtonText}>Change</Text>
          </TouchableOpacity>

          {/* Cancel Button */}
          <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  bottomSheet: {
    backgroundColor: "#1A1A1A",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 20,
    height: "80%",
  },
  scrollArea: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#333",
  },
  title: {
    fontSize: 18,
    fontFamily: "BebasNeue",
    color: "#E8C96D",
    letterSpacing: 1,
  },
  presetsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 20,
    paddingTop: 20,
    gap: 12,
  },
  presetCard: {
    flex: 1,
    minWidth: "30%",
    aspectRatio: 1,
    backgroundColor: "#222",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#333",
  },
  presetCardActive: {
    backgroundColor: "#E8C96D",
    borderColor: "#E8C96D",
  },
  presetText: {
    fontSize: 16,
    fontFamily: "BebasNeue",
    color: "#E8C96D",
    letterSpacing: 0.5,
  },
  presetTextActive: {
    color: "#111",
  },
  customSection: {
    paddingHorizontal: 20,
    marginTop: 20,
  },
  customLabel: {
    fontSize: 14,
    color: "#ccc",
    marginBottom: 8,
  },
  customSectionHeader: {
    paddingHorizontal: 20,
    marginTop: 20,
  },
  customSectionTitle: {
    color: "#E8C96D",
    fontSize: 16,
    fontFamily: "BebasNeue",
    marginBottom: 4,
  },
  customSectionDescription: {
    color: "#999",
    fontSize: 12,
    lineHeight: 18,
  },
  customInputContainer: {
    flexDirection: "row",
    gap: 8,
  },
  customInput: {
    flex: 1,
    backgroundColor: "#222",
    borderRadius: 8,
    paddingHorizontal: 12,
    color: "#fff",
    borderWidth: 1,
    borderColor: "#333",
  },
  customButton: {
    backgroundColor: "#E8C96D",
    borderRadius: 8,
    paddingHorizontal: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  customButtonText: {
    color: "#111",
    fontFamily: "BebasNeue",
    fontSize: 14,
  },
  applyButton: {
    marginHorizontal: 20,
    marginTop: 20,
    backgroundColor: "#E8C96D",
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
  },
  sectionSubtitle: {
    color: "#ccc",
    fontSize: 13,
    marginHorizontal: 20,
    marginTop: 18,
    lineHeight: 20,
  },
  applyButtonText: {
    color: "#111",
    fontFamily: "BebasNeue",
    fontSize: 16,
    letterSpacing: 0.5,
  },
  cancelButton: {
    marginHorizontal: 20,
    marginTop: 10,
    backgroundColor: "#222",
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#333",
  },
  cancelButtonText: {
    color: "#ccc",
    fontFamily: "BebasNeue",
    fontSize: 16,
    letterSpacing: 0.5,
  },
  infoText: {
    color: "#999",
    fontSize: 12,
    marginHorizontal: 20,
    marginTop: 16,
    textAlign: "center",
    lineHeight: 18,
  },
});
