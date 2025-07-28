import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Home from '../screens/Home';
import VirtualPet from '../screens/VirtualPet';
import AddPost from '../screens/AddPost';
import Social from '../screens/Social';
import Profile from '../screens/Profile';
import Settings from '../screens/Settings';
import Tasks from '../screens/Tasks';
import PetProfile from '../screens/PetProfile';
import GpsCollarMap from '../screens/GpsCollarMap';
import EditUserProfile from '../screens/EditUserProfile';

import ChatRoom from '../screens/ChatRoom';

import FriendsList from '../screens/FriendsList';
import AIChat from '../screens/AIChat';
import { useTheme } from '../contexts/ThemeContext';
import { useLanguage } from '../contexts/LanguageContext';
import { colors } from '../constants/Styles';
import CustomTabBar from '../components/CustomTabBar';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const TabNavigator = () => {
  return (
    <Tab.Navigator
      tabBar={props => <CustomTabBar {...props} />}
      screenOptions={{ headerShown: false }}
    >
      <Tab.Screen name="Home" component={Home} options={{ title: 'Home' }} />
      <Tab.Screen name="VirtualPet" component={VirtualPet} options={{ title: 'Virtual Pet' }} />
      <Tab.Screen name="Social" component={Social} options={{ title: 'Social' }} />
      <Tab.Screen name="Profile" component={Profile} options={{ title: 'Profile' }} />
    </Tab.Navigator>
  );
};

const AppNavigator = () => {
  const { isDarkMode } = useTheme();
  const { t } = useLanguage();
  return (
    <Stack.Navigator>
      <Stack.Screen name="MainTabs" component={TabNavigator} options={{ headerShown: false }} />
      <Stack.Screen name="EditUserProfile" component={EditUserProfile} options={{ title: 'Edit Profile' }} />
      <Stack.Screen
        name="Settings"
        component={Settings}
        options={{
          headerShown: true,
          title: 'Settings',
          headerStyle: {
            backgroundColor: isDarkMode ? colors.gray[900] : colors.white,
            elevation: 0,
            shadowOpacity: 0,
          },
          headerTintColor: isDarkMode ? colors.white : colors.gray[900],
        }}
      />
      <Stack.Screen
        name="GpsCollarMap"
        component={GpsCollarMap}
        options={{
          headerShown: true,
          title: 'GPS Collar',
          headerStyle: {
            backgroundColor: isDarkMode ? colors.gray[900] : colors.white,
            // borderBottomWidth: 0, // 可选，去除下边框
            elevation: 0,
            shadowOpacity: 0,
          },
          headerTintColor: isDarkMode ? colors.white : colors.gray[900],
          presentation: 'modal',
        }}
      />

      <Stack.Screen
        name="ChatRoom"
        component={ChatRoom}
        options={{
          headerShown: true,
          headerStyle: {
            backgroundColor: isDarkMode ? colors.gray[900] : colors.white,
            elevation: 0,
            shadowOpacity: 0,
          },
          headerTintColor: isDarkMode ? colors.white : colors.gray[900],
        }}
      />

      <Stack.Screen
        name="FriendsList"
        component={FriendsList}
        options={{
          headerShown: true,
          title: t('common.friends.title'),
          headerStyle: {
            backgroundColor: isDarkMode ? colors.gray[900] : colors.white,
            elevation: 0,
            shadowOpacity: 0,
            borderBottomWidth: 0,
          },
          headerTintColor: isDarkMode ? colors.white : colors.gray[900],
        }}
      />

      <Stack.Screen
        name="AIChat"
        component={AIChat}
        options={{
          headerShown: true,
          title: t('common.aiChat.title'),
          headerStyle: {
            backgroundColor: isDarkMode ? colors.gray[900] : colors.white,
            elevation: 0,
            shadowOpacity: 0,
            borderBottomWidth: 0,
          },
          headerTintColor: isDarkMode ? colors.white : colors.gray[900],
        }}
      />
      <Stack.Screen
        name="PetProfile"
        component={PetProfile}
        options={{
          headerShown: true,
          title: 'Pet Profile',
          headerStyle: {
            backgroundColor: isDarkMode ? colors.gray[900] : colors.white,
            elevation: 0,
            shadowOpacity: 0,
            borderBottomWidth: 0,
          },
          headerTintColor: isDarkMode ? colors.white : colors.gray[900],
        }}
      />
      <Stack.Screen
        name="Tasks"
        component={Tasks}
        options={{
          headerShown: true,
          title: 'Tasks',
          headerStyle: {
            backgroundColor: isDarkMode ? colors.gray[900] : colors.white,
            elevation: 0,
            shadowOpacity: 0,
            borderBottomWidth: 0,
          },
          headerTintColor: isDarkMode ? colors.white : colors.gray[900],
        }}
      />
      <Stack.Screen
        name="AddPost"
        component={AddPost}
        options={{
          headerShown: true,
          title: 'Add Post',
          headerStyle: {
            backgroundColor: isDarkMode ? colors.gray[900] : colors.white,
            elevation: 0,
            shadowOpacity: 0,
            borderBottomWidth: 0,
          },
          headerTintColor: isDarkMode ? colors.white : colors.gray[900],
          presentation: 'modal',
        }}
      />
    </Stack.Navigator>
  );
};

export default AppNavigator; 