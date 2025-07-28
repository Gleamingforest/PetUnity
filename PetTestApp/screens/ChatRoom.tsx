import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { useLanguage } from '../contexts/LanguageContext';
import { colors } from '../constants/Styles';
import { chatService, Message } from '../services/ChatService';
import ChatMessage from '../components/ChatMessage';
import { auth } from '../firebase';



export default function ChatRoom({ route, navigation }: any) {
  const { chatId, otherUserId, otherUserName } = route.params as { 
    chatId: string; 
    otherUserId: string; 
    otherUserName: string; 
  };
  const { t } = useLanguage();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(true);
  const [chatRoomId, setChatRoomId] = useState<string>('');
  // 移除本地消息状态，简化逻辑
  const flatListRef = useRef<FlatList>(null);

  // 监控消息状态变化
  useEffect(() => {
    console.log('📊 消息状态变化:', {
      messagesCount: messages.length,
      displayMessagesCount: messages.length
    });
  }, [messages]);

  // 设置导航栏标题
  React.useLayoutEffect(() => {
    navigation.setOptions({
      title: otherUserName,
    });
  }, [navigation, otherUserName]);

  // 初始化聊天室
  useEffect(() => {
    const initializeChat = async () => {
      try {
        const currentUser = auth.currentUser;
        if (!currentUser) {
          Alert.alert('错误', '用户未登录');
          return;
        }

        // 使用传入的chatId或创建新的聊天室
        let roomId = chatId;
        if (!roomId) {
          roomId = await chatService.getOrCreateChatRoom([currentUser.uid, otherUserId]);
        }
        setChatRoomId(roomId);

        // 监听消息
        const unsubscribe = chatService.onMessages(roomId, (newMessages) => {
          console.log('🔄 ChatRoom 收到新消息列表:', newMessages);
          console.log('📊 消息数量:', newMessages.length);
          
          // 避免重复设置相同的消息列表
          setMessages(prevMessages => {
            // 简单比较消息数量和最后一条消息ID
            if (prevMessages.length === newMessages.length && 
                prevMessages.length > 0 && 
                newMessages.length > 0 &&
                prevMessages[prevMessages.length - 1]?.id === newMessages[newMessages.length - 1]?.id) {
              console.log('🔄 消息列表相同，跳过更新');
              return prevMessages;
            }
            console.log('🔄 消息列表已更新, 新数量:', newMessages.length);
            return newMessages;
          });
          
          setLoading(false);
        });

        // 标记消息为已读
        await chatService.markMessagesAsRead(roomId, currentUser.uid);

        return unsubscribe;
      } catch (error) {
        console.error('初始化聊天失败:', error);
        Alert.alert('错误', '初始化聊天失败');
        setLoading(false);
      }
    };

    const unsubscribe = initializeChat();
    return () => {
      unsubscribe.then(unsub => unsub && unsub());
    };
  }, [chatId, otherUserId]);

  const sendMessage = async () => {
    if (!inputText.trim() || !chatRoomId) return;

    console.log('📤 ChatRoom 开始发送消息');
    console.log('📝 输入文本:', inputText);
    console.log('🏠 聊天室ID:', chatRoomId);

    try {
      const currentUser = auth.currentUser;
      if (!currentUser) {
        Alert.alert('错误', '用户未登录');
        return;
      }

      const messageData: any = {
        text: inputText.trim(),
        senderId: currentUser.uid,
        senderName: currentUser.displayName || '用户',
        type: 'text'
      };

      // 只有当头像存在时才添加
      if (currentUser.photoURL) {
        messageData.senderAvatar = currentUser.photoURL;
      }

      console.log('📨 准备发送的消息数据:', messageData);

      // 直接发送消息到服务器，不使用本地消息
      console.log('📨 准备发送的消息数据:', messageData);

      // 清空输入框
      setInputText('');

      // 发送消息到服务器
      await chatService.sendMessage(chatRoomId, messageData);
      console.log('✅ 消息发送成功');
    } catch (error) {
      console.error('❌ 发送消息失败:', error);
      Alert.alert('错误', '发送消息失败');
    }
  };

  const handleMessageLongPress = (message: Message) => {
    const currentUser = auth.currentUser;
    if (message.senderId === currentUser?.uid) {
      Alert.alert(
        '消息操作',
        '选择操作',
        [
          { text: '删除', onPress: () => deleteMessage(message.id), style: 'destructive' },
          { text: '取消', style: 'cancel' }
        ]
      );
    }
  };

  const deleteMessage = async (messageId: string) => {
    try {
      await chatService.deleteMessage(chatRoomId, messageId);
    } catch (error) {
      console.error('删除消息失败:', error);
      Alert.alert('错误', '删除消息失败');
    }
  };

  const renderMessage = ({ item }: { item: Message }) => {
    console.log('🎨 渲染消息:', item.id, item.text);
    return (
      <ChatMessage 
        message={item} 
        onLongPress={handleMessageLongPress}
      />
    );
  };

  // 直接使用消息列表，简化逻辑
  const getDisplayMessages = React.useMemo(() => {
    return messages;
  }, [messages]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>加载聊天记录...</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      <FlatList
        ref={flatListRef}
        data={getDisplayMessages}
        renderItem={renderMessage}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.messagesList}
        inverted={false}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
        onLayout={() => flatListRef.current?.scrollToEnd({ animated: true })}
        removeClippedSubviews={false}
        maxToRenderPerBatch={10}
        windowSize={10}
        initialNumToRender={20}
      />
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={inputText}
          onChangeText={setInputText}
          placeholder={t('common.chat.placeholder')}
          multiline
        />
        <TouchableOpacity
          style={[styles.sendButton, !inputText.trim() && styles.sendButtonDisabled]}
          onPress={sendMessage}
          disabled={!inputText.trim()}
        >
          <FontAwesome5 name="paper-plane" size={20} color={colors.white} />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.white,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: colors.gray[600],
  },
  messagesList: {
    padding: 10,
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: colors.gray[200],
    backgroundColor: colors.white,
  },
  input: {
    flex: 1,
    backgroundColor: colors.gray[100],
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginRight: 10,
    maxHeight: 100,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: colors.gray[400],
  },
}); 