import { database } from './firebase';
import { ref, remove, get } from 'firebase/database';
import { auth } from './firebase';

// 清理错误的好友数据
export const cleanupFriends = async () => {
  try {
    const currentUser = auth.currentUser;
    if (!currentUser) {
      console.log('❌ 用户未登录');
      return;
    }

    console.log('🧹 开始清理好友数据...');
    console.log('👤 当前用户ID:', currentUser.uid);

    // 检查并删除自己作为好友的错误数据
    const selfFriendRef = ref(database, `users/${currentUser.uid}/friends/${currentUser.uid}`);
    const selfFriendSnapshot = await get(selfFriendRef);
    
    if (selfFriendSnapshot.exists()) {
      console.log('⚠️ 发现错误数据：自己作为好友存在');
      await remove(selfFriendRef);
      console.log('✅ 已删除错误的好友数据');
    } else {
      console.log('✅ 没有发现错误的好友数据');
    }

    // 检查其他用户是否也有类似问题
    const allUsersRef = ref(database, 'users');
    const allUsersSnapshot = await get(allUsersRef);
    
    allUsersSnapshot.forEach(async (childSnapshot) => {
      const userId = childSnapshot.key;
      if (userId !== currentUser.uid) {
        const otherUserSelfFriendRef = ref(database, `users/${userId}/friends/${userId}`);
        const otherUserSelfFriendSnapshot = await get(otherUserSelfFriendRef);
        
        if (otherUserSelfFriendSnapshot.exists()) {
          console.log(`⚠️ 用户 ${userId} 也有错误的好友数据`);
          await remove(otherUserSelfFriendRef);
          console.log(`✅ 已删除用户 ${userId} 的错误数据`);
        }
      }
    });

    console.log('🎉 清理完成！');

  } catch (error) {
    console.error('❌ 清理失败:', error);
  }
}; 