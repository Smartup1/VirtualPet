import React, { useEffect } from 'react';
import { View, StyleSheet, SafeAreaView, Text, TouchableOpacity, ScrollView } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import Pet from '@components/Pet';
import { usePetStore } from '@store/petStore';

export default function HomeScreen() {
  const { 
    stats, 
    progress, 
    wallet, 
    mood, 
    equippedAccessory,
    interactionCount,
    feed, 
    play, 
    sleepAction, 
    bathe,
    petInteraction,
    applyOfflineDecay
  } = usePetStore();

  // Aplica decaimento offline ao abrir o app
  useEffect(() => {
    applyOfflineDecay();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="auto" />
      
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.levelText}>Nível {progress.level}</Text>
            <Text style={styles.xpText}>XP: {progress.xp}/{progress.xpToNextLevel}</Text>
          </View>
          <View style={styles.walletContainer}>
            <Text style={styles.coinsText}>🪙 {wallet.coins}</Text>
            <Text style={styles.gemsText}>💎 {wallet.gems}</Text>
          </View>
        </View>

        {/* Interação Count */}
        <View style={styles.interactionBadge}>
          <Text style={styles.interactionText}>❤️ {interactionCount} carinhos</Text>
        </View>

        {/* Pet */}
        <Pet
          mood={mood}
          equippedAccessory={equippedAccessory}
          onPetPress={petInteraction}
        />

        {/* Status Bars */}
        <View style={styles.statsContainer}>
          <View style={styles.statRow}>
            <Text style={styles.statLabel}>🍕 Fome</Text>
            <View style={styles.statBar}>
              <View style={[styles.statFill, { width: `${stats.hunger}%`, backgroundColor: '#FF6B6B' }]} />
            </View>
            <Text style={styles.statValue}>{Math.round(stats.hunger)}%</Text>
          </View>
          
          <View style={styles.statRow}>
            <Text style={styles.statLabel}>😊 Felicidade</Text>
            <View style={styles.statBar}>
              <View style={[styles.statFill, { width: `${stats.happiness}%`, backgroundColor: '#FFD93D' }]} />
            </View>
            <Text style={styles.statValue}>{Math.round(stats.happiness)}%</Text>
          </View>
          
          <View style={styles.statRow}>
            <Text style={styles.statLabel}>😴 Sono</Text>
            <View style={styles.statBar}>
              <View style={[styles.statFill, { width: `${stats.sleep}%`, backgroundColor: '#6BCB77' }]} />
            </View>
            <Text style={styles.statValue}>{Math.round(stats.sleep)}%</Text>
          </View>
          
          <View style={styles.statRow}>
            <Text style={styles.statLabel}>🧼 Higiene</Text>
            <View style={styles.statBar}>
              <View style={[styles.statFill, { width: `${stats.hygiene}%`, backgroundColor: '#4D96FF' }]} />
            </View>
            <Text style={styles.statValue}>{Math.round(stats.hygiene)}%</Text>
          </View>
        </View>

        {/* Ações */}
        <View style={styles.actionsContainer}>
          <TouchableOpacity style={[styles.actionButton, styles.actionFeed]} onPress={feed}>
            <Text style={styles.actionText}>🍕 Alimentar</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.actionButton, styles.actionPlay]} onPress={play}>
            <Text style={styles.actionText}>🎮 Brincar</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.actionButton, styles.actionSleep]} onPress={sleepAction}>
            <Text style={styles.actionText}>😴 Dormir</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.actionButton, styles.actionBath]} onPress={bathe}>
            <Text style={styles.actionText}>🚿 Banho</Text>
          </TouchableOpacity>
        </View>

        {/* Dica */}
        <Text style={styles.hint}>👆 Toque no pet para dar carinho e ganhar moedas!</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContent: {
    alignItems: 'center',
    paddingBottom: 30,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  levelText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  xpText: {
    fontSize: 12,
    color: '#666',
  },
  walletContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
  },
  coinsText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFD93D',
  },
  gemsText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4D96FF',
  },
  interactionBadge: {
    backgroundColor: '#FF6B6B',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
    marginTop: 5,
  },
  interactionText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  },
  statsContainer: {
    width: '90%',
    marginTop: 10,
    paddingHorizontal: 10,
  },
  statRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  statLabel: {
    width: 60,
    fontSize: 14,
    color: '#555',
  },
  statBar: {
    flex: 1,
    height: 10,
    backgroundColor: '#e0e0e0',
    borderRadius: 5,
    marginHorizontal: 10,
    overflow: 'hidden',
  },
  statFill: {
    height: '100%',
    borderRadius: 5,
  },
  statValue: {
    width: 40,
    fontSize: 12,
    color: '#555',
    textAlign: 'right',
  },
  actionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginTop: 15,
    gap: 10,
    paddingHorizontal: 10,
  },
  actionButton: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
    minWidth: 80,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  actionFeed: {
    backgroundColor: '#FF6B6B',
  },
  actionPlay: {
    backgroundColor: '#FFD93D',
  },
  actionSleep: {
    backgroundColor: '#6BCB77',
  },
  actionBath: {
    backgroundColor: '#4D96FF',
  },
  actionText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
    textAlign: 'center',
  },
  hint: {
    marginTop: 20,
    fontSize: 14,
    color: '#999',
    fontWeight: '500',
    textAlign: 'center',
  },
});