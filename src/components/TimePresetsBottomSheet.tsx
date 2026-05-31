import { useAppStore } from "@/store/appStore";
import { MaterialIcons } from "@expo/vector-icons";
import { useState } from "react";
import {
    Alert,
    Modal,
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
  const { minutes, setMinutes } = useAppStore();
  const [selectedMinutes, setSelectedMinutes] = useState(minutes);
  const [customInput, setCustomInput] = useState("");

  const handlePresetSelect = (preset: number) => {
    setSelectedMinutes(preset);
    setCustomInput("");
  };

  const handleCustomApply = () => {
    const num = parseInt(customInput, 10);
    if (isNaN(num) || num <= 0 || num > 120) {
      Alert.alert("Invalid Input", "Please enter a number between 1 and 120");
      return;
    }
    setSelectedMinutes(num);
  };

  const handleApply = () => {
    setMinutes(selectedMinutes);
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

          {/* Presets Grid */}
          <View style={styles.presetsGrid}>
            {PRESETS.map((preset) => (
              <TouchableOpacity
                key={preset}
                style={[
                  styles.presetCard,
                  selectedMinutes === preset && styles.presetCardActive,
                ]}
                onPress={() => handlePresetSelect(preset)}
              >
                <Text
                  style={[
                    styles.presetText,
                    selectedMinutes === preset && styles.presetTextActive,
                  ]}
                >
                  {preset}m
                </Text>
              </TouchableOpacity>
            ))}
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
                value={customInput}
                onChangeText={setCustomInput}
              />
              <TouchableOpacity
                style={styles.customButton}
                onPress={handleCustomApply}
              >
                <Text style={styles.customButtonText}>Apply</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Apply Button */}
          <TouchableOpacity style={styles.applyButton} onPress={handleApply}>
            <Text style={styles.applyButtonText}>Set Time</Text>
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
    paddingBottom: 30,
    maxHeight: "80%",
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
});
