import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext';
import { colors } from '../constants/Styles';

interface UnityPetViewerProps {
  petType: string;
  petMood: string;
  onUnityReady?: () => void;
  onUnityError?: (error: string) => void;
}

const UnityPetViewer: React.FC<UnityPetViewerProps> = ({
  petType,
  petMood,
  onUnityReady,
  onUnityError,
}) => {
  const { isDarkMode } = useTheme();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // 模拟加载过程
    const timer = setTimeout(() => {
      setIsLoading(false);
      onUnityReady?.();
    }, 2000);

    return () => clearTimeout(timer);
  }, [onUnityReady]);

  // 获取宠物图标
  const getPetIcon = () => {
    switch (petType) {
      case 'dog': return 'dog';
      case 'cat': return 'cat';
      case 'rabbit': return 'rabbit';
      case 'bird': return 'dove';
      default: return 'paw';
    }
  };

  // 获取心情图标
  const getMoodIcon = () => {
    switch (petMood) {
      case 'happy': return 'smile';
      case 'sad': return 'frown';
      case 'excited': return 'star';
      case 'sleepy': return 'bed';
      default: return 'meh';
    }
  };

  if (isLoading) {
    return (
      <View style={[styles.container, { backgroundColor: isDarkMode ? '#1a1a1a' : '#f5f5f5' }]}>
        <View style={styles.loadingContainer}>
          <FontAwesome5 
            name="spinner" 
            size={32} 
            color={isDarkMode ? '#ffffff' : '#333333'} 
            style={styles.spinner}
          />
          <Text style={[styles.loadingText, { color: isDarkMode ? '#ffffff' : '#333333' }]}>
            加载虚拟宠物中...
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: isDarkMode ? '#1a1a1a' : '#f5f5f5' }]}>
      <View style={styles.petContainer}>
        <View style={styles.petIconContainer}>
          <FontAwesome5 
            name={getPetIcon()} 
            size={80} 
            color={colors.primary} 
          />
          <View style={styles.moodIconContainer}>
            <FontAwesome5 
              name={getMoodIcon()} 
              size={24} 
              color="#FFD93D" 
            />
          </View>
        </View>
        
        <Text style={[styles.petName, { color: isDarkMode ? '#ffffff' : '#333333' }]}>
          {petType.charAt(0).toUpperCase() + petType.slice(1)} ({petMood})
        </Text>
        
        <Text style={[styles.placeholderText, { color: isDarkMode ? '#cccccc' : '#666666' }]}>
          Unity 3D 宠物将在这里显示
        </Text>
        
        <TouchableOpacity 
          style={[styles.infoButton, { backgroundColor: colors.primary }]}
          onPress={() => {
            console.log('Unity integration coming soon!');
            onUnityError?.('Unity integration not yet implemented');
          }}
        >
          <Text style={styles.infoButtonText}>了解更多</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 300,
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  spinner: {
    marginBottom: 16,
  },
  loadingText: {
    fontSize: 16,
    fontWeight: '500',
  },
  petContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  petIconContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  moodIconContainer: {
    position: 'absolute',
    top: -10,
    right: -10,
    backgroundColor: '#333',
    borderRadius: 12,
    padding: 4,
  },
  petName: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  placeholderText: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 16,
  },
  infoButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  infoButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '500',
  },
});

export default UnityPetViewer; 