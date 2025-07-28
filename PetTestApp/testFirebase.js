import { database } from './firebase';
import { ref, set, get } from 'firebase/database';

// 测试Firebase连接
export const testFirebaseConnection = async () => {
  try {
    console.log('Testing Firebase connection...');
    
    // 尝试写入测试数据
    const testRef = ref(database, 'test/connection');
    await set(testRef, {
      timestamp: Date.now(),
      message: 'Connection test'
    });
    console.log('✅ Firebase write test successful');
    
    // 尝试读取测试数据
    const snapshot = await get(testRef);
    if (snapshot.exists()) {
      console.log('✅ Firebase read test successful');
      console.log('Data:', snapshot.val());
    } else {
      console.log('❌ Firebase read test failed - no data found');
    }
    
    // 清理测试数据
    await set(testRef, null);
    console.log('✅ Test data cleaned up');
    
  } catch (error) {
    console.error('❌ Firebase test failed:', error);
    console.error('Error code:', error.code);
    console.error('Error message:', error.message);
  }
}; 