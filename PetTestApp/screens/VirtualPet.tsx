import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StatusBar, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FontAwesome5 } from '@expo/vector-icons';
import { styles, colors } from '../constants/Styles';
import { useLanguage } from '../contexts/LanguageContext';
import { useTheme } from '../contexts/ThemeContext';
import UnityPetViewer from '../components/UnityPetViewer';
import CustomHeader from '../components/CustomHeader';

export default function VirtualPet() {
  const { t } = useLanguage();
  const { isDarkMode } = useTheme();
  const [selectedPet, setSelectedPet] = useState('dog');
  const [petMood, setPetMood] = useState('happy');

  // 宠物选项
  const petOptions = [
    { id: 'dog', name: 'Dog', icon: 'dog' },
    { id: 'cat', name: 'Cat', icon: 'cat' },
    { id: 'rabbit', name: 'Rabbit', icon: 'rabbit' },
    { id: 'bird', name: 'Bird', icon: 'dove' },
  ];

  // 互动选项
  const interactionOptions = [
    { id: 'play', name: 'Play', icon: 'play', color: colors.primary },
    { id: 'feed', name: 'Feed', icon: 'utensils', color: '#FF6B6B' },
    { id: 'pet', name: 'Pet', icon: 'hand-paper', color: '#4ECDC4' },
    { id: 'train', name: 'Train', icon: 'graduation-cap', color: '#45B7D1' },
  ];

  // 心情选项
  const moodOptions = [
    { id: 'happy', name: 'Happy', icon: 'smile', color: '#FFD93D' },
    { id: 'sad', name: 'Sad', icon: 'frown', color: '#6C5CE7' },
    { id: 'excited', name: 'Excited', icon: 'star', color: '#FF7675' },
    { id: 'sleepy', name: 'Sleepy', icon: 'bed', color: '#74B9FF' },
  ];

  const handlePetInteraction = (interactionType: string) => {
    console.log(`Pet interaction: ${interactionType}`);
    // 这里将来会与Unity通信
  };

  const handleMoodChange = (mood: string) => {
    setPetMood(mood);
    console.log(`Pet mood changed to: ${mood}`);
    // 这里将来会与Unity通信
  };

  return (
    <SafeAreaView style={[styles.safeAreaContainer, { backgroundColor: isDarkMode ? colors.gray[900] : colors.white }]}>
      <StatusBar barStyle={isDarkMode ? "light-content" : "dark-content"} />
      <CustomHeader title={t('common.virtualPet.title')} />
      <ScrollView 
        style={[styles.content, { backgroundColor: isDarkMode ? colors.gray[900] : colors.white }]} 
        contentContainerStyle={[styles.scrollViewContent, { backgroundColor: isDarkMode ? colors.gray[900] : colors.white }]}
      >


        {/* 3D Unity Container */}
        <UnityPetViewer
          petType={selectedPet}
          petMood={petMood}
          onUnityReady={() => console.log('Unity is ready!')}
          onUnityError={(error) => console.error('Unity error:', error)}
        />

        {/* Pet Selection */}
        <View style={[styles.sectionHeader, { marginBottom: 16 }]}>
          <Text style={[styles.sectionTitle, { color: isDarkMode ? colors.white : colors.gray[900] }]}>
            {t('common.virtualPet.selectPetType')}
          </Text>
        </View>
        
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingRight: 20 }}
          style={{ marginBottom: 24 }}
        >
          {petOptions.map((pet) => (
            <TouchableOpacity
              key={pet.id}
              style={[
                localStyles.petOption,
                { 
                  backgroundColor: isDarkMode ? colors.gray[800] : colors.white,
                  borderColor: selectedPet === pet.id ? colors.primary : (isDarkMode ? colors.gray[700] : colors.gray[200])
                }
              ]}
              onPress={() => setSelectedPet(pet.id)}
            >
              <FontAwesome5 
                name={pet.icon} 
                size={24} 
                color={selectedPet === pet.id ? colors.primary : (isDarkMode ? colors.gray[400] : colors.gray[600])} 
              />
              <Text style={[
                localStyles.petOptionText,
                { color: selectedPet === pet.id ? colors.primary : (isDarkMode ? colors.gray[400] : colors.gray[600]) }
              ]}>
                {pet.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Interaction Options */}
        <View style={[styles.sectionHeader, { marginBottom: 16 }]}>
          <Text style={[styles.sectionTitle, { color: isDarkMode ? colors.white : colors.gray[900] }]}>
            {t('common.virtualPet.interactions')}
          </Text>
        </View>
        
        <View style={localStyles.interactionGrid}>
          {interactionOptions.map((option) => (
            <TouchableOpacity
              key={option.id}
              style={[
                localStyles.interactionButton,
                { backgroundColor: isDarkMode ? colors.gray[800] : colors.white }
              ]}
              onPress={() => handlePetInteraction(option.id)}
            >
              <FontAwesome5 name={option.icon} size={20} color={option.color} />
              <Text style={[
                localStyles.interactionText,
                { color: isDarkMode ? colors.white : colors.gray[800] }
              ]}>
                {option.name}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Mood Selection */}
        <View style={[styles.sectionHeader, { marginBottom: 16, marginTop: 24 }]}>
          <Text style={[styles.sectionTitle, { color: isDarkMode ? colors.white : colors.gray[900] }]}>
            {t('common.virtualPet.petMood')}
          </Text>
        </View>
        
        <View style={localStyles.interactionGrid}>
          {moodOptions.map((mood) => (
            <TouchableOpacity
              key={mood.id}
              style={[
                localStyles.interactionButton,
                { 
                  backgroundColor: isDarkMode ? colors.gray[800] : colors.white,
                  borderColor: petMood === mood.id ? mood.color : 'transparent',
                  borderWidth: petMood === mood.id ? 2 : 0
                }
              ]}
              onPress={() => handleMoodChange(mood.id)}
            >
              <FontAwesome5 name={mood.icon} size={20} color={mood.color} />
              <Text style={[
                localStyles.interactionText,
                { color: isDarkMode ? colors.white : colors.gray[800] }
              ]}>
                {mood.name}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Pet Stats */}
        <View style={[styles.sectionHeader, { marginBottom: 16, marginTop: 24 }]}>
          <Text style={[styles.sectionTitle, { color: isDarkMode ? colors.white : colors.gray[900] }]}>
            {t('common.virtualPet.petStats')}
          </Text>
        </View>
        
        <View style={[localStyles.statsContainer, { backgroundColor: isDarkMode ? colors.gray[800] : colors.white }]}>
          <View style={localStyles.statItem}>
            <FontAwesome5 name="heart" size={16} color={colors.heart.icon} />
            <Text style={[localStyles.statLabel, { color: isDarkMode ? colors.gray[400] : colors.gray[500] }]}>
              {t('common.virtualPet.happiness')}
            </Text>
            <Text style={[localStyles.statValue, { color: isDarkMode ? colors.white : colors.gray[900] }]}>
              85%
            </Text>
          </View>
          <View style={localStyles.statItem}>
            <FontAwesome5 name="star" size={16} color="#FFD93D" />
            <Text style={[localStyles.statLabel, { color: isDarkMode ? colors.gray[400] : colors.gray[500] }]}>
              {t('common.virtualPet.energy')}
            </Text>
            <Text style={[localStyles.statValue, { color: isDarkMode ? colors.white : colors.gray[900] }]}>
              72%
            </Text>
          </View>
          <View style={localStyles.statItem}>
            <FontAwesome5 name="brain" size={16} color="#4ECDC4" />
            <Text style={[localStyles.statLabel, { color: isDarkMode ? colors.gray[400] : colors.gray[500] }]}>
              {t('common.virtualPet.intelligence')}
            </Text>
            <Text style={[localStyles.statValue, { color: isDarkMode ? colors.white : colors.gray[900] }]}>
              68%
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const localStyles = StyleSheet.create({
  petOption: {
    width: 80,
    height: 80,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
    borderWidth: 2,
  },
  petOptionText: {
    fontSize: 12,
    marginTop: 4,
    fontWeight: '500',
  },
  interactionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  interactionButton: {
    width: '48%',
    height: 60,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  interactionText: {
    fontSize: 12,
    marginTop: 4,
    fontWeight: '500',
  },
  statsContainer: {
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statLabel: {
    fontSize: 12,
    marginTop: 4,
    marginBottom: 2,
  },
  statValue: {
    fontSize: 16,
    fontWeight: '600',
  },
}); 