// Firebase AI Logic 诊断工具
// 运行此文件来检查 Firebase AI Logic 配置状态

const { initializeApp } = require('firebase/app');
const { getAI, getGenerativeModel, GoogleAIBackend } = require('firebase/ai');

// Firebase配置
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

async function diagnoseFirebaseAI() {
  console.log('🔍 开始 Firebase AI Logic 诊断...\n');
  
  try {
    // 1. 检查配置
    console.log('1️⃣ 检查 Firebase 配置:');
    console.log('   - 项目ID:', firebaseConfig.projectId);
    console.log('   - API Key:', firebaseConfig.apiKey ? '✅ 已设置' : '❌ 未设置');
    console.log('   - Auth Domain:', firebaseConfig.authDomain);
    console.log('   - App ID:', firebaseConfig.appId);
    console.log('');
    
    // 2. 初始化 Firebase
    console.log('2️⃣ 初始化 Firebase 应用...');
    const app = initializeApp(firebaseConfig);
    console.log('   ✅ Firebase 应用初始化成功');
    console.log('');
    
    // 3. 初始化 AI 服务
    console.log('3️⃣ 初始化 Firebase AI Logic...');
    const ai = getAI(app, { backend: new GoogleAIBackend() });
    console.log('   ✅ AI 服务初始化成功');
    console.log('');
    
    // 4. 创建模型实例
    console.log('4️⃣ 创建 Gemini 模型实例...');
    
    // 尝试不同的模型版本
    const modelVersions = [
      "gemini-2.0-flash-exp",
      "gemini-1.5-flash", 
      "gemini-1.0-pro",
      "gemini-2.5-flash"
    ];
    
    let model = null;
    let successfulModel = null;
    
    for (const modelVersion of modelVersions) {
      try {
        console.log(`   尝试模型: ${modelVersion}...`);
        model = getGenerativeModel(ai, { model: modelVersion });
        console.log(`   ✅ 模型 ${modelVersion} 创建成功`);
        successfulModel = modelVersion;
        break;
      } catch (modelError) {
        console.log(`   ❌ 模型 ${modelVersion} 失败:`, modelError.message);
      }
    }
    
    if (!model) {
      throw new Error('所有模型版本都失败了');
    }
    
    console.log(`   🎯 使用模型: ${successfulModel}`);
    console.log('');
    
    // 5. 测试 AI 调用
    console.log('5️⃣ 测试 AI 调用...');
    const result = await model.generateContent("Hello, this is a test message.");
    const response = result.response;
    const text = response.text();
    console.log('   ✅ AI 调用成功');
    console.log('   📝 AI 回复:', text);
    console.log('');
    
    console.log('🎉 诊断完成！Firebase AI Logic 配置正确，可以正常使用。');
    
  } catch (error) {
    console.error('❌ 诊断失败！发现以下问题:');
    console.error('');
    console.error('错误类型:', error.constructor.name);
    console.error('错误代码:', error.code || 'N/A');
    console.error('错误消息:', error.message);
    console.error('');
    
    // 根据错误类型提供建议
    if (error.code === 'AI/error' && error.message.includes('Invalid backend')) {
      console.error('🔧 问题分析: Firebase AI Logic 后端配置无效');
      console.error('💡 解决方案:');
      console.error('   1. 检查 Google Cloud Console 中的 API 启用状态');
      console.error('   2. 确认 Firebase 项目中的 AI Logic 服务已启用');
      console.error('   3. 检查服务账户权限');
      console.error('   4. 确认计费已启用');
    } else if (error.code === 'auth/api-key-not-valid') {
      console.error('🔧 问题分析: API Key 无效');
      console.error('💡 解决方案: 检查 Firebase 项目设置中的 API Key');
    } else if (error.code === 'auth/project-not-found') {
      console.error('🔧 问题分析: 项目未找到');
      console.error('💡 解决方案: 检查项目 ID 是否正确');
    } else {
      console.error('🔧 问题分析: 未知错误');
      console.error('💡 建议: 检查网络连接和 Firebase 服务状态');
    }
    
    console.error('');
    console.error('📋 完整错误信息:');
    console.error(error);
  }
}

// 运行诊断
diagnoseFirebaseAI(); 