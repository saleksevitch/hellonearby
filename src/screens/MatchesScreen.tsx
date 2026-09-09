import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useApp } from '../utils/AppContext';
import { Match } from '../types';
import { APP_CONFIG } from '../utils/config';
import { RootStackParamList } from '../navigation/types';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function MatchesScreen() {
  const navigation = useNavigation<NavigationProp>();
  const { matches, blockUser } = useApp();

  const handleMatchPress = (match: Match) => {
    navigation.navigate('ProximityPing', { match });
  };

  const handleBlockUser = (userId: string, userName: string) => {
    Alert.alert(
      'Block User',
      `Are you sure you want to block ${userName}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Block',
          style: 'destructive',
          onPress: () => {
            blockUser(userId);
            Alert.alert('User Blocked', `${userName} has been blocked.`);
          },
        },
      ]
    );
  };

  const renderMatch = ({ item }: { item: Match }) => {
    const isNearby = (item.user.distance || 0) <= APP_CONFIG.proximityThreshold;
    const daysAgo = Math.floor(
      (Date.now() - new Date(item.matchedAt).getTime()) / (1000 * 60 * 60 * 24)
    );

    return (
      <TouchableOpacity
        style={styles.matchCard}
        onPress={() => handleMatchPress(item)}
      >
        <Image source={{ uri: item.user.photoUrl }} style={styles.matchPhoto} />
        <View style={styles.matchInfo}>
          <Text style={styles.matchName}>{item.user.name}</Text>
          <Text style={styles.matchDistance}>
            ~{Math.round(item.user.distance || 0)}m away
          </Text>
          {isNearby ? (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>📍 Nearby - Tap to ping!</Text>
            </View>
          ) : (
            <Text style={styles.matchStatus}>
              Match • {daysAgo === 0 ? 'Today' : `${daysAgo}d ago`}
            </Text>
          )}
        </View>
        <TouchableOpacity
          style={styles.optionsButton}
          onPress={() => handleBlockUser(item.userId, item.user.name)}
        >
          <Text style={styles.optionsIcon}>⋯</Text>
        </TouchableOpacity>
      </TouchableOpacity>
    );
  };

  if (matches.length === 0) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Matches</Text>
        </View>
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyEmoji}>💫</Text>
          <Text style={styles.emptyText}>No matches yet!</Text>
          <Text style={styles.emptySubtext}>
            Start swiping to find your matches
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Matches</Text>
        <Text style={styles.subtitle}>{matches.length} mutual matches</Text>
      </View>

      <FlatList
        data={matches}
        renderItem={renderMatch}
        keyExtractor={(item) => item.userId}
        contentContainerStyle={styles.listContent}
      />

      <View style={styles.infoBox}>
        <Text style={styles.infoText}>
          🎯 Get within {APP_CONFIG.proximityThresholdDisplay} of a match to
          unlock ping & photo for an IRL hello!
        </Text>
      </View>
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
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#888',
  },
  listContent: {
    padding: 20,
    paddingBottom: 100,
  },
  matchCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
    borderRadius: 16,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#333',
  },
  matchPhoto: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  matchInfo: {
    flex: 1,
    marginLeft: 12,
  },
  matchName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 2,
  },
  matchDistance: {
    fontSize: 13,
    color: '#6C63FF',
    fontWeight: '600',
    marginBottom: 4,
  },
  matchStatus: {
    fontSize: 13,
    color: '#888',
  },
  badge: {
    backgroundColor: '#6C63FF',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#fff',
  },
  optionsButton: {
    padding: 8,
  },
  optionsIcon: {
    fontSize: 24,
    color: '#666',
  },
  infoBox: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    padding: 16,
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#333',
  },
  infoText: {
    fontSize: 13,
    color: '#aaa',
    textAlign: 'center',
    lineHeight: 18,
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
  },
});
