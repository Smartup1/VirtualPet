import React, { useState } from "react";
import { StyleSheet, View, Text, Alert } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import TopBar from "@components/TopBar";
import Pet from "@components/Pet";
import StatusBars from "@components/StatusBar";
import BottomActions from "@components/BottomActions";
import SideMenu from "@components/SideMenu";
import FoodAnimation from "@components/FoodAnimation";
import { colors } from "@styles/colors";
import { spacing, radius, shadow } from "@styles/theme";
import { usePet } from "@hooks/usePet";
import { PetAction } from "@ptypes/index";

export default function HomeScreen() {
  const router = useRouter();
  const {
    name,
    stats,
    progress,
    wallet,
    mood,
    equippedAccessory,
    interactionCount,
    handleAction,
    petInteraction,
  } = usePet();
  const [menuOpen, setMenuOpen] = useState(false);
  const [foodVisible, setFoodVisible] = useState(false);

  function onAction(action: PetAction) {
    handleAction(action);
    if (action === "feed") {
      setFoodVisible(true);
    }
  }

  return (
    <LinearGradient
      colors={[colors.backgroundGradientStart, colors.backgroundGradientEnd]}
      style={styles.gradient}
    >
      <SafeAreaView style={styles.safeArea}>
        <TopBar
          petName={name}
          level={progress.level}
          xp={progress.xp}
          xpToNextLevel={progress.xpToNextLevel}
          coins={wallet.coins}
          gems={wallet.gems}
          onMenuPress={() => setMenuOpen(true)}
        />

        <View style={styles.center}>
          <View style={styles.interactionBadge}>
            <Text style={styles.interactionText}>❤️ {interactionCount} carinhos</Text>
          </View>

          <Pet mood={mood} equippedAccessory={equippedAccessory} onPetPress={petInteraction} />
        </View>

        <View style={styles.statusCard}>
          <StatusBars
            hunger={stats.hunger}
            happiness={stats.happiness}
            sleep={stats.sleep}
            hygiene={stats.hygiene}
          />
        </View>

        <BottomActions onAction={onAction} />
      </SafeAreaView>

      <FoodAnimation visible={foodVisible} onFinish={() => setFoodVisible(false)} />

      <SideMenu
        visible={menuOpen}
        onClose={() => setMenuOpen(false)}
        onNavigate={(route) => {
          setMenuOpen(false);
          if (route === "loja") {
            router.push("/loja");
          } else if (route === "missoes") {
            router.push("/missoes");
          } else if (route === "conquistas") {
            router.push("/conquistas");
          } else if (route === "minijogos") {
            Alert.alert("Em breve!", "Os minijogos ainda estão sendo preparados. 🎲");
          }
        }}
      />
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
    justifyContent: "space-between",
  },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  interactionBadge: {
    backgroundColor: colors.hunger,
    paddingHorizontal: spacing.md,
    paddingVertical: 6,
    borderRadius: radius.pill,
    marginBottom: spacing.sm,
    ...shadow.card,
  },
  interactionText: {
    color: colors.white,
    fontWeight: "700",
    fontSize: 13,
  },
  statusCard: {
    marginHorizontal: spacing.md,
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    padding: spacing.md,
    ...shadow.card,
  },
});
