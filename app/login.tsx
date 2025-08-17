import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
  useColorScheme,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';

export default function LoginScreen() {
  const colorScheme = useColorScheme();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);

  const isDark = colorScheme === 'dark';

  const handleAuth = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    setLoading(true);
    
    try {
      // Bypass login - simulate quick success
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Save user token
      await AsyncStorage.setItem('userToken', email);
      await AsyncStorage.setItem('userEmail', email);
      
      // Navigate to tabs
      router.replace('/(tabs)');
    } catch (error) {
      Alert.alert('Error', 'Authentication failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={[styles.container, isDark && styles.darkContainer]}>
      <View style={styles.authContainer}>
        <Text style={[styles.title, isDark && styles.darkText]}>
          {isLogin ? 'Welcome Back!' : 'Create Account'}
        </Text>
        <Text style={[styles.subtitle, isDark && styles.darkSubText]}>
          {isLogin ? 'Sign in to compare ride prices' : 'Join to start comparing rides'}
        </Text>

        <View style={styles.inputContainer}>
          <TextInput
            style={[styles.input, isDark && styles.darkInput]}
            placeholder="Email"
            placeholderTextColor={isDark ? '#8E8E93' : '#8E8E93'}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <TextInput
            style={[styles.input, isDark && styles.darkInput]}
            placeholder="Password"
            placeholderTextColor={isDark ? '#8E8E93' : '#8E8E93'}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
        </View>

        <TouchableOpacity 
          style={[styles.authButton, loading && styles.disabledButton]} 
          onPress={handleAuth}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.authButtonText}>
              {isLogin ? 'Sign In' : 'Sign Up'}
            </Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.switchButton}
          onPress={() => setIsLogin(!isLogin)}
        >
          <Text style={[styles.switchText, isDark && styles.darkText]}>
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <Text style={styles.switchLinkText}>
              {isLogin ? 'Sign Up' : 'Sign In'}
            </Text>
          </Text>
        </TouchableOpacity>
      </View>
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
  authContainer: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
    color: '#000000',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 32,
    color: '#8E8E93',
  },
  inputContainer: {
    marginBottom: 24,
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#E5E5E7',
  },
  darkInput: {
    backgroundColor: '#1C1C1E',
    borderColor: '#2C2C2E',
    color: '#FFFFFF',
  },
  authButton: {
    backgroundColor: '#007AFF',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginBottom: 16,
  },
  disabledButton: {
    opacity: 0.6,
  },
  authButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  switchButton: {
    alignItems: 'center',
  },
  switchText: {
    fontSize: 14,
    color: '#8E8E93',
  },
  switchLinkText: {
    color: '#007AFF',
    fontWeight: '600',
  },
  darkText: {
    color: '#FFFFFF',
  },
  darkSubText: {
    color: '#8E8E93',
  },
});