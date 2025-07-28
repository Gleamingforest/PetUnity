const functions = require('firebase-functions');
const admin = require('firebase-admin');
const {PredictionServiceClient} = require('@google-cloud/aiplatform');

// 初始化 Firebase Admin
admin.initializeApp();

// 初始化 AI Platform 客户端
const client = new PredictionServiceClient({
  apiEndpoint: 'us-central1-aiplatform.googleapis.com',
});

const project = 'your-project-id'; // 替换为你的 Google Cloud 项目 ID
const location = 'us-central1';
const publisher = 'google';
const model = 'gemini-2.0-flash-exp';

// AI 聊天函数
exports.aiChat = functions.https.onCall(async (data, context) => {
  try {
    // 验证用户身份
    if (!context.auth) {
      throw new functions.https.HttpsError('unauthenticated', '用户未登录');
    }

    const { message, language = 'zh' } = data;
    
    if (!message) {
      throw new functions.https.HttpsError('invalid-argument', '消息不能为空');
    }

    // 构建 AI 请求
    const endpoint = `projects/${project}/locations/${location}/publishers/${publisher}/models/${model}`;
    
    const instanceValue = {
      prompt: `你是一个宠物护理助手。请用${language === 'zh' ? '中文' : 'English'}回答用户关于宠物的问题。用户问题：${message}`
    };

    const instance = {
      prompt: JSON.stringify(instanceValue)
    };

    const instances = [instance];

    const parameter = {
      temperature: 0.7,
      maxOutputTokens: 1024,
      topP: 0.8,
      topK: 40
    };

    const request = {
      endpoint,
      instances,
      parameters: parameter,
    };

    // 调用 AI 模型
    const [response] = await client.predict(request);
    
    if (response.predictions && response.predictions[0]) {
      const prediction = response.predictions[0];
      let aiResponse = '';
      
      if (prediction.candidates && prediction.candidates[0]) {
        aiResponse = prediction.candidates[0].content;
      } else if (prediction.structValue && prediction.structValue.fields) {
        aiResponse = prediction.structValue.fields.text?.stringValue || 
                    prediction.structValue.fields.content?.stringValue || 
                    JSON.stringify(prediction.structValue);
      } else {
        aiResponse = JSON.stringify(prediction);
      }

      // 记录聊天到数据库
      await admin.database().ref(`chats/${context.auth.uid}`).push({
        message,
        response: aiResponse,
        timestamp: admin.database.ServerValue.TIMESTAMP,
        language
      });

      return { response: aiResponse };
    } else {
      throw new functions.https.HttpsError('internal', 'AI 响应格式错误');
    }

  } catch (error) {
    console.error('AI Chat Error:', error);
    throw new functions.https.HttpsError('internal', 'AI 服务暂时不可用');
  }
});

// 获取聊天历史
exports.getChatHistory = functions.https.onCall(async (data, context) => {
  try {
    if (!context.auth) {
      throw new functions.https.HttpsError('unauthenticated', '用户未登录');
    }

    const { limit = 50 } = data;
    
    const snapshot = await admin.database()
      .ref(`chats/${context.auth.uid}`)
      .orderByChild('timestamp')
      .limitToLast(limit)
      .once('value');

    const chats = [];
    snapshot.forEach((childSnapshot) => {
      chats.push({
        id: childSnapshot.key,
        ...childSnapshot.val()
      });
    });

    return { chats: chats.reverse() };

  } catch (error) {
    console.error('Get Chat History Error:', error);
    throw new functions.https.HttpsError('internal', '获取聊天历史失败');
  }
}); 