import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, FlatList, StatusBar, StyleSheet, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FontAwesome, FontAwesome5 } from '@expo/vector-icons';
import { styles, colors } from '../constants/Styles';
import RadarScan from '../components/RadarScan';
import { useLanguage } from '../contexts/LanguageContext';
import { useTheme } from '../contexts/ThemeContext';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import CustomTabBar from '../components/CustomTabBar';
import CustomHeader from '../components/CustomHeader';

type RootStackParamList = {
  ChatList: undefined;
};

type SocialScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'ChatList'>;

interface Post {
  id: number;
  user: {
    name: string;
    avatar: string;
    timeAgo: string;
  };
  content: string;
  image: string;
  likes: number;
  comments: number;
  liked: boolean;
  type: 'image' | 'video';
  videoUrl?: string;
}

interface NearbyPet {
  id: number;
  name: string;
  breed: string;
  age: string;
  distance: string;
  image: string;
}

// 计算瀑布流列宽
const { width } = Dimensions.get('window');
const CARD_GAP = 16; // 卡片之间的间距
const SCREEN_PADDING = 16; // 屏幕边缘的间距
const COLUMN_WIDTH = (width - (SCREEN_PADDING * 2) - CARD_GAP) / 2; // 计算每列宽度

export default function Social() {
  const { t, currentLanguage } = useLanguage();
  const { isDarkMode } = useTheme();
  const navigation = useNavigation<SocialScreenNavigationProp>();
  const [activeTab, setActiveTab] = useState(0); // 0: 动态, 1: 附近, 2: 活动
  const [isSearching, setIsSearching] = useState(false);
  const [posts, setPosts] = useState<Post[]>([
    {
      id: 1,
      user: {
        name: 'Alex Johnson',
        avatar: 'https://i.pravatar.cc/150?img=1',
        timeAgo: '2小时前',
      },
      content: 'Buddy had a great time at the dog park today!',
      image: 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b',
      likes: 42,
      comments: 8,
      liked: false,
      type: 'image',
    },
    {
      id: 2,
      user: {
        name: 'Emily Wilson',
        avatar: 'https://i.pravatar.cc/150?img=2',
        timeAgo: 'yesterday',
      },
      content: 'Luna\'s new toy unboxing video',
      image: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1',
      likes: 28,
      comments: 5,
      liked: false,
      type: 'video',
      videoUrl: 'https://example.com/video1.mp4',
    },
  ]);

  // 添加加载状态
  const [isLoading, setIsLoading] = useState(false);

  // 模拟加载更多数据
  const loadMorePosts = () => {
    if (isLoading) return;
    
    setIsLoading(true);
    
    // 模拟网络请求延迟
    setTimeout(() => {
      const newPosts: Post[] = Array.from({ length: 4 }, (_, index) => ({
        id: posts.length + index + 1,
        user: {
          name: `User ${posts.length + index + 1}`,
          avatar: `https://i.pravatar.cc/150?img=${(posts.length + index) % 70}`,
          timeAgo: 'just now',
        },
        content: `这是第 ${posts.length + index + 1} 条动态`,
        image: `https://picsum.photos/seed/${posts.length + index}/400/500`,
        likes: Math.floor(Math.random() * 100),
        comments: Math.floor(Math.random() * 20),
        liked: false,
        type: Math.random() > 0.5 ? 'image' : 'video',
        videoUrl: Math.random() > 0.5 ? 'https://example.com/video1.mp4' : undefined,
      }));

      setPosts(prevPosts => [...prevPosts, ...newPosts]);
      setIsLoading(false);
    }, 1000);
  };

  // 附近的宠物数据
  const [nearbyPets, setNearbyPets] = useState([
    {
      id: 1,
      name: 'Buddy',
      breed: 'Golden Retriever',
      age: '3 years',
      distance: '0.5 km',
      image: 'https://picsum.photos/200',
    },
    {
      id: 2,
      name: 'Luna',
      breed: 'Siberian Husky',
      age: '2 years',
      distance: '0.8 km',
      image: 'https://picsum.photos/200',
    },
    {
      id: 3,
      name: 'Max',
      breed: 'Pug',
      age: '1 year',
      distance: '1.2 km',
      image: 'https://picsum.photos/200',
    },
  ]);

  // toggle like
  const toggleLike = (postId: number) => {
    setPosts(currentPosts => 
      currentPosts.map(post => {
        if (post.id === postId) {
          return {
            ...post,
            liked: !post.liked,
            likes: post.liked ? post.likes - 1 : post.likes + 1
          };
        }
        return post;
      })
    );
  };

  // 处理搜索
  const handleSearch = () => {
    setIsSearching(true);
    
    // 3秒后更新数据并返回
    setTimeout(() => {
      // 生成新的随机宠物数据
      const newPets = Array.from({ length: 3 }, (_, index) => ({
        id: Date.now() + index,
        name: ['Buddy', 'Luna', 'Max', 'Charlie', 'Bella', 'Rocky'][Math.floor(Math.random() * 6)],
        breed: ['Golden Retriever', 'Siberian Husky', 'Pug', 'Labrador', 'German Shepherd', 'Beagle'][Math.floor(Math.random() * 6)],
        age: `${Math.floor(Math.random() * 5) + 1} years`,
        distance: `${(Math.random() * 2).toFixed(1)} km`,
        image: 'https://picsum.photos/200',
      }));
      
      setNearbyPets(newPets);
      setIsSearching(false);
    }, 3000);
  };

  // render nearby pets section
  const renderNearbyPetsSection = () => (
    <View style={{ paddingHorizontal: 16, paddingTop: 8 }}>
      <View style={[styles.sectionHeader, { marginBottom: 12 }]}>
        <Text style={[styles.sectionTitle, { color: isDarkMode ? colors.white : colors.gray[900] }]}>
          {t('common.social.nearbyPets')}
        </Text>
        <TouchableOpacity onPress={handleSearch}>
          <Text style={styles.sectionLink}>{t('common.social.search')}</Text>
        </TouchableOpacity>
      </View>
      {isSearching ? (
        <View style={{ height: 200, justifyContent: 'center', alignItems: 'center' }}>
          <RadarScan />
        </View>
      ) : (
        <FlatList
          data={nearbyPets}
          renderItem={({ item }) => (
            <TouchableOpacity 
              key={item.id}
              style={[styles.card, { 
                backgroundColor: isDarkMode ? colors.gray[700] : colors.white,
                marginRight: 16,
                width: 200,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 3,
                elevation: 2,
              }]}
            >
              <Image
                source={{ uri: item.image }}
                style={{ width: '100%', height: 120, borderRadius: 8 }}
              />
              <View style={{ padding: 12 }}>
                <Text style={[styles.taskTitle, { color: isDarkMode ? colors.white : colors.gray[900] }]}>
                  {item.name}
                </Text>
                <Text style={[styles.taskTime, { color: isDarkMode ? colors.gray[400] : colors.gray[500] }]}>
                  {item.breed} · {item.age}
                </Text>
                <Text style={[styles.taskTime, { color: isDarkMode ? colors.gray[400] : colors.gray[500] }]}>
                  distance: {item.distance}
                </Text>
              </View>
            </TouchableOpacity>
          )}
          keyExtractor={(item) => item.id.toString()}
          horizontal
          showsHorizontalScrollIndicator={false}
        />
      )}
    </View>
  );

  // 渲染宠物活动卡片
  const renderEventsSection = () => (
    <View style={[styles.card, { backgroundColor: isDarkMode ? colors.gray[800] : colors.white }]}> 
      <View style={styles.sectionHeader}>
        <Text style={[styles.sectionTitle, { color: isDarkMode ? colors.white : colors.gray[900] }]}>events</Text>
        <TouchableOpacity>
          <Text style={styles.sectionLink}>viewAll</Text>
        </TouchableOpacity>
      </View>
      <View style={[styles.card, { backgroundColor: isDarkMode ? colors.gray[700] : colors.white, marginBottom: 16 }]}> 
        <View style={styles.flexStart}>
          <FontAwesome5 name="calendar-alt" size={20} color={colors.primary} />
          <View style={{ marginLeft: 12 }}>
            <Text style={[styles.taskTitle, { color: isDarkMode ? colors.white : colors.gray[900] }]}>Pet Carnival</Text>
            <Text style={[styles.taskTime, { color: isDarkMode ? colors.gray[400] : colors.gray[500] }]}>March 20, 2024 14:00</Text>
            <Text style={[styles.taskTime, { color: isDarkMode ? colors.gray[400] : colors.gray[500] }]}>Central Park</Text>
          </View>
        </View>
      </View>
      <View style={[styles.card, { backgroundColor: isDarkMode ? colors.gray[700] : colors.white }]}> 
        <View style={styles.flexStart}>
          <FontAwesome5 name="paw" size={20} color={colors.primary} />
          <View style={{ marginLeft: 12 }}>
            <Text style={[styles.taskTitle, { color: isDarkMode ? colors.white : colors.gray[900] }]}>Pet Training Course</Text>
            <Text style={[styles.taskTime, { color: isDarkMode ? colors.gray[400] : colors.gray[500] }]}>Saturday 10:00</Text>
            <Text style={[styles.taskTime, { color: isDarkMode ? colors.gray[400] : colors.gray[500] }]}>Pet Training Center</Text>
          </View>
        </View>
      </View>
    </View>
  );

  // 渲染分段控制器
  const renderTabController = () => (
    <View style={{
      flexDirection: 'row',
      backgroundColor: colors.gray[100],
      borderRadius: 8,
      padding: 4,
      marginBottom: 24,
    }}>
      <TouchableOpacity
        style={{
          flex: 1,
          paddingVertical: 8,
          backgroundColor: activeTab === 0 ? colors.white : 'transparent',
          borderRadius: 4,
          alignItems: 'center',
          ...(activeTab === 0 ? {
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 3,
            elevation: 2,
          } : null),
        }}
        onPress={() => setActiveTab(0)}
      >
        <Text style={{ fontSize: 14, fontWeight: '500', color: activeTab === 0 ? colors.gray[900] : colors.gray[500] }}>
          {t('common.social.tab.activity')}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={{
          flex: 1,
          paddingVertical: 8,
          backgroundColor: activeTab === 1 ? colors.white : 'transparent',
          borderRadius: 4,
          alignItems: 'center',
          ...(activeTab === 1 ? {
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 3,
            elevation: 2,
          } : null),
        }}
        onPress={() => setActiveTab(1)}
      >
        <Text style={{ fontSize: 14, fontWeight: '500', color: activeTab === 1 ? colors.gray[900] : colors.gray[500] }}>
          {t('common.social.tab.nearby')}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={{
          flex: 1,
          paddingVertical: 8,
          backgroundColor: activeTab === 2 ? colors.white : 'transparent',
          borderRadius: 4,
          alignItems: 'center',
          ...(activeTab === 2 ? {
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 3,
            elevation: 2,
          } : null),
        }}
        onPress={() => setActiveTab(2)}
      >
        <Text style={{ fontSize: 14, fontWeight: '500', color: activeTab === 2 ? colors.gray[900] : colors.gray[500] }}>
          {t('common.social.tab.events')}
        </Text>
      </TouchableOpacity>
    </View>
  );

  // 渲染头部内容（只显示Tab控制器）
  const renderHeader = () => (
    <View style={{ position: 'relative' }}>
      {renderTabController()}
    </View>
  );

  // 渲染瀑布流动态卡片
  const renderWaterfallPost = ({ item, index }: { item: Post; index: number }) => {
    const isLeft = index % 2 === 0;
    return (
      <TouchableOpacity
        style={{
          width: COLUMN_WIDTH,
          marginLeft: isLeft ? 0 : 8,
          marginRight: isLeft ? 8 : 0,
          marginBottom: 16,
          backgroundColor: colors.white,
          borderRadius: 8,
          overflow: 'hidden',
          shadowColor: '#000',
          shadowOffset: {
            width: 0,
            height: 2,
          },
          shadowOpacity: 0.1,
          shadowRadius: 3,
          elevation: 2,
        }}
      >
        {/* 媒体内容 */}
        <View style={{ position: 'relative' }}>
          <Image
            source={{ uri: item.image }}
            style={{ width: '100%', height: COLUMN_WIDTH * 1.2, resizeMode: 'cover' }}
          />
          {item.type === 'video' && (
            <View style={{
              position: 'absolute',
              top: 8,
              right: 8,
              backgroundColor: 'rgba(0, 0, 0, 0.6)',
              borderRadius: 12,
              padding: 4,
            }}>
              <FontAwesome name="play" size={12} color={colors.white} />
            </View>
          )}
        </View>

        {/* 用户信息和互动数据 */}
        <View style={{ padding: 8 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
            <Image
              source={{ uri: item.user.avatar }}
              style={{ width: 20, height: 20, borderRadius: 10, marginRight: 6 }}
            />
            <Text style={{ fontSize: 12, color: colors.gray[600] }}>{item.user.name}</Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <FontAwesome
              name="heart"
              size={12}
              color={colors.gray[400]}
              style={{ marginRight: 4 }}
            />
            <Text style={{ fontSize: 12, color: colors.gray[500] }}>{item.likes}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={[styles.safeAreaContainer, { backgroundColor: isDarkMode ? colors.gray[900] : colors.white }]}>
      <StatusBar barStyle={isDarkMode ? "light-content" : "dark-content"} />
      <CustomHeader title={t('common.social.title')} />
      {renderHeader()}
      {activeTab === 0 && (
        <FlatList
          data={posts}
          renderItem={({ item, index }) => renderWaterfallPost({ item, index })}
          keyExtractor={(item) => item.id.toString()}
          numColumns={2}
          contentContainerStyle={styles.scrollViewContent}
          columnWrapperStyle={{}}
          showsVerticalScrollIndicator={false}
          onEndReached={loadMorePosts}
          onEndReachedThreshold={0.5}
          ListFooterComponent={() => (
            isLoading ? (
              <View style={{ padding: 20, alignItems: 'center' }}>
                <Text style={{ color: colors.gray[500] }}>loading more...</Text>
              </View>
            ) : null
          )}
        />
      )}
      {activeTab === 1 && (
        <ScrollView style={[styles.content, { backgroundColor: isDarkMode ? colors.gray[900] : colors.white }]}> 
          {renderNearbyPetsSection()}
        </ScrollView>
      )}
      {activeTab === 2 && (
        <ScrollView style={[styles.content, { backgroundColor: isDarkMode ? colors.gray[900] : colors.white }]}> 
          {renderEventsSection()}
        </ScrollView>
      )}
      {/* 悬浮按钮 */}
      <TouchableOpacity
        style={{
          position: 'absolute',
          bottom: 104,
          right: 16,
          width: 56,
          height: 56,
          borderRadius: 28,
          backgroundColor: colors.primary,
          alignItems: 'center',
          justifyContent: 'center',
          elevation: 4,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.2,
          shadowRadius: 4,
        }}
      >
        <FontAwesome name="plus" size={20} color={colors.white} />
      </TouchableOpacity>
    </SafeAreaView>
  );
} 