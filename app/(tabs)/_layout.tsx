import { Tabs } from 'expo-router';
import { Chrome as Home, User, Clock } from 'lucide-react-native';
import { useColorScheme, Platform } from 'react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withSpring,
  interpolate,
  Extrapolate
} from 'react-native-reanimated';
import { useEffect } from 'react';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const tabAnimation = useSharedValue(0);

  useEffect(() => {
    tabAnimation.value = withSpring(1, {
      damping: 15,
      stiffness: 150,
    });
  }, []);

  const animatedTabBarStyle = useAnimatedStyle(() => {
    const translateY = interpolate(
      tabAnimation.value,
      [0, 1],
      [100, 0],
      Extrapolate.CLAMP
    );

    const opacity = interpolate(
      tabAnimation.value,
      [0, 1],
      [0, 1],
      Extrapolate.CLAMP
    );

    return {
      transform: [{ translateY }],
      opacity,
    };
  });
  
  const tabBarStyle = {
    backgroundColor: colorScheme === 'dark' ? '#1C1C1E' : '#FFFFFF',
    borderTopColor: colorScheme === 'dark' ? '#2C2C2E' : '#E5E5E7',
    borderTopWidth: 1,
    paddingBottom: 8,
    height: 88,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: colorScheme === 'dark' ? 0.3 : 0.1,
    shadowRadius: 8,
    elevation: 8,
  };

  const tabBarActiveTintColor = colorScheme === 'dark' ? '#007AFF' : '#007AFF';
  const tabBarInactiveTintColor = colorScheme === 'dark' ? '#8E8E93' : '#8E8E93';

  const AnimatedTabIcon = ({ children, focused }: { children: React.ReactNode; focused: boolean }) => {
    const iconScale = useSharedValue(focused ? 1 : 0.8);
    const iconOpacity = useSharedValue(focused ? 1 : 0.6);

    useEffect(() => {
      iconScale.value = withSpring(focused ? 1.1 : 1, {
        damping: 15,
        stiffness: 200,
      });
      iconOpacity.value = withSpring(focused ? 1 : 0.7, {
        damping: 15,
        stiffness: 200,
      });
    }, [focused]);

    const animatedIconStyle = useAnimatedStyle(() => ({
      transform: [{ scale: iconScale.value }],
      opacity: iconOpacity.value,
    }));

    return (
      <Animated.View style={animatedIconStyle}>
        {children}
      </Animated.View>
    );
  };
  return (
    <Animated.View style={[{ flex: 1 }, animatedTabBarStyle]}>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarStyle,
          tabBarActiveTintColor,
          tabBarInactiveTintColor,
          tabBarLabelStyle: {
            fontSize: 12,
            fontWeight: '600',
            marginTop: 4,
          },
          tabBarItemStyle: {
            paddingTop: 8,
          },
          tabBarHideOnKeyboard: Platform.OS === 'ios' ? false : true,
        }}>
        <Tabs.Screen
          name="index"
          options={{
            title: 'Home',
            tabBarIcon: ({ size, color, focused }) => (
              <AnimatedTabIcon focused={focused}>
                <Home size={size} color={color} />
              </AnimatedTabIcon>
            ),
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: 'Profile',
            tabBarIcon: ({ size, color, focused }) => (
              <AnimatedTabIcon focused={focused}>
                <User size={size} color={color} />
              </AnimatedTabIcon>
            ),
          }}
        />
        <Tabs.Screen
          name="coming-soon"
          options={{
            title: 'Coming Soon',
            tabBarIcon: ({ size, color, focused }) => (
              <AnimatedTabIcon focused={focused}>
                <Clock size={size} color={color} />
              </AnimatedTabIcon>
            ),
          }}
        />
      </Tabs>
    </Animated.View>
  );
}