import { database } from '../firebase';
import { 
  ref, 
  push, 
  onValue, 
  off, 
  query, 
  orderByChild, 
  set,
  get,
  update,
  remove
} from 'firebase/database';
import { auth } from '../firebase';

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  bio?: string;
  isOnline?: boolean;
  lastSeen?: number;
}

export interface FriendRequest {
  id: string;
  fromUserId: string;
  toUserId: string;
  status: 'pending' | 'accepted' | 'rejected';
  timestamp: number;
  fromUserName: string;
  fromUserAvatar?: string;
}

export interface Friend {
  id: string;
  name: string;
  avatar?: string;
  isOnline?: boolean;
  lastSeen?: number;
}

class FriendService {
  // 搜索用户
  async searchUsers(searchTerm: string): Promise<User[]> {
    const usersRef = ref(database, 'users');
    const snapshot = await get(usersRef);
    
    const users: User[] = [];
    const currentUser = auth.currentUser;
    
    snapshot.forEach((childSnapshot) => {
      const user = childSnapshot.val();
      const userId = childSnapshot.key!;
      
      // 排除当前用户
      if (userId !== currentUser?.uid) {
        // 搜索用户名或邮箱
        if (user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email?.toLowerCase().includes(searchTerm.toLowerCase())) {
          users.push({
            id: userId,
            ...user
          });
        }
      }
    });
    
    return users;
  }

  // 发送好友请求
  async sendFriendRequest(toUserId: string): Promise<string> {
    const currentUser = auth.currentUser;
    if (!currentUser) {
      throw new Error('用户未登录');
    }

    // 检查是否已经是好友
    const isFriend = await this.checkIfFriends(currentUser.uid, toUserId);
    if (isFriend) {
      throw new Error('已经是好友了');
    }

    // 检查是否已经发送过请求
    const existingRequest = await this.getFriendRequest(currentUser.uid, toUserId);
    if (existingRequest) {
      throw new Error('已经发送过好友请求了');
    }

    const requestsRef = ref(database, 'friendRequests');
    const newRequestRef = push(requestsRef);
    
    const requestData: any = {
      id: newRequestRef.key!,
      fromUserId: currentUser.uid,
      toUserId: toUserId,
      status: 'pending',
      timestamp: Date.now(),
      fromUserName: currentUser.displayName || '用户'
    };

    // 只有当头像存在时才添加
    if (currentUser.photoURL) {
      requestData.fromUserAvatar = currentUser.photoURL;
    }

    await set(newRequestRef, requestData);
    return newRequestRef.key!;
  }

  // 获取好友请求
  async getFriendRequests(userId: string): Promise<FriendRequest[]> {
    const requestsRef = ref(database, 'friendRequests');
    const snapshot = await get(requestsRef);
    
    const requests: FriendRequest[] = [];
    snapshot.forEach((childSnapshot) => {
      const request = childSnapshot.val();
      if (request.toUserId === userId && request.status === 'pending') {
        requests.push(request);
      }
    });
    
    return requests.sort((a, b) => b.timestamp - a.timestamp);
  }

  // 监听好友请求
  onFriendRequests(userId: string, callback: (requests: FriendRequest[]) => void) {
    const requestsRef = ref(database, 'friendRequests');
    
    const unsubscribe = onValue(requestsRef, (snapshot) => {
      const requests: FriendRequest[] = [];
      snapshot.forEach((childSnapshot) => {
        const request = childSnapshot.val();
        if (request.toUserId === userId && request.status === 'pending') {
          requests.push(request);
        }
      });
      
      const sortedRequests = requests.sort((a, b) => b.timestamp - a.timestamp);
      callback(sortedRequests);
    });

    return unsubscribe;
  }

  // 接受好友请求
  async acceptFriendRequest(requestId: string): Promise<void> {
    const currentUser = auth.currentUser;
    if (!currentUser) {
      throw new Error('用户未登录');
    }

    const requestRef = ref(database, `friendRequests/${requestId}`);
    const snapshot = await get(requestRef);
    
    if (!snapshot.exists()) {
      throw new Error('好友请求不存在');
    }

    const request = snapshot.val();
    if (request.toUserId !== currentUser.uid) {
      throw new Error('无权操作此请求');
    }

    // 更新请求状态
    await update(requestRef, { status: 'accepted' });

    // 添加到好友列表
    const userFriendsRef = ref(database, `users/${currentUser.uid}/friends/${request.fromUserId}`);
    const otherUserFriendsRef = ref(database, `users/${request.fromUserId}/friends/${currentUser.uid}`);

    const userFriendData: any = {
      id: request.fromUserId,
      name: request.fromUserName,
      addedAt: Date.now()
    };

    // 只有当头像存在时才添加
    if (request.fromUserAvatar) {
      userFriendData.avatar = request.fromUserAvatar;
    }

    await set(userFriendsRef, userFriendData);

    // 获取当前用户信息
    const currentUserRef = ref(database, `users/${currentUser.uid}`);
    const currentUserSnapshot = await get(currentUserRef);
    const currentUserData = currentUserSnapshot.val();

    const otherUserFriendData: any = {
      id: currentUser.uid,
      name: currentUserData?.name || currentUser.displayName || '用户',
      addedAt: Date.now()
    };

    // 只有当头像存在时才添加
    const avatar = currentUserData?.avatar || currentUser.photoURL;
    if (avatar) {
      otherUserFriendData.avatar = avatar;
    }

    await set(otherUserFriendsRef, otherUserFriendData);
  }

  // 拒绝好友请求
  async rejectFriendRequest(requestId: string): Promise<void> {
    const currentUser = auth.currentUser;
    if (!currentUser) {
      throw new Error('用户未登录');
    }

    const requestRef = ref(database, `friendRequests/${requestId}`);
    const snapshot = await get(requestRef);
    
    if (!snapshot.exists()) {
      throw new Error('好友请求不存在');
    }

    const request = snapshot.val();
    if (request.toUserId !== currentUser.uid) {
      throw new Error('无权操作此请求');
    }

    await update(requestRef, { status: 'rejected' });
  }

  // 获取好友列表
  async getFriends(userId: string): Promise<Friend[]> {
    console.log('🔍 FriendService.getFriends 被调用');
    console.log('👤 用户ID:', userId);
    
    // 首先检查用户是否存在
    const userRef = ref(database, `users/${userId}`);
    const userSnapshot = await get(userRef);
    console.log('📊 用户数据存在:', userSnapshot.exists());
    
    if (!userSnapshot.exists()) {
      console.log('❌ 用户数据不存在，无法获取好友');
      return [];
    }
    
    const friendsRef = ref(database, `users/${userId}/friends`);
    console.log('📂 数据库路径:', `users/${userId}/friends`);
    
    const snapshot = await get(friendsRef);
    console.log('📊 数据库快照存在:', snapshot.exists());
    console.log('📊 数据库快照值:', snapshot.val());
    
    const friends: Friend[] = [];
    if (snapshot.exists()) {
      snapshot.forEach((childSnapshot) => {
        const friend = childSnapshot.val();
        console.log('👥 发现好友:', childSnapshot.key, friend);
        
        // 过滤掉自己（防止自己出现在好友列表中）
        if (childSnapshot.key !== userId) {
          friends.push({
            id: childSnapshot.key!,
            ...friend
          });
        } else {
          console.log('⚠️ 过滤掉自己:', childSnapshot.key);
        }
      });
    } else {
      console.log('❌ 数据库中没有好友数据');
    }
    
    console.log('✅ 最终好友列表:', friends);
    return friends.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
  }

  // 监听好友列表
  onFriends(userId: string, callback: (friends: Friend[]) => void) {
    console.log('🔍 FriendService.onFriends 开始监听');
    console.log('👤 监听用户ID:', userId);
    
    const friendsRef = ref(database, `users/${userId}/friends`);
    
    const unsubscribe = onValue(friendsRef, (snapshot) => {
      console.log('🔄 onFriends 监听器触发');
      console.log('📊 快照存在:', snapshot.exists());
      console.log('📊 快照值:', snapshot.val());
      
      const friends: Friend[] = [];
      if (snapshot.exists()) {
        snapshot.forEach((childSnapshot) => {
          const friend = childSnapshot.val();
          console.log('👥 监听器发现好友:', childSnapshot.key, friend);
          
          // 过滤掉自己（防止自己出现在好友列表中）
          if (childSnapshot.key !== userId) {
            friends.push({
              id: childSnapshot.key!,
              ...friend
            });
          } else {
            console.log('⚠️ 监听器过滤掉自己:', childSnapshot.key);
          }
        });
      } else {
        console.log('❌ 监听器: 数据库中没有好友数据');
      }
      
      const sortedFriends = friends.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
      console.log('✅ 监听器最终好友列表:', sortedFriends);
      callback(sortedFriends);
    });

    return unsubscribe;
  }

  // 删除好友
  async removeFriend(friendId: string): Promise<void> {
    const currentUser = auth.currentUser;
    if (!currentUser) {
      throw new Error('用户未登录');
    }

    // 从双方的好友列表中删除
    const userFriendsRef = ref(database, `users/${currentUser.uid}/friends/${friendId}`);
    const otherUserFriendsRef = ref(database, `users/${friendId}/friends/${currentUser.uid}`);

    await remove(userFriendsRef);
    await remove(otherUserFriendsRef);
  }

  // 检查是否已经是好友
  async checkIfFriends(userId1: string, userId2: string): Promise<boolean> {
    // 不能添加自己为好友
    if (userId1 === userId2) {
      return false;
    }
    
    const friendRef = ref(database, `users/${userId1}/friends/${userId2}`);
    const snapshot = await get(friendRef);
    return snapshot.exists();
  }

  // 获取特定的好友请求
  async getFriendRequest(fromUserId: string, toUserId: string): Promise<FriendRequest | null> {
    const requestsRef = ref(database, 'friendRequests');
    const snapshot = await get(requestsRef);
    
    let request: FriendRequest | null = null;
    snapshot.forEach((childSnapshot) => {
      const req = childSnapshot.val();
      if (req.fromUserId === fromUserId && req.toUserId === toUserId && req.status === 'pending') {
        request = req;
      }
    });
    
    return request;
  }

  // 创建或更新用户资料
  async createOrUpdateUserProfile(userData: Partial<User>): Promise<void> {
    const currentUser = auth.currentUser;
    if (!currentUser) {
      throw new Error('用户未登录');
    }

    console.log('🔍 创建或更新用户资料:', currentUser.uid);

    const userRef = ref(database, `users/${currentUser.uid}`);
    
    // 首先检查现有用户数据
    const snapshot = await get(userRef);
    const existingData = snapshot.exists() ? snapshot.val() : {};
    
    console.log('📊 现有用户数据:', existingData);
    
    // 只更新基本资料，保留好友数据
    const updateData = {
      id: currentUser.uid,
      name: userData.name || currentUser.displayName || '用户',
      email: userData.email || currentUser.email || '',
      avatar: userData.avatar || currentUser.photoURL || '',
      bio: userData.bio || '',
      updatedAt: Date.now(),
      // 保留现有的好友数据
      friends: existingData.friends || {},
      // 保留其他现有数据
      ...existingData
    };
    
    console.log('📝 更新后的用户数据:', updateData);
    
    await set(userRef, updateData);
    console.log('✅ 用户资料更新完成');
  }

  // 安全更新用户资料（只更新指定字段）
  async safeUpdateUserProfile(userData: Partial<User>): Promise<void> {
    const currentUser = auth.currentUser;
    if (!currentUser) {
      throw new Error('用户未登录');
    }

    console.log('🔒 安全更新用户资料:', currentUser.uid);

    const userRef = ref(database, `users/${currentUser.uid}`);
    
    // 只更新指定的字段，不影响其他数据
    const updateFields: any = {};
    
    if (userData.name) updateFields.name = userData.name;
    if (userData.email) updateFields.email = userData.email;
    if (userData.avatar) updateFields.avatar = userData.avatar;
    if (userData.bio) updateFields.bio = userData.bio;
    
    updateFields.updatedAt = Date.now();
    
    console.log('📝 要更新的字段:', updateFields);
    
    // 使用 update 方法只更新指定字段
    await update(userRef, updateFields);
    console.log('✅ 用户资料安全更新完成');
  }

  // 测试方法：手动添加测试好友
  async addTestFriend(userId: string, friendId: string, friendName: string): Promise<void> {
    console.log('🧪 添加测试好友:', { userId, friendId, friendName });
    
    const friendRef = ref(database, `users/${userId}/friends/${friendId}`);
    await set(friendRef, {
      id: friendId,
      name: friendName,
      addedAt: Date.now()
    });
    
    console.log('✅ 测试好友添加成功');
  }

  // 测试方法：检查用户数据完整性
  async checkUserData(userId: string): Promise<any> {
    console.log('🔍 检查用户数据完整性:', userId);
    
    const userRef = ref(database, `users/${userId}`);
    const snapshot = await get(userRef);
    
    if (snapshot.exists()) {
      const userData = snapshot.val();
      console.log('✅ 用户数据存在:', userData);
      return userData;
    } else {
      console.log('❌ 用户数据不存在');
      return null;
    }
  }
}

export const friendService = new FriendService();
export default friendService; 