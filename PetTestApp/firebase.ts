import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getDatabase } from 'firebase/database';
import { getAI, getGenerativeModel, GoogleAIBackend } from 'firebase/ai';
import { Platform } from 'react-native';

// Firebase配置
const firebaseConfig = {
  apiKey: "AIzaSyAFnEY37rPNtbO9imrlFqGZicXfgGRuEG4",
  authDomain: "petapp-e1059.firebaseapp.com",
  projectId: "petapp-e1059",
  storageBucket: "petapp-e1059.appspot.com",
  messagingSenderId: "279016691814",
  appId: "1:279016691814:web:0bf7eeb33d33d05e9cb5a7",
  measurementId: "G-SC9BHBEWTD",
  databaseURL: "https://petapp-e1059-default-rtdb.firebaseio.com" // 添加Realtime Database URL
};

// 初始化Firebase
const app = initializeApp(firebaseConfig);

// 获取Auth实例
export const auth = getAuth(app);

// 获取Realtime Database实例
export const database = getDatabase(app);

// 智能 AI 初始化（移动端自动使用回退方案）
let aiInstance: any = null;
let geminiModelInstance: any = null;
let aiInitialized = false;

export const getGeminiModel = () => {
  // 在移动端环境中，直接返回 null，使用回退方案
  if (Platform.OS !== 'web') {
    if (!aiInitialized) {
      console.log('📱 检测到移动端环境，使用回退 AI 方案');
      aiInitialized = true;
    }
    return null;
  }

  // 仅在 Web 环境中尝试使用 Firebase AI Logic
  if (!aiInstance) {
    try {
      console.log('🌐 检测到 Web 环境，尝试初始化 Firebase AI Logic...');
      console.log('项目ID:', firebaseConfig.projectId);
      
      // 尝试初始化 AI 服务
      aiInstance = getAI(app, { backend: new GoogleAIBackend() });
      console.log('✅ AI 服务初始化成功');
      
      // 尝试使用不同的模型版本
      try {
        geminiModelInstance = getGenerativeModel(aiInstance, { model: "gemini-2.0-flash-exp" });
        console.log('✅ Gemini 模型 (2.0-flash-exp) 初始化成功');
      } catch (modelError) {
        console.log('⚠️ 模型 2.0-flash-exp 失败，尝试 1.5-flash...');
        try {
          geminiModelInstance = getGenerativeModel(aiInstance, { model: "gemini-1.5-flash" });
          console.log('✅ Gemini 模型 (1.5-flash) 初始化成功');
        } catch (modelError2) {
          console.log('⚠️ 模型 1.5-flash 失败，尝试 1.0-pro...');
          geminiModelInstance = getGenerativeModel(aiInstance, { model: "gemini-1.0-pro" });
          console.log('✅ Gemini 模型 (1.0-pro) 初始化成功');
        }
      }
      
      aiInitialized = true;
      return geminiModelInstance;
    } catch (error) {
      console.error('❌ Firebase AI Logic 初始化失败:');
      console.error('错误类型:', error.constructor.name);
      console.error('错误代码:', error.code);
      console.error('错误消息:', error.message);
      
      aiInitialized = true;
      return null;
    }
  }
  return geminiModelInstance;
};

export default app; 