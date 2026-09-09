import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Animated,
  Alert,
  Platform,
} from 'react-native';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import { useApp } from '../utils/AppContext';
import { APP_CONFIG } from '../utils/config';
import { RootStackParamList } from '../navigation/types';

type ProximityPingRouteProp = RouteProp<RootStackParamList, 'ProximityPing'>;

export default function ProximityPingScreen() {
  const route = useRoute<ProximityPingRouteProp>();
  const navigation = useNavigation();
  const { reportUser } = useApp();
  const { match } = route.params;

  const [pulseAnim] = useState(new Animated.Value(1));
  const [isNearby, setIsNearby] = useState(false);

  // Mock proximity check - in real app, this would use actual GPS
  useEffect(() => {
    // Simulate proximity based on mock distance
    const mockIsNearby = (match.user.distance || 0) <= APP_CONFIG.proximityThreshold;
    setIsNearby(mockIsNearby);

    // Pulse animation when nearby
    if (mockIsNearby) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.2,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
        ])
      ).start();
    }
  }, [match.user.distance]);

  const handlePing = () => {
    if (isNearby) {
      Alert.alert(
        'Ping Sent! 📍',
        `${match.user.name} will receive your ping. Time to say hello IRL!`,
        [{ text: 'OK' }]
      );
    } else {
      Alert.alert(
        'Not Close Enough',
        `Get within ${APP_CONFIG.proximityThresholdDisplay} to send a ping!`
      );
    }
  };

  const handleReport = () => {
    Alert.alert(
      'Report User',
      'Why are you reporting this user?',
      [
        {
          text: 'Inappropriate behavior',
          onPress: () => {
            reportUser(match.userId, 'Inappropriate behavior');
            Alert.alert('Report Submitted', 'Thank you for your report.');
          },
        },
        {
          text: 'Spam',
          onPress: () => {
            reportUser(match.userId, 'Spam');
            Alert.alert('Report Submitted', 'Thank you for your report.');
          },
        },
        {
          text: 'Other',
          onPress: () => {
            reportUser(match.userId, 'Other');
            Alert.alert('Report Submitted', 'Thank you for your report.');
          },
        },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.backIcon}>←</Text>
      </TouchableOpacity>

      <View style={styles.content}>
        {isNearby ? (
          <>
            <Animated.View style={[styles.pulseContainer, { transform: [{ scale: pulseAnim }] }]}>
              <View style={styles.pulseOuter}>
                <View style={styles.pulseMiddle}>
                  <Image
                    source={{ uri: match.user.photoUrl }}
                    style={styles.photo}
                  />
                </View>
              </View>
            </Animated.View>

            <View style={styles.unlockBadge}>
              <Text style={styles.unlockBadgeText}>🔓 Photo Unlocked!</Text>
            </View>

            <Text style={styles.name}>{match.user.name}, {match.user.age}</Text>
            <Text style={styles.distance}>
              ~{Math.round(match.user.distance || 0)}m away
            </Text>
            <Text style={styles.bio}>{match.user.bio}</Text>

            <TouchableOpacity style={styles.pingButton} onPress={handlePing}>
              <Text style={styles.pingButtonText}>📍 Send Ping</Text>
            </TouchableOpacity>

            <Text style={styles.hint}>
              Tap to let {match.user.name} know you're ready to meet!
            </Text>
          </>
        ) : (
          <>
            <View style={styles.lockedContainer}>
              <View style={styles.lockedIcon}>
                <Text style={styles.lockedEmoji}>🔒</Text>
              </View>
              <Text style={styles.lockedName}>{match.user.name}</Text>
              <Text style={styles.lockedText}>
                Photo & ping locked
              </Text>
              <Text style={styles.lockedDistance}>
                Get within {APP_CONFIG.proximityThresholdDisplay} to unlock!
              </Text>
              <View style={styles.distanceIndicator}>
                <Text style={styles.currentDistance}>
                  Currently ~{Math.round(match.user.distance || 0)}m away
                </Text>
              </View>
            </View>

            <Text style={styles.hint}>
              Move closer to unlock their photo and send a ping 📍
            </Text>
          </>
        )}
      </View>

      <TouchableOpacity style={styles.reportButton} onPress={handleReport}>
        <Text style={styles.reportText}>🚩 Report</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a0a',
  },
  backButton: {
    position: 'absolute',
    top: 50,
    left: 20,
    zIndex: 10,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(26, 26, 26, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  backIcon: {
    fontSize: 24,
    color: '#fff',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  pulseContainer: {
    marginBottom: 30,
  },
  pulseOuter: {
    width: 240,
    height: 240,
    borderRadius: 120,
    backgroundColor: 'rgba(108, 99, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  pulseMiddle: {
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: 'rgba(108, 99, 255, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  photo: {
    width: 160,
    height: 160,
    borderRadius: 80,
    borderWidth: 4,
    borderColor: '#6C63FF',
  },
  unlockBadge: {
    backgroundColor: '#6C63FF',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    marginBottom: 20,
  },
  unlockBadgeText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#fff',
  },
  name: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  distance: {
    fontSize: 16,
    color: '#6C63FF',
    fontWeight: '600',
    marginBottom: 16,
  },
  bio: {
    fontSize: 16,
    color: '#ccc',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 30,
  },
  pingButton: {
    backgroundColor: '#6C63FF',
    paddingHorizontal: 40,
    paddingVertical: 16,
    borderRadius: 30,
    marginBottom: 12,
    ...Platform.select({
      ios: {
        shadowColor: '#6C63FF',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.5,
        shadowRadius: 8,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  pingButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  hint: {
    fontSize: 14,
    color: '#888',
    textAlign: 'center',
    marginTop: 8,
  },
  lockedContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  lockedIcon: {
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: '#1a1a1a',
    borderWidth: 4,
    borderColor: '#333',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
  },
  lockedEmoji: {
    fontSize: 64,
  },
  lockedName: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 12,
  },
  lockedText: {
    fontSize: 18,
    color: '#888',
    marginBottom: 8,
  },
  lockedDistance: {
    fontSize: 16,
    color: '#6C63FF',
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 20,
  },
  distanceIndicator: {
    backgroundColor: '#1a1a1a',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#333',
  },
  currentDistance: {
    fontSize: 14,
    color: '#aaa',
  },
  reportButton: {
    position: 'absolute',
    bottom: 40,
    alignSelf: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  reportText: {
    fontSize: 14,
    color: '#666',
  },
});
