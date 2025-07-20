// src/screens/Notifications.tsx
import React, { useEffect } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { useLanguage } from '../contexts/LanguageContext';
import { useTheme } from '../contexts/ThemeContext';
import { colors } from '../constants/Styles';

const mockNotifications = [
  { id: '1', title: 'Welcome!', content: 'Thanks for using our app.', read: false },
  { id: '2', title: 'Update', content: 'New features are available.', read: false },
];

export default function Notifications({ route, navigation }) {
  const { t } = useLanguage();
  const { isDarkMode } = useTheme();

  useEffect(() => {
    // 进入页面时自动标记为已读
    if (route.params?.markAllAsRead) {
      route.params.markAllAsRead();
    }
  }, []);

  return (
    <View style={[styles.container, { backgroundColor: isDarkMode ? colors.gray[900] : colors.white }]}>
      <Text style={[styles.title, { color: isDarkMode ? colors.white : colors.gray[900] }]}>{t('common.notifications.systemNotification')}</Text>
      <FlatList
        data={mockNotifications}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={[styles.notificationItem, { backgroundColor: isDarkMode ? colors.gray[800] : colors.gray[100] }]}>
            <Text style={[styles.notificationTitle, { color: isDarkMode ? colors.white : colors.gray[900] }]}>{item.title}</Text>
            <Text style={[styles.notificationContent, { color: isDarkMode ? colors.gray[400] : colors.gray[600] }]}>{item.content}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 16 },
  notificationItem: { marginBottom: 16, padding: 12, borderRadius: 8 },
  notificationTitle: { fontWeight: 'bold', fontSize: 16 },
  notificationContent: { fontSize: 14 },
});