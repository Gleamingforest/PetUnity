const { initializeApp } = require('firebase/app');
const { getDatabase, ref, get } = require('firebase/database');

const firebaseConfig = {
  apiKey: "AIzaSyBQJQJQJQJQJQJQJQJQJQJQJQJQJQJQJQ",
  authDomain: "petapp-e1059.firebaseapp.com",
  projectId: "petapp-e1059",
  storageBucket: "petapp-e1059.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdefghijklmnop",
  databaseURL: "https://petapp-e1059-default-rtdb.firebaseio.com"
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

async function debugFriends() {
  console.log('🔍 开始调试好友数据...\n');

  try {
    // 检查用户数据
    console.log('📊 检查用户数据...');
    const usersRef = ref(database, 'users');
    const usersSnapshot = await get(usersRef);
    
    if (usersSnapshot.exists()) {
      console.log('✅ 用户数据存在');
      usersSnapshot.forEach((childSnapshot) => {
        const user = childSnapshot.val();
        console.log(`👤 用户 ${childSnapshot.key}:`, {
          name: user.name,
          email: user.email,
          hasFriends: user.friends ? Object.keys(user.friends).length : 0
        });
        
        // 检查好友数据
        if (user.friends) {
          console.log(`   👥 好友列表 (${Object.keys(user.friends).length}个):`);
          Object.keys(user.friends).forEach(friendId => {
            const friend = user.friends[friendId];
            console.log(`     - ${friendId}: ${friend.name || '未知'}`);
          });
        }
      });
    } else {
      console.log('❌ 用户数据不存在');
    }

    console.log('\n📊 检查好友请求数据...');
    const requestsRef = ref(database, 'friendRequests');
    const requestsSnapshot = await get(requestsRef);
    
    if (requestsSnapshot.exists()) {
      console.log('✅ 好友请求数据存在');
      requestsSnapshot.forEach((childSnapshot) => {
        const request = childSnapshot.val();
        console.log(`📨 请求 ${childSnapshot.key}:`, {
          from: request.fromUserId,
          to: request.toUserId,
          status: request.status,
          fromName: request.fromUserName
        });
      });
    } else {
      console.log('❌ 好友请求数据不存在');
    }

    // 特别检查特定用户的好友
    console.log('\n🔍 特别检查用户 6fsxebBd4CPh79FeDOcctPCv6qU2 的好友...');
    const specificUserRef = ref(database, 'users/6fsxebBd4CPh79FeDOcctPCv6qU2');
    const specificUserSnapshot = await get(specificUserRef);
    
    if (specificUserSnapshot.exists()) {
      const user = specificUserSnapshot.val();
      console.log('👤 用户信息:', {
        name: user.name,
        email: user.email
      });
      
      if (user.friends) {
        console.log('👥 好友数据:', user.friends);
        Object.keys(user.friends).forEach(friendId => {
          const friend = user.friends[friendId];
          console.log(`   - ${friendId}:`, friend);
        });
      } else {
        console.log('❌ 该用户没有好友数据');
      }
    } else {
      console.log('❌ 该用户不存在');
    }

    // 检查另一个用户
    console.log('\n🔍 特别检查用户 Su9T2tDj5CQ2taYORpRrxrkQvg63 的好友...');
    const otherUserRef = ref(database, 'users/Su9T2tDj5CQ2taYORpRrxrkQvg63');
    const otherUserSnapshot = await get(otherUserRef);
    
    if (otherUserSnapshot.exists()) {
      const user = otherUserSnapshot.val();
      console.log('👤 用户信息:', {
        name: user.name,
        email: user.email
      });
      
      if (user.friends) {
        console.log('👥 好友数据:', user.friends);
        Object.keys(user.friends).forEach(friendId => {
          const friend = user.friends[friendId];
          console.log(`   - ${friendId}:`, friend);
        });
      } else {
        console.log('❌ 该用户没有好友数据');
      }
    } else {
      console.log('❌ 该用户不存在');
    }

  } catch (error) {
    console.error('❌ 调试过程中出错:', error);
  }
}

debugFriends(); 