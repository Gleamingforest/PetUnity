import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

// Firebase配置
const firebaseConfig = {
  apiKey: "AIzaSyAFnEY37rPNtbO9imrlFqGZicXfgGRuEG4",
  authDomain: "petapp-e1059.firebaseapp.com",
  projectId: "petapp-e1059",
  storageBucket: "petapp-e1059.appspot.com",
  messagingSenderId: "279016691814",
  appId: "1:279016691814:web:0bf7eeb33d33d05e9cb5a7",
  measurementId: "G-SC9BHBEWTD"
};

// 初始化Firebase
const app = initializeApp(firebaseConfig);

// 获取Auth实例
export const auth = getAuth(app);

export default app; 