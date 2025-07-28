import { database } from '../firebase';
import { 
  ref, 
  push, 
  onValue, 
  off, 
  query, 
  orderByChild, 
  limitToLast,
  serverTimestamp,
  set,
  get
} from 'firebase/database';
import { auth } from '../firebase';

export interface Message {
  id: string;
  text: string;
  senderId: string;
  senderName: string;
  senderAvatar?: string;
  timestamp: number;
  type: 'text' | 'image' | 'location';
  imageUrl?: string;
  location?: {
    latitude: number;
    longitude: number;
    address?: string;
  };
}

export interface ChatRoom {
  id: string;
  participants: string[];
  lastMessage?: Message;
  lastMessageTime?: number;
  unreadCount?: { [userId: string]: number };
}

export interface ChatParticipant {
  id: string;
  name: string;
  avatar?: string;
  isOnline?: boolean;
  lastSeen?: number;
}

class ChatService {
  // 获取或创建聊天室
  async getOrCreateChatRoom(participantIds: string[]): Promise<string> {
    const sortedIds = participantIds.sort();
    const chatRoomId = sortedIds.join('_');
    
    console.log('🔍 获取或创建聊天室:', { chatRoomId, participants: sortedIds });
    
    const chatRoomRef = ref(database, `chatRooms/${chatRoomId}`);
    const snapshot = await get(chatRoomRef);
    
    if (!snapshot.exists()) {
      console.log('📝 创建新聊天室:', chatRoomId);
      // 创建新聊天室
      const timestamp = Date.now();
      await set(chatRoomRef, {
        participants: sortedIds,
        createdAt: timestamp,
        lastMessageTime: timestamp
      });
      console.log('✅ 新聊天室创建成功');
    } else {
      console.log('✅ 聊天室已存在:', chatRoomId);
    }
    
    return chatRoomId;
  }

  // 发送消息
  async sendMessage(chatRoomId: string, message: Omit<Message, 'id' | 'timestamp'>): Promise<string> {
    const currentUser = auth.currentUser;
    if (!currentUser) {
      throw new Error('用户未登录');
    }

    console.log('📤 开始发送消息到聊天室:', chatRoomId);
    console.log('📝 消息内容:', message);

    const messagesRef = ref(database, `chatRooms/${chatRoomId}/messages`);
    const newMessageRef = push(messagesRef);
    
    // 使用服务器时间戳确保时间一致性
    const timestamp = Date.now();
    const messageData: Message = {
      id: newMessageRef.key!,
      ...message,
      timestamp: timestamp
    };

    console.log('📨 完整的消息数据:', messageData);

    // 先保存消息
    await set(newMessageRef, messageData);
    console.log('✅ 消息已保存到数据库');

    // 然后更新聊天室的最后消息
    const chatRoomRef = ref(database, `chatRooms/${chatRoomId}`);
    const lastMessageRef = ref(database, `chatRooms/${chatRoomId}/lastMessage`);
    const lastMessageTimeRef = ref(database, `chatRooms/${chatRoomId}/lastMessageTime`);
    
    await set(lastMessageRef, messageData);
    await set(lastMessageTimeRef, timestamp);
    console.log('✅ 聊天室最后消息已更新');

    return newMessageRef.key!;
  }

  // 监听聊天消息
  onMessages(chatRoomId: string, callback: (messages: Message[]) => void) {
    console.log('🔍 ChatService.onMessages 开始监听聊天室:', chatRoomId);
    
    const messagesRef = ref(database, `chatRooms/${chatRoomId}/messages`);
    const messagesQuery = query(messagesRef, orderByChild('timestamp'), limitToLast(100));
    
    const unsubscribe = onValue(messagesQuery, (snapshot) => {
      console.log('🔄 消息监听器触发，消息数量:', snapshot.numChildren);
      
      const messages: Message[] = [];
      snapshot.forEach((childSnapshot) => {
        const message = childSnapshot.val();
        if (message && message.id) {
          console.log('📨 收到消息:', {
            id: message.id,
            text: message.text,
            senderId: message.senderId,
            timestamp: message.timestamp
          });
          messages.push(message);
        } else {
          console.log('⚠️ 跳过无效消息:', childSnapshot.key, childSnapshot.val());
        }
      });
      
      // 按时间戳排序，确保消息顺序正确
      const sortedMessages = messages.sort((a, b) => a.timestamp - b.timestamp);
      console.log('✅ 排序后的消息列表数量:', sortedMessages.length);
      console.log('✅ 最新消息:', sortedMessages[sortedMessages.length - 1]);
      callback(sortedMessages);
    });

    return unsubscribe;
  }

  // 获取用户的所有聊天室
  async getUserChatRooms(userId: string): Promise<ChatRoom[]> {
    const chatRoomsRef = ref(database, 'chatRooms');
    const snapshot = await get(chatRoomsRef);
    
    const chatRooms: ChatRoom[] = [];
    snapshot.forEach((childSnapshot) => {
      const chatRoom = childSnapshot.val();
      // 检查chatRoom和participants是否存在
      if (chatRoom && chatRoom.participants && Array.isArray(chatRoom.participants) && chatRoom.participants.includes(userId)) {
        chatRooms.push({
          id: childSnapshot.key!,
          ...chatRoom
        });
      }
    });

    return chatRooms.sort((a, b) => (b.lastMessageTime || 0) - (a.lastMessageTime || 0));
  }

  // 监听用户聊天室列表
  onUserChatRooms(userId: string, callback: (chatRooms: ChatRoom[]) => void) {
    console.log('🔍 ChatService.onUserChatRooms 开始监听用户聊天室:', userId);
    
    const chatRoomsRef = ref(database, 'chatRooms');
    
    const unsubscribe = onValue(chatRoomsRef, (snapshot) => {
      console.log('🔄 聊天室监听器触发，总聊天室数量:', snapshot.numChildren);
      
      const chatRooms: ChatRoom[] = [];
      snapshot.forEach((childSnapshot) => {
        const chatRoom = childSnapshot.val();
        console.log('🏠 检查聊天室:', {
          id: childSnapshot.key,
          participants: chatRoom?.participants,
          includesUser: chatRoom?.participants?.includes(userId)
        });
        
        // 检查chatRoom和participants是否存在
        if (chatRoom && chatRoom.participants && Array.isArray(chatRoom.participants) && chatRoom.participants.includes(userId)) {
          console.log('✅ 添加聊天室到列表:', childSnapshot.key);
          chatRooms.push({
            id: childSnapshot.key!,
            ...chatRoom
          });
        }
      });
      
      const sortedRooms = chatRooms.sort((a, b) => (b.lastMessageTime || 0) - (a.lastMessageTime || 0));
      console.log('✅ 用户聊天室列表:', sortedRooms.length, '个聊天室');
      callback(sortedRooms);
    });

    return unsubscribe;
  }

  // 标记消息为已读
  async markMessagesAsRead(chatRoomId: string, userId: string) {
    const chatRoomRef = ref(database, `chatRooms/${chatRoomId}/unreadCount/${userId}`);
    await set(chatRoomRef, 0);
  }

  // 获取未读消息数量
  async getUnreadCount(chatRoomId: string, userId: string): Promise<number> {
    const unreadRef = ref(database, `chatRooms/${chatRoomId}/unreadCount/${userId}`);
    const snapshot = await get(unreadRef);
    return snapshot.val() || 0;
  }

  // 更新用户在线状态
  async updateUserStatus(userId: string, isOnline: boolean) {
    const userRef = ref(database, `users/${userId}/status`);
    await set(userRef, {
      isOnline,
      lastSeen: isOnline ? serverTimestamp() : Date.now()
    });
  }

  // 监听用户状态
  onUserStatus(userId: string, callback: (status: { isOnline: boolean; lastSeen: number }) => void) {
    const userRef = ref(database, `users/${userId}/status`);
    
    const unsubscribe = onValue(userRef, (snapshot) => {
      const status = snapshot.val();
      if (status) {
        callback(status);
      }
    });

    return unsubscribe;
  }

  // 删除消息
  async deleteMessage(chatRoomId: string, messageId: string): Promise<void> {
    const messageRef = ref(database, `chatRooms/${chatRoomId}/messages/${messageId}`);
    await set(messageRef, null);
  }

  // 搜索聊天记录
  async searchMessages(chatRoomId: string, searchText: string): Promise<Message[]> {
    const messagesRef = ref(database, `chatRooms/${chatRoomId}/messages`);
    const snapshot = await get(messagesRef);
    
    const messages: Message[] = [];
    snapshot.forEach((childSnapshot) => {
      const message = childSnapshot.val();
      // 检查message和text是否存在
      if (message && message.text && message.text.toLowerCase().includes(searchText.toLowerCase())) {
        messages.push(message);
      }
    });

    return messages.sort((a, b) => a.timestamp - b.timestamp);
  }
}

export const chatService = new ChatService();
export default chatService; 