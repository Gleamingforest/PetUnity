import { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, StatusBar, StyleSheet, Platform } from 'react-native';
import { FontAwesome, FontAwesome5 } from '@expo/vector-icons';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { styles, colors } from '../constants/Styles';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useLanguage } from '../contexts/LanguageContext';
import { useTheme } from '../contexts/ThemeContext';
import { useFocusEffect } from '@react-navigation/native';
import React from 'react';

type RootStackParamList = {
  ProfileMain: {
    newPet?: {
      id: number;
      name: string;
      breed: string;
      gender: string;
      age: string;
      weight: string;
      microchipId: string;
      image?: { uri: string };
    };
    newHealthRecord?: {
      id: number;
      type: string;
      date: string;
      status: string;
    };
  };
  AddPet: undefined;
  EditProfile: undefined;
  AddHealthRecord: undefined;
};

type ProfileScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'ProfileMain'>;
type ProfileScreenRouteProp = RouteProp<RootStackParamList, 'ProfileMain'>;

type Pet = {
  id: number;
  name: string;
  breed: string;
  gender: string;
  age: string;
  weight: string;
  microchipId: string;
  image?: { uri: string };
};

const localStyles = StyleSheet.create({
  microchipText: {
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    letterSpacing: 0.5,
  },
});

export default function Profile() {
  const [selectedPetIndex, setSelectedPetIndex] = useState(0);
  const [pets, setPets] = useState<Pet[]>([
    {
      id: 1,
      name: 'Buddy',
      breed: 'Golden Retriever',
      gender: 'male',
      age: '3 years 2 months',
      weight: '32 kg',
      microchipId: '985-1210-3328-4767',
    },
    {
      id: 2,
      name: 'Kitty',
      breed: 'Persian Cat',
      gender: 'female',
      age: '2 years 5 months',
      weight: '4.5 kg',
      microchipId: '985-1210-3328-4768',
    },
  ]);

  const [healthRecords, setHealthRecords] = useState([
    {
      id: 1,
      type: 'Rabies Vaccine',
      date: '',
      status: 'valid',
    },
    {
      id: 2,
      type: 'Annual Physical Examination',
      date: '2023-03-20',
      status: 'normal',
    },
  ]);

  const navigation = useNavigation<ProfileScreenNavigationProp>();
  const route = useRoute<ProfileScreenRouteProp>();
  const { t } = useLanguage();
  const { isDarkMode } = useTheme();

  useEffect(() => {
    // Load pets from AsyncStorage
    loadPets();
  }, []);

  useEffect(() => {
    // Handle new pet data from AddPet screen
    if (route.params?.newPet) {
      const newPet = route.params.newPet;
      setPets(currentPets => {
        const updatedPets = [...currentPets, newPet];
        savePets(updatedPets);
        return updatedPets;
      });
      setSelectedPetIndex(pets.length); // Select the newly added pet
    }
  }, [route.params?.newPet]);

  useFocusEffect(
    React.useCallback(() => {
      if (route.params?.newHealthRecord) {
        setHealthRecords(prev => [...prev, route.params.newHealthRecord]);
        // 清除参数，避免重复添加
        navigation.setParams({ newHealthRecord: undefined });
      }
    }, [route.params?.newHealthRecord])
  );

  const loadPets = async () => {
    try {
      const savedPets = await AsyncStorage.getItem('pets');
      if (savedPets) {
        setPets(JSON.parse(savedPets));
      }
    } catch (error) {
      console.error('Error loading pets:', error);
    }
  };

  const savePets = async (petsToSave: typeof pets) => {
    try {
      await AsyncStorage.setItem('pets', JSON.stringify(petsToSave));
    } catch (error) {
      console.error('Error saving pets:', error);
    }
  };

  const selectedPet = pets[selectedPetIndex];

  return (
    <View style={[styles.container, { backgroundColor: isDarkMode ? colors.gray[900] : colors.white }]}>
      <StatusBar barStyle={isDarkMode ? "light-content" : "dark-content"} />
      <ScrollView 
        style={[styles.content, { backgroundColor: isDarkMode ? colors.gray[900] : colors.white }]}
        contentContainerStyle={{ padding: 16 }}
      >

        
        <TouchableOpacity 
          style={[styles.addButton, { backgroundColor: isDarkMode ? colors.gray[800] : colors.white }]}
          onPress={() => navigation.navigate('AddPet')}
        >
          <FontAwesome5 name="plus" size={20} color={colors.primary} />
          <Text style={[styles.addButtonText, { color: isDarkMode ? colors.white : colors.gray[800] }]}>
            {t('common.profile.addPet')}
          </Text>
        </TouchableOpacity>

        {/* 宠物选择器 */}
        <View>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingRight: 20 }}
          >
            {pets.map((pet, index) => (
              <TouchableOpacity
                key={pet.id}
                onPress={() => setSelectedPetIndex(index)}
                style={{
                  marginRight: 16,
                  opacity: index === selectedPetIndex ? 1 : 0.6,
                }}
              >
                <View style={{ 
                  width: 80, 
                  height: 80, 
                  borderRadius: 40,
                  backgroundColor: isDarkMode ? colors.gray[800] : colors.gray[100],
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: 8,
                  borderWidth: index === selectedPetIndex ? 3 : 0,
                  borderColor: colors.primary,
                }}>
                  {pet.image ? (
                    <Image 
                      source={pet.image} 
                      style={{ width: 80, height: 80, borderRadius: 40 }}
                    />
                  ) : (
                    <FontAwesome5 
                      name={pet.breed.includes('猫') ? 'cat' : 'dog'} 
                      size={32} 
                      color={isDarkMode ? colors.gray[400] : colors.gray[500]} 
                    />
                  )}
                </View>
                <Text style={{
                  textAlign: 'center',
                  fontSize: 16,
                  fontWeight: index === selectedPetIndex ? '600' : '400',
                  color: isDarkMode ? colors.white : colors.gray[800],
                }}>
                  {pet.name}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* 基本信息卡片 */}
        <View style={[styles.card, { backgroundColor: isDarkMode ? colors.gray[800] : colors.white }]}>
          <View style={[styles.flexBetween, { marginBottom: 16 }]}>
            <Text style={[styles.subtitle, { color: isDarkMode ? colors.white : colors.gray[800] }]}>{t('common.profile.basicInfo')}</Text>
            <TouchableOpacity onPress={() => navigation.navigate('EditProfile')}>
              <FontAwesome name="pencil" size={16} color={colors.primary} />
            </TouchableOpacity>
          </View>
          <View style={{ marginTop: 16 }}>
            <View style={styles.infoRow}>
              <Text style={[styles.infoLabel, { color: isDarkMode ? colors.white : colors.gray[800] }]}>{t('common.profile.breed')}</Text>
              <Text style={[styles.infoValue, { color: isDarkMode ? colors.gray[300] : colors.gray[600] }]}>{selectedPet.breed}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={[styles.infoLabel, { color: isDarkMode ? colors.white : colors.gray[800] }]}>{t('common.profile.gender')}</Text>
              <Text style={[styles.infoValue, { color: isDarkMode ? colors.gray[300] : colors.gray[600] }]}>{selectedPet.gender}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={[styles.infoLabel, { color: isDarkMode ? colors.white : colors.gray[800] }]}>{t('common.profile.age')}</Text>
              <Text style={[styles.infoValue, { color: isDarkMode ? colors.gray[300] : colors.gray[600] }]}>{selectedPet.age}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={[styles.infoLabel, { color: isDarkMode ? colors.white : colors.gray[800] }]}>{t('common.profile.weight')}</Text>
              <Text style={[styles.infoValue, { color: isDarkMode ? colors.gray[300] : colors.gray[600] }]}>{selectedPet.weight}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={[styles.infoLabel, { color: isDarkMode ? colors.white : colors.gray[800] }]}>{t('common.profile.microchipId')}</Text>
              <Text
                style={[styles.infoValue, localStyles.microchipText, { flexShrink: 1 }]}
                numberOfLines={1}
                ellipsizeMode="middle"
              >
                {selectedPet.microchipId}
              </Text>
            </View>
          </View>
        </View>

        {/* 健康记录卡片 */}
        <View style={[styles.card, { backgroundColor: isDarkMode ? colors.gray[800] : colors.white, marginBottom: 24 }]}>
          <View style={[styles.flexBetween, { marginBottom: 16 }]}>
            <Text style={[styles.subtitle, { color: isDarkMode ? colors.white : colors.gray[800] }]}>Health Records</Text>
            <TouchableOpacity onPress={() => navigation.navigate('AddHealthRecord')}>
              <Text style={{ color: colors.primary, fontSize: 14 }}>Add</Text>
            </TouchableOpacity>
          </View>
          
          {healthRecords.map(record => (
            <View key={record.id} style={[styles.healthRecord, { backgroundColor: isDarkMode ? colors.gray[700] : colors.white }]}>
              <View style={styles.healthRecordHeader}>
                <FontAwesome5 name="syringe" size={16} color={colors.primary} />
                <Text style={[styles.healthRecordTitle, { color: isDarkMode ? colors.white : colors.gray[800] }]}>{record.type}</Text>
              </View>
              <Text style={[styles.healthRecordDate, { color: isDarkMode ? colors.gray[400] : colors.gray[500] }]}>{record.date}</Text>
              <View style={[styles.healthRecordStatus, { backgroundColor: isDarkMode ? colors.gray[600] : '#E8F5E9' }]}>
                <Text style={{ color: isDarkMode ? colors.gray[300] : '#2E7D32', fontSize: 12 }}>{record.status}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* 饮食信息卡片 */}
        <View style={[styles.card, { backgroundColor: isDarkMode ? colors.gray[800] : colors.white, marginBottom: 24 }]}>
          <Text style={[styles.subtitle, { color: isDarkMode ? colors.white : colors.gray[800] }]}>Diet Information</Text>
          
          <View style={[styles.dietInfo, { flexDirection: 'column' }]}>
            {/* Daily Food */}
            <View style={styles.dietItem}>
              <FontAwesome5 name="utensils" size={16} color={colors.primary} />
              <View style={{ marginLeft: 12 }}>
                <Text style={[styles.dietTitle, { color: isDarkMode ? colors.white : colors.gray[800] }]}>Daily Food</Text>
                <Text
                  style={[styles.dietDescription, { flexShrink: 1 }]}
                  numberOfLines={1}
                  ellipsizeMode="tail"
                >
                  Premium Dog Food 300g × 2
                </Text>
              </View>
            </View>

            {/* Allergens */}
            <View style={[styles.dietItem, { marginTop: 8 }]}> 
              <FontAwesome5 name="exclamation-triangle" size={16} color={colors.primary} />
              <View style={{ marginLeft: 12 }}>
                <Text style={[styles.dietTitle, { color: isDarkMode ? colors.white : colors.gray[800] }]}>Allergens</Text>
                <Text
                  style={[styles.dietDescription, { flexShrink: 1 }]}
                  numberOfLines={1}
                  ellipsizeMode="tail"
                >
                  Chicken, Wheat
                </Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
} 