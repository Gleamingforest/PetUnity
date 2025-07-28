import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { colors } from '../constants/Styles';
import { useTheme } from '../contexts/ThemeContext';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { useNavigation } from '@react-navigation/native';
import { getGeminiModel } from '../firebase';
import { getFunctions, httpsCallable } from 'firebase/functions';
import openaiService from '../services/openaiService';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
  isLoading?: boolean;
}

export default function AIChat() {
  const { isDarkMode } = useTheme();
  const { t } = useLanguage();
  const { user } = useAuth();
  const navigation = useNavigation();
  
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: t('common.aiChat.welcome'),
      isUser: false,
      timestamp: new Date(),
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const flatListRef = useRef<FlatList>(null);

  // 自动滚动到底部
  useEffect(() => {
    if (messages.length > 0) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages]);

  // 发送消息到 AI
  const sendMessage = async () => {
    if (!inputText.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText.trim(),
      isUser: true,
      timestamp: new Date(),
    };

    // 添加用户消息
    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsLoading(true);

    // 添加 AI 正在输入的占位消息
    const aiLoadingMessage: Message = {
      id: (Date.now() + 1).toString(),
      text: '',
      isUser: false,
      timestamp: new Date(),
      isLoading: true,
    };
    setMessages(prev => [...prev, aiLoadingMessage]);

    try {
      // 尝试使用真正的 Firebase AI Logic
      const response = await callFirebaseAILogic(inputText.trim());
      
      // 移除加载消息，添加 AI 回复
      setMessages(prev => {
        const filtered = prev.filter(msg => !msg.isLoading);
        return [...filtered, {
          id: (Date.now() + 2).toString(),
          text: response.ai_response || '抱歉，我现在无法回答这个问题。',
          isUser: false,
          timestamp: new Date(),
        }];
      });
    } catch (error) {
      console.error('AI 聊天错误:', error);
      Alert.alert(t('common.aiChat.error'), t('common.aiChat.errorMessage'));
      
      // 移除加载消息
      setMessages(prev => prev.filter(msg => !msg.isLoading));
    } finally {
      setIsLoading(false);
    }
  };

  // 调用真正的 AI 服务（优先 OpenAI，然后是 Firebase Functions）
  const callFirebaseAILogic = async (message: string) => {
    try {
      // 首先尝试 OpenAI
      if (openaiService.isValidApiKey()) {
        console.log('🤖 尝试使用 OpenAI API');
        const response = await openaiService.sendMessage(message, t('common.language') as 'zh' | 'en');
        console.log('✅ OpenAI API 调用成功');
        return { ai_response: response };
      }
      
      // 如果 OpenAI 不可用，尝试 Firebase Functions
      console.log('🤖 尝试使用 Firebase Functions AI 服务');
      
      // 初始化 Firebase Functions
      const functions = getFunctions();
      const aiChatFunction = httpsCallable(functions, 'aiChat');
      
      // 调用 Firebase Function
      const result = await aiChatFunction({
        message: message,
        language: t('common.language')
      });
      
      const data = result.data as any;
      console.log('✅ Firebase Functions AI 调用成功');
      return { ai_response: data.response };
      
    } catch (error) {
      console.log('❌ AI 服务调用失败，使用回退方案');
      console.error('AI Service Error:', error);
      return await callFallbackAI(message);
    }
  };

  // 回退 AI 服务（当 Firebase AI Logic 不可用时）
  const callFallbackAI = async (message: string) => {
    // 模拟网络延迟
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));

    const responses = {
      zh: {
        greeting: '你好！我是你的宠物护理助手，有什么可以帮助你的吗？',
        care: '关于宠物护理，我建议定期检查宠物的健康状况，保持适当的运动和营养。',
        food: '宠物饮食很重要！建议根据宠物的年龄、体重和健康状况选择合适的食物。',
        exercise: '宠物运动对健康很重要，建议每天进行适当的运动，比如散步或玩耍。',
        health: '定期带宠物去兽医检查很重要，可以预防疾病并及早发现问题。',
        default: '这是一个很好的问题！作为宠物护理助手，我会尽力帮助你。'
      },
      en: {
        greeting: 'Hello! I\'m your pet care assistant. How can I help you?',
        care: 'For pet care, I recommend regular health checks, proper exercise and nutrition.',
        food: 'Pet nutrition is important! I suggest choosing food based on your pet\'s age, weight and health condition.',
        exercise: 'Pet exercise is crucial for health. I recommend daily activities like walks or playtime.',
        health: 'Regular vet checkups are important to prevent diseases and catch issues early.',
        default: 'That\'s a great question! As a pet care assistant, I\'ll do my best to help you.'
      }
    };

    const lang = t('common.language') === 'zh' ? 'zh' : 'en';
    let response = responses[lang].default;

    // 简单的关键词匹配
    const lowerMessage = message.toLowerCase();
    if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || message.includes('你好')) {
      response = responses[lang].greeting;
    } else if (lowerMessage.includes('care') || message.includes('护理') || message.includes('照顾')) {
      response = responses[lang].care;
    } else if (lowerMessage.includes('food') || lowerMessage.includes('eat') || message.includes('食物') || message.includes('吃')) {
      response = responses[lang].food;
    } else if (lowerMessage.includes('exercise') || lowerMessage.includes('walk') || message.includes('运动') || message.includes('散步')) {
      response = responses[lang].exercise;
    } else if (lowerMessage.includes('health') || lowerMessage.includes('sick') || message.includes('健康') || message.includes('生病')) {
      response = responses[lang].health;
    }

    return { ai_response: response };
  };

  // 渲染消息
  const renderMessage = ({ item }: { item: Message }) => (
    <View style={[
      styles.messageContainer,
      item.isUser ? styles.userMessage : styles.aiMessage,
      { backgroundColor: item.isUser 
        ? colors.primary 
        : isDarkMode ? colors.gray[800] : colors.gray[100]
      }
    ]}>
      {item.isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="small" color={colors.primary} />
          <Text style={[styles.loadingText, { color: isDarkMode ? colors.gray[400] : colors.gray[600] }]}>
            {t('common.aiChat.thinking')}
          </Text>
        </View>
      ) : (
        <Text style={[
          styles.messageText,
          { color: item.isUser ? colors.white : isDarkMode ? colors.white : colors.gray[900] }
        ]}>
          {item.text}
        </Text>
      )}
      <Text style={[
        styles.timestamp,
        { color: item.isUser ? colors.white + '80' : isDarkMode ? colors.gray[400] : colors.gray[500] }
      ]}>
        {item.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
      </Text>
    </View>
  );

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: isDarkMode ? colors.gray[900] : colors.white }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      {/* 消息列表 */}
      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.messagesList}
        showsVerticalScrollIndicator={false}
      />

      {/* 输入区域 */}
      <View style={[
        styles.inputContainer,
        { backgroundColor: isDarkMode ? colors.gray[800] : colors.gray[100] }
      ]}>
        <TextInput
          style={[
            styles.input,
            { 
              backgroundColor: isDarkMode ? colors.gray[700] : colors.white,
              color: isDarkMode ? colors.white : colors.gray[900]
            }
          ]}
          value={inputText}
          onChangeText={setInputText}
          placeholder={t('common.aiChat.placeholder')}
          placeholderTextColor={isDarkMode ? colors.gray[400] : colors.gray[600]}
          multiline
          maxLength={500}
        />
        <TouchableOpacity
          style={[
            styles.sendButton,
            (!inputText.trim() || isLoading) && styles.sendButtonDisabled
          ]}
          onPress={sendMessage}
          disabled={!inputText.trim() || isLoading}
        >
          {isLoading ? (
            <ActivityIndicator size={20} color={colors.white} />
          ) : (
            <FontAwesome5 name="paper-plane" size={20} color={colors.white} />
          )}
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = {
  container: {
    flex: 1,
  },
  messagesList: {
    padding: 16,
    paddingBottom: 8,
  },
  messageContainer: {
    maxWidth: '80%',
    padding: 12,
    borderRadius: 16,
    marginBottom: 8,
  },
  userMessage: {
    alignSelf: 'flex-end',
    borderBottomRightRadius: 4,
  },
  aiMessage: {
    alignSelf: 'flex-start',
    borderBottomLeftRadius: 4,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 22,
  },
  timestamp: {
    fontSize: 12,
    marginTop: 4,
    opacity: 0.7,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  loadingText: {
    fontSize: 14,
    fontStyle: 'italic',
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 16,
    gap: 12,
    alignItems: 'flex-end',
  },
  input: {
    flex: 1,
    minHeight: 40,
    maxHeight: 100,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    fontSize: 16,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: colors.gray[400],
  },
}; 