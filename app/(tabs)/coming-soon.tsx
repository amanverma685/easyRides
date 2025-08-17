import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  useColorScheme,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { 
  Clock, 
  MapPin, 
  Star, 
  Bell, 
  CreditCard, 
  Users,
  Calendar,
  Zap
} from 'lucide-react-native';

interface FeatureCard {
  icon: React.ReactNode;
  title: string;
  description: string;
  status: 'In Development' | 'Planning' | 'Research';
  color: string;
}

export default function ComingSoonScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const upcomingFeatures: FeatureCard[] = [
    {
      icon: <MapPin size={24} color="#007AFF" />,
      title: 'Live Tracking',
      description: 'Real-time tracking of your rides with accurate ETAs and driver location updates.',
      status: 'In Development',
      color: '#007AFF',
    },
    {
      icon: <Star size={24} color="#34C759" />,
      title: 'Driver Ratings',
      description: 'View driver ratings and reviews to make informed decisions about your rides.',
      status: 'In Development',
      color: '#34C759',
    },
    {
      icon: <Bell size={24} color="#FF9500" />,
      title: 'Smart Notifications',
      description: 'Get personalized notifications about price drops, surge pricing, and ride availability.',
      status: 'Planning',
      color: '#FF9500',
    },
    {
      icon: <CreditCard size={24} color="#AF52DE" />,
      title: 'Unified Payments',
      description: 'Pay for rides from any service directly through the app with saved payment methods.',
      status: 'Research',
      color: '#AF52DE',
    },
    {
      icon: <Users size={24} color="#FF2D92" />,
      title: 'Ride Sharing',
      description: 'Split costs with friends and share rides easily with integrated group booking.',
      status: 'Planning',
      color: '#FF2D92',
    },
    {
      icon: <Calendar size={24} color="#5AC8FA" />,
      title: 'Scheduled Rides',
      description: 'Book rides in advance and get the best prices for your planned trips.',
      status: 'Planning',
      color: '#5AC8FA',
    },
    {
      icon: <Zap size={24} color="#FFCC00" />,
      title: 'Price Predictions',
      description: 'AI-powered price predictions to help you choose the best time to book.',
      status: 'Research',
      color: '#FFCC00',
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'In Development':
        return '#34C759';
      case 'Planning':
        return '#FF9500';
      case 'Research':
        return '#8E8E93';
      default:
        return '#8E8E93';
    }
  };

  const getStatusBackground = (status: string) => {
    switch (status) {
      case 'In Development':
        return '#E8F5E8';
      case 'Planning':
        return '#FFF4E6';
      case 'Research':
        return '#F2F2F7';
      default:
        return '#F2F2F7';
    }
  };

  return (
    <SafeAreaView style={[styles.container, isDark && styles.darkContainer]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View style={[styles.clockContainer, isDark && styles.darkClockContainer]}>
            <Clock size={48} color={isDark ? '#FFFFFF' : '#007AFF'} />
          </View>
          <Text style={[styles.title, isDark && styles.darkText]}>
            Exciting Features Coming Soon!
          </Text>
          <Text style={[styles.subtitle, isDark && styles.darkSubText]}>
            We're working hard to bring you even more amazing features to enhance your ride comparison experience.
          </Text>
        </View>

        <View style={styles.featuresSection}>
          <Text style={[styles.sectionTitle, isDark && styles.darkText]}>
            What's Next
          </Text>
          
          {upcomingFeatures.map((feature, index) => (
            <View 
              key={index} 
              style={[styles.featureCard, isDark && styles.darkFeatureCard]}
            >
              <View style={styles.featureHeader}>
                <View style={[styles.iconContainer, { backgroundColor: `${feature.color}20` }]}>
                  {feature.icon}
                </View>
                <View style={styles.featureTitleContainer}>
                  <Text style={[styles.featureTitle, isDark && styles.darkText]}>
                    {feature.title}
                  </Text>
                  <View style={[
                    styles.statusBadge, 
                    { backgroundColor: isDark ? '#2C2C2E' : getStatusBackground(feature.status) }
                  ]}>
                    <View style={[
                      styles.statusDot, 
                      { backgroundColor: getStatusColor(feature.status) }
                    ]} />
                    <Text style={[
                      styles.statusText, 
                      { color: isDark ? '#FFFFFF' : getStatusColor(feature.status) }
                    ]}>
                      {feature.status}
                    </Text>
                  </View>
                </View>
              </View>
              
              <Text style={[styles.featureDescription, isDark && styles.darkSubText]}>
                {feature.description}
              </Text>
            </View>
          ))}
        </View>

        <View style={[styles.feedbackSection, isDark && styles.darkFeedbackSection]}>
          <Text style={[styles.feedbackTitle, isDark && styles.darkText]}>
            Have a Feature Request?
          </Text>
          <Text style={[styles.feedbackText, isDark && styles.darkSubText]}>
            We'd love to hear your ideas! Send us your feedback and feature requests to help us build the perfect ride comparison app for you.
          </Text>
          <View style={styles.contactInfo}>
            <Text style={[styles.contactText, isDark && styles.darkSubText]}>
              📧 feedback@ridecompare.com
            </Text>
            <Text style={[styles.contactText, isDark && styles.darkSubText]}>
              💬 Join our community for updates
            </Text>
          </View>
        </View>

        <View style={styles.footer}>
          <Text style={[styles.footerText, isDark && styles.darkSubText]}>
            Stay tuned for updates! 🚀
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
    alignItems: 'center',
    padding: 32,
    paddingTop: 48,
  },
  clockContainer: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: '#E5F4FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  darkClockContainer: {
    backgroundColor: '#1C1C1E',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 12,
    color: '#000000',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    color: '#8E8E93',
    lineHeight: 22,
    paddingHorizontal: 16,
  },
  featuresSection: {
    padding: 24,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#000000',
  },
  featureCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  darkFeatureCard: {
    backgroundColor: '#1C1C1E',
  },
  featureHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  featureTitleContainer: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 6,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: '#F2F2F7',
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 6,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  featureDescription: {
    fontSize: 14,
    color: '#8E8E93',
    lineHeight: 20,
  },
  feedbackSection: {
    margin: 24,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  darkFeedbackSection: {
    backgroundColor: '#1C1C1E',
  },
  feedbackTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#000000',
  },
  feedbackText: {
    fontSize: 14,
    color: '#8E8E93',
    lineHeight: 20,
    marginBottom: 16,
  },
  contactInfo: {
    gap: 8,
  },
  contactText: {
    fontSize: 14,
    color: '#8E8E93',
  },
  footer: {
    alignItems: 'center',
    padding: 32,
  },
  footerText: {
    fontSize: 16,
    color: '#8E8E93',
    textAlign: 'center',
  },
  darkText: {
    color: '#FFFFFF',
  },
  darkSubText: {
    color: '#8E8E93',
  },
});