import React, { useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import { useApp } from '../utils/AppContext';
import { APP_CONFIG } from '../utils/config';
import { RootStackParamList } from '../navigation/types';

type GeomatchDetailRouteProp = RouteProp<RootStackParamList, 'GeomatchDetail'>;

export default function GeomatchDetailScreen() {
  const route = useRoute<GeomatchDetailRouteProp>();
  const navigation = useNavigation();
  const { geomatches, reportUser, blockUser } = useApp();
  const { geomatchUserId } = route.params;

  const geomatch = useMemo(() => {
    return geomatches.find((g) => g.userId === geomatchUserId);
  }, [geomatches, geomatchUserId]);

  if (!geomatch) {
    return (
      <View style={styles.container}>
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Geomatch not found</Text>
        </View>
      </View>
    );
  }

  const { user } = geomatch;
  const isInRange = (user.distance || 0) <= APP_CONFIG.proximityThreshold;
  const isEphemeral = geomatch.isEphemeral && !isInRange;

  const handleReport = () => {
    Alert.alert(
      'Report User',
      'Why are you reporting this user?',
      [
        {
          text: 'Inappropriate behavior',
          onPress: () => {
            reportUser(user.id, 'Inappropriate behavior');
            Alert.alert('Report Submitted', 'Thank you for your report.');
          },
        },
        {
          text: 'Spam',
          onPress: () => {
            reportUser(user.id, 'Spam');
            Alert.alert('Report Submitted', 'Thank you for your report.');
          },
        },
        {
          text: 'Other',
          onPress: () => {
            reportUser(user.id, 'Other');
            Alert.alert('Report Submitted', 'Thank you for your report.');
          },
        },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  const handleBlock = () => {
    Alert.alert(
      'Block User',
      `Are you sure you want to block ${user.name}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Block',
          style: 'destructive',
          onPress: () => {
            blockUser(user.id);
            Alert.alert('User Blocked', `${user.name} has been blocked.`);
            navigation.goBack();
          },
        },
      ]
    );
  };

  const getEthnicityLabel = (ethnicity?: string) => {
    if (!ethnicity) return 'Not specified';
    return ethnicity.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.backIcon}>←</Text>
      </TouchableOpacity>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {isEphemeral && (
          <View style={styles.vanishedBanner}>
            <Text style={styles.vanishedText}>
              👻 Out of range - This geomatch has vanished
            </Text>
          </View>
        )}

        <View style={styles.photoContainer}>
          <Image source={{ uri: user.photoUrl }} style={styles.photo} />
          {!isEphemeral && (
            <View style={styles.inRangeBadge}>
              <Text style={styles.inRangeBadgeText}>📍 In Range</Text>
            </View>
          )}
        </View>

        <View style={styles.content}>
          <Text style={styles.name}>{user.name}, {user.age}</Text>
          <Text style={styles.distance}>
            ~{Math.round(user.distance || 0)}m away
          </Text>

          <View style={styles.detailsGrid}>
            <View style={styles.detailBox}>
              <Text style={styles.detailLabel}>Height</Text>
              <Text style={styles.detailValue}>{user.height} cm</Text>
            </View>
            <View style={styles.detailBox}>
              <Text style={styles.detailLabel}>Gender</Text>
              <Text style={styles.detailValue}>
                {user.gender.charAt(0).toUpperCase() + user.gender.slice(1)}
              </Text>
            </View>
            {user.ethnicity && (
              <View style={styles.detailBox}>
                <Text style={styles.detailLabel}>Ethnicity</Text>
                <Text style={styles.detailValue}>
                  {getEthnicityLabel(user.ethnicity)}
                </Text>
              </View>
            )}
          </View>

          <View style={styles.bioSection}>
            <Text style={styles.bioLabel}>About</Text>
            <Text style={styles.bio}>{user.bio}</Text>
          </View>

          <View style={styles.infoBox}>
            <Text style={styles.infoText}>
              ✨ Caught on {new Date(geomatch.caughtAt).toLocaleDateString()}
            </Text>
            {isEphemeral && (
              <Text style={styles.infoSubtext}>
                Get back within {APP_CONFIG.proximityThresholdDisplay} to reconnect
              </Text>
            )}
          </View>

          <View style={styles.actionsRow}>
            <TouchableOpacity style={styles.reportButton} onPress={handleReport}>
              <Text style={styles.reportText}>🚩 Report</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.blockButton} onPress={handleBlock}>
              <Text style={styles.blockText}>🚫 Block</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
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
    backgroundColor: 'rgba(26, 26, 26, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  backIcon: {
    fontSize: 24,
    color: '#fff',
  },
  scrollContent: {
    paddingBottom: 40,
  },
  vanishedBanner: {
    backgroundColor: '#333',
    padding: 16,
    marginTop: 90,
    marginHorizontal: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#666',
  },
  vanishedText: {
    fontSize: 14,
    color: '#fff',
    textAlign: 'center',
    fontWeight: '600',
  },
  photoContainer: {
    marginTop: 20,
    alignItems: 'center',
    marginBottom: 20,
  },
  photo: {
    width: 280,
    height: 360,
    borderRadius: 20,
    borderWidth: 4,
    borderColor: '#6C63FF',
  },
  inRangeBadge: {
    position: 'absolute',
    bottom: 16,
    backgroundColor: '#6C63FF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  inRangeBadgeText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#fff',
  },
  content: {
    paddingHorizontal: 20,
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
    marginBottom: 20,
  },
  detailsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 24,
  },
  detailBox: {
    backgroundColor: '#1a1a1a',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#333',
    minWidth: 100,
  },
  detailLabel: {
    fontSize: 12,
    color: '#888',
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  bioSection: {
    marginBottom: 24,
  },
  bioLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#888',
    marginBottom: 8,
  },
  bio: {
    fontSize: 16,
    color: '#ccc',
    lineHeight: 24,
  },
  infoBox: {
    backgroundColor: '#1a1a1a',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#333',
    marginBottom: 24,
  },
  infoText: {
    fontSize: 14,
    color: '#fff',
    marginBottom: 4,
  },
  infoSubtext: {
    fontSize: 13,
    color: '#888',
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  reportButton: {
    flex: 1,
    backgroundColor: '#333',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  reportText: {
    fontSize: 14,
    color: '#fff',
    fontWeight: '600',
  },
  blockButton: {
    flex: 1,
    backgroundColor: '#ff4458',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  blockText: {
    fontSize: 14,
    color: '#fff',
    fontWeight: '600',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 18,
    color: '#888',
  },
});
