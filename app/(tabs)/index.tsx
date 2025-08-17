import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  useColorScheme,
  ActivityIndicator,
  Linking,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MapPin, Search, Navigation, Car, Bike, Truck } from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import * as Location from 'expo-location';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';

interface RideOption {
  service: string;
  vehicleType: string;
  icon: React.ReactNode;
  estimatedPrice: string;
  estimatedTime: string;
  deepLink: string;
  color: string;
  iosAppId?: string;
  androidPackage?: string;
}

export default function HomeScreen() {
  const colorScheme = useColorScheme();
  const [source, setSource] = useState('');
  const [destination, setDestination] = useState('');
  const [selectedVehicleTab, setSelectedVehicleTab] = useState('all');
  const [loading, setLoading] = useState(false);
  const [rideOptions, setRideOptions] = useState<RideOption[]>([]);
  const [sourceCoords, setSourceCoords] = useState<{lat: number, lng: number} | null>(null);
  const [destCoords, setDestCoords] = useState<{lat: number, lng: number} | null>(null);

  const isDark = colorScheme === 'dark';

  useEffect(() => {
    checkLoginStatus();
  }, []);

  const checkLoginStatus = async () => {
    try {
      const userToken = await AsyncStorage.getItem('userToken');
      if (!userToken) {
        router.replace('/login');
      }
    } catch (error) {
      console.log('Error checking login status:', error);
      router.replace('/login');
    }
  };

  const getCurrentLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission denied', 'Location permission is required');
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      const address = await Location.reverseGeocodeAsync({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });

      if (address[0]) {
        const currentLocation = `${address[0].street || ''} ${address[0].city || ''}`.trim();
        setSource(currentLocation);
        setSourceCoords({
          lat: location.coords.latitude,
          lng: location.coords.longitude,
        });
      }
    } catch (error) {
      Alert.alert('Error', 'Unable to get current location');
    }
  };

  const searchRides = async () => {
    if (!source || !destination) {
      Alert.alert('Error', 'Please enter both source and destination');
      return;
    }

    setLoading(true);
    
    try {
      // Simulate API calls to ride services
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const allRideOptions: RideOption[] = [
        // Uber options
        {
          service: 'Uber',
          vehicleType: 'bike',
          icon: <Bike size={20} color="#FFFFFF" />,
          estimatedPrice: getRandomPrice('bike'),
          estimatedTime: '3-5 min',
          deepLink: 'uber://',
          color: '#000000',
          iosAppId: '368677368',
          androidPackage: 'com.ubercab',
        },
        {
          service: 'Uber',
          vehicleType: 'auto',
          icon: <Car size={20} color="#FFFFFF" />,
          estimatedPrice: getRandomPrice('auto'),
          estimatedTime: '5-8 min',
          deepLink: 'uber://',
          color: '#000000',
          iosAppId: '368677368',
          androidPackage: 'com.ubercab',
        },
        {
          service: 'Uber',
          vehicleType: 'sedan',
          icon: <Car size={20} color="#FFFFFF" />,
          estimatedPrice: getRandomPrice('sedan'),
          estimatedTime: '5-8 min',
          deepLink: 'uber://',
          color: '#000000',
          iosAppId: '368677368',
          androidPackage: 'com.ubercab',
        },
        {
          service: 'Uber',
          vehicleType: 'suv',
          icon: <Truck size={20} color="#FFFFFF" />,
          estimatedPrice: getRandomPrice('suv'),
          estimatedTime: '6-10 min',
          deepLink: 'uber://',
          color: '#000000',
          iosAppId: '368677368',
          androidPackage: 'com.ubercab',
        },
        // Ola options
        {
          service: 'Ola',
          vehicleType: 'bike',
          icon: <Bike size={20} color="#FFFFFF" />,
          estimatedPrice: getRandomPrice('bike'),
          estimatedTime: '4-6 min',
          deepLink: 'olacabs://',
          color: '#00A652',
          iosAppId: '539179177',
          androidPackage: 'com.olacabs.customer',
        },
        {
          service: 'Ola',
          vehicleType: 'auto',
          icon: <Car size={20} color="#FFFFFF" />,
          estimatedPrice: getRandomPrice('auto'),
          estimatedTime: '6-10 min',
          deepLink: 'olacabs://',
          color: '#00A652',
          iosAppId: '539179177',
          androidPackage: 'com.olacabs.customer',
        },
        {
          service: 'Ola',
          vehicleType: 'sedan',
          icon: <Car size={20} color="#FFFFFF" />,
          estimatedPrice: getRandomPrice('sedan'),
          estimatedTime: '6-10 min',
          deepLink: 'olacabs://',
          color: '#00A652',
          iosAppId: '539179177',
          androidPackage: 'com.olacabs.customer',
        },
        {
          service: 'Ola',
          vehicleType: 'suv',
          icon: <Truck size={20} color="#FFFFFF" />,
          estimatedPrice: getRandomPrice('suv'),
          estimatedTime: '7-12 min',
          deepLink: 'olacabs://',
          color: '#00A652',
          iosAppId: '539179177',
          androidPackage: 'com.olacabs.customer',
        },
        // Rapido options (mainly bikes)
        {
          service: 'Rapido',
          vehicleType: 'bike',
          icon: <Bike size={20} color="#FFFFFF" />,
          estimatedPrice: getRandomPrice('bike'),
          estimatedTime: '3-5 min',
          deepLink: 'rapido://',
          color: '#FFD700',
          iosAppId: '1442072406',
          androidPackage: 'com.rapido.passenger',
        },
        {
          service: 'Rapido',
          vehicleType: 'auto',
          icon: <Car size={20} color="#FFFFFF" />,
          estimatedPrice: getRandomPrice('auto'),
          estimatedTime: '4-7 min',
          deepLink: 'rapido://',
          color: '#FFD700',
          iosAppId: '1442072406',
          androidPackage: 'com.rapido.passenger',
        },
        // Namma Yatri options
        {
          service: 'Namma Yatri',
          vehicleType: 'auto',
          icon: <Car size={20} color="#FFFFFF" />,
          estimatedPrice: getRandomPrice('auto'),
          estimatedTime: '4-7 min',
          deepLink: 'nammayatri://',
          color: '#FF6B35',
          iosAppId: '1633941745',
          androidPackage: 'in.juspay.nammayatri',
        },
        {
          service: 'Namma Yatri',
          vehicleType: 'sedan',
          icon: <Car size={20} color="#FFFFFF" />,
          estimatedPrice: getRandomPrice('sedan'),
          estimatedTime: '4-7 min',
          deepLink: 'nammayatri://',
          color: '#FF6B35',
          iosAppId: '1633941745',
          androidPackage: 'in.juspay.nammayatri',
        },
      ];

      setRideOptions(allRideOptions);
    } catch (error) {
      Alert.alert('Error', 'Failed to fetch ride prices');
    } finally {
      setLoading(false);
    }
  };

  const getRandomPrice = (vehicleType: string) => {
    const basePrice = {
      bike: 25,
      auto: 45,
      sedan: 85,
      suv: 120,
    };
    
    const base = basePrice[vehicleType as keyof typeof basePrice] || 50;
    const variation = Math.floor(Math.random() * 20) - 10;
    return `₹${base + variation}`;
  };

  const handleRideSelect = async (rideOption: RideOption) => {
    try {
      const supported = await Linking.canOpenURL(rideOption.deepLink);
      
      if (supported) {
        await Linking.openURL(rideOption.deepLink);
      } else {
        // App not installed, redirect to store
        let storeUrl = '';
        
        if (Platform.OS === 'ios') {
          storeUrl = `https://apps.apple.com/app/id${rideOption.iosAppId}`;
        } else {
          storeUrl = `https://play.google.com/store/apps/details?id=${rideOption.androidPackage}`;
        }
        
        Alert.alert(
          `${rideOption.service} not installed`,
          `Do you want to install ${rideOption.service}?`,
          [
            { text: 'Cancel', style: 'cancel' },
            { 
              text: 'Install', 
              onPress: () => Linking.openURL(storeUrl)
            }
          ]
        );
      }
    } catch (error) {
      Alert.alert('Error', 'Unable to open the app');
    }
  };

  const getFilteredRides = () => {
    if (selectedVehicleTab === 'all') {
      return rideOptions;
    }
    return rideOptions.filter(ride => ride.vehicleType === selectedVehicleTab);
  };

  const vehicleTabs = [
    { id: 'all', label: 'All', icon: <Car size={16} /> },
    { id: 'bike', label: 'Bike', icon: <Bike size={16} /> },
    { id: 'auto', label: 'Auto', icon: <Car size={16} /> },
    { id: 'sedan', label: 'Sedan', icon: <Car size={16} /> },
    { id: 'suv', label: 'SUV', icon: <Truck size={16} /> },
  ];

  return (
    <SafeAreaView style={[styles.container, isDark && styles.darkContainer]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={[styles.headerTitle, isDark && styles.darkText]}>
            Find Your Ride
          </Text>
          <Text style={[styles.headerSubtitle, isDark && styles.darkSubText]}>
            Compare prices across all services
          </Text>
        </View>

        <View style={styles.searchSection}>
          <View style={[styles.locationContainer, isDark && styles.darkCard]}>
            <View style={styles.locationInputWrapper}>
              <MapPin size={20} color={isDark ? '#8E8E93' : '#8E8E93'} />
              <View style={styles.autocompleteContainer}>
                <GooglePlacesAutocomplete
                  placeholder="From"
                  onPress={(data, details = null) => {
                    setSource(data.description);
                    if (details) {
                      setSourceCoords({
                        lat: details.geometry.location.lat,
                        lng: details.geometry.location.lng,
                      });
                    }
                  }}
                  query={{
                    key: 'YOUR_GOOGLE_PLACES_API_KEY', // Replace with your API key
                    language: 'en',
                  }}
                  textInputProps={{
                    value: source,
                    onChangeText: setSource,
                    style: [styles.locationInput, isDark && styles.darkText],
                    placeholderTextColor: isDark ? '#8E8E93' : '#8E8E93',
                  }}
                  styles={{
                    container: styles.googlePlacesContainer,
                    listView: [styles.googlePlacesList, isDark && styles.darkCard],
                    row: [styles.googlePlacesRow, isDark && styles.darkCard],
                    description: [styles.googlePlacesText, isDark && styles.darkText],
                  }}
                />
              </View>
              <TouchableOpacity onPress={getCurrentLocation} style={styles.currentLocationBtn}>
                <Navigation size={16} color="#007AFF" />
              </TouchableOpacity>
            </View>
            
            <View style={styles.separator} />
            
            <View style={styles.locationInputWrapper}>
              <MapPin size={20} color={isDark ? '#8E8E93' : '#8E8E93'} />
              <View style={styles.autocompleteContainer}>
                <GooglePlacesAutocomplete
                  placeholder="To"
                  onPress={(data, details = null) => {
                    setDestination(data.description);
                    if (details) {
                      setDestCoords({
                        lat: details.geometry.location.lat,
                        lng: details.geometry.location.lng,
                      });
                    }
                  }}
                  query={{
                    key: 'YOUR_GOOGLE_PLACES_API_KEY', // Replace with your API key
                    language: 'en',
                  }}
                  textInputProps={{
                    value: destination,
                    onChangeText: setDestination,
                    style: [styles.locationInput, isDark && styles.darkText],
                    placeholderTextColor: isDark ? '#8E8E93' : '#8E8E93',
                  }}
                  styles={{
                    container: styles.googlePlacesContainer,
                    listView: [styles.googlePlacesList, isDark && styles.darkCard],
                    row: [styles.googlePlacesRow, isDark && styles.darkCard],
                    description: [styles.googlePlacesText, isDark && styles.darkText],
                  }}
                />
              </View>
            </View>
          </View>

          <TouchableOpacity 
            style={[styles.searchButton, loading && styles.disabledButton]}
            onPress={searchRides}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <>
                <Search size={20} color="#FFFFFF" />
                <Text style={styles.searchButtonText}>Search Rides</Text>
              </>
            )}
          </TouchableOpacity>
        </View>

        {rideOptions.length > 0 && (
          <View style={styles.resultsSection}>
            <Text style={[styles.sectionTitle, isDark && styles.darkText]}>
              Available Rides
            </Text>
            
            {/* Vehicle Type Tabs */}
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false} 
              style={styles.vehicleTabsContainer}
            >
              {vehicleTabs.map((tab) => (
                <TouchableOpacity
                  key={tab.id}
                  style={[
                    styles.vehicleTab,
                    selectedVehicleTab === tab.id && styles.selectedVehicleTab,
                    isDark && styles.darkVehicleTab,
                  ]}
                  onPress={() => setSelectedVehicleTab(tab.id)}
                >
                  <View style={[
                    styles.vehicleTabIcon,
                    selectedVehicleTab === tab.id && styles.selectedVehicleTabIcon,
                  ]}>
                    {React.cloneElement(tab.icon, {
                      color: selectedVehicleTab === tab.id ? '#FFFFFF' : (isDark ? '#8E8E93' : '#8E8E93'),
                    })}
                  </View>
                  <Text style={[
                    styles.vehicleTabLabel,
                    selectedVehicleTab === tab.id && styles.selectedVehicleTabLabel,
                    isDark && styles.darkText,
                  ]}>
                    {tab.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            {/* Ride Options */}
            {getFilteredRides().map((option, index) => (
              <TouchableOpacity
                key={index}
                style={[styles.rideCard, isDark && styles.darkCard]}
                onPress={() => handleRideSelect(option)}
              >
                <View style={[styles.serviceIcon, { backgroundColor: option.color }]}>
                  {option.icon}
                </View>
                
                <View style={styles.rideInfo}>
                  <View style={styles.rideHeader}>
                    <Text style={[styles.serviceName, isDark && styles.darkText]}>
                      {option.service}
                    </Text>
                    <Text style={[styles.ridePrice, isDark && styles.darkText]}>
                      {option.estimatedPrice}
                    </Text>
                  </View>
                  <View style={styles.rideDetails}>
                    <Text style={[styles.vehicleType, isDark && styles.darkSubText]}>
                      {option.vehicleType.charAt(0).toUpperCase() + option.vehicleType.slice(1)}
                    </Text>
                    <Text style={[styles.estimatedTime, isDark && styles.darkSubText]}>
                      {option.estimatedTime}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}
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
    paddingBottom: 16,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#000000',
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#8E8E93',
    marginTop: 4,
  },
  searchSection: {
    padding: 24,
  },
  locationContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  darkCard: {
    backgroundColor: '#1C1C1E',
  },
  locationInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  autocompleteContainer: {
    flex: 1,
    marginLeft: 12,
  },
  googlePlacesContainer: {
    flex: 1,
  },
  googlePlacesList: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    marginTop: 4,
  },
  googlePlacesRow: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  googlePlacesText: {
    fontSize: 14,
    color: '#000000',
  },
  locationInput: {
    fontSize: 16,
    color: '#000000',
    padding: 0,
  },
  currentLocationBtn: {
    padding: 8,
  },
  separator: {
    height: 1,
    backgroundColor: '#E5E5E7',
    marginVertical: 12,
  },
  searchButton: {
    backgroundColor: '#007AFF',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  disabledButton: {
    opacity: 0.6,
  },
  searchButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  resultsSection: {
    padding: 24,
    paddingTop: 0,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
    color: '#000000',
  },
  vehicleTabsContainer: {
    marginBottom: 20,
  },
  vehicleTab: {
    alignItems: 'center',
    padding: 12,
    marginRight: 12,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    minWidth: 70,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  darkVehicleTab: {
    backgroundColor: '#1C1C1E',
  },
  selectedVehicleTab: {
    backgroundColor: '#007AFF',
  },
  vehicleTabIcon: {
    marginBottom: 4,
  },
  selectedVehicleTabIcon: {
    color: '#FFFFFF',
  },
  vehicleTabLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#8E8E93',
  },
  selectedVehicleTabLabel: {
    color: '#FFFFFF',
  },
  rideCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  serviceIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  rideInfo: {
    flex: 1,
  },
  rideHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  serviceName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000000',
  },
  ridePrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000000',
  },
  rideDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  vehicleType: {
    fontSize: 14,
    color: '#8E8E93',
  },
  estimatedTime: {
    fontSize: 14,
    color: '#8E8E93',
  },
  darkText: {
    color: '#FFFFFF',
  },
  darkSubText: {
    color: '#8E8E93',
  },
});