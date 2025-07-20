import React from 'react';
import { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, Switch, Alert, StatusBar, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FontAwesome, FontAwesome5 } from '@expo/vector-icons';
// import { useRouter } from 'expo-router';
import { styles, colors } from '../constants/Styles';
import { useLanguage } from '../contexts/LanguageContext';
import { useTheme } from '../contexts/ThemeContext';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../contexts/AuthContext';

interface SettingItemProps {
  icon: string;
  iconBg: string;
  iconColor: string;
  title: string;
  subtitle?: string;
  hasToggle?: boolean;
  toggleValue?: boolean;
  onToggleChange?: (value: boolean) => void;
  showChevron?: boolean;
  onPress?: () => void;
  isLast?: boolean;
}

const Settings = () => {
  // const router = useRouter();
  const { t, currentLanguage, setLanguage } = useLanguage();
  const { isDarkMode, toggleDarkMode } = useTheme();
  const { user, signOut } = useAuth();
  const navigation = useNavigation();
  
  // State for toggle switches
  const [taskReminders, setTaskReminders] = React.useState(true);
  const [socialNotifications, setSocialNotifications] = React.useState(true);
  const [healthAlerts, setHealthAlerts] = React.useState(true);
  
  // State for language selection modal
  const [showLanguageModal, setShowLanguageModal] = React.useState(false);

  // Helper function to create setting items
  const renderSettingItem = ({ 
    icon, 
    iconBg, 
    iconColor, 
    title, 
    subtitle, 
    hasToggle, 
    toggleValue, 
    onToggleChange, 
    showChevron, 
    onPress, 
    isLast 
  }: SettingItemProps) => (
    <View style={[
      styles.flexBetween, 
      { 
        paddingVertical: 12,
        borderBottomWidth: isLast ? 0 : 1,
        borderBottomColor: colors.gray[100],
      }
    ]}>
      <View style={styles.flexStart}>
        <View style={{
          width: 40,
          height: 40,
          borderRadius: 20,
          backgroundColor: iconBg,
          alignItems: 'center',
          justifyContent: 'center',
          marginRight: 12,
        }}>
          <FontAwesome5 name={icon} size={16} color={iconColor} />
        </View>
        <View>
          <Text style={{ fontWeight: '500', fontSize: 16 }}>{title}</Text>
          {subtitle && <Text style={{ fontSize: 14, color: colors.gray[500] }}>{subtitle}</Text>}
        </View>
      </View>
      
      {hasToggle && (
        <Switch
          trackColor={{ false: colors.gray[200], true: colors.primary }}
          thumbColor={colors.white}
          ios_backgroundColor={colors.gray[200]}
          onValueChange={onToggleChange}
          value={toggleValue}
        />
      )}
      
      {showChevron && (
        <TouchableOpacity
          style={{
            width: 32,
            height: 32,
            backgroundColor: colors.gray[100],
            borderRadius: 16,
            alignItems: 'center',
            justifyContent: 'center',
          }}
          onPress={onPress}
        >
          <FontAwesome name="chevron-right" size={12} color={colors.gray[400]} />
        </TouchableOpacity>
      )}
      
      {!hasToggle && !showChevron && (
        <TouchableOpacity
          style={{
            width: 32,
            height: 32,
            backgroundColor: colors.gray[100],
            borderRadius: 16,
            alignItems: 'center',
            justifyContent: 'center',
          }}
          onPress={onPress}
        >
          <FontAwesome name="cog" size={7} color={colors.gray[400]} />
        </TouchableOpacity>
      )}
    </View>
  );

  // Language selection modal
  const renderLanguageModal = () => (
    <Modal
      visible={showLanguageModal}
      transparent
      animationType="slide"
      onRequestClose={() => setShowLanguageModal(false)}
    >
      <View style={{
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'flex-end',
      }}>
        <View style={{
          backgroundColor: colors.white,
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          padding: 20,
        }}>
          <Text style={{
            fontSize: 18,
            fontWeight: '600',
            marginBottom: 20,
            textAlign: 'center',
          }}>
            {t('common.settings.language')}
          </Text>
          
          <TouchableOpacity
            style={{
              paddingVertical: 15,
              borderBottomWidth: 1,
              borderBottomColor: colors.gray[100],
            }}
            onPress={() => {
              setLanguage('zh');
              setShowLanguageModal(false);
            }}
          >
            <Text style={{
              fontSize: 16,
              color: currentLanguage === 'zh' ? colors.primary : colors.gray[900],
              fontWeight: currentLanguage === 'zh' ? '600' : '400',
            }}>
              {t('common.settings.language_zh')}
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={{
              paddingVertical: 15,
            }}
            onPress={() => {
              setLanguage('en');
              setShowLanguageModal(false);
            }}
          >
            <Text style={{
              fontSize: 16,
              color: currentLanguage === 'en' ? colors.primary : colors.gray[900],
              fontWeight: currentLanguage === 'en' ? '600' : '400',
            }}>
              {t('common.settings.language_en')}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );

  return (
    <SafeAreaView style={[styles.safeAreaContainer, { backgroundColor: isDarkMode ? colors.gray[900] : colors.white }]}>
      <StatusBar barStyle={isDarkMode ? "light-content" : "dark-content"} />
      
      <ScrollView 
        style={[styles.content, { backgroundColor: isDarkMode ? colors.gray[900] : colors.white }]} 
        contentContainerStyle={[styles.scrollViewContent, { backgroundColor: isDarkMode ? colors.gray[900] : colors.white }]}
      >
        {/* Header */}
        <View style={[styles.flexBetween, { marginBottom: 24 }]}>
          <Text style={[styles.title, { color: isDarkMode ? colors.white : colors.gray[800] }]}>{t('common.settings.title')}</Text>
        </View>

        {/* User Profile Section */}
        <View style={[styles.card, { marginBottom: 24 }]}>
          <View style={styles.flexBetween}>
            <View style={styles.flexStart}>
              <Image
                source={require('../assets/images/profile-placeholder.png')}
                style={{ width: 64, height: 64, borderRadius: 32, marginRight: 16 }}
              />
              <View style={{ flex: 1, marginRight: 16 }}>
                <Text style={{ fontSize: 18, fontWeight: '600' }}>Alex Johnson</Text>
                <Text 
                  style={{ color: colors.gray[500] }}
                  numberOfLines={1}
                  ellipsizeMode="tail"
                >{user?.email}</Text>
                <TouchableOpacity style={{ marginTop: 4 }} onPress={() => navigation.navigate('EditUserProfile')}>
                  <Text style={{ fontSize: 14, fontWeight: '500', color: colors.primary }}>{t('common.profile.editProfile')}</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>

        {/* Language Settings */}
        <View style={[styles.sectionHeader, { marginBottom: 16 }]}>
          <Text style={[styles.sectionTitle, { color: isDarkMode ? colors.white : colors.gray[900] }]}>{t('common.settings.language')}</Text>
        </View>

        <View style={[styles.card, { backgroundColor: isDarkMode ? colors.gray[800] : colors.white }]}>
          <TouchableOpacity
            style={[
              styles.languageOption,
              { borderBottomColor: isDarkMode ? colors.gray[700] : colors.gray[100] }
            ]}
            onPress={() => {
              setLanguage('en');
              setShowLanguageModal(false);
            }}
          >
            <Text style={[styles.languageText, { color: isDarkMode ? colors.white : colors.gray[900] }]}>English</Text>
            {currentLanguage === 'en' && (
              <FontAwesome5 name="check" size={16} color={colors.primary} />
            )}
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.languageOption}
            onPress={() => {
              setLanguage('zh');
              setShowLanguageModal(false);
            }}
          >
            <Text style={[styles.languageText, { color: isDarkMode ? colors.white : colors.gray[900] }]}>中文</Text>
            {currentLanguage === 'zh' && (
              <FontAwesome5 name="check" size={16} color={colors.primary} />
            )}
          </TouchableOpacity>
        </View>

        {/* Theme Settings */}
        <View style={[styles.sectionHeader, { marginTop: 24, marginBottom: 16 }]}>
          <Text style={[styles.sectionTitle, { color: isDarkMode ? colors.white : colors.gray[900] }]}>{t('common.settings.theme')}</Text>
        </View>

        <View style={[styles.card, { backgroundColor: isDarkMode ? colors.gray[800] : colors.white }]}>
          <View style={[styles.themeOption, { borderBottomColor: isDarkMode ? colors.gray[700] : colors.gray[100] }]}>
            <Text style={[styles.themeText, { color: isDarkMode ? colors.white : colors.gray[900] }]}>{t('common.settings.darkMode')}</Text>
            <Switch
              value={isDarkMode}
              onValueChange={toggleDarkMode}
              trackColor={{ false: colors.gray[300], true: colors.primary }}
              thumbColor={colors.white}
            />
          </View>
        </View>

        {/* Notification Settings */}
        <View style={[styles.sectionHeader, { marginTop: 24, marginBottom: 16 }]}>
          <Text style={[styles.sectionTitle, { color: isDarkMode ? colors.white : colors.gray[900] }]}>{t('common.settings.notifications')}</Text>
        </View>

        <View style={[styles.card, { backgroundColor: isDarkMode ? colors.gray[800] : colors.white }]}>
          <View style={[styles.notificationOption, { 
            borderBottomColor: isDarkMode ? colors.gray[700] : colors.gray[100],
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingVertical: 12,
            paddingHorizontal: 16
          }]}>
            <View style={{ flex: 1, marginRight: 16 }}>
              <Text style={[styles.notificationTitle, { color: isDarkMode ? colors.white : colors.gray[900], fontSize: 14 }]}>{t('common.settings.taskReminders')}</Text>
              <Text style={[styles.notificationDescription, { color: isDarkMode ? colors.gray[400] : colors.gray[500], fontSize: 12 }]}>
                {t('common.settings.taskRemindersDesc')}
              </Text>
            </View>
            <Switch
              value={taskReminders}
              onValueChange={setTaskReminders}
              trackColor={{ false: colors.gray[300], true: colors.primary }}
              thumbColor={colors.white}
            />
          </View>
          <View style={[styles.notificationOption, { 
            borderBottomColor: isDarkMode ? colors.gray[700] : colors.gray[100],
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingVertical: 12,
            paddingHorizontal: 16
          }]}>
            <View style={{ flex: 1, marginRight: 16 }}>
              <Text style={[styles.notificationTitle, { color: isDarkMode ? colors.white : colors.gray[900], fontSize: 14 }]}>{t('common.settings.socialNotifications')}</Text>
              <Text style={[styles.notificationDescription, { color: isDarkMode ? colors.gray[400] : colors.gray[500], fontSize: 12 }]}>
                {t('common.settings.socialNotifications_desc')}
              </Text>
            </View>
            <Switch
              value={socialNotifications}
              onValueChange={setSocialNotifications}
              trackColor={{ false: colors.gray[300], true: colors.primary }}
              thumbColor={colors.white}
            />
          </View>
          <View style={[styles.notificationOption, { 
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingVertical: 12,
            paddingHorizontal: 16
          }]}>
            <View style={{ flex: 1, marginRight: 16 }}>
              <Text style={[styles.notificationTitle, { color: isDarkMode ? colors.white : colors.gray[900], fontSize: 14 }]}>{t('common.settings.healthAlerts')}</Text>
              <Text style={[styles.notificationDescription, { color: isDarkMode ? colors.gray[400] : colors.gray[500], fontSize: 12 }]}>
                {t('common.settings.healthAlerts_desc')}
              </Text>
            </View>
            <Switch
              value={healthAlerts}
              onValueChange={setHealthAlerts}
              trackColor={{ false: colors.gray[300], true: colors.primary }}
              thumbColor={colors.white}
            />
          </View>
        </View>

        {/* Account Settings */}
        <View style={[styles.sectionHeader, { marginTop: 24, marginBottom: 16 }]}>
          <Text style={[styles.sectionTitle, { color: isDarkMode ? colors.white : colors.gray[900] }]}>{t('common.settings.myDevices')}</Text>
        </View>

        <View style={[styles.card, { backgroundColor: isDarkMode ? colors.gray[800] : colors.white }]}>
          {/* GPS Collar */}
          <TouchableOpacity 
            style={[styles.accountOption, { 
              borderBottomColor: isDarkMode ? colors.gray[700] : colors.gray[100],
              paddingVertical: 12
            }]}
            onPress={() => {
              // @ts-ignore
              navigation.navigate('GpsCollarMap');
            }}
          >
            <View style={{ flexDirection: 'column' }}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <FontAwesome5 name="map-marker-alt" size={18} color={colors.primary} style={{ marginRight: 12 }} />
                <Text style={[styles.accountText, { color: isDarkMode ? colors.white : colors.gray[900] }]}>{t('common.settings.deviceList.gpsCollar')}</Text>
              </View>
              <Text style={{ color: colors.primary, fontSize: 13, marginLeft: 30, marginTop: 4 }}>{t('common.settings.deviceStatus.working')}</Text>
            </View>
          </TouchableOpacity>

          {/* Pet Camera */}
          <TouchableOpacity 
            style={[styles.accountOption, { 
              borderBottomColor: isDarkMode ? colors.gray[700] : colors.gray[100],
              paddingVertical: 12
            }]}
            onPress={() => {
              // TODO: Navigate to Pet Camera device page
              console.log('Navigate to Pet Camera');
            }}
          >
            <View style={{ flexDirection: 'column' }}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <FontAwesome5 name="video" size={18} color={colors.primary} style={{ marginRight: 12 }} />
                <Text style={[styles.accountText, { color: isDarkMode ? colors.white : colors.gray[900] }]}>{t('common.settings.deviceList.petCamera')}</Text>
              </View>
              <Text style={{ color: colors.error, fontSize: 13, marginLeft: 30, marginTop: 4 }}>{t('common.settings.deviceStatus.notConnected')}</Text>
            </View>
          </TouchableOpacity>

          {/* Feeder */}
          <TouchableOpacity 
            style={[styles.accountOption, { paddingVertical: 12 }]}
            onPress={() => {
              // TODO: Navigate to Feeder device page
              console.log('Navigate to Feeder');
            }}
          >
            <View style={{ flexDirection: 'column' }}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <FontAwesome5 name="utensils" size={18} color={colors.primary} style={{ marginRight: 12 }} />
                <Text style={[styles.accountText, { color: isDarkMode ? colors.white : colors.gray[900] }]}>{t('common.settings.deviceList.feeder')}</Text>
              </View>
              <Text style={{ color: colors.primary, fontSize: 13, marginLeft: 30, marginTop: 4 }}>{t('common.settings.deviceStatus.working')}</Text>
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>
      
      {renderLanguageModal()}
    </SafeAreaView>
  );
}

export default Settings; 