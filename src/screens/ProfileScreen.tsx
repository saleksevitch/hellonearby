import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Image,
  TouchableOpacity,
  ScrollView,
  Switch,
  Alert,
} from 'react-native';
import { useApp } from '../utils/AppContext';
import { APP_CONFIG } from '../utils/config';
import { Gender, Ethnicity } from '../types';

const GENDER_OPTIONS: Gender[] = ['man', 'woman', 'non-binary', 'other'];
const ETHNICITY_OPTIONS: Ethnicity[] = [
  'asian',
  'black',
  'hispanic',
  'white',
  'middle-eastern',
  'mixed',
  'other',
  'prefer-not-to-say',
];

export default function ProfileScreen() {
  const { profile, updateProfile, quota, resetQuota, applicationData, setApplicationStatus, simulateLastActive } = useApp();
  const [isEditing, setIsEditing] = useState(false);
  const [tempProfile, setTempProfile] = useState(profile);

  const handleSave = () => {
    updateProfile(tempProfile);
    setIsEditing(false);
    Alert.alert('Profile Updated', 'Your profile and filters have been saved!');
  };

  const handleCancel = () => {
    setTempProfile(profile);
    setIsEditing(false);
  };

  const toggleGenderPreference = (gender: Gender) => {
    // v1: heterosexual only - fixed based on user gender
    // Man seeks Woman, Woman seeks Man
    Alert.alert(
      'Gender Preference',
      'HelloNearby v1 supports heterosexual couples. Your gender preference is set based on your gender.',
      [{ text: 'OK' }]
    );
  };

  const toggleEthnicityPreference = (ethnicity: Ethnicity) => {
    const current = tempProfile.preferences.ethnicities || [];
    const updated = current.includes(ethnicity)
      ? current.filter((e) => e !== ethnicity)
      : [...current, ethnicity];
    
    setTempProfile({
      ...tempProfile,
      preferences: {
        ...tempProfile.preferences,
        ethnicities: updated.length > 0 ? updated : undefined,
      },
    });
  };

  const formatGender = (gender: Gender) => {
    return gender.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join('-');
  };

  const formatEthnicity = (ethnicity: Ethnicity) => {
    return ethnicity.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.appName}>{APP_CONFIG.appName}</Text>
          <Text style={styles.subtitle}>Your Profile</Text>
        </View>

        {/* Quota Display */}
        <View style={styles.quotaSection}>
          <View style={styles.quotaRow}>
            <Text style={styles.quotaLabel}>Geomatches this week</Text>
            <Text style={styles.quotaValue}>
              {quota.total - quota.used}/{quota.total}
            </Text>
          </View>
          <View style={styles.statusRow}>
            <Text style={styles.statusLabel}>Membership</Text>
            <View style={styles.statusBadge}>
              <Text style={styles.statusText}>
                💎 Paid (5/week)
              </Text>
            </View>
          </View>
          
          {/* Demo Controls */}
          <View style={styles.demoSection}>
            <Text style={styles.demoLabel}>🛠️ Demo Controls</Text>
            <TouchableOpacity style={styles.demoButton} onPress={resetQuota}>
              <Text style={styles.demoButtonText}>Reset Weekly Quota</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.demoButton} 
              onPress={() => {
                Alert.alert(
                  'Simulate Inactivity',
                  'Set last active date:',
                  [
                    { text: 'Today', onPress: () => simulateLastActive(0) },
                    { text: '10 days ago', onPress: () => simulateLastActive(10) },
                    { text: '15 days ago (warning)', onPress: () => simulateLastActive(15) },
                    { text: '22 days ago (release seat)', onPress: () => simulateLastActive(22) },
                    { text: 'Cancel', style: 'cancel' },
                  ]
                );
              }}
            >
              <Text style={styles.demoButtonText}>Simulate Inactivity</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.demoButton} 
              onPress={() => {
                Alert.alert(
                  'Change Application Status',
                  'Demo only - change status:',
                  [
                    { text: 'Approved', onPress: () => setApplicationStatus('approved') },
                    { text: 'Waitlisted', onPress: () => setApplicationStatus('waitlisted') },
                    { text: 'Under Review', onPress: () => setApplicationStatus('under_review') },
                    { text: 'Cancel', style: 'cancel' },
                  ]
                );
              }}
            >
              <Text style={styles.demoButtonText}>Change Status (Demo)</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Photo */}
        <View style={styles.photoContainer}>
          <Image source={{ uri: profile.photoUrl }} style={styles.photo} />
        </View>

        {/* Profile Fields */}
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
                  placeholderTextColor="#666"
                />
              </View>

              <View style={styles.row}>
                <View style={[styles.inputGroup, { flex: 1, marginRight: 8 }]}>
                  <Text style={styles.label}>Age</Text>
                  <TextInput
                    style={styles.input}
                    value={String(tempProfile.age)}
                    onChangeText={(text) =>
                      setTempProfile({
                        ...tempProfile,
                        age: parseInt(text) || 18,
                      })
                    }
                    keyboardType="numeric"
                    placeholder="Age"
                    placeholderTextColor="#666"
                  />
                </View>

                <View style={[styles.inputGroup, { flex: 1, marginLeft: 8 }]}>
                  <Text style={styles.label}>Height (cm)</Text>
                  <TextInput
                    style={styles.input}
                    value={String(tempProfile.height)}
                    onChangeText={(text) =>
                      setTempProfile({
                        ...tempProfile,
                        height: parseInt(text) || 170,
                      })
                    }
                    keyboardType="numeric"
                    placeholder="Height"
                    placeholderTextColor="#666"
                  />
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Gender</Text>
                <View style={styles.chipContainer}>
                  {GENDER_OPTIONS.map((gender) => (
                    <TouchableOpacity
                      key={gender}
                      style={[
                        styles.chip,
                        tempProfile.gender === gender && styles.chipSelected,
                      ]}
                      onPress={() =>
                        setTempProfile({ ...tempProfile, gender })
                      }
                    >
                      <Text
                        style={[
                          styles.chipText,
                          tempProfile.gender === gender &&
                            styles.chipTextSelected,
                        ]}
                      >
                        {formatGender(gender)}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Ethnicity (Optional)</Text>
                <View style={styles.chipContainer}>
                  {ETHNICITY_OPTIONS.map((eth) => (
                    <TouchableOpacity
                      key={eth}
                      style={[
                        styles.chip,
                        tempProfile.ethnicity === eth && styles.chipSelected,
                      ]}
                      onPress={() =>
                        setTempProfile({ ...tempProfile, ethnicity: eth })
                      }
                    >
                      <Text
                        style={[
                          styles.chipText,
                          tempProfile.ethnicity === eth &&
                            styles.chipTextSelected,
                        ]}
                      >
                        {formatEthnicity(eth)}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
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
                  placeholderTextColor="#666"
                  multiline
                  numberOfLines={4}
                />
              </View>

              <View style={styles.inputGroup}>
                <View style={styles.switchRow}>
                  <View>
                    <Text style={styles.label}>Discoverable</Text>
                    <Text style={styles.switchSubtext}>
                      Appear on others' radar
                    </Text>
                  </View>
                  <Switch
                    value={tempProfile.isDiscoverable}
                    onValueChange={(value) =>
                      setTempProfile({ ...tempProfile, isDiscoverable: value })
                    }
                    trackColor={{ false: '#333', true: '#6C63FF' }}
                    thumbColor="#fff"
                  />
                </View>
              </View>

              {/* Filter Preferences */}
              <View style={styles.filtersSection}>
                <Text style={styles.sectionTitle}>Your Filters</Text>
                <Text style={styles.sectionSubtext}>
                  Two-way matching: you only see people who also match your criteria
                </Text>

                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Age Range</Text>
                  <View style={styles.row}>
                    <TextInput
                      style={[styles.input, { flex: 1, marginRight: 8 }]}
                      value={String(tempProfile.preferences.ageRange[0])}
                      onChangeText={(text) =>
                        setTempProfile({
                          ...tempProfile,
                          preferences: {
                            ...tempProfile.preferences,
                            ageRange: [
                              parseInt(text) || 18,
                              tempProfile.preferences.ageRange[1],
                            ],
                          },
                        })
                      }
                      keyboardType="numeric"
                      placeholder="Min"
                      placeholderTextColor="#666"
                    />
                    <TextInput
                      style={[styles.input, { flex: 1, marginLeft: 8 }]}
                      value={String(tempProfile.preferences.ageRange[1])}
                      onChangeText={(text) =>
                        setTempProfile({
                          ...tempProfile,
                          preferences: {
                            ...tempProfile.preferences,
                            ageRange: [
                              tempProfile.preferences.ageRange[0],
                              parseInt(text) || 99,
                            ],
                          },
                        })
                      }
                      keyboardType="numeric"
                      placeholder="Max"
                      placeholderTextColor="#666"
                    />
                  </View>
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Who I Want to Meet</Text>
                  <Text style={styles.v1Note}>
                    v1 supports heterosexual couples: {tempProfile.gender === 'man' ? 'Men seek Women' : 'Women seek Men'}
                  </Text>
                  <View style={styles.chipContainer}>
                    <View style={[styles.chip, styles.chipSelected]}>
                      <Text style={[styles.chipText, styles.chipTextSelected]}>
                        {tempProfile.gender === 'man' ? 'Woman' : 'Man'}
                      </Text>
                    </View>
                  </View>
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Height Range (cm)</Text>
                  <View style={styles.row}>
                    <TextInput
                      style={[styles.input, { flex: 1, marginRight: 8 }]}
                      value={String(tempProfile.preferences.heightRange[0])}
                      onChangeText={(text) =>
                        setTempProfile({
                          ...tempProfile,
                          preferences: {
                            ...tempProfile.preferences,
                            heightRange: [
                              parseInt(text) || 140,
                              tempProfile.preferences.heightRange[1],
                            ],
                          },
                        })
                      }
                      keyboardType="numeric"
                      placeholder="Min"
                      placeholderTextColor="#666"
                    />
                    <TextInput
                      style={[styles.input, { flex: 1, marginLeft: 8 }]}
                      value={String(tempProfile.preferences.heightRange[1])}
                      onChangeText={(text) =>
                        setTempProfile({
                          ...tempProfile,
                          preferences: {
                            ...tempProfile.preferences,
                            heightRange: [
                              tempProfile.preferences.heightRange[0],
                              parseInt(text) || 220,
                            ],
                          },
                        })
                      }
                      keyboardType="numeric"
                      placeholder="Max"
                      placeholderTextColor="#666"
                    />
                  </View>
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Ethnicity Filter (Optional)</Text>
                  <Text style={styles.filterSubtext}>
                    Leave unselected to match anyone
                  </Text>
                  <View style={styles.chipContainer}>
                    {ETHNICITY_OPTIONS.filter((e) => e !== 'prefer-not-to-say').map((eth) => (
                      <TouchableOpacity
                        key={eth}
                        style={[
                          styles.chip,
                          tempProfile.preferences.ethnicities?.includes(
                            eth
                          ) && styles.chipSelected,
                        ]}
                        onPress={() => toggleEthnicityPreference(eth)}
                      >
                        <Text
                          style={[
                            styles.chipText,
                            tempProfile.preferences.ethnicities?.includes(
                              eth
                            ) && styles.chipTextSelected,
                          ]}
                        >
                          {formatEthnicity(eth)}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
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
              <Text style={styles.name}>
                {profile.name}, {profile.age}
              </Text>
              <Text style={styles.detail}>
                {profile.height} cm • {formatGender(profile.gender)}
                {profile.ethnicity && ` • ${formatEthnicity(profile.ethnicity)}`}
              </Text>
              <Text style={styles.bio}>{profile.bio}</Text>

              <View style={styles.switchRow}>
                <Text style={styles.discoverableLabel}>
                  Discoverable: {profile.isDiscoverable ? '✅ On' : '❌ Off'}
                </Text>
              </View>

              <View style={styles.filtersDisplay}>
                <Text style={styles.sectionTitle}>Your Filters</Text>
                <Text style={styles.filterText}>
                  • Age: {profile.preferences.ageRange[0]}-
                  {profile.preferences.ageRange[1]}
                </Text>
                <Text style={styles.filterText}>
                  • Meet: {profile.gender === 'man' ? 'Women' : 'Men'} (v1: heterosexual)
                </Text>
                <Text style={styles.filterText}>
                  • Height: {profile.preferences.heightRange[0]}-
                  {profile.preferences.heightRange[1]} cm
                </Text>
                {profile.preferences.ethnicities &&
                  profile.preferences.ethnicities.length > 0 && (
                    <Text style={styles.filterText}>
                      • Ethnicity:{' '}
                      {profile.preferences.ethnicities
                        .map(formatEthnicity)
                        .join(', ')}
                    </Text>
                  )}
              </View>

              <TouchableOpacity
                style={styles.button}
                onPress={() => setIsEditing(true)}
              >
                <Text style={styles.buttonText}>Edit Profile & Filters</Text>
              </TouchableOpacity>
            </>
          )}
        </View>

        <View style={styles.infoBox}>
          <Text style={styles.infoTitle}>How {APP_CONFIG.appName} works</Text>
          <Text style={styles.infoText}>
            1. Turn on discoverable to appear on radar{'\n'}
            2. Set your filters (two-way matching){'\n'}
            3. Catch people in range ({APP_CONFIG.proximityThresholdDisplay}){'\n'}
            4. Use your 5 geomatches per week wisely!{'\n'}
            5. Get close to say hello IRL 👋
          </Text>
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
  quotaSection: {
    marginHorizontal: 20,
    marginTop: 20,
    padding: 16,
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#333',
  },
  quotaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  quotaLabel: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '600',
  },
  quotaValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#6C63FF',
  },
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  statusLabel: {
    fontSize: 14,
    color: '#888',
  },
  statusBadge: {
    backgroundColor: '#333',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#fff',
  },
  demoSection: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#333',
  },
  demoLabel: {
    fontSize: 12,
    color: '#ff9500',
    fontWeight: '600',
    marginBottom: 12,
  },
  demoButton: {
    backgroundColor: '#333',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 8,
  },
  demoButtonText: {
    fontSize: 13,
    color: '#ff9500',
    fontWeight: '600',
  },
  photoContainer: {
    alignItems: 'center',
    marginVertical: 30,
  },
  v1Note: {
    fontSize: 12,
    color: '#888',
    marginBottom: 8,
    fontStyle: 'italic',
  },
  photo: {
    width: 160,
    height: 160,
    borderRadius: 80,
    borderWidth: 4,
    borderColor: '#6C63FF',
  },
  infoContainer: {
    paddingHorizontal: 20,
  },
  name: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  detail: {
    fontSize: 16,
    color: '#aaa',
    marginBottom: 12,
  },
  bio: {
    fontSize: 16,
    color: '#ccc',
    lineHeight: 24,
    marginBottom: 16,
  },
  discoverableLabel: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '600',
    marginBottom: 16,
  },
  filtersDisplay: {
    backgroundColor: '#1a1a1a',
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#333',
  },
  filterText: {
    fontSize: 14,
    color: '#ccc',
    marginTop: 8,
    lineHeight: 20,
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
  row: {
    flexDirection: 'row',
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#333',
  },
  switchSubtext: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#1a1a1a',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#333',
  },
  chipSelected: {
    backgroundColor: '#6C63FF',
    borderColor: '#6C63FF',
  },
  chipText: {
    fontSize: 13,
    color: '#aaa',
  },
  chipTextSelected: {
    color: '#fff',
    fontWeight: '600',
  },
  filtersSection: {
    marginTop: 24,
    paddingTop: 24,
    borderTopWidth: 1,
    borderTopColor: '#333',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  sectionSubtext: {
    fontSize: 13,
    color: '#888',
    marginBottom: 20,
    lineHeight: 18,
  },
  filterSubtext: {
    fontSize: 12,
    color: '#666',
    marginBottom: 8,
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
