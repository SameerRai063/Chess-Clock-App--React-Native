import { FontAwesome5, MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useRef, useState } from "react";
import {
  Animated,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomeScreen() {
  const router = useRouter();
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const [activeButton, setActiveButton] = useState<string | null>(null);

  const animateButton = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.95,
      useNativeDriver: true,
    }).start(() => {
      Animated.spring(scaleAnim, {
        toValue: 1,
        useNativeDriver: true,
      }).start();
    });
  };

  const handleClockPress = () => {
    animateButton();
    setTimeout(() => router.push("/clock"), 100);
  };

  const handleSoundPress = () => {
    animateButton();
    setTimeout(() => router.push("/sound"), 100);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Custom Header */}
      <View style={styles.header}>
        <Text style={styles.headerText}>Customizable Chess Clock</Text>
      </View>

      {/* Main Content */}
      <View style={styles.content}>
        <FontAwesome5
          name="chess-queen"
          size={80}
          color="#E8C96D"
          style={styles.icon}
        />
        <Text style={styles.tagline}>Blunder Master Samir Rai</Text>

        <View style={styles.buttonContainer}>
          {/* Chess Clock Button */}
          <TouchableOpacity
            style={styles.primaryButton}
            activeOpacity={0.8}
            onPress={handleClockPress}
          >
            <MaterialIcons
              name="schedule"
              size={24}
              color="#111"
              style={styles.buttonIcon}
            />
            <Text style={styles.primaryButtonText}>Chess Clock</Text>
          </TouchableOpacity>

          {/* Customize Sound Button */}
          <TouchableOpacity
            style={styles.secondaryButton}
            activeOpacity={0.8}
            onPress={handleSoundPress}
          >
            <MaterialIcons
              name="volume-up"
              size={24}
              color="#fff"
              style={styles.buttonIcon}
            />
            <Text style={styles.secondaryButtonText}>Customize Sound</Text>
          </TouchableOpacity>
        </View>
      </View>
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
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  icon: {
    marginBottom: 20,
  },
  tagline: {
    fontSize: 16,
    color: "#ccc",
    marginBottom: 40,
    textAlign: "center",
    fontStyle: "italic",
  },
  buttonContainer: {
    width: "100%",
    gap: 16,
  },
  primaryButton: {
    backgroundColor: "#E8C96D",
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 20,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  primaryButtonText: {
    fontSize: 18,
    fontFamily: "BebasNeue",
    color: "#111",
    letterSpacing: 0.5,
  },
  secondaryButton: {
    backgroundColor: "#222",
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 20,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 12,
    borderWidth: 1,
    borderColor: "#333",
  },
  secondaryButtonText: {
    fontSize: 18,
    fontFamily: "BebasNeue",
    color: "#fff",
    letterSpacing: 0.5,
  },
  buttonIcon: {
    marginRight: 4,
  },
});
