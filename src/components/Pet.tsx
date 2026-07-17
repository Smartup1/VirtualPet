import React, { useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import Animated from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";
import { useIdleAnimation } from "@animations/idle";
import { useBlinkAnimation } from "@animations/blink";
import { useEatAnimation } from "@animations/eat";
import { useSleepAnimation } from "@animations/sleep";
import { colors } from "@styles/colors";
import { radius, shadow } from "@styles/theme";
import { PetMood } from "@ptypes/index";

interface PetProps {
  mood: PetMood;
}

// Placeholder visual: substitua por uma imagem/Lottie da capivara em
// src/assets/images quando tiver a arte final.
export default function Pet({ mood }: PetProps) {
  const idleStyle = useIdleAnimation();
  const blinkStyle = useBlinkAnimation();
  const { animatedStyle: eatStyle, play: playEat } = useEatAnimation();
  const { bodyStyle: sleepBodyStyle, zStyle } = useSleepAnimation(mood === "sleeping");

  useEffect(() => {
    if (mood === "eating") {
      playEat();
    }
  }, [mood]);

  return (
    <View style={styles.wrapper}>
      {mood === "sleeping" && (
        <Animated.Text style={[styles.zzz, zStyle]}>💤</Animated.Text>
      )}
      <Animated.View style={[styles.shadowEllipse]} />
      <Animated.View style={[idleStyle, eatStyle, sleepBodyStyle]}>
        <LinearGradient
          colors={[colors.primary, colors.primaryDark]}
          style={styles.body}
        >
          <Animated.View style={[styles.eyesRow, blinkStyle]}>
            <View style={styles.eye} />
            <View style={styles.eye} />
          </Animated.View>
          <View style={styles.nose} />
        </LinearGradient>
      </Animated.View>
      <Text style={styles.moodLabel}>{moodEmoji(mood)}</Text>
    </View>
  );
}

function moodEmoji(mood: PetMood) {
  switch (mood) {
    case "happy":
      return "😊";
    case "sad":
      return "😢";
    case "sleeping":
      return "😴";
    case "eating":
      return "😋";
    default:
      return "🙂";
  }
}

const styles = StyleSheet.create({
  wrapper: {
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 24,
  },
  shadowEllipse: {
    position: "absolute",
    bottom: -10,
    width: 140,
    height: 24,
    borderRadius: radius.pill,
    backgroundColor: "rgba(0,0,0,0.12)",
  },
  body: {
    width: 180,
    height: 180,
    borderRadius: radius.lg + 20,
    alignItems: "center",
    justifyContent: "center",
    ...shadow.card,
  },
  eyesRow: {
    flexDirection: "row",
    gap: 24,
    marginBottom: 12,
  },
  eye: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: colors.textDark,
  },
  nose: {
    width: 18,
    height: 12,
    borderRadius: 8,
    backgroundColor: colors.textDark,
    opacity: 0.7,
  },
  zzz: {
    position: "absolute",
    top: -10,
    right: 30,
    fontSize: 24,
  },
  moodLabel: {
    position: "absolute",
    top: -6,
    fontSize: 22,
  },
});
