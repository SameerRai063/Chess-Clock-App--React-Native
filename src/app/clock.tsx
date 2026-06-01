import TimePresetsBottomSheet from "@/components/TimePresetsBottomSheet";
import { useAppStore } from "@/store/appStore";
import { playMoveSound } from "@/utils/audioUtils";
import { formatTime } from "@/utils/timeUtils";
import { MaterialIcons } from "@expo/vector-icons";
import { useEffect, useRef, useState } from "react";
import {
  Animated,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type Side = "top" | "bottom" | null;

export default function ClockScreen() {
  const minutes = useAppStore((s) => s.minutes);
  const incrementSeconds = useAppStore((s) => s.incrementSeconds);

  const [activeSide, setActiveSide] = useState<Side>(null);
  const [running, setRunning] = useState(false);
  const [topTime, setTopTime] = useState(minutes * 60);
  const [bottomTime, setBottomTime] = useState(minutes * 60);
  const [movesTop, setMovesTop] = useState(0);
  const [movesBottom, setMovesBottom] = useState(0);
  const [muted, setMuted] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const topTimeOpacity = useRef(new Animated.Value(1)).current;
  const bottomTimeOpacity = useRef(new Animated.Value(1)).current;

  // When minutes change (preset applied), reset the game to the new time.
  useEffect(() => {
    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    setRunning(false);
    setActiveSide(null);
    setTopTime(minutes * 60);
    setBottomTime(minutes * 60);
    setMovesTop(0);
    setMovesBottom(0);
  }, [minutes]);

  // Pulse animation for low time
  useEffect(() => {
    if (topTime < 10 && topTime > 0 && activeSide === "top" && running) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(topTimeOpacity, {
            toValue: 0.3,
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.timing(topTimeOpacity, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
          }),
        ]),
      ).start();
    }
  }, [topTime, activeSide, running]);

  useEffect(() => {
    if (
      bottomTime < 10 &&
      bottomTime > 0 &&
      activeSide === "bottom" &&
      running
    ) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(bottomTimeOpacity, {
            toValue: 0.3,
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.timing(bottomTimeOpacity, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
          }),
        ]),
      ).start();
    }
  }, [bottomTime, activeSide, running]);

  const startInterval = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    intervalRef.current = setInterval(() => {
      setActiveSide((current) => {
        if (current === "top") {
          setTopTime((t) => {
            const newTime = t - 1;
            if (newTime <= 0) {
              endGame("bottom");
              return 0;
            }
            return newTime;
          });
        } else if (current === "bottom") {
          setBottomTime((t) => {
            const newTime = t - 1;
            if (newTime <= 0) {
              endGame("top");
              return 0;
            }
            return newTime;
          });
        }
        return current;
      });
    }, 1000);
  };

  const endGame = (winner: Side) => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setRunning(false);
  };

  useEffect(() => {
    if (running && intervalRef.current === null) {
      startInterval();
    } else if (!running && intervalRef.current !== null) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    return () => {
      if (intervalRef.current !== null) {
        clearInterval(intervalRef.current);
      }
    };
  }, [running]);

  const tapClock = (side: Side) => {
    if (topTime <= 0 || bottomTime <= 0) return;

    if (!running) {
      setRunning(true);
      setActiveSide(side === "top" ? "bottom" : "top");
      return;
    }

    if (activeSide !== side) return;
    playMoveSound(muted);

    if (side === "top") {
      setMovesTop((m) => m + 1);
      setTopTime((t) => t + incrementSeconds);
    } else {
      setMovesBottom((m) => m + 1);
      setBottomTime((t) => t + incrementSeconds);
    }

    setActiveSide(side === "top" ? "bottom" : "top");
  };

  const reset = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    const currentMinutes = useAppStore.getState().minutes;

    setRunning(false);
    setActiveSide(null);
    setTopTime(currentMinutes * 60);
    setBottomTime(currentMinutes * 60);
    setMovesTop(0);
    setMovesBottom(0);
  };

  const togglePause = () => {
    if (!running && activeSide === null) return;
    setRunning(!running);
  };

  const getTopBackgroundColor = () => {
    if (topTime <= 0) return "#3D1111";
    if (activeSide === "top" && running) return "#1A1A1A";
    if (!running && activeSide === null) return "#222";
    if (!running && activeSide !== null) return "#2A2A2A";
    return "#222";
  };

  const getBottomBackgroundColor = () => {
    if (bottomTime <= 0) return "#3D1111";
    if (activeSide === "bottom" && running) return "#1A1A1A";
    if (!running && activeSide === null) return "#222";
    if (!running && activeSide !== null) return "#2A2A2A";
    return "#222";
  };

  const getTimeColor = (time: number) => {
    if (time < 10 && time > 0) return "#E85D4A";
    return "#fff";
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Top Half */}
      <TouchableOpacity
        style={[
          styles.half,
          styles.topHalf,
          { backgroundColor: getTopBackgroundColor() },
        ]}
        onPress={() => tapClock("top")}
        activeOpacity={0.7}
      >
        <View style={styles.transform180}>
          <Text style={styles.movesLabel}>Moves: {movesTop}</Text>
          <Animated.Text
            style={[
              styles.timeDisplay,
              { color: getTimeColor(topTime), opacity: topTimeOpacity },
            ]}
          >
            {formatTime(topTime)}
          </Animated.Text>
        </View>
      </TouchableOpacity>

      {/* Middle Control Bar */}
      <View style={styles.presetInfoBar}>
        <Text style={styles.presetInfoText}>
          Preset: {minutes} min
          {incrementSeconds ? ` + ${incrementSeconds}s` : ""}
        </Text>
      </View>
      <View style={styles.controlBar}>
        <TouchableOpacity style={styles.controlButton} onPress={reset}>
          <MaterialIcons name="refresh" size={24} color="#E8C96D" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.playButton} onPress={togglePause}>
          <MaterialIcons
            name={running ? "pause" : "play-arrow"}
            size={24}
            color="#111"
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.controlButton}
          onPress={() => setShowSettings(true)}
        >
          <MaterialIcons name="settings" size={24} color="#E8C96D" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.controlButton}
          onPress={() => setMuted(!muted)}
        >
          <MaterialIcons
            name={muted ? "volume-off" : "volume-up"}
            size={24}
            color={muted ? "#888" : "#E8C96D"}
          />
        </TouchableOpacity>
      </View>

      {/* Bottom Half */}
      <TouchableOpacity
        style={[
          styles.half,
          styles.bottomHalf,
          { backgroundColor: getBottomBackgroundColor() },
        ]}
        onPress={() => tapClock("bottom")}
        activeOpacity={0.7}
      >
        <Text style={styles.movesLabel}>Moves: {movesBottom}</Text>
        <Animated.Text
          style={[
            styles.timeDisplay,
            { color: getTimeColor(bottomTime), opacity: bottomTimeOpacity },
          ]}
        >
          {formatTime(bottomTime)}
        </Animated.Text>
      </TouchableOpacity>

      {/* Settings Bottom Sheet Modal */}
      <TimePresetsBottomSheet
        visible={showSettings}
        onClose={() => setShowSettings(false)}
        onApply={() => {
          reset();
          setShowSettings(false);
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1A1A1A",
  },
  half: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  topHalf: {
    transform: [{ rotate: "180deg" }],
  },
  bottomHalf: {},
  transform180: {
    transform: [{ rotate: "180deg" }],
    justifyContent: "center",
    alignItems: "center",
  },
  movesLabel: {
    fontSize: 14,
    color: "#888",
    marginBottom: 8,
  },
  timeDisplay: {
    fontSize: 90,
    fontFamily: "BebasNeue",
    color: "#fff",
    letterSpacing: 2,
  },
  controlBar: {
    backgroundColor: "#111",
    height: 60,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingHorizontal: 16,
    gap: 12,
  },
  presetInfoBar: {
    backgroundColor: "#111",
    paddingVertical: 8,
    alignItems: "center",
  },
  presetInfoText: {
    color: "#ccc",
    fontSize: 12,
  },
  controlButton: {
    width: 44,
    height: 44,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 22,
  },
  playButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#E8C96D",
    justifyContent: "center",
    alignItems: "center",
  },
});
