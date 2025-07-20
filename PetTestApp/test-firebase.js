// 简单的Firebase配置测试脚本
// 运行: node test-firebase.js

const { initializeApp } = require('firebase/app');
const { getAuth } = require('firebase/auth');

// 测试配置
const firebaseConfig = {
  apiKey: "AIzaSyAFnEY37rPNtbO9imrlFqGZicXfgGRuEG4",
  authDomain: "petapp-e1059.firebaseapp.com",
  projectId: "petapp-e1059",
  storageBucket: "petapp-e1059.appspot.com",
  messagingSenderId: "279016691814",
  appId: "1:279016691814:web:0bf7eeb33d33d05e9cb5a7",
  measurementId: "G-SC9BHBEWTD"
};

try {
  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);
  console.log('✅ Firebase配置成功！');
  console.log('Auth实例已创建:', auth);
} catch (error) {
  console.error('❌ Firebase配置失败:', error.message);
} 