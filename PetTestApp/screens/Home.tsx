import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StatusBar, Image, SafeAreaView } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { styles, colors } from '../constants/Styles';
import { useLanguage } from '../contexts/LanguageContext';
import { useTheme } from '../contexts/ThemeContext';
import { useNavigation } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

type RootTabParamList = {
  Home: undefined;
  VirtualPet: undefined;
  AddPost: undefined;
  Social: undefined;
  Profile: undefined;
};

type RootStackParamList = {
  PetProfile: undefined;
  Tasks: undefined;
};

type HomeScreenTabNavigationProp = BottomTabNavigationProp<RootTabParamList, 'Home'>;
type HomeScreenStackNavigationProp = NativeStackNavigationProp<RootStackParamList, 'PetProfile'>;

export default function Home() {
  const { t } = useLanguage();
  const { isDarkMode } = useTheme();
  const navigation = useNavigation<HomeScreenTabNavigationProp>();
  const stackNavigation = useNavigation<HomeScreenStackNavigationProp>();

  // 宠物信息数组
  const pets = [
    {
      name: 'Buddy',
      breed: 'Golden Retriever',
      age: 3,
      gender: t('common.home.male'),
      avatar: require('../assets/images/pet-placeholder.png'),
      health: t('common.home.healthy'),
      healthColor: '#2ecc40',
    },
    {
      name: 'Kitty',
      breed: 'British Shorthair',
      age: 2,
      gender: t('common.home.female'),
      avatar: require('../assets/images/pet-placeholder-2.png'),
      health: t('common.home.healthy'),
      healthColor: '#2ecc40',
    },
  ];
  const [currentPetIndex, setCurrentPetIndex] = useState(0);
  const currentPet = pets[currentPetIndex];

  // 宠物卡片组件
  const renderPetCard = () => (
    <View style={{
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: isDarkMode ? colors.gray[800] : '#fff',
      borderRadius: 20,
      padding: 18,
      marginBottom: 18,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.06,
      shadowRadius: 8,
      elevation: 2,
    }}>
      <Image
        source={currentPet.avatar}
        style={{ width: 60, height: 60, borderRadius: 30, marginRight: 16 }}
      />
      <View style={{ flex: 1 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Text style={{ fontSize: 18, fontWeight: 'bold', color: isDarkMode ? '#fff' : '#222' }}>{currentPet.name}</Text>
          <TouchableOpacity
            style={{ marginLeft: 8, padding: 4 }}
            onPress={() => setCurrentPetIndex((currentPetIndex + 1) % pets.length)}
          >
            <FontAwesome5 name="exchange-alt" size={16} color={isDarkMode ? colors.gray[400] : colors.gray[500]} />
          </TouchableOpacity>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4 }}>
          <View style={{ backgroundColor: '#f3f4f6', borderRadius: 8, paddingHorizontal: 8, paddingVertical: 2, marginRight: 6 }}>
            <Text style={{ fontSize: 13, color: '#6c757d' }}>{currentPet.breed}</Text>
          </View>
          <View style={{ backgroundColor: '#fffbe6', borderRadius: 8, paddingHorizontal: 8, paddingVertical: 2, marginRight: 6 }}>
            <Text style={{ fontSize: 13, color: '#f6b100' }}>{currentPet.age} {t('common.home.years')}</Text>
          </View>
          <View style={{ backgroundColor: '#e3f0ff', borderRadius: 8, paddingHorizontal: 8, paddingVertical: 2 }}>
            <Text style={{ fontSize: 13, color: '#3498db' }}><FontAwesome5 name="mars" size={12} color="#3498db" /> {currentPet.gender}</Text>
          </View>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 8 }}>
          <View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: currentPet.healthColor, marginRight: 6 }} />
          <Text style={{ color: currentPet.healthColor, fontWeight: 'bold', fontSize: 15 }}>{currentPet.health}</Text>
        </View>
      </View>
      <TouchableOpacity 
        style={{ marginLeft: 12, backgroundColor: '#f3f4f6', width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' }}
        onPress={() => stackNavigation.navigate('PetProfile')}
      >
        <FontAwesome5 name="chevron-right" size={18} color={isDarkMode ? colors.gray[400] : colors.gray[500]} />
      </TouchableOpacity>
    </View>
  );

  // 顶部欢迎区
  const renderWelcomeSection = () => (
    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
      <View>
        <Text style={{ fontSize: 26, fontWeight: 'bold', color: isDarkMode ? colors.white : colors.gray[900], marginBottom: 2 }}>
          {t('common.home.hello')}, Alex!
        </Text>
        <Text style={{ fontSize: 16, color: isDarkMode ? colors.gray[400] : colors.gray[500] }}>
          {t('common.home.monday')}, 15 {t('common.home.may')}
        </Text>
      </View>
      <TouchableOpacity style={{ marginRight: 2 }} onPress={() => navigation.navigate('Profile')}>
        <Image
          source={{ uri: 'https://randomuser.me/api/portraits/men/32.jpg' }}
          style={{ width: 48, height: 48, borderRadius: 24, borderWidth: 2, borderColor: '#fff' }}
        />
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: isDarkMode ? colors.gray[900] : colors.white }}>
      <StatusBar barStyle={isDarkMode ? "light-content" : "dark-content"} />
      <ScrollView 
        style={{ flex: 1, backgroundColor: isDarkMode ? colors.gray[900] : colors.white }}
        contentContainerStyle={{ padding: 16 }}
        showsVerticalScrollIndicator={false}
      >
        {renderWelcomeSection()}
        {renderPetCard()}

        {/* 健康数据卡片 */}
        <View style={[styles.card, { backgroundColor: isDarkMode ? colors.gray[800] : colors.white }]}>
          <Text style={[styles.subtitle, { color: isDarkMode ? colors.white : colors.gray[800] }]}>{t('common.home.healthData')}</Text>
          <View style={styles.healthStatsContainer}>
            <View style={[styles.healthStatCard, { backgroundColor: isDarkMode ? colors.gray[700] : colors.white }]}>
              <View style={[styles.statIconContainer, { backgroundColor: colors.heart.bg }]}>
                <FontAwesome5 name="heartbeat" size={20} color={colors.heart.icon} />
              </View>
              <Text style={[styles.statLabel, { color: isDarkMode ? colors.gray[400] : colors.gray[500] }]}>{t('common.home.heartRate')}</Text>
              <Text style={[styles.statValue, { color: isDarkMode ? colors.white : colors.gray[900] }]}>72 BPM</Text>
            </View>

            <View style={[styles.healthStatCard, { backgroundColor: isDarkMode ? colors.gray[700] : colors.white }]}>
              <View style={[styles.statIconContainer, { backgroundColor: colors.weight.bg }]}>
                <FontAwesome5 name="weight" size={20} color={colors.weight.icon} />
              </View>
              <Text style={[styles.statLabel, { color: isDarkMode ? colors.gray[400] : colors.gray[500] }]}>{t('common.home.weight')}</Text>
              <Text style={[styles.statValue, { color: isDarkMode ? colors.white : colors.gray[900] }]}>32 kg</Text>
            </View>

            <View style={[styles.healthStatCard, { backgroundColor: isDarkMode ? colors.gray[700] : colors.white }]}>
              <View style={[styles.statIconContainer, { backgroundColor: colors.calories.bg }]}>
                <FontAwesome5 name="fire" size={20} color={colors.calories.icon} />
              </View>
              <Text style={[styles.statLabel, { color: isDarkMode ? colors.gray[400] : colors.gray[500] }]}>{t('common.home.calories')}</Text>
              <Text style={[styles.statValue, { color: isDarkMode ? colors.white : colors.gray[900] }]}>450 kcal</Text>
            </View>
          </View>
        </View>

        {/* 今日任务卡片 */}
        <View style={[styles.card, { backgroundColor: isDarkMode ? colors.gray[800] : colors.white }]}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: isDarkMode ? colors.white : colors.gray[900] }]}>{t('common.home.todayTasks')}</Text>
            <TouchableOpacity onPress={() => stackNavigation.navigate('Tasks')}>
              <Text style={styles.sectionLink}>{t('common.home.viewAll')}</Text>
            </TouchableOpacity>
          </View>

          <View style={[styles.taskContainer, { backgroundColor: isDarkMode ? colors.gray[700] : colors.white }]}>
            <ScrollView style={styles.taskScrollView}>
              <View style={[styles.taskItem, { borderBottomColor: isDarkMode ? colors.gray[600] : colors.gray[100] }]}>
                <View style={[styles.taskIconContainer, { backgroundColor: colors.heart.bg }]}>
                  <FontAwesome5 name="pills" size={20} color={colors.heart.icon} />
                </View>
                <View style={styles.taskContent}>
                  <Text style={[styles.taskTitle, { color: isDarkMode ? colors.white : colors.gray[900] }]}>{t('common.home.takeMedicine')}</Text>
                  <Text style={[styles.taskTime, { color: isDarkMode ? colors.gray[400] : colors.gray[500] }]}>{t('common.home.morning')} 9:00</Text>
                </View>
                <View style={[styles.taskCheckbox, { borderColor: isDarkMode ? colors.gray[500] : colors.gray[300] }]} />
              </View>

              <View style={[styles.taskItem, { borderBottomColor: isDarkMode ? colors.gray[600] : colors.gray[100] }]}>
                <View style={[styles.taskIconContainer, { backgroundColor: colors.weight.bg }]}>
                  <FontAwesome5 name="walking" size={20} color={colors.weight.icon} />
                </View>
                <View style={styles.taskContent}>
                  <Text style={[styles.taskTitle, { color: isDarkMode ? colors.white : colors.gray[900] }]}>{t('common.home.walk')}</Text>
                  <Text style={[styles.taskTime, { color: isDarkMode ? colors.gray[400] : colors.gray[500] }]}>{t('common.home.afternoon')} 4:00</Text>
                </View>
                <View style={[styles.taskCheckbox, { borderColor: isDarkMode ? colors.gray[500] : colors.gray[300] }]} />
              </View>
            </ScrollView>
          </View>
        </View>

        {/* 兽医预约卡片 */}
        <View style={[styles.card, { backgroundColor: isDarkMode ? colors.gray[800] : colors.white }]}>
          <View style={styles.vetVisitHeader}>
            <FontAwesome5 name="hospital" size={20} color={colors.primary} />
            <Text style={[styles.vetTitle, { color: isDarkMode ? colors.white : colors.gray[900] }]}>{t('common.home.nextVetAppointment')}</Text>
          </View>

          <View style={styles.vetInfo}>
            <Text style={[styles.vetDate, { color: isDarkMode ? colors.white : colors.gray[900] }]}>2024 {t('common.home.march')} 15 14:30</Text>
            <Text style={[styles.vetDoctor, { color: isDarkMode ? colors.gray[400] : colors.gray[500] }]}>{t('common.home.drZhang')} - {t('common.home.annualCheckup')}</Text>
          </View>

          <TouchableOpacity style={[styles.rescheduleBtn, { backgroundColor: isDarkMode ? colors.gray[700] : colors.gray[100] }]}>
            <Text style={[styles.rescheduleBtnText, { color: isDarkMode ? colors.gray[300] : colors.gray[700] }]}>{t('common.home.reschedule')}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
} 