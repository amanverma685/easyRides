import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Switch,
  ScrollView,
  Alert,
  useColorScheme,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { User, Settings, Moon, Sun, CreditCard as Edit, LogOut, Bell, Shield, CircleHelp as HelpCircle } from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';

interface UserProfile {
  email: string;
  name: string;
  phone: string;
  preferredVehicle: string;
}

export default function ProfileScreen() {
  const colorScheme = useColorScheme();
  const [userProfile, setUserProfile] = useState<UserProfile>({
    email: '',
    name: '',
    phone: '',
    preferredVehicle: 'sedan',
  });
  const [isEditing, setIsEditing] = useState(false);
  const [darkModeEnabled, setDarkModeEnabled] = useState(colorScheme === 'dark');
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  const isDark = colorScheme === 'dark';

  useEffect(() => {
    loadUserProfile();
  }, []);

  const loadUserProfile = async () => {
    try {
      const email = await AsyncStorage.getItem('userEmail');
      const savedProfile = await AsyncStorage.getItem('userProfile');
      
      if (savedProfile) {
        setUserProfile(JSON.parse(savedProfile));
      } else if (email) {
        setUserProfile(prev => ({ ...prev, email }));
      }
    } catch (error) {
      console.log('Error loading profile:', error);
    }
  };

  const saveProfile = async () => {
    if (!userProfile.name.trim()) {
      Alert.alert('Error', 'Please enter your name');
      return;
    }

    try {
      await AsyncStorage.setItem('userProfile', JSON.stringify(userProfile));
      setIsEditing(false);
      Alert.alert('Success', 'Profile updated successfully!');
    } catch (error) {
      Alert.alert('Error', 'Failed to save profile');
    }
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            try {
              await AsyncStorage.removeItem('userToken');
                router.replace('/login');
              router.replace('/(tabs)/');
            } catch (error) {
              console.log('Error during logout:', error);
            }
          },
        },
      ]
    );
  };

  const ProfileSection = ({ icon, title, children }: { icon: React.ReactNode; title: string; children: React.ReactNode }) => (
    <View style={[styles.section, isDark && styles.darkSection]}>
      <View style={styles.sectionHeader}>
        {icon}
        <Text style={[styles.sectionTitle, isDark && styles.darkText]}>{title}</Text>
      </View>
      {children}
    </View>
  );

  const SettingRow = ({ 
    icon, 
    title, 
    subtitle, 
    onPress, 
    rightComponent 
  }: { 
    icon: React.ReactNode; 
    title: string; 
    subtitle?: string; 
    onPress?: () => void;
    rightComponent?: React.ReactNode;
  }) => (
    <TouchableOpacity 
      style={[styles.settingRow, isDark && styles.darkSettingRow]} 
      onPress={onPress}
      disabled={!onPress}
    >
      <View style={styles.settingLeft}>
        <View style={[styles.settingIcon, isDark && styles.darkSettingIcon]}>
          {icon}
        </View>
        <View>
          <Text style={[styles.settingTitle, isDark && styles.darkText]}>{title}</Text>
          {subtitle && (
            <Text style={[styles.settingSubtitle, isDark && styles.darkSubText]}>{subtitle}</Text>
          )}
        </View>
      </View>
      {rightComponent}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={[styles.container, isDark && styles.darkContainer]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <View style={[styles.avatar, isDark && styles.darkAvatar]}>
              <User size={32} color={isDark ? '#FFFFFF' : '#007AFF'} />
            </View>
            <View style={styles.userInfo}>
              <Text style={[styles.userName, isDark && styles.darkText]}>
                {userProfile.name || 'Complete your profile'}
              </Text>
              <Text style={[styles.userEmail, isDark && styles.darkSubText]}>
                {userProfile.email}
              </Text>
            </View>
            <TouchableOpacity
              style={styles.editButton}
              onPress={() => setIsEditing(!isEditing)}
            >
              <Edit size={20} color="#007AFF" />
            </TouchableOpacity>
          </View>
        </View>

        {isEditing && (
          <ProfileSection
            icon={<Edit size={20} color={isDark ? '#FFFFFF' : '#007AFF'} />}
            title="Edit Profile"
          >
            <View style={styles.editForm}>
              <Text style={[styles.inputLabel, isDark && styles.darkText]}>Full Name</Text>
              <TextInput
                style={[styles.editInput, isDark && styles.darkInput]}
                value={userProfile.name}
                onChangeText={(text) => setUserProfile(prev => ({ ...prev, name: text }))}
                placeholder="Enter your full name"
                placeholderTextColor={isDark ? '#8E8E93' : '#8E8E93'}
              />

              <Text style={[styles.inputLabel, isDark && styles.darkText]}>Phone Number</Text>
              <TextInput
                style={[styles.editInput, isDark && styles.darkInput]}
                value={userProfile.phone}
                onChangeText={(text) => setUserProfile(prev => ({ ...prev, phone: text }))}
                placeholder="Enter your phone number"
                placeholderTextColor={isDark ? '#8E8E93' : '#8E8E93'}
                keyboardType="phone-pad"
              />

              <Text style={[styles.inputLabel, isDark && styles.darkText]}>Preferred Vehicle</Text>
              <View style={styles.vehicleOptions}>
                {['bike', 'auto', 'sedan', 'suv'].map((vehicle) => (
                  <TouchableOpacity
                    key={vehicle}
                    style={[
                      styles.vehicleOption,
                      userProfile.preferredVehicle === vehicle && styles.selectedVehicle,
                      isDark && styles.darkVehicleOption,
                    ]}
                    onPress={() => setUserProfile(prev => ({ ...prev, preferredVehicle: vehicle }))}
                  >
                    <Text style={[
                      styles.vehicleText,
                      userProfile.preferredVehicle === vehicle && styles.selectedVehicleText,
                      isDark && styles.darkText,
                    ]}>
                      {vehicle.charAt(0).toUpperCase() + vehicle.slice(1)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <View style={styles.editActions}>
                <TouchableOpacity
                  style={[styles.saveButton]}
                  onPress={saveProfile}
                >
                  <Text style={styles.saveButtonText}>Save Changes</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={() => setIsEditing(false)}
                >
                  <Text style={[styles.cancelButtonText, isDark && styles.darkText]}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </View>
          </ProfileSection>
        )}

        <ProfileSection
          icon={<Settings size={20} color={isDark ? '#FFFFFF' : '#007AFF'} />}
          title="Preferences"
        >
          <SettingRow
            icon={darkModeEnabled ? <Moon size={20} color="#8E8E93" /> : <Sun size={20} color="#8E8E93" />}
            title="Dark Mode"
            subtitle="Switch between light and dark themes"
            rightComponent={
              <Switch
                value={darkModeEnabled}
                onValueChange={setDarkModeEnabled}
                trackColor={{ false: '#E5E5E7', true: '#007AFF' }}
                thumbColor={darkModeEnabled ? '#FFFFFF' : '#FFFFFF'}
              />
            }
          />
          
          <SettingRow
            icon={<Bell size={20} color="#8E8E93" />}
            title="Notifications"
            subtitle="Get updates about ride prices and offers"
            rightComponent={
              <Switch
                value={notificationsEnabled}
                onValueChange={setNotificationsEnabled}
                trackColor={{ false: '#E5E5E7', true: '#007AFF' }}
                thumbColor={notificationsEnabled ? '#FFFFFF' : '#FFFFFF'}
              />
            }
          />
        </ProfileSection>

        <ProfileSection
          icon={<Shield size={20} color={isDark ? '#FFFFFF' : '#007AFF'} />}
          title="Support & Security"
        >
          <SettingRow
            icon={<HelpCircle size={20} color="#8E8E93" />}
            title="Help & Support"
            subtitle="Get help with the app"
            onPress={() => Alert.alert('Help', 'Contact support at support@ridecompare.com')}
          />
          
          <SettingRow
            icon={<Shield size={20} color="#8E8E93" />}
            title="Privacy Policy"
            subtitle="Learn about our privacy practices"
            onPress={() => Alert.alert('Privacy', 'Privacy policy coming soon')}
          />
        </ProfileSection>

        <View style={[styles.section, isDark && styles.darkSection]}>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <LogOut size={20} color="#FF3B30" />
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <Text style={[styles.footerText, isDark && styles.darkSubText]}>
            RideCompare v1.0.0
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  darkContainer: {
    backgroundColor: '#000000',
  },
  header: {
    padding: 24,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#E5F4FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  darkAvatar: {
    backgroundColor: '#1C1C1E',
  },
  userInfo: {
    flex: 1,
    marginLeft: 16,
  },
  userName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: '#8E8E93',
  },
  editButton: {
    padding: 8,
  },
  section: {
    marginHorizontal: 24,
    marginBottom: 24,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  darkSection: {
    backgroundColor: '#1C1C1E',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 12,
    color: '#000000',
  },
  editForm: {
    gap: 16,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 8,
  },
  editInput: {
    backgroundColor: '#F2F2F7',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#E5E5E7',
  },
  darkInput: {
    backgroundColor: '#2C2C2E',
    borderColor: '#3A3A3C',
    color: '#FFFFFF',
  },
  vehicleOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginTop: 8,
  },
  vehicleOption: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#F2F2F7',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E5E7',
  },
  darkVehicleOption: {
    backgroundColor: '#2C2C2E',
    borderColor: '#3A3A3C',
  },
  selectedVehicle: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  vehicleText: {
    fontSize: 14,
    color: '#000000',
  },
  selectedVehicleText: {
    color: '#FFFFFF',
  },
  editActions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  saveButton: {
    flex: 1,
    backgroundColor: '#007AFF',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  cancelButton: {
    flex: 1,
    backgroundColor: 'transparent',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E5E7',
  },
  cancelButtonText: {
    color: '#8E8E93',
    fontSize: 16,
    fontWeight: '600',
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F2F2F7',
  },
  darkSettingRow: {
    borderBottomColor: '#2C2C2E',
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingIcon: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: '#F2F2F7',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  darkSettingIcon: {
    backgroundColor: '#2C2C2E',
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#000000',
  },
  settingSubtitle: {
    fontSize: 12,
    color: '#8E8E93',
    marginTop: 2,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    backgroundColor: '#FFEBEE',
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FF3B30',
    marginLeft: 8,
  },
  footer: {
    padding: 24,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    color: '#8E8E93',
  },
  darkText: {
    color: '#FFFFFF',
  },
  darkSubText: {
    color: '#8E8E93',
  },
});