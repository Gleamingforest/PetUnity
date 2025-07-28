const { initializeApp } = require('firebase/app');
const { getDatabase, ref, get, set, push } = require('firebase/database');

const firebaseConfig = {
  apiKey: "AIzaSyAFnEY37rPNtbO9imrlFqGZicXfgGRuEG4",
  authDomain: "petapp-e1059.firebaseapp.com",
  projectId: "petapp-e1059",
  storageBucket: "petapp-e1059.appspot.com",
  messagingSenderId: "279016691814",
  appId: "1:279016691814:web:0bf7eeb33d33d05e9cb5a7",
  measurementId: "G-SC9BHBEWTD",
  databaseURL: "https://petapp-e1059-default-rtdb.firebaseio.com"
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

async function testFriends() {
  console.log('🧪 开始测试好友数据...\n');

  try {
    // 测试用户ID
    const userId1 = '6fsxebBd4CPh79FeDOcctPCv6qU2';
    const userId2 = 'Su9T2tDj5CQ2taYORpRrxrkQvg63';

    console.log('📊 检查用户数据...');
    
    // 检查用户1
    const user1Ref = ref(database, `users/${userId1}`);
    const user1Snapshot = await get(user1Ref);
    console.log(`👤 用户1 (${userId1}) 存在:`, user1Snapshot.exists());
    if (user1Snapshot.exists()) {
      console.log('   用户1数据:', user1Snapshot.val());
    }

    // 检查用户2
    const user2Ref = ref(database, `users/${userId2}`);
    const user2Snapshot = await get(user2Ref);
    console.log(`👤 用户2 (${userId2}) 存在:`, user2Snapshot.exists());
    if (user2Snapshot.exists()) {
      console.log('   用户2数据:', user2Snapshot.val());
    }

    console.log('\n📊 检查好友关系...');
    
    // 检查用户1的好友
    const friends1Ref = ref(database, `users/${userId1}/friends`);
    const friends1Snapshot = await get(friends1Ref);
    console.log(`👥 用户1的好友存在:`, friends1Snapshot.exists());
    if (friends1Snapshot.exists()) {
      console.log('   用户1的好友数据:', friends1Snapshot.val());
    }

    // 检查用户2的好友
    const friends2Ref = ref(database, `users/${userId2}/friends`);
    const friends2Snapshot = await get(friends2Ref);
    console.log(`👥 用户2的好友存在:`, friends2Snapshot.exists());
    if (friends2Snapshot.exists()) {
      console.log('   用户2的好友数据:', friends2Snapshot.val());
    }

    console.log('\n📊 检查好友请求...');
    const requestsRef = ref(database, 'friendRequests');
    const requestsSnapshot = await get(requestsRef);
    console.log('📨 好友请求存在:', requestsSnapshot.exists());
    if (requestsSnapshot.exists()) {
      console.log('   好友请求数据:', requestsSnapshot.val());
    }

    // 测试手动添加好友关系
    console.log('\n🧪 测试手动添加好友关系...');
    
    // 为用户1添加用户2作为好友
    const testFriendRef = ref(database, `users/${userId1}/friends/${userId2}`);
    await set(testFriendRef, {
      id: userId2,
      name: '测试好友',
      addedAt: Date.now()
    });
    console.log('✅ 已为用户1添加测试好友');

    // 为用户2添加用户1作为好友
    const testFriendRef2 = ref(database, `users/${userId2}/friends/${userId1}`);
    await set(testFriendRef2, {
      id: userId1,
      name: '测试好友2',
      addedAt: Date.now()
    });
    console.log('✅ 已为用户2添加测试好友');

    // 再次检查好友关系
    console.log('\n📊 再次检查好友关系...');
    const friends1Snapshot2 = await get(friends1Ref);
    console.log('   用户1的好友数据:', friends1Snapshot2.val());
    
    const friends2Snapshot2 = await get(friends2Ref);
    console.log('   用户2的好友数据:', friends2Snapshot2.val());

  } catch (error) {
    console.error('❌ 测试过程中出错:', error);
  }
}

testFriends(); 