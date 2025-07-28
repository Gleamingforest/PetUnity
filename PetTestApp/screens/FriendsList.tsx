import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  StyleSheet,
  Alert,
  ActivityIndicator,
  TextInput,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FontAwesome5 } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { colors } from '../constants/Styles';
import { useTheme } from '../contexts/ThemeContext';
import { useLanguage } from '../contexts/LanguageContext';
import { friendService, Friend, FriendRequest, User } from '../services/FriendService';
import { auth } from '../firebase';
import { onAuthStateChanged } from 'firebase/auth';

type RootStackParamList = {
  ChatRoom: { chatId: string; otherUserId: string; otherUserName: string };
};

type FriendsListScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'ChatRoom'>;

export default function FriendsList() {
  const navigation = useNavigation<FriendsListScreenNavigationProp>();
  const { isDarkMode } = useTheme();
  const { t } = useLanguage();
  
  // 标签页状态
  const [activeTab, setActiveTab] = useState<'friends' | 'search' | 'requests'>('friends');
  
  // 好友列表状态
  const [friends, setFriends] = useState<Friend[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  
  // 搜索好友状态
  const [searchText, setSearchText] = useState('');
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [searching, setSearching] = useState(false);
  
  // 好友请求状态
  const [friendRequests, setFriendRequests] = useState<FriendRequest[]>([]);
  const [requestsLoading, setRequestsLoading] = useState(false);

  // 监听用户登录状态变化
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUserId(user?.uid || null);
      
      if (user) {
        loadFriendsData(user.uid);
      } else {
        setFriends([]);
        setLoading(false);
      }
    });

    return unsubscribe;
  }, []);

  // 加载好友数据的函数
  const loadFriendsData = async (userId: string) => {
    try {
      setLoading(true);
      const friendsList = await friendService.getFriends(userId);
      setFriends(friendsList);
    } catch (error) {
      Alert.alert(t('common.friends.errors.loadFriends'));
    } finally {
      setLoading(false);
    }
  };

  // 设置好友列表监听器
  useEffect(() => {
    if (!currentUserId) {
      return;
    }

    // 监听好友列表变化
    const unsubscribe = friendService.onFriends(currentUserId, (updatedFriends) => {
      setFriends(updatedFriends);
    });

    return unsubscribe;
  }, [currentUserId]);

  // 设置好友请求监听器
  useEffect(() => {
    if (!currentUserId) {
      return;
    }

    // 监听好友请求变化
    const unsubscribe = friendService.onFriendRequests(currentUserId, (requests) => {
      setFriendRequests(requests);
    });

    return unsubscribe;
  }, [currentUserId]);

  // 搜索用户功能
  const searchUsers = async () => {
    if (!searchText.trim()) {
      setSearchResults([]);
      return;
    }

    setSearching(true);
    try {
      const results = await friendService.searchUsers(searchText.trim());
      setSearchResults(results);
    } catch (error) {
      Alert.alert(t('common.friends.errors.searchFailed'));
    } finally {
      setSearching(false);
    }
  };

  // 发送好友请求
  const sendFriendRequest = async (userId: string) => {
    try {
      await friendService.sendFriendRequest(userId);
      Alert.alert(t('common.friends.requestSentSuccess'));
      
      // 从搜索结果中移除已发送请求的用户
      setSearchResults(prev => prev.filter(user => user.id !== userId));
    } catch (error) {
      Alert.alert(t('common.friends.errors.requestFailed'));
    }
  };

  // 接受好友请求
  const acceptFriendRequest = async (requestId: string) => {
    try {
      await friendService.acceptFriendRequest(requestId);
      Alert.alert(t('common.friends.requestAccepted'));
    } catch (error) {
      Alert.alert(t('common.friends.errors.acceptFailed'));
    }
  };

  // 拒绝好友请求
  const rejectFriendRequest = async (requestId: string) => {
    try {
      await friendService.rejectFriendRequest(requestId);
      Alert.alert(t('common.friends.requestDeclined'));
    } catch (error) {
      Alert.alert(t('common.friends.errors.declineFailed'));
    }
  };

  const startChat = (friend: Friend) => {
    const currentUser = auth.currentUser;
    if (!currentUser) return;

    // 创建聊天ID（确保唯一性）
    const chatId = [currentUser.uid, friend.id].sort().join('_');
    
    navigation.navigate('ChatRoom', {
      chatId,
      otherUserId: friend.id,
      otherUserName: friend.name || '好友'
    });
  };

  const removeFriend = async (friend: Friend) => {
    Alert.alert(
      t('common.friends.removeFriendTitle'),
      t('common.friends.removeFriendMessage'),
      [
        { text: t('common.friends.cancel'), style: 'cancel' },
        {
          text: t('common.friends.confirm'),
          style: 'destructive',
          onPress: async () => {
            try {
              await friendService.removeFriend(friend.id);
              Alert.alert(t('common.friends.friendRemoved'));
            } catch (error) {
              Alert.alert(t('common.friends.errors.removeFailed'));
            }
          }
        }
      ]
    );
  };

  const renderFriend = ({ item }: { item: Friend }) => (
    <View style={[
      styles.friendItem,
      { backgroundColor: isDarkMode ? colors.gray[800] : colors.white }
    ]}>
      <View style={styles.friendInfo}>
        <View style={styles.avatarContainer}>
          {item.avatar ? (
            <Image source={{ uri: item.avatar }} style={styles.avatar} />
          ) : (
            <View style={[styles.defaultAvatar, { backgroundColor: colors.primary }]}>
              <FontAwesome5 name="user" size={20} color={colors.white} />
            </View>
          )}
          {item.isOnline && <View style={styles.onlineIndicator} />}
        </View>
        
        <View style={styles.friendDetails}>
          <Text style={[
            styles.friendName,
            { color: isDarkMode ? colors.white : colors.gray[900] }
          ]}>
            {item.name || '好友'}
          </Text>
          <Text style={[
            styles.friendStatus,
            { color: isDarkMode ? colors.gray[400] : colors.gray[600] }
          ]}>
            {item.isOnline ? '在线' : '离线'}
          </Text>
        </View>
      </View>

      <View style={styles.actionButtons}>
        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: colors.primary }]}
          onPress={() => startChat(item)}
        >
          <FontAwesome5 name="comments" size={16} color={colors.white} />
          <Text style={styles.actionButtonText}>{t('common.friends.chat')}</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: '#ef4444' }]}
          onPress={() => removeFriend(item)}
        >
          <FontAwesome5 name="user-minus" size={16} color={colors.white} />
          <Text style={styles.actionButtonText}>{t('common.friends.remove')}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  // 渲染搜索结果
  const renderSearchResult = ({ item }: { item: User }) => (
    <View style={[
      styles.friendItem,
      { backgroundColor: isDarkMode ? colors.gray[800] : colors.white }
    ]}>
      <View style={styles.friendInfo}>
        <View style={styles.avatarContainer}>
          {item.avatar ? (
            <Image source={{ uri: item.avatar }} style={styles.avatar} />
          ) : (
            <View style={[styles.defaultAvatar, { backgroundColor: colors.primary }]}>
              <FontAwesome5 name="user" size={20} color={colors.white} />
            </View>
          )}
        </View>
        
        <View style={styles.friendDetails}>
          <Text style={[
            styles.friendName,
            { color: isDarkMode ? colors.white : colors.gray[900] }
          ]}>
            {item.name || '用户'}
          </Text>
          <Text style={[
            styles.friendStatus,
            { color: isDarkMode ? colors.gray[400] : colors.gray[600] }
          ]}>
            {item.email}
          </Text>
        </View>
      </View>

      <TouchableOpacity
        style={[styles.actionButton, { backgroundColor: colors.primary }]}
        onPress={() => sendFriendRequest(item.id)}
      >
        <FontAwesome5 name="user-plus" size={16} color={colors.white} />
        <Text style={styles.actionButtonText}>{t('common.friends.add')}</Text>
      </TouchableOpacity>
    </View>
  );

  // 渲染好友请求
  const renderFriendRequest = ({ item }: { item: FriendRequest }) => (
    <View style={[
      styles.friendItem,
      { backgroundColor: isDarkMode ? colors.gray[800] : colors.white }
    ]}>
      <View style={styles.friendInfo}>
        <View style={styles.avatarContainer}>
          {item.fromUserAvatar ? (
            <Image source={{ uri: item.fromUserAvatar }} style={styles.avatar} />
          ) : (
            <View style={[styles.defaultAvatar, { backgroundColor: colors.primary }]}>
              <FontAwesome5 name="user" size={20} color={colors.white} />
            </View>
          )}
        </View>
        
        <View style={styles.friendDetails}>
          <Text style={[
            styles.friendName,
            { color: isDarkMode ? colors.white : colors.gray[900] }
          ]}>
            {item.fromUserName || '用户'}
          </Text>
          <Text style={[
            styles.friendStatus,
            { color: isDarkMode ? colors.gray[400] : colors.gray[600] }
          ]}>
            {t('common.friends.wantsToAddYou')}
          </Text>
        </View>
      </View>

      <View style={styles.actionButtons}>
        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: '#10b981' }]}
          onPress={() => acceptFriendRequest(item.id)}
        >
          <FontAwesome5 name="check" size={16} color={colors.white} />
          <Text style={styles.actionButtonText}>{t('common.friends.accept')}</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: '#ef4444' }]}
          onPress={() => rejectFriendRequest(item.id)}
        >
          <FontAwesome5 name="times" size={16} color={colors.white} />
          <Text style={styles.actionButtonText}>{t('common.friends.decline')}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={[
        styles.container,
        { backgroundColor: isDarkMode ? colors.gray[900] : colors.white }
      ]}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={[
            styles.loadingText,
            { color: isDarkMode ? colors.white : colors.gray[900] }
          ]}>
            {t('common.friends.loading')}
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={[
      styles.container,
      { backgroundColor: isDarkMode ? colors.gray[900] : colors.white }
    ]}>
      {/* 标签页 */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[
            styles.tab,
            activeTab === 'friends' && styles.activeTab,
            { backgroundColor: activeTab === 'friends' ? colors.primary : 'transparent' }
          ]}
          onPress={() => setActiveTab('friends')}
        >
          <FontAwesome5 
            name="users" 
            size={16} 
            color={activeTab === 'friends' ? colors.white : colors.gray[600]} 
          />
          <Text style={[
            styles.tabText,
            { color: activeTab === 'friends' ? colors.white : colors.gray[600] }
          ]}>
            {t('common.friends.tabs.myFriends')} ({friends.length})
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.tab,
            activeTab === 'search' && styles.activeTab,
            { backgroundColor: activeTab === 'search' ? colors.primary : 'transparent' }
          ]}
          onPress={() => setActiveTab('search')}
        >
          <FontAwesome5 
            name="search" 
            size={16} 
            color={activeTab === 'search' ? colors.white : colors.gray[600]} 
          />
          <Text style={[
            styles.tabText,
            { color: activeTab === 'search' ? colors.white : colors.gray[600] }
          ]}>
            {t('common.friends.tabs.addFriend')}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.tab,
            activeTab === 'requests' && styles.activeTab,
            { backgroundColor: activeTab === 'requests' ? colors.primary : 'transparent' }
          ]}
          onPress={() => setActiveTab('requests')}
        >
          <FontAwesome5 
            name="user-plus" 
            size={16} 
            color={activeTab === 'requests' ? colors.white : colors.gray[600]} 
          />
          <Text style={[
            styles.tabText,
            { color: activeTab === 'requests' ? colors.white : colors.gray[600] }
          ]}>
            {t('common.friends.tabs.friendRequests')} ({friendRequests.length})
          </Text>
          {friendRequests.length > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{friendRequests.length}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      {/* 标签页内容 */}
      {activeTab === 'friends' && (
        <View style={[styles.tabContent, { paddingTop: 60 }]}>
          {friends.length === 0 ? (
            <View style={styles.emptyContainer}>
              <FontAwesome5 name="user-friends" size={48} color={colors.gray[400]} />
              <Text style={[
                styles.emptyText,
                { color: isDarkMode ? colors.gray[400] : colors.gray[600] }
              ]}>
                {t('common.friends.noFriends')}
              </Text>
              <Text style={[
                styles.emptySubtext,
                { color: isDarkMode ? colors.gray[500] : colors.gray[500] }
              ]}>
                {t('common.friends.noFriendsDesc')}
              </Text>
            </View>
          ) : (
            <FlatList
              data={friends}
              renderItem={renderFriend}
              keyExtractor={(item) => item.id}
              contentContainerStyle={styles.listContainer}
              showsVerticalScrollIndicator={false}
            />
          )}
        </View>
      )}

      {activeTab === 'search' && (
        <View style={[styles.tabContent, { paddingTop: 60 }]}>
          <View style={styles.searchContainer}>
            <TextInput
              style={[
                styles.searchInput,
                { 
                  backgroundColor: isDarkMode ? colors.gray[800] : colors.gray[100],
                  color: isDarkMode ? colors.white : colors.gray[900]
                }
              ]}
              placeholder={t('common.friends.searchHint')}
              placeholderTextColor={isDarkMode ? colors.gray[400] : colors.gray[600]}
              value={searchText}
              onChangeText={setSearchText}
              onSubmitEditing={searchUsers}
            />
            <TouchableOpacity
              style={[styles.searchButton, { backgroundColor: colors.primary }]}
              onPress={searchUsers}
              disabled={searching}
            >
              {searching ? (
                <ActivityIndicator size="small" color={colors.white} />
              ) : (
                <FontAwesome5 name="search" size={16} color={colors.white} />
              )}
            </TouchableOpacity>
          </View>

          {searchResults.length === 0 ? (
            <View style={styles.emptyContainer}>
              <FontAwesome5 name="search" size={48} color={colors.gray[400]} />
              <Text style={[
                styles.emptyText,
                { color: isDarkMode ? colors.gray[400] : colors.gray[600] }
              ]}>
                {searchText ? t('common.friends.noUsersFound') : t('common.friends.enterSearchTerm')}
              </Text>
            </View>
          ) : (
            <FlatList
              data={searchResults}
              renderItem={renderSearchResult}
              keyExtractor={(item) => item.id}
              contentContainerStyle={styles.listContainer}
              showsVerticalScrollIndicator={false}
            />
          )}
        </View>
      )}

      {activeTab === 'requests' && (
        <View style={[styles.tabContent, { paddingTop: 60 }]}>
          {friendRequests.length === 0 ? (
            <View style={styles.emptyContainer}>
              <FontAwesome5 name="user-plus" size={48} color={colors.gray[400]} />
              <Text style={[
                styles.emptyText,
                { color: isDarkMode ? colors.gray[400] : colors.gray[600] }
              ]}>
                {t('common.friends.noRequests')}
              </Text>
              <Text style={[
                styles.emptySubtext,
                { color: isDarkMode ? colors.gray[500] : colors.gray[500] }
              ]}>
                {t('common.friends.noRequestsDesc')}
              </Text>
            </View>
          ) : (
            <FlatList
              data={friendRequests}
              renderItem={renderFriendRequest}
              keyExtractor={(item) => item.id}
              contentContainerStyle={styles.listContainer}
              showsVerticalScrollIndicator={false}
            />
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: colors.gray[100],
    marginHorizontal: 16,
    marginTop: 0,
    borderRadius: 12,
    padding: 4,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 8,
    gap: 6,
    position: 'relative',
  },
  activeTab: {
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  tabText: {
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
  },
  badge: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: '#ef4444',
    borderRadius: 8,
    minWidth: 16,
    height: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    color: colors.white,
    fontSize: 10,
    fontWeight: 'bold',
  },
  tabContent: {
    flex: 1,
  },
  searchContainer: {
    flexDirection: 'row',
    margin: 16,
    gap: 12,
  },
  searchInput: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    fontSize: 16,
  },
  searchButton: {
    width: 48,
    height: 48,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },

  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  emptyText: {
    marginTop: 16,
    fontSize: 18,
    fontWeight: '600',
  },
  emptySubtext: {
    marginTop: 8,
    fontSize: 14,
    textAlign: 'center',
  },
  listContainer: {
    padding: 16,
  },
  friendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    marginBottom: 12,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  friendInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 12,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  defaultAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#10b981',
    borderWidth: 2,
    borderColor: colors.white,
  },
  friendDetails: {
    flex: 1,
  },
  friendName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  friendStatus: {
    fontSize: 14,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 6,
  },
  actionButtonText: {
    color: colors.white,
    fontSize: 12,
    fontWeight: '600',
  },
}); 