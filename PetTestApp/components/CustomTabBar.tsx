import React from 'react';
import { View, TouchableOpacity, StyleSheet, Text } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { colors } from '../constants/Styles';
import { useTheme } from '../contexts/ThemeContext';

export default function CustomTabBar({ state, descriptors, navigation }) {
  const { isDarkMode } = useTheme();
  // 前两个Tab
  const firstTabs = state.routes.slice(0, 2);
  // 后两个Tab
  const lastTabs = state.routes.slice(2);

  // 动态样式
  const tabBarStyle = [
    styles.tabBar,
    {
      backgroundColor: isDarkMode ? colors.gray[900] : '#fff',
      borderTopColor: isDarkMode ? colors.gray[800] : '#eee',
    },
  ];
  const plusButtonStyle = [
    styles.plusButton,
    { backgroundColor: isDarkMode ? colors.primary : colors.primary },
  ];

  return (
    <View style={tabBarStyle}>
      {firstTabs.map((route, index) => {
        const { options } = descriptors[route.key];
        const label =
          options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
            ? options.title
            : route.name;
        const isFocused = state.index === index;
        const iconName = options.tabBarIconName ||
          (route.name === 'Home' ? 'home' :
          route.name === 'VirtualPet' ? 'paw' :
          route.name === 'Social' ? 'camera' :
          route.name === 'Profile' ? 'user' : 'circle');
        return (
          <TouchableOpacity
            key={route.key}
            accessibilityRole="button"
            accessibilityState={isFocused ? { selected: true } : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            testID={options.tabBarTestID}
            onPress={() => navigation.navigate(route.name)}
            style={styles.tabItem}
            activeOpacity={0.7}
          >
            <FontAwesome5 name={iconName} size={22} color={isFocused ? colors.primary : (isDarkMode ? colors.gray[400] : colors.gray[400])} />
            <Text style={{ color: isFocused ? colors.primary : (isDarkMode ? colors.gray[400] : colors.gray[400]), fontSize: 12, marginTop: 2 }}>{label}</Text>
          </TouchableOpacity>
        );
      })}
      {/* 中间加号按钮 */}
      <TouchableOpacity
        style={styles.plusButtonContainer}
        onPress={() => navigation.navigate('AddPost')}
        activeOpacity={0.8}
      >
        <View style={plusButtonStyle}>
          <FontAwesome5 name="plus" size={28} color="#fff" />
        </View>
      </TouchableOpacity>
      {lastTabs.map((route, i) => {
        const index = i + 2;
        const { options } = descriptors[route.key];
        const label =
          options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
            ? options.title
            : route.name;
        const isFocused = state.index === index;
        const iconName = options.tabBarIconName ||
          (route.name === 'Home' ? 'home' :
          route.name === 'VirtualPet' ? 'paw' :
          route.name === 'Social' ? 'camera' :
          route.name === 'Profile' ? 'user' : 'circle');
        return (
          <TouchableOpacity
            key={route.key}
            accessibilityRole="button"
            accessibilityState={isFocused ? { selected: true } : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            testID={options.tabBarTestID}
            onPress={() => navigation.navigate(route.name)}
            style={styles.tabItem}
            activeOpacity={0.7}
          >
            <FontAwesome5 name={iconName} size={22} color={isFocused ? colors.primary : (isDarkMode ? colors.gray[400] : colors.gray[400])} />
            <Text style={{ color: isFocused ? colors.primary : (isDarkMode ? colors.gray[400] : colors.gray[400]), fontSize: 12, marginTop: 2 }}>{label}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    flexDirection: 'row',
    height: 64,
    borderTopWidth: 1,
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 10,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
  },
  plusButtonContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: -24,
    zIndex: 10,
    alignItems: 'center',
    justifyContent: 'center',
    pointerEvents: 'box-none',
  },
  plusButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.18,
    shadowRadius: 8,
    elevation: 12,
  },
}); 