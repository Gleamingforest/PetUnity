import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FontAwesome, FontAwesome5 } from '@expo/vector-icons';
import { styles, colors } from '../constants/Styles';
import { useTasks } from '../contexts/TaskContext';
import { useFocusEffect } from '@react-navigation/native';
import { useNavigation } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { useLanguage } from '../contexts/LanguageContext';
import { useTheme } from '../contexts/ThemeContext';

type RootTabParamList = {
  Home: undefined;
  Profile: undefined;
  Social: undefined;
  Tasks: undefined;
  Settings: undefined;
  Notifications: undefined;
};

type NavigationProp = BottomTabNavigationProp<RootTabParamList>;

type RootStackParamList = {
  Main: undefined;
  Notifications: { markAllAsRead: () => void } | undefined;
  SystemNotification: { markAllAsRead: () => void } | undefined;
  // ...其他页面
};

export default function MainMenu() {
  const { tasks, toggleTask, loadTasks } = useTasks();
  const tabNavigation = useNavigation();
  const stackNavigation = tabNavigation.getParent();
  const { t, currentLanguage } = useLanguage();
  const { isDarkMode } = useTheme();
  
  const currentDate = new Date().toLocaleDateString(
    currentLanguage === 'zh' ? 'zh-CN' : 'en-US',
    {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'long',
    }
  );

  const [hasUnread, setHasUnread] = useState(true);

  useFocusEffect(
    React.useCallback(() => {
      const loadData = async () => {
        await loadTasks();
      };
      loadData();
    }, [])
  );

  const handleViewAllTasks = () => {
    tabNavigation.navigate('Tasks');
  };

  const handleBellPress = () => {
    setHasUnread(false);
    stackNavigation?.navigate('SystemNotification', {
      markAllAsRead: () => setHasUnread(false),
    });
  };

  return (
    <SafeAreaView style={[styles.safeAreaContainer, { backgroundColor: isDarkMode ? colors.gray[900] : colors.white }]}>
      <StatusBar barStyle={isDarkMode ? "light-content" : "dark-content"} />
      <ScrollView 
        style={[styles.content, { backgroundColor: isDarkMode ? colors.gray[900] : colors.white }]} 
        contentContainerStyle={[styles.scrollViewContent, { backgroundColor: isDarkMode ? colors.gray[900] : colors.white }]}
      >
        {/* Header */}
        <View style={[styles.flexBetween, { marginBottom: 24 }]}>
          <View>
            <Text style={[styles.title, { color: isDarkMode ? colors.white : colors.gray[800] }]}>{t('common.welcome.welcome')}</Text>
            <Text style={[styles.subtitle, { color: isDarkMode ? colors.gray[400] : colors.gray[500] }]}>{currentDate}</Text>
          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center' }}>
            <TouchableOpacity
              style={{
                width: 40,
                height: 40,
                backgroundColor: '#f3f4f6',
                borderRadius: 20,
                alignItems: 'center',
                justifyContent: 'center',
              }}
              onPress={handleBellPress}
            >
              <FontAwesome name="bell" size={16} color="#666" />
              {hasUnread && (
                <View style={{
                  position: 'absolute',
                  top: 6,
                  right: 6,
                  width: 10,
                  height: 10,
                  borderRadius: 5,
                  backgroundColor: 'red',
                  borderWidth: 1,
                  borderColor: '#fff',
                }} />
              )}
            </TouchableOpacity>
          </View>
        </View>

        {/* Health Stats */}
        <View style={styles.healthStatsContainer}>
          <View style={[styles.healthStatCard, { backgroundColor: isDarkMode ? colors.gray[800] : colors.white }]}>
            <View style={[styles.statIconContainer, { backgroundColor: colors.heart.bg }]}>
              <FontAwesome5 name="heartbeat" size={20} color={colors.heart.icon} />
            </View>
            <Text style={[styles.statLabel, { color: isDarkMode ? colors.gray[400] : colors.gray[500] }]}>{t('common.profile.heartRate')}</Text>
            <Text style={[styles.statValue, { color: isDarkMode ? colors.white : colors.gray[900] }]}>72 BPM</Text>
          </View>
          <View style={[styles.healthStatCard, { backgroundColor: isDarkMode ? colors.gray[800] : colors.white }]}>
            <View style={[styles.statIconContainer, { backgroundColor: colors.weight.bg }]}>
              <FontAwesome5 name="weight" size={20} color={colors.weight.icon} />
            </View>
            <Text style={[styles.statLabel, { color: isDarkMode ? colors.gray[400] : colors.gray[500] }]}>{t('common.profile.weight')}</Text>
            <Text style={[styles.statValue, { color: isDarkMode ? colors.white : colors.gray[900] }]}>12.5 kg</Text>
          </View>
          <View style={[styles.healthStatCard, { backgroundColor: isDarkMode ? colors.gray[800] : colors.white }]}>
            <View style={[styles.statIconContainer, { backgroundColor: colors.calories.bg }]}>
              <FontAwesome5 name="fire" size={20} color={colors.calories.icon} />
            </View>
            <Text style={[styles.statLabel, { color: isDarkMode ? colors.gray[400] : colors.gray[500] }]}>{t('common.profile.calories')}</Text>
            <Text style={[styles.statValue, { color: isDarkMode ? colors.white : colors.gray[900] }]}>320 kcal</Text>
          </View>
        </View>

        {/* Today's Tasks */}
        <View style={[styles.sectionHeader, { marginTop: 8 }]}>
          <Text style={[styles.sectionTitle, { color: isDarkMode ? colors.white : colors.gray[900] }]}>{t('common.tasks.todayTasks')}</Text>
          <TouchableOpacity onPress={handleViewAllTasks}>
            <Text style={styles.sectionLink}>{t('common.tasks.viewAll')}</Text>
          </TouchableOpacity>
        </View>

        <View style={[styles.taskContainer, { backgroundColor: isDarkMode ? colors.gray[800] : colors.white }]}>
          <ScrollView 
            style={styles.taskScrollView}
            showsVerticalScrollIndicator={false}
            nestedScrollEnabled={true}
          >
            {tasks.map((task, index) => (
              <View 
                key={task.id} 
                style={[
                  styles.taskItem, 
                  { borderBottomColor: isDarkMode ? colors.gray[700] : colors.gray[100] },
                  index === tasks.length - 1 ? { borderBottomWidth: 0 } : null
                ]}
              >
                <View style={[styles.taskIconContainer, { backgroundColor: task.iconBg }]}>
                  <FontAwesome5 name={task.icon} size={16} color={task.iconColor} />
                </View>
                <View style={styles.taskContent}>
                  <Text style={[
                    styles.taskTitle,
                    { color: isDarkMode ? colors.white : colors.gray[900] },
                    task.completed && { textDecorationLine: 'line-through', color: isDarkMode ? colors.gray[500] : colors.gray[400] }
                  ]}>
                    {task.title}
                  </Text>
                  <Text style={[styles.taskTime, { color: isDarkMode ? colors.gray[400] : colors.gray[500] }]}>{task.time}</Text>
                </View>
                <TouchableOpacity 
                  style={[
                    styles.taskCheckbox,
                    { borderColor: isDarkMode ? colors.gray[500] : colors.gray[300] },
                    task.completed && { backgroundColor: colors.primary }
                  ]}
                  onPress={() => toggleTask(task.id)}
                >
                  {task.completed && (
                    <FontAwesome name="check" size={12} color={colors.white} />
                  )}
                </TouchableOpacity>
              </View>
            ))}
          </ScrollView>
        </View>

        {/* Vet Visit */}
        <View style={[styles.sectionHeader, { marginTop: 24 }]}>
          <Text style={[styles.sectionTitle, { color: isDarkMode ? colors.white : colors.gray[900] }]}>{t('common.profile.vetVisit')}</Text>
        </View>

        <View style={[styles.vetVisitCard, { backgroundColor: isDarkMode ? colors.gray[800] : colors.white }]}>
          <View style={styles.vetVisitHeader}>
            <FontAwesome name="calendar" size={20} style={[styles.vetIcon, { color: isDarkMode ? colors.white : colors.gray[800] }]} />
            <Text style={[styles.vetTitle, { color: isDarkMode ? colors.white : colors.gray[900] }]}>{t('common.profile.nextAppointment')}</Text>
          </View>
          <View style={styles.vetInfo}>
            <Text style={[styles.vetDate, { color: isDarkMode ? colors.white : colors.gray[900] }]}>{t('common.profile.appointmentDate')}</Text>
            <Text style={[styles.vetDoctor, { color: isDarkMode ? colors.gray[400] : colors.gray[500] }]}>{t('common.profile.doctorInfo')}</Text>
          </View>
          <TouchableOpacity style={[styles.rescheduleBtn, { backgroundColor: isDarkMode ? colors.gray[700] : colors.gray[100] }]}>
            <Text style={[styles.rescheduleBtnText, { color: isDarkMode ? colors.gray[300] : colors.gray[700] }]}>{t('common.profile.reschedule')}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
} 