import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useApp, doFiltersMatch } from '../utils/AppContext';
import { MOCK_NEARBY_USERS } from '../data/mockUsers';
import { User } from '../types';
import { APP_CONFIG } from '../utils/config';
import { RootStackParamList } from '../navigation/types';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function RadarScreen() {
  const navigation = useNavigation<NavigationProp>();
  const { profile, quota, catchGeomatch, geomatches } = useApp();

  // Filter users based on:
  // 1. Discoverable
  // 2. Two-way filter match
  // 3. In range
  // 4. Not already caught
  const availableUsers = useMemo(() => {
    const caughtIds = new Set(geomatches.map((g) => g.userId));
    
    return MOCK_NEARBY_USERS.filter((user) => {
      if (caughtIds.has(user.id)) return false;
      if (!user.isDiscoverable) return false;
      if ((user.distance || 0) > APP_CONFIG.proximityThreshold) return false;
      if (!doFiltersMatch(profile, user)) return false;
      return true;
    });
  }, [profile, geomatches]);

  const handleCatchAttempt = (user: User) => {
    if (quota.used >= quota.total) {
      Alert.alert(
        'No Geomatches Left',
        `You've used all ${quota.total} geomatch${quota.total > 1 ? 'es' : ''} this week. Resets in ${getDaysUntilReset()} days.`,
        [{ text: 'OK' }]
      );
      return;
    }

    Alert.alert(
      'Catch This Person?',
      `Use 1 of your ${quota.total - quota.used} remaining geomatch${quota.total - quota.used > 1 ? 'es' : ''} this week?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Catch',
          onPress: () => {
            const success = catchGeomatch(user);
            if (success) {
              navigation.navigate('GeomatchDetail', { geomatchUserId: user.id });
            }
          },
        },
      ]
    );
  };

  const getDaysUntilReset = () => {
    const now = new Date();
    const reset = new Date(quota.resetTime);
    const diff = reset.getTime() - now.getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  };

  const renderNearbyUser = ({ item }: { item: User }) => (
    <TouchableOpacity
      style={styles.encounterCard}
      onPress={() => handleCatchAttempt(item)}
    >
      <View style={styles.mysteryCircle}>
        <Text style={styles.mysteryIcon}>?</Text>
      </View>
      <View style={styles.encounterInfo}>
        <Text style={styles.encounterTitle}>Mystery Person Nearby</Text>
        <Text style={styles.encounterDistance}>
          ~{Math.round(item.distance || 0)}m away
        </Text>
        <Text style={styles.encounterHint}>
          Tap to catch • Uses 1 geomatch
        </Text>
      </View>
      <View style={styles.catchButton}>
        <Text style={styles.catchIcon}>→</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Radar</Text>
        <View style={styles.quotaBadge}>
          <Text style={styles.quotaText}>
            {quota.total - quota.used}/{quota.total} this week
          </Text>
        </View>
      </View>

      {availableUsers.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyEmoji}>📡</Text>
          <Text style={styles.emptyText}>No one in range right now</Text>
          <Text style={styles.emptySubtext}>
            People within {APP_CONFIG.proximityThresholdDisplay} who match your filters will appear here
          </Text>
          {!profile.isDiscoverable && (
            <View style={styles.warningBox}>
              <Text style={styles.warningText}>
                ⚠️ You're not discoverable. Turn on discoverable in your profile to appear on others' radar.
              </Text>
            </View>
          )}
        </View>
      ) : (
        <>
          <View style={styles.infoBox}>
            <Text style={styles.infoText}>
              🎯 {availableUsers.length} {availableUsers.length === 1 ? 'person' : 'people'} in range
            </Text>
            <Text style={styles.infoSubtext}>
              Catch them now or they'll vanish when out of range
            </Text>
          </View>

          <FlatList
            data={availableUsers}
            renderItem={renderNearbyUser}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContent}
          />
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a0a',
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
  },
  quotaBadge: {
    backgroundColor: '#6C63FF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  quotaText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
  },
  infoBox: {
    marginHorizontal: 20,
    marginBottom: 16,
    padding: 16,
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#6C63FF',
  },
  infoText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 4,
  },
  infoSubtext: {
    fontSize: 13,
    color: '#aaa',
  },
  listContent: {
    padding: 20,
    paddingTop: 0,
  },
  encounterCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#333',
  },
  mysteryCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#6C63FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  mysteryIcon: {
    fontSize: 32,
    color: '#fff',
    fontWeight: 'bold',
  },
  encounterInfo: {
    flex: 1,
  },
  encounterTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  encounterDistance: {
    fontSize: 13,
    color: '#6C63FF',
    fontWeight: '600',
    marginBottom: 4,
  },
  encounterHint: {
    fontSize: 12,
    color: '#888',
  },
  catchButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#333',
    justifyContent: 'center',
    alignItems: 'center',
  },
  catchIcon: {
    fontSize: 20,
    color: '#6C63FF',
    fontWeight: 'bold',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyEmoji: {
    fontSize: 80,
    marginBottom: 20,
  },
  emptyText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 16,
    color: '#888',
    textAlign: 'center',
    lineHeight: 22,
  },
  warningBox: {
    marginTop: 20,
    padding: 16,
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#ff9500',
  },
  warningText: {
    fontSize: 14,
    color: '#ff9500',
    textAlign: 'center',
    lineHeight: 20,
  },
});
