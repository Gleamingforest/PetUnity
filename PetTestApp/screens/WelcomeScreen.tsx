import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useLanguage } from '../contexts/LanguageContext';

interface WelcomeScreenProps {
  userEmail: string;
  onLogout: () => void;
  onEnterMainMenu: () => void;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ userEmail, onLogout, onEnterMainMenu }) => {
  const { t } = useLanguage();

  return (
    <View style={styles.container}>
      <Text style={styles.welcomeTitle}>{t('common.welcome.welcome')}</Text>
      <Text style={styles.welcomeText}>{t('common.welcome.welcome')} {userEmail}</Text>
      
      <TouchableOpacity style={styles.menuButton} onPress={onEnterMainMenu}>
        <Text style={styles.buttonText}>{t('common.welcome.enterMainMenu')}</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.logoutButton} onPress={onLogout}>
        <Text style={styles.buttonText}>{t('common.welcome.logout')}</Text>
      </TouchableOpacity>
      
      <StatusBar style="auto" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  welcomeTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#007AFF',
  },
  welcomeText: {
    fontSize: 18,
    marginBottom: 30,
    color: '#333',
  },
  menuButton: {
    width: '100%',
    height: 50,
    backgroundColor: '#007AFF',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  logoutButton: {
    width: '100%',
    height: 50,
    backgroundColor: '#FF3B30',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default WelcomeScreen; 