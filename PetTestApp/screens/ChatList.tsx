import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
} from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { useLanguage } from '../contexts/LanguageContext';
import { useTheme } from '../contexts/ThemeContext';
import { colors } from '../constants/Styles';

type Friend = {
  id: string;
  name: string;
  avatar: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
};

// 模拟好友数据
const mockFriends: Friend[] = [
  {
    id: '1',
    name: 'Alice',
    avatar: 'https://i.pravatar.cc/150?img=1',
    lastMessage: 'Hey, how are you?',
    lastMessageTime: '10:30',
    unreadCount: 2,
  },
  {
    id: '2',
    name: 'Bob',
    avatar: 'https://i.pravatar.cc/150?img=2',
    lastMessage: 'See you tomorrow!',
    lastMessageTime: 'Yesterday',
    unreadCount: 0,
  },
  {
    id: '3',
    name: 'Charlie',
    avatar: 'https://i.pravatar.cc/150?img=3',
    lastMessage: 'Thanks for your help!',
    lastMessageTime: '2 hours ago',
    unreadCount: 1,
  },
];

export default function ChatList({ navigation }: any) {
  const { t } = useLanguage();
  const { isDarkMode } = useTheme();

  const renderFriend = ({ item }: { item: Friend }) => (
    <TouchableOpacity
      style={[styles.friendItem, { backgroundColor: isDarkMode ? colors.gray[800] : colors.white }]}
      onPress={() => navigation.navigate('ChatRoom', { friend: item })}
    >
      <Image source={{ uri: item.avatar }} style={styles.avatar} />
      <View style={styles.friendInfo}>
        <View style={styles.nameTimeContainer}>
          <Text style={[styles.name, { color: isDarkMode ? colors.white : colors.gray[800] }]}>
            {item.name}
          </Text>
          <Text style={[styles.time, { color: isDarkMode ? colors.gray[400] : colors.gray[500] }]}>
            {item.lastMessageTime}
          </Text>
        </View>
        <View style={styles.messageContainer}>
          <Text 
            style={[styles.lastMessage, { color: isDarkMode ? colors.gray[300] : colors.gray[600] }]}
            numberOfLines={1}
          >
            {item.lastMessage}
          </Text>
          {item.unreadCount > 0 && (
            <View style={styles.unreadBadge}>
              <Text style={styles.unreadCount}>{item.unreadCount}</Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { backgroundColor: isDarkMode ? colors.gray[900] : colors.white }]}>
      <FlatList
        data={mockFriends}
        renderItem={renderFriend}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContent: {
    padding: 16,
  },
  friendItem: {
    flexDirection: 'row',
    padding: 12,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  friendInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  nameTimeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  time: {
    fontSize: 12,
  },
  messageContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  lastMessage: {
    flex: 1,
    fontSize: 14,
    marginRight: 8,
  },
  unreadBadge: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    minWidth: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  unreadCount: {
    color: colors.white,
    fontSize: 12,
    fontWeight: 'bold',
  },
}); 