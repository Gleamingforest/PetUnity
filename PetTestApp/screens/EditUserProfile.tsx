import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, StatusBar, TextInput, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FontAwesome } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { styles, colors } from '../constants/Styles';
import * as ImagePicker from 'expo-image-picker';
import { useLanguage } from '../contexts/LanguageContext';
import { useTheme } from '../contexts/ThemeContext';

interface UserData {
  name: string;
  email: string;
  phone: string;
  image: any;
}

interface EditingState {
  name: boolean;
  email: boolean;
  phone: boolean;
}

export default function EditUserProfile() {
  const navigation = useNavigation();
  const { t } = useLanguage();
  const { isDarkMode } = useTheme();
  
  const [userData, setUserData] = useState<UserData>({
    name: 'Alex Johnson',
    email: 'alex.johnson@example.com',
    phone: '+1 234 567 8900',
    image: require('../assets/images/profile-placeholder.png'),
  });

  const [isEditing, setIsEditing] = useState<EditingState>({
    name: false,
    email: false,
    phone: false,
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
        setUserData(prev => ({
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
      <Text style={[styles.editFieldLabel, { color: isDarkMode ? colors.white : colors.gray[800] }]}>{label}</Text>
      {isEditing[field] ? (
        <View style={styles.editInputContainer}>
          <TextInput
            style={[styles.editInput, { 
              color: isDarkMode ? colors.white : colors.gray[800],
              backgroundColor: isDarkMode ? colors.gray[800] : colors.white 
            }]}
            value={value}
            onChangeText={(text) => setUserData(prev => ({ ...prev, [field]: text }))}
            autoFocus
          />
          <TouchableOpacity
            style={styles.editButton}
            onPress={() => setIsEditing(prev => ({ ...prev, [field]: false }))}
          >
            <Text style={[styles.editButtonText, { color: colors.primary }]}>{t('common.profile.save')}</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <TouchableOpacity
          style={styles.editableValue}
          onPress={() => setIsEditing(prev => ({ ...prev, [field]: true }))}
        >
          <Text style={[styles.editableValueText, { color: isDarkMode ? colors.gray[300] : colors.gray[600] }]}>{value}</Text>
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
        <Text style={[styles.headerTitle, { color: isDarkMode ? colors.white : colors.gray[900] }]}>{t('common.settings.editProfile')}</Text>
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
            source={userData.image}
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
          {renderEditableField(t('common.profile.name'), userData.name, 'name')}
          {renderEditableField(t('common.auth.email'), userData.email, 'email')}
          {renderEditableField(t('common.profile.phone'), userData.phone, 'phone')}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
} 