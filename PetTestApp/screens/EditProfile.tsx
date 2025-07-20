import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, StatusBar, TextInput, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FontAwesome } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { styles, colors } from '../constants/Styles';
import * as ImagePicker from 'expo-image-picker';
import { useLanguage } from '../contexts/LanguageContext';
import { useTheme } from '../contexts/ThemeContext';

interface PetData {
  name: string;
  breed: string;
  gender: string;
  birthDate: string;
  weight: string;
  microchipId: string;
  image: any; // 这里使用 any 是因为图片源可以是 require 或 uri
}

interface EditingState {
  name: boolean;
  breed: boolean;
  gender: boolean;
  birthDate: boolean;
  weight: boolean;
  microchipId: boolean;
}

export default function EditProfile() {
  const navigation = useNavigation();
  const { t } = useLanguage();
  const { isDarkMode } = useTheme();
  
  const [petData, setPetData] = useState<PetData>({
    name: 'Buddy',
    breed: 'Golden Retriever',
    gender: 'Male',
    birthDate: 'Mar 12, 2020',
    weight: '32',
    microchipId: '985-1210-3328-4767',
    image: require('../../assets/pet-placeholder.png'),
  });

  const [isEditing, setIsEditing] = useState<EditingState>({
    name: false,
    breed: false,
    gender: false,
    birthDate: false,
    weight: false,
    microchipId: false,
  });

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });

      if (!result.canceled) {
        setPetData(prev => ({
          ...prev,
          image: { uri: result.assets[0].uri }
        }));
      }
    } catch (error) {
      Alert.alert(t('common.profile.errors.imageError'), t('common.profile.errors.imageErrorDesc'));
    }
  };

  const handleSave = () => {
    Alert.alert(
      t('common.profile.success'),
      t('common.profile.updateSuccess'),
      [
        {
          text: t('common.profile.confirm'),
          onPress: () => navigation.goBack()
        }
      ]
    );
  };

  const renderEditableField = (label: string, value: string, field: keyof EditingState) => (
    <View style={styles.editField}>
      <Text style={styles.editFieldLabel}>{label}</Text>
      {isEditing[field] ? (
        <View style={styles.editInputContainer}>
          <TextInput
            style={styles.editInput}
            value={value}
            onChangeText={(text) => setPetData(prev => ({ ...prev, [field]: text }))}
            autoFocus
          />
          <TouchableOpacity
            style={styles.editButton}
            onPress={() => setIsEditing(prev => ({ ...prev, [field]: false }))}
          >
            <Text style={styles.editButtonText}>完成</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <TouchableOpacity
          style={styles.editableValue}
          onPress={() => setIsEditing(prev => ({ ...prev, [field]: true }))}
        >
          <Text style={styles.editableValueText}>{value}</Text>
          <FontAwesome name="pencil" size={14} color={colors.gray[400]} />
        </TouchableOpacity>
      )}
    </View>
  );

  return (
    <SafeAreaView style={[styles.safeAreaContainer, { backgroundColor: isDarkMode ? colors.gray[900] : colors.white }]}>
      <StatusBar barStyle={isDarkMode ? "light-content" : "dark-content"} />
      
      {/* Header */}
      <View style={[styles.header, { backgroundColor: isDarkMode ? colors.gray[800] : colors.white }]}>
        <TouchableOpacity
          style={[styles.backButton, { width: 20, height: 20, borderRadius: 10 }]}
          onPress={() => navigation.goBack()}
        >
          <FontAwesome name="arrow-left" size={8} color={isDarkMode ? colors.gray[400] : colors.gray[500]} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: isDarkMode ? colors.white : colors.gray[900] }]}>{t('common.profile.editProfile')}</Text>
        <TouchableOpacity
          style={styles.saveButton}
          onPress={handleSave}
        >
          <Text style={[styles.saveButtonText, { color: colors.primary }]}>{t('common.profile.save')}</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} contentContainerStyle={styles.scrollViewContent}>
        {/* Profile Image */}
        <View style={styles.profileImageContainer}>
          <Image
            source={petData.image}
            style={styles.profileImage}
          />
          <TouchableOpacity
            style={styles.changePhotoButton}
            onPress={pickImage}
          >
            <FontAwesome name="camera" size={16} color={colors.white} />
            <Text style={styles.changePhotoText}>{t('common.profile.changePhoto')}</Text>
          </TouchableOpacity>
        </View>

        {/* Edit Fields */}
        <View style={styles.editContainer}>
          {renderEditableField(t('common.profile.name'), petData.name, 'name')}
          {renderEditableField(t('common.profile.breed'), petData.breed, 'breed')}
          {renderEditableField(t('common.profile.gender'), petData.gender, 'gender')}
          {renderEditableField(t('common.profile.birthDate'), petData.birthDate, 'birthDate')}
          {renderEditableField(t('common.profile.weight'), petData.weight, 'weight')}
          {renderEditableField(t('common.profile.microchipId'), petData.microchipId, 'microchipId')}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
} 