import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../contexts/ThemeContext';
import { colors } from '../constants/Styles';

interface CustomHeaderProps {
  title: string;
  showSettings?: boolean;
  onSettingsPress?: () => void;
  rightContent?: React.ReactNode;
}

const CustomHeader: React.FC<CustomHeaderProps> = ({
  title,
  showSettings = true,
  onSettingsPress,
  rightContent,
}) => {
  const navigation = useNavigation();
  const { isDarkMode } = useTheme();

  const handleSettings = () => {
    if (onSettingsPress) {
      onSettingsPress();
    } else {
      // 默认跳转到Settings
      (navigation as any).navigate('Settings');
    }
  };

  return (
    <View style={[styles.header, { backgroundColor: isDarkMode ? colors.gray[900] : colors.white }]}> 
      {showSettings && (
        <TouchableOpacity style={styles.leftBtn} onPress={handleSettings}>
          <FontAwesome5 name="cog" size={22} color={isDarkMode ? colors.white : colors.gray[800]} />
        </TouchableOpacity>
      )}
      <Text style={[styles.title, { color: isDarkMode ? colors.white : colors.gray[900] }]} numberOfLines={1}>{title}</Text>
      <View style={styles.rightContent}>{rightContent}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 56,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    zIndex: 10,
  },
  leftBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    flex: 1,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 'bold',
    marginHorizontal: 8,
  },
  rightContent: {
    minWidth: 40,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
});

export default CustomHeader; 