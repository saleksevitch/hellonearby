import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Animated,
  Dimensions,
  Alert,
  Platform,
} from 'react-native';
import { useApp } from '../utils/AppContext';
import { MOCK_NEARBY_USERS } from '../data/mockUsers';
import { User } from '../types';
import { APP_CONFIG } from '../utils/config';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const SWIPE_THRESHOLD = 120;

export default function SwipeScreen() {
  const { swipedUsers, handleSwipe } = useApp();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [swipeAnimation] = useState(new Animated.Value(0));

  const availableUsers = MOCK_NEARBY_USERS.filter(
    (user) => !swipedUsers.has(user.id)
  );

  const currentUser = availableUsers[currentIndex];

  const handleLike = () => {
    if (!currentUser) return;

    Animated.timing(swipeAnimation, {
      toValue: SCREEN_WIDTH,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      handleSwipe(currentUser.id, 'like', currentUser);
      swipeAnimation.setValue(0);
      setCurrentIndex((prev) => prev + 1);
    });
  };

  const handlePass = () => {
    if (!currentUser) return;

    Animated.timing(swipeAnimation, {
      toValue: -SCREEN_WIDTH,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      handleSwipe(currentUser.id, 'pass', currentUser);
      swipeAnimation.setValue(0);
      setCurrentIndex((prev) => prev + 1);
    });
  };

  if (!currentUser) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Nearby</Text>
        </View>
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyEmoji}>🎉</Text>
          <Text style={styles.emptyText}>No more people nearby right now!</Text>
          <Text style={styles.emptySubtext}>
            Check back later for more matches
          </Text>
        </View>
      </View>
    );
  }

  const cardStyle = {
    transform: [
      { translateX: swipeAnimation },
      {
        rotate: swipeAnimation.interpolate({
          inputRange: [-SCREEN_WIDTH, 0, SCREEN_WIDTH],
          outputRange: ['-30deg', '0deg', '30deg'],
        }),
      },
    ],
    opacity: swipeAnimation.interpolate({
      inputRange: [-SCREEN_WIDTH, 0, SCREEN_WIDTH],
      outputRange: [0, 1, 0],
    }),
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Nearby</Text>
        <Text style={styles.subtitle}>
          {availableUsers.length} people around you
        </Text>
      </View>

      <View style={styles.cardContainer}>
        <Animated.View style={[styles.card, cardStyle]}>
          <Image source={{ uri: currentUser.photoUrl }} style={styles.photo} />
          <View style={styles.infoOverlay}>
            <View style={styles.userInfo}>
              <Text style={styles.name}>
                {currentUser.name}, {currentUser.age}
              </Text>
              <Text style={styles.distance}>
                ~{Math.round(currentUser.distance || 0)}m away
              </Text>
            </View>
            <Text style={styles.bio}>{currentUser.bio}</Text>
          </View>
        </Animated.View>

        {availableUsers[currentIndex + 1] && (
          <View style={[styles.card, styles.nextCard]}>
            <Image
              source={{ uri: availableUsers[currentIndex + 1].photoUrl }}
              style={styles.photo}
            />
          </View>
        )}
      </View>

      <View style={styles.actionsContainer}>
        <TouchableOpacity style={styles.passButton} onPress={handlePass}>
          <Text style={styles.buttonIcon}>✕</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.likeButton} onPress={handleLike}>
          <Text style={styles.buttonIcon}>♥</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.infoBox}>
        <Text style={styles.infoText}>
          💡 Mutual likes unlock photo & ping when you're within{' '}
          {APP_CONFIG.proximityThresholdDisplay}
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
  cardContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  card: {
    width: SCREEN_WIDTH - 40,
    height: '75%',
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: '#1a1a1a',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  nextCard: {
    position: 'absolute',
    opacity: 0.5,
    transform: [{ scale: 0.95 }],
  },
  photo: {
    width: '100%',
    height: '100%',
  },
  infoOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  userInfo: {
    marginBottom: 8,
  },
  name: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  distance: {
    fontSize: 14,
    color: '#6C63FF',
    fontWeight: '600',
  },
  bio: {
    fontSize: 16,
    color: '#ccc',
    lineHeight: 22,
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 40,
    paddingVertical: 20,
  },
  passButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#333',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#ff4458',
  },
  likeButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#6C63FF',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#8b84ff',
  },
  buttonIcon: {
    fontSize: 32,
    color: '#fff',
    fontWeight: 'bold',
  },
  infoBox: {
    marginHorizontal: 20,
    marginBottom: 20,
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
