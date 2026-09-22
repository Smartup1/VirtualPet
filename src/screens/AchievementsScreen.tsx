import React from "react";
import { View, Text, StyleSheet, ScrollView, Pressable } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import Currency from "@components/Currency";
import { colors } from "@styles/colors";
import { radius, spacing, shadow } from "@styles/theme";
import { usePetStore } from "@store/petStore";
import { ACHIEVEMENTS } from "@constants/achievements";

export default function AchievementsScreen() {
  const router = useRouter();
  const wallet = usePetStore((s) => s.wallet);
  const claimedAchievements = usePetStore((s) => s.claimedAchievements);
  const claimAchievement = usePetStore((s) => s.claimAchievement);
  // Lê o estado inteiro para poder recalcular o progresso de cada conquista.
  const state = usePetStore();

  function rewardLabel(reward: { coins?: number; gems?: number }) {
    const parts: string[] = [];
    if (reward.coins) parts.push(`🪙 ${reward.coins}`);
    if (reward.gems) parts.push(`💎 ${reward.gems}`);
    return parts.join("   ");
  }

  return (
    <LinearGradient
      colors={[colors.backgroundGradientStart, colors.backgroundGradientEnd]}
      style={styles.gradient}
    >
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} style={styles.backButton}>
            <Text style={styles.backLabel}>← Voltar</Text>
          </Pressable>
          <Currency coins={wallet.coins} gems={wallet.gems} />
        </View>

        <Text style={styles.title}>Conquistas</Text>
        <Text style={styles.subtitle}>
          {claimedAchievements.length}/{ACHIEVEMENTS.length} desbloqueadas
        </Text>

        <ScrollView contentContainerStyle={styles.list}>
          {ACHIEVEMENTS.map((achievement) => {
            const progress = Math.min(achievement.getProgress(state), achievement.target);
            const claimed = claimedAchievements.includes(achievement.id);
            const ready = progress >= achievement.target && !claimed;
            const percent = (progress / achievement.target) * 100;

            return (
              <View
                key={achievement.id}
                style={[styles.card, claimed && styles.cardClaimed]}
              >
                <View style={[styles.iconBadge, claimed && styles.iconBadgeClaimed]}>
                  <Text style={styles.icon}>{claimed ? "🏆" : achievement.icon}</Text>
                </View>

                <View style={styles.cardBody}>
                  <Text style={styles.cardTitle}>{achievement.title}</Text>
                  <Text style={styles.cardDescription}>{achievement.description}</Text>

                  <View style={styles.track}>
                    <View
                      style={[
                        styles.trackFill,
                        {
                          width: `${percent}%`,
                          backgroundColor: claimed ? colors.happiness : colors.secondary,
                        },
                      ]}
                    />
                  </View>
                  <View style={styles.progressRow}>
                    <Text style={styles.progressText}>
                      {progress}/{achievement.target}
                    </Text>
                    <Text style={styles.rewardText}>{rewardLabel(achievement.reward)}</Text>
                  </View>
                </View>

                <Pressable
                  disabled={!ready}
                  onPress={() => claimAchievement(achievement.id)}
                  style={({ pressed }) => [
                    styles.claimButton,
                    claimed && styles.claimButtonDone,
                    !ready && !claimed && styles.claimButtonDisabled,
                    pressed && ready && styles.claimButtonPressed,
                  ]}
                >
                  <Text
                    style={[
                      styles.claimLabel,
                      (claimed || !ready) && styles.claimLabelMuted,
                    ]}
                  >
                    {claimed ? "✓" : ready ? "Resgatar" : "..."}
                  </Text>
                </Pressable>
              </View>
            );
          })}
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: { flex: 1 },
  safeArea: { flex: 1 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: spacing.md,
    paddingTop: spacing.sm,
  },
  backButton: { paddingVertical: spacing.xs },
  backLabel: { fontWeight: "700", color: colors.textDark },
  title: {
    fontSize: 26,
    fontWeight: "800",
    color: colors.primaryDark,
    textAlign: "center",
    marginTop: spacing.sm,
    letterSpacing: 0.4,
  },
  subtitle: {
    fontSize: 12,
    fontWeight: "600",
    color: colors.textLight,
    textAlign: "center",
    marginTop: 2,
    marginBottom: spacing.md,
  },
  list: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.lg,
    gap: spacing.sm,
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    padding: spacing.sm,
    gap: spacing.sm,
    ...shadow.card,
  },
  cardClaimed: {
    backgroundColor: `${colors.happiness}1A`,
  },
  iconBadge: {
    width: 46,
    height: 46,
    borderRadius: radius.md,
    backgroundColor: `${colors.secondary}1F`,
    alignItems: "center",
    justifyContent: "center",
  },
  iconBadgeClaimed: {
    backgroundColor: `${colors.happiness}33`,
  },
  icon: { fontSize: 22 },
  cardBody: { flex: 1 },
  cardTitle: { fontSize: 14, fontWeight: "700", color: colors.textDark },
  cardDescription: { fontSize: 11, color: colors.textLight, marginBottom: 6 },
  track: {
    height: 8,
    backgroundColor: colors.barBackground,
    borderRadius: radius.pill,
    overflow: "hidden",
  },
  trackFill: { height: "100%", borderRadius: radius.pill },
  progressRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 3,
  },
  progressText: { fontSize: 10, fontWeight: "700", color: colors.textDark },
  rewardText: { fontSize: 10, fontWeight: "600", color: colors.textLight },
  claimButton: {
    minWidth: 64,
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: radius.pill,
    backgroundColor: colors.secondary,
    alignItems: "center",
    justifyContent: "center",
  },
  claimButtonDone: { backgroundColor: `${colors.happiness}33` },
  claimButtonDisabled: { backgroundColor: colors.barBackground },
  claimButtonPressed: { opacity: 0.8 },
  claimLabel: { fontSize: 12, fontWeight: "800", color: colors.white },
  claimLabelMuted: { color: colors.textLight },
});
