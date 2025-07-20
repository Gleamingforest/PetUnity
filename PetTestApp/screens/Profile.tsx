import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, FlatList, StyleSheet, Dimensions, ScrollView, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FontAwesome, FontAwesome5 } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext';
import { useLanguage } from '../contexts/LanguageContext';
import { useNavigation } from '@react-navigation/native';
import CustomHeader from '../components/CustomHeader';

const AVATAR = 'https://randomuser.me/api/portraits/men/32.jpg';
const USERNAME = 'Alex';
const HANDLE = '@alex_sf';
const BIO = 'Dog lover and pet photographer.';
const LOCATION = 'Edmonton, Alberta';
const POSTS = 12;
const FOLLOWERS = 24;
const FOLLOWING = 36;

const TABS = [
  { key: 'posts', label: 'Posts', icon: 'th-large' },
  { key: 'saved', label: 'Saved', icon: 'bookmark' },
  { key: 'tagged', label: 'Tagged', icon: 'tag' },
];

const GRID_DATA = [
  // 假数据，图片和视频混合
  { id: '1', type: 'image', uri: 'https://images.unsplash.com/photo-1507146426996-ef05306b995a' },
  { id: '2', type: 'image', uri: 'https://images.unsplash.com/photo-1518717758536-85ae29035b6d' },
  { id: '3', type: 'image', uri: 'https://images.unsplash.com/photo-1518715308788-3005759c61d4' },
  { id: '4', type: 'image', uri: 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca' },
  { id: '5', type: 'image', uri: 'https://images.unsplash.com/photo-1502672023488-70e25813f145' },
  { id: '6', type: 'image', uri: 'https://images.unsplash.com/photo-1518715308788-3005759c61d4' },
  { id: '7', type: 'image', uri: 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca' },
  { id: '8', type: 'image', uri: 'https://images.unsplash.com/photo-1502672023488-70e25813f145' },
  { id: '9', type: 'image', uri: 'https://images.unsplash.com/photo-1518717758536-85ae29035b6d' },
  { id: '10', type: 'image', uri: 'https://images.unsplash.com/photo-1507146426996-ef05306b995a' },
  { id: '11', type: 'image', uri: 'https://images.unsplash.com/photo-1518715308788-3005759c61d4' },
  { id: '12', type: 'image', uri: 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca' },
];

const { width } = Dimensions.get('window');
const CARD_GAP = 8;
const NUM_COLUMNS = 3;
const CARD_SIZE = (width - CARD_GAP * (NUM_COLUMNS + 1)) / NUM_COLUMNS;

export default function Profile() {
  const { isDarkMode } = useTheme();
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState('posts');
  const navigation = useNavigation() as any;

  // 个人卡片
  const renderProfileCard = () => (
    <View style={[styles.profileCard, { backgroundColor: isDarkMode ? '#23272f' : '#fff' }]}> 
      <Image source={{ uri: AVATAR }} style={styles.avatar} />
      <View style={{ flex: 1, marginLeft: 16 }}>
        {/* Edit按钮绝对定位在卡片右上角 */}
        <TouchableOpacity style={styles.editBtn} onPress={() => navigation.navigate('EditUserProfile')}>
          <Text style={styles.editBtnText}>Edit Profile</Text>
        </TouchableOpacity>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <View>
            <Text style={[styles.name, { color: isDarkMode ? '#fff' : '#222' }]}>{USERNAME} <Text style={styles.handle}>{HANDLE}</Text></Text>
            <Text style={[styles.bio, { color: isDarkMode ? '#bbb' : '#555' }]}>{BIO}</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 2 }}>
              <FontAwesome name="map-marker" size={14} color={isDarkMode ? '#bbb' : '#888'} style={{ marginRight: 4 }} />
              <Text style={{ color: isDarkMode ? '#bbb' : '#888', fontSize: 13 }}>{LOCATION}</Text>
            </View>
          </View>
        </View>
        <View style={styles.statsRow}>
          <View style={styles.statItem}><Text style={styles.statNum}>{POSTS}</Text><Text style={styles.statLabel}>Posts</Text></View>
          <View style={styles.statItem}><Text style={styles.statNum}>{FOLLOWERS}</Text><Text style={styles.statLabel}>Followers</Text></View>
          <View style={styles.statItem}><Text style={styles.statNum}>{FOLLOWING}</Text><Text style={styles.statLabel}>Following</Text></View>
        </View>
      </View>
    </View>
  );

  // Tab切换
  const renderTabs = () => (
    <View style={[styles.tabs, { backgroundColor: isDarkMode ? '#23272f' : '#fff' }]}> 
      {TABS.map(tab => (
        <TouchableOpacity
          key={tab.key}
          style={[styles.tabBtn, activeTab === tab.key && styles.tabBtnActive]}
          onPress={() => setActiveTab(tab.key)}
        >
          <FontAwesome5 name={tab.icon} size={16} color={activeTab === tab.key ? '#ff5a5f' : isDarkMode ? '#bbb' : '#888'} style={{ marginRight: 6 }} />
          <Text style={[styles.tabLabel, { color: activeTab === tab.key ? '#ff5a5f' : isDarkMode ? '#bbb' : '#888' }]}>{tab.label}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  // 网格内容
  const renderGridItem = ({ item }: { item: { id: string; type: string; uri: string } }) => (
    <View style={styles.gridItem}>
      <Image source={{ uri: item.uri }} style={styles.gridImage} />
      {/* 可扩展为视频/图片类型判断 */}
    </View>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: isDarkMode ? '#181c22' : '#f5f6fa' }}>
      <StatusBar barStyle={isDarkMode ? "light-content" : "dark-content"} />
      <CustomHeader title={t('common.profile.title')} />
      <ScrollView style={{ flex: 1 }}>
        <View style={{ padding: 16 }}>
          {renderProfileCard()}
          {renderTabs()}
          <FlatList
            data={GRID_DATA}
            renderItem={renderGridItem}
            keyExtractor={item => item.id}
            numColumns={NUM_COLUMNS}
            columnWrapperStyle={{ justifyContent: 'space-between', marginBottom: CARD_GAP }}
            scrollEnabled={false}
            contentContainerStyle={{ marginTop: 12, paddingBottom: 32 }}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  profileCard: {
    position: 'relative', // 新增，确保绝对定位生效
    flexDirection: 'row',
    borderRadius: 20,
    padding: 20,
    marginBottom: 18,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 8,
  },
  name: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  handle: {
    fontSize: 16,
    color: '#888',
    fontWeight: '400',
  },
  bio: {
    fontSize: 15,
    marginTop: 2,
    marginBottom: 2,
  },
  settingsBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#f3f4f6',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
  },
  statItem: {
    alignItems: 'center',
    marginRight: 24,
  },
  statNum: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#222',
  },
  statLabel: {
    fontSize: 13,
    color: '#888',
  },
  editBtn: {
    position: 'absolute',
    top: 54, // 向下移动到地址行旁边
    right: 0, // 紧贴右侧
    backgroundColor: '#f3f4f6',
    borderRadius: 8, // 缩小圆角
    paddingHorizontal: 10, // 缩小宽度
    paddingVertical: 4, // 缩小高度
    zIndex: 2,
  },
  editBtnText: {
    color: '#222',
    fontWeight: 'bold',
    fontSize: 13, // 缩小字体
  },
  tabs: {
    flexDirection: 'row',
    borderRadius: 12,
    marginBottom: 12,
    padding: 4,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  tabBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 8,
  },
  tabBtnActive: {
    backgroundColor: '#fff0f0',
  },
  tabLabel: {
    fontSize: 15,
    fontWeight: '500',
  },
  gridItem: {
    width: CARD_SIZE,
    height: CARD_SIZE,
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 0,
    backgroundColor: '#eee',
  },
  gridImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
}); 