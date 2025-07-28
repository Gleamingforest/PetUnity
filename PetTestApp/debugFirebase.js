import { database } from './firebase';
import { ref, get } from 'firebase/database';
import { auth } from './firebase';

// 调试Firebase数据
export const debugFirebaseData = async () => {
  try {
    const currentUser = auth.currentUser;
    if (!currentUser) {
      console.log('❌ 用户未登录');
      return;
    }

    console.log('🔍 开始调试Firebase数据...');
    console.log('👤 当前用户ID:', currentUser.uid);

    // 检查用户资料
    const userRef = ref(database, `users/${currentUser.uid}`);
    const userSnapshot = await get(userRef);
    
    if (userSnapshot.exists()) {
      console.log('✅ 用户资料存在:', userSnapshot.val());
    } else {
      console.log('❌ 用户资料不存在');
    }

    // 检查好友列表
    const friendsRef = ref(database, `users/${currentUser.uid}/friends`);
    const friendsSnapshot = await get(friendsRef);
    
    if (friendsSnapshot.exists()) {
      console.log('✅ 好友列表存在:');
      friendsSnapshot.forEach((childSnapshot) => {
        console.log('  - 好友:', childSnapshot.key, ':', childSnapshot.val());
      });
    } else {
      console.log('❌ 好友列表不存在');
    }

    // 检查好友请求
    const requestsRef = ref(database, 'friendRequests');
    const requestsSnapshot = await get(requestsRef);
    
    if (requestsSnapshot.exists()) {
      console.log('✅ 好友请求存在:');
      requestsSnapshot.forEach((childSnapshot) => {
        const request = childSnapshot.val();
        if (request.fromUserId === currentUser.uid || request.toUserId === currentUser.uid) {
          console.log('  - 请求:', childSnapshot.key, ':', request);
        }
      });
    } else {
      console.log('❌ 好友请求不存在');
    }

    // 检查所有用户
    const allUsersRef = ref(database, 'users');
    const allUsersSnapshot = await get(allUsersRef);
    
    if (allUsersSnapshot.exists()) {
      console.log('✅ 所有用户:');
      allUsersSnapshot.forEach((childSnapshot) => {
        const user = childSnapshot.val();
        console.log('  - 用户:', childSnapshot.key, ':', {
          name: user.name,
          email: user.email,
          hasFriends: user.friends ? Object.keys(user.friends).length : 0
        });
      });
    } else {
      console.log('❌ 没有用户数据');
    }

  } catch (error) {
    console.error('❌ 调试失败:', error);
  }
}; 