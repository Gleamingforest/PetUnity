import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  Dimensions,
  TouchableOpacity,
  Animated,
  PanResponder,
  StatusBar,
  RefreshControl,
  ScrollView,
  useColorScheme,
} from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { useLanguage } from '../contexts/LanguageContext';
import { colors } from '../constants/Styles';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../contexts/ThemeContext';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;
const SWIPE_THRESHOLD = 0.25 * SCREEN_WIDTH;
const SWIPE_OUT_DURATION = 250;
const ROTATION_THRESHOLD = 45; // 45度判定阈值

type PetCard = {
  id: string;
  petImage: string;
  ownerName: string;
  ownerAvatar: string;
  petName: string;
  petAge: number;
  petBreed: string;
};

// 模拟数据库
const mockDatabase: PetCard[] = [
  {
    id: '1',
    petImage: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1',
    ownerName: 'Alice',
    ownerAvatar: 'https://i.pravatar.cc/150?img=1',
    petName: 'Max',
    petAge: 2,
    petBreed: 'Golden Retriever',
  },
  {
    id: '2',
    petImage: 'https://images.unsplash.com/photo-1517849845537-4d257902454a',
    ownerName: 'Bob',
    ownerAvatar: 'https://i.pravatar.cc/150?img=2',
    petName: 'Luna',
    petAge: 1,
    petBreed: 'Siberian Husky',
  },
  {
    id: '3',
    petImage: 'https://images.unsplash.com/photo-1537151608828-ea2b11777ee8',
    ownerName: 'Charlie',
    ownerAvatar: 'https://i.pravatar.cc/150?img=3',
    petName: 'Bella',
    petAge: 3,
    petBreed: 'Poodle',
  },
  {
    id: '4',
    petImage: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e',
    ownerName: 'David',
    ownerAvatar: 'https://i.pravatar.cc/150?img=4',
    petName: 'Rocky',
    petAge: 4,
    petBreed: 'German Shepherd',
  },
  {
    id: '5',
    petImage: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee',
    ownerName: 'Emma',
    ownerAvatar: 'https://i.pravatar.cc/150?img=5',
    petName: 'Coco',
    petAge: 2,
    petBreed: 'French Bulldog',
  },
];

export default function Match() {
  const { t } = useLanguage();
  const navigation = useNavigation();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [cards, setCards] = useState<PetCard[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const position = new Animated.ValueXY();
  const isDarkMode = useColorScheme() === 'dark';
  const { isDarkMode: themeIsDarkMode } = useTheme();

  // 初始化卡片
  useEffect(() => {
    loadCards();
  }, []);

  // 隐藏导航栏
  useEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
    StatusBar.setHidden(true);

    return () => {
      navigation.setOptions({
        headerShown: true,
      });
      StatusBar.setHidden(false);
    };
  }, [navigation]);

  const loadCards = () => {
    // 模拟从数据库加载数据，每次加载3张卡片
    const shuffledCards = [...mockDatabase]
      .sort(() => Math.random() - 0.5)
      .slice(0, 3);
    setCards(shuffledCards);
    setCurrentIndex(0);
  };

  const onRefresh = React.useCallback(() => {
    if (currentIndex >= cards.length) {
      setRefreshing(true);
      loadCards();
      setRefreshing(false);
    }
  }, [currentIndex, cards.length]);

  const resetPosition = () => {
    Animated.spring(position, {
      toValue: { x: 0, y: 0 },
      useNativeDriver: false,
      friction: 5,
      tension: 40,
    }).start();
  };

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderMove: (_, gesture) => {
      // 限制垂直方向的移动，只允许向下滑动
      const newY = gesture.dy > 0 ? gesture.dy : 0;
      position.setValue({ x: gesture.dx, y: newY });
    },
    onPanResponderRelease: (_, gesture) => {
      const rotation = Math.abs((gesture.dx / SCREEN_WIDTH) * 120); // 计算旋转角度
      
      if (rotation > ROTATION_THRESHOLD) {
        // 如果旋转角度超过45度，执行滑动
        if (gesture.dx > 0) {
          forceSwipe('right');
        } else {
          forceSwipe('left');
        }
      } else {
        // 只有在用户完全松开手指且未达到滑动阈值时才回正
        if (gesture.dx !== 0) {
          resetPosition();
        }
      }
    },
    onPanResponderTerminate: () => {
      // 只在手势被系统终止时回正
      if (position.x._value !== 0) {
        resetPosition();
      }
    },
  });

  const forceSwipe = (direction: 'right' | 'left') => {
    const x = direction === 'right' ? SCREEN_WIDTH : -SCREEN_WIDTH;
    Animated.timing(position, {
      toValue: { x, y: 0 },
      duration: SWIPE_OUT_DURATION,
      useNativeDriver: false,
    }).start(() => {
      // 确保动画完成后重置位置
      position.setValue({ x: 0, y: 0 });
      onSwipeComplete(direction);
    });
  };

  const onSwipeComplete = (direction: 'right' | 'left') => {
    const item = cards[currentIndex];
    direction === 'right' ? console.log('Like:', item) : console.log('Dislike:', item);
    position.setValue({ x: 0, y: 0 });
    setCurrentIndex(currentIndex + 1);
  };

  const getCardStyle = () => {
    const rotate = position.x.interpolate({
      inputRange: [-SCREEN_WIDTH * 1.5, 0, SCREEN_WIDTH * 1.5],
      outputRange: ['-120deg', '0deg', '120deg'],
    });

    return {
      ...position.getLayout(),
      transform: [{ rotate }],
    };
  };

  const renderCard = () => {
    if (currentIndex >= cards.length) {
      return (
        <View style={styles.noMoreCards}>
          <Text style={styles.noMoreCardsText}>{t('common.match.noMoreCards')}</Text>
        </View>
      );
    }

    const card = cards[currentIndex];

    return (
      <Animated.View
        style={[styles.card, getCardStyle()]}
        {...panResponder.panHandlers}
      >
        <View style={styles.petNameOverlay}>
          <Text style={styles.petNameText}>{card.petName}</Text>
        </View>
        <Image source={{ uri: card.petImage }} style={styles.petImage} />
        <View style={styles.cardInfo}>
          <View style={styles.ownerInfo}>
            <Image source={{ uri: card.ownerAvatar }} style={styles.ownerAvatar} />
            <View style={styles.ownerTextContainer}>
              <Text style={styles.ownerName} numberOfLines={1}>
                {card.ownerName}
              </Text>
            </View>
          </View>
          <View style={styles.petInfoContainer}>
            <Text style={styles.petDetails} numberOfLines={1}>
              {card.petAge} {t('common.match.years')} • {card.petBreed}
            </Text>
          </View>
        </View>
      </Animated.View>
    );
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: themeIsDarkMode ? colors.gray[900] : colors.white,
    },
    scrollContent: {
      flexGrow: 1,
    },
    cardContainer: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: 20,
    },
    card: {
      width: SCREEN_WIDTH * 0.9,
      height: SCREEN_HEIGHT * 0.7,
      borderRadius: 20,
      backgroundColor: themeIsDarkMode ? colors.gray[800] : colors.white,
      shadowColor: themeIsDarkMode ? colors.white : colors.black,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,
    },
    petImage: {
      width: '100%',
      height: '85%',
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
    },
    cardInfo: {
      padding: 15,
      backgroundColor: themeIsDarkMode ? colors.gray[800] : colors.white,
      borderBottomLeftRadius: 20,
      borderBottomRightRadius: 20,
      marginTop: -20,
    },
    ownerInfo: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 8,
    },
    ownerAvatar: {
      width: 40,
      height: 40,
      borderRadius: 20,
      marginRight: 10,
    },
    ownerTextContainer: {
      flex: 1,
    },
    ownerName: {
      fontSize: 16,
      fontWeight: 'bold',
      color: themeIsDarkMode ? colors.white : colors.gray[800],
    },
    petInfoContainer: {
      marginLeft: 50,
    },
    petDetails: {
      fontSize: 14,
      color: themeIsDarkMode ? colors.gray[300] : colors.gray[600],
    },
    buttonsContainer: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      width: '100%',
      paddingHorizontal: 100,
      paddingBottom: 20,
    },
    button: {
      width: 45,
      height: 45,
      borderRadius: 22.5,
      backgroundColor: themeIsDarkMode ? colors.gray[800] : colors.white,
      justifyContent: 'center',
      alignItems: 'center',
      shadowColor: themeIsDarkMode ? colors.white : colors.black,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,
    },
    dislikeButton: {
      borderWidth: 2,
      borderColor: colors.red,
    },
    likeButton: {
      borderWidth: 2,
      borderColor: colors.green,
    },
    noMoreCards: {
      width: SCREEN_WIDTH * 0.9,
      height: SCREEN_HEIGHT * 0.7,
      borderRadius: 20,
      backgroundColor: themeIsDarkMode ? colors.gray[800] : colors.gray[100],
      justifyContent: 'center',
      alignItems: 'center',
    },
    noMoreCardsText: {
      fontSize: 18,
      color: themeIsDarkMode ? colors.gray[300] : colors.gray[600],
    },
    petNameOverlay: {
      position: 'absolute',
      top: 20,
      left: 0,
      right: 0,
      alignItems: 'center',
      zIndex: 1,
    },
    petNameText: {
      fontSize: 24,
      fontWeight: 'bold',
      color: colors.white,
      textShadowColor: 'rgba(0, 0, 0, 0.75)',
      textShadowOffset: { width: 1, height: 1 },
      textShadowRadius: 3,
      backgroundColor: 'rgba(0, 0, 0, 0.3)',
      paddingHorizontal: 20,
      paddingVertical: 8,
      borderRadius: 20,
    },
  });

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: themeIsDarkMode ? colors.gray[900] : colors.white }]}
      contentContainerStyle={styles.scrollContent}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          colors={[colors.primary]}
          tintColor={colors.primary}
          enabled={currentIndex >= cards.length}
        />
      }
      scrollEnabled={currentIndex >= cards.length}
    >
      <StatusBar barStyle={themeIsDarkMode ? "light-content" : "dark-content"} />
      <View style={styles.cardContainer}>
        {renderCard()}
      </View>
      <View style={styles.buttonsContainer}>
        <TouchableOpacity
          style={[styles.button, styles.dislikeButton]}
          onPress={() => forceSwipe('left')}
        >
          <FontAwesome5 name="times" size={20} color={colors.red} />
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, styles.likeButton]}
          onPress={() => forceSwipe('right')}
        >
          <FontAwesome5 name="heart" size={20} color={colors.green} />
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
} 