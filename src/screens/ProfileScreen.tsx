import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Image,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { useApp } from '../utils/AppContext';
import { APP_CONFIG } from '../utils/config';

export default function ProfileScreen() {
  const { profile, updateProfile } = useApp();
  const [isEditing, setIsEditing] = useState(false);
  const [tempProfile, setTempProfile] = useState(profile);

  const handleSave = () => {
    updateProfile(tempProfile);
    setIsEditing(false);
    Alert.alert('Profile Updated', 'Your profile has been saved!');
  };

  const handleCancel = () => {
    setTempProfile(profile);
    setIsEditing(false);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.appName}>{APP_CONFIG.appName}</Text>
          <Text style={styles.subtitle}>Your Profile</Text>
        </View>

        <View style={styles.photoContainer}>
          <Image source={{ uri: profile.photoUrl }} style={styles.photo} />
          {isEditing && (
            <Text style={styles.photoHint}>
              Placeholder photo - real photo upload in future version
            </Text>
          )}
        </View>

        <View style={styles.infoContainer}>
          {isEditing ? (
            <>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Name</Text>
                <TextInput
                  style={styles.input}
                  value={tempProfile.name}
                  onChangeText={(text) =>
                    setTempProfile({ ...tempProfile, name: text })
                  }
                  placeholder="Your name"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Age</Text>
                <TextInput
                  style={styles.input}
                  value={String(tempProfile.age)}
                  onChangeText={(text) =>
                    setTempProfile({ ...tempProfile, age: parseInt(text) || 18 })
                  }
                  keyboardType="numeric"
                  placeholder="Your age"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Bio</Text>
                <TextInput
                  style={[styles.input, styles.bioInput]}
                  value={tempProfile.bio}
                  onChangeText={(text) =>
                    setTempProfile({ ...tempProfile, bio: text })
                  }
                  placeholder="Tell us about yourself..."
                  multiline
                  numberOfLines={4}
                />
              </View>

              <View style={styles.buttonRow}>
                <TouchableOpacity
                  style={[styles.button, styles.cancelButton]}
                  onPress={handleCancel}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={handleSave}>
                  <Text style={styles.buttonText}>Save</Text>
                </TouchableOpacity>
              </View>
            </>
          ) : (
            <>
              <Text style={styles.name}>{profile.name}, {profile.age}</Text>
              <Text style={styles.bio}>{profile.bio}</Text>

              <TouchableOpacity
                style={styles.button}
                onPress={() => setIsEditing(true)}
              >
                <Text style={styles.buttonText}>Edit Profile</Text>
              </TouchableOpacity>
            </>
          )}
        </View>

        <View style={styles.infoBox}>
          <Text style={styles.infoTitle}>How {APP_CONFIG.appName} works</Text>
          <Text style={styles.infoText}>
            1. Swipe on people nearby{'\n'}
            2. Match when you both like each other{'\n'}
            3. Get within {APP_CONFIG.proximityThresholdDisplay} to unlock their photo & ping{'\n'}
            4. Say hello IRL! 👋
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a0a',
  },
  scrollContent: {
    paddingBottom: 40,
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
    backgroundColor: '#1a1a1a',
  },
  appName: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#888',
  },
  photoContainer: {
    alignItems: 'center',
    marginVertical: 30,
  },
  photo: {
    width: 160,
    height: 160,
    borderRadius: 80,
    borderWidth: 4,
    borderColor: '#6C63FF',
  },
  photoHint: {
    marginTop: 12,
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  infoContainer: {
    paddingHorizontal: 20,
  },
  name: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 12,
  },
  bio: {
    fontSize: 16,
    color: '#ccc',
    lineHeight: 24,
    marginBottom: 24,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#888',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#fff',
    borderWidth: 1,
    borderColor: '#333',
  },
  bioInput: {
    height: 100,
    textAlignVertical: 'top',
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  button: {
    flex: 1,
    backgroundColor: '#6C63FF',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 12,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  cancelButton: {
    backgroundColor: '#333',
  },
  cancelButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  infoBox: {
    marginHorizontal: 20,
    marginTop: 30,
    padding: 20,
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#333',
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 12,
  },
  infoText: {
    fontSize: 14,
    color: '#aaa',
    lineHeight: 22,
  },
});
