import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, StatusBar, TextInput, Alert, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FontAwesome } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { styles, colors } from '../constants/Styles';
import * as ImagePicker from 'expo-image-picker';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

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
  };
  AddPet: undefined;
};

type AddPetScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'AddPet'>;

interface PetData {
  name: string;
  breed: string;
  gender: string;
  birthDate: string;
  weight: string;
  microchipId: string;
  image: any;
}

interface EditingState {
  name: boolean;
  breed: boolean;
  gender: boolean;
  birthDate: boolean;
  weight: boolean;
  microchipId: boolean;
}

const localStyles = StyleSheet.create({
  profileImageContainer: {
    alignItems: 'center',
    marginVertical: 16,
  },
  profileImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#eee',
  },
  changePhotoButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    borderRadius: 16,
    paddingVertical: 4,
    paddingHorizontal: 10,
    minHeight: 28,
    marginTop: 8,
  },
  changePhotoText: {
    color: '#fff',
    marginLeft: 6,
    fontSize: 12,
  },
  editContainer: {
    marginTop: 16,
    marginBottom: 16,
    paddingHorizontal: 8,
  },
});

export default function AddPet() {
  const navigation = useNavigation<AddPetScreenNavigationProp>();
  
  const [petData, setPetData] = useState<PetData>({
    name: '',
    breed: '',
    gender: '',
    birthDate: '',
    weight: '',
    microchipId: '',
    image: require('../assets/images/pet-placeholder.png'),
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
      Alert.alert('Error', 'Failed to select image');
    }
  };

  const handleSave = () => {
    // 验证必填字段
    if (!petData.name || !petData.breed || !petData.gender) {
      Alert.alert('Error', 'Please fill in the pet\'s name, breed and gender');
      return;
    }

    // 计算年龄
    const age = petData.birthDate ? calculateAge(petData.birthDate) : 'Unknown';

    // 创建新宠物对象
    const newPet = {
      id: Date.now(), // 使用时间戳作为临时ID
      name: petData.name,
      breed: petData.breed,
      gender: petData.gender,
      age: age,
      weight: petData.weight ? `${petData.weight} kg` : 'Unknown',
      microchipId: petData.microchipId || 'Unknown',
      image: petData.image !== require('../assets/images/pet-placeholder.png') ? petData.image : undefined
    };

    // 返回到个人页面并传递新宠物数据
    navigation.navigate('ProfileMain', { newPet });
  };

  const calculateAge = (birthDate: string) => {
    try {
      const birth = new Date(birthDate);
      const now = new Date();
      const years = now.getFullYear() - birth.getFullYear();
      const months = now.getMonth() - birth.getMonth();
      
      if (months < 0) {
        return `${years - 1} years ${months + 12} months`;
      }
      return `${years} years ${months} months`;
    } catch {
      return 'Unknown';
    }
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
            <Text style={styles.editButtonText}>Done</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <TouchableOpacity
          style={styles.editableValue}
          onPress={() => setIsEditing(prev => ({ ...prev, [field]: true }))}
        >
          <Text style={[
            styles.editableValueText,
            !value && { color: colors.gray[400], fontStyle: 'italic' }
          ]}>
            {value || 'Click to input'}
          </Text>
          <FontAwesome name="pencil" size={14} color={colors.gray[400]} />
        </TouchableOpacity>
      )}
    </View>
  );

  return (
    <SafeAreaView style={styles.safeAreaContainer}>
      <StatusBar barStyle="dark-content" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={[styles.backButton, { width: 20, height: 20, borderRadius: 10 }]}
          onPress={() => navigation.goBack()}
        >
          <FontAwesome name="arrow-left" size={8} color={colors.gray[500]} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Add Pet</Text>
        <TouchableOpacity
          style={styles.saveButton}
          onPress={handleSave}
        >
          <Text style={styles.saveButtonText}>Save</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} contentContainerStyle={styles.scrollViewContent}>
        {/* Profile Image */}
        <View style={localStyles.profileImageContainer}>
          <Image
            source={petData.image}
            style={localStyles.profileImage}
          />
          <TouchableOpacity
            style={localStyles.changePhotoButton}
            onPress={pickImage}
          >
            <FontAwesome name="camera" size={14} color={colors.white} />
            <Text style={localStyles.changePhotoText}>Add Photo</Text>
          </TouchableOpacity>
        </View>

        {/* Edit Fields */}
        <View style={localStyles.editContainer}>
          {renderEditableField('Name *', petData.name, 'name')}
          {renderEditableField('Breed *', petData.breed, 'breed')}
          {renderEditableField('Gender *', petData.gender, 'gender')}
          {renderEditableField('Birth Date', petData.birthDate, 'birthDate')}
          {renderEditableField('Weight (kg)', petData.weight, 'weight')}
          {renderEditableField('Microchip ID', petData.microchipId, 'microchipId')}
        </View>

        <Text style={[styles.editFieldLabel, { margin: 16, opacity: 0.5 }]}>
          * is required
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
} 