import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/Ionicons';

// screens
import MusicListScreen from './Screens/MusicListScreen';
import PlayerScreen from './Screens/PlayerScreen';

// navigator
const Bottom = createBottomTabNavigator();

// color palette
const colors = {
  primary: '#973131',
  secondary: '#E0A75E',
  tertiary: '#F9D689',
  quaternary: '#F5E7B2',
};

const Appnavigation = () => {
  return (
    <NavigationContainer>
      <Bottom.Navigator
        screenOptions={{
          tabBarActiveTintColor: colors.primary,
          tabBarInactiveTintColor: colors.secondary,
          tabBarStyle: {
            backgroundColor: colors.quaternary,
          },
          tabBarLabelStyle: {
            color: colors.primary,
          },
        }}
      >
        <Bottom.Screen
          name='MusicListScreen'
          component={MusicListScreen}
          options={{
            headerShown: false, 
            tabBarIcon: ({ color, size }) => (
              <Icon name="musical-notes" color={color} size={size} />
            ),
          }}
        />
        <Bottom.Screen
          name='PlayerScreen'
          component={PlayerScreen}
          options={{
            headerShown: false, 
            tabBarIcon: ({ color, size }) => (
              <Icon name="play-circle" color={color} size={size} />
            ),
          }}
        />
        
      </Bottom.Navigator>
    </NavigationContainer>
  );
};

export default Appnavigation;
