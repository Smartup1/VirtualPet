import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";
import TopBar from "@components/TopBar";
import Pet from "@components/Pet";
import StatusBars from "@components/StatusBar";
import BottomActions from "@components/BottomActions";
import SideMenu from "@components/SideMenu";
import { colors } from "@styles/colors";
import { spacing, radius, shadow } from "@styles/theme";
import { usePet } from "@hooks/usePet";

export default function HomeScreen() {
  const { name, stats, progress, wallet, mood, handleAction } = usePet();
  const [menuOpen, setMenuOpen] = useState(false);

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
        />

        <View style={styles.center}>
          <Pet mood={mood} />
        </View>

        <View style={styles.statusCard}>
          <StatusBars
            hunger={stats.hunger}
            happiness={stats.happiness}
            sleep={stats.sleep}
            hygiene={stats.hygiene}
          />
        </View>

        <BottomActions onAction={handleAction} />
      </SafeAreaView>

      <SideMenu
        visible={menuOpen}
        onClose={() => setMenuOpen(false)}
        onNavigate={(route) => {
          setMenuOpen(false);
          // TODO: navegar com expo-router, ex: router.push(`/${route}`)
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
  statusCard: {
    marginHorizontal: spacing.md,
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    padding: spacing.md,
    ...shadow.card,
  },
});
