# Firebase AI Logic 配置指南

## 🔧 **问题诊断**

当前遇到的错误：
```
FirebaseError: AI: Error fetching from https://firebasevertexai.googleapis.com/: [400] (AI/fetch-error)
```

这表明 Firebase AI Logic 服务未正确配置。

## 🛠️ **解决步骤**

### **1. 启用 Firebase AI Logic 服务**

1. 打开 [Firebase 控制台](https://console.firebase.google.com/)
2. 选择你的项目 `petapp-e1059`
3. 在左侧菜单中找到 **"AI Logic"**
4. 点击 **"开始使用"** 或 **"Get Started"**

### **2. 配置 API 权限**

1. 在 Firebase 控制台中，转到 **"项目设置"** > **"服务账户"**
2. 确保你的项目已启用以下 API：
   - Google AI API
   - Vertex AI API
   - Firebase AI Logic API

### **3. 设置应用注册**

1. 在 AI Logic 控制台中，确保你的应用已注册：
   - iOS: `com.yourcompany.petpaw`
   - Android: `com.yourcompany.petpaw`
   - Web: `com.yourcompany.petpaw`

### **4. 配置 App Check（推荐）**

1. 在 Firebase 控制台中，转到 **"App Check"**
2. 为你的应用启用 App Check
3. 这将提高安全性并防止滥用

### **5. 检查配额和计费**

1. 确保你的项目有足够的配额
2. 检查计费设置是否正确
3. Firebase AI Logic 可能需要启用计费

## 🔄 **当前状态**

### **回退方案已启用**
- ✅ 当 Firebase AI Logic 不可用时，应用会自动使用本地模拟响应
- ✅ 用户仍然可以正常使用 AI 聊天功能
- ✅ 不会出现错误提示

### **测试建议**
1. 先测试回退方案是否正常工作
2. 按照上述步骤配置 Firebase AI Logic
3. 配置完成后，AI 功能会自动升级到真正的 Gemini 模型

## 📱 **应用功能**

### **当前支持的对话主题**
- **问候**: "你好"、"Hello"
- **护理**: "护理"、"照顾"、"care"
- **饮食**: "食物"、"吃"、"food"、"eat"
- **运动**: "运动"、"散步"、"exercise"、"walk"
- **健康**: "健康"、"生病"、"health"、"sick"

### **语言支持**
- ✅ 中文 (zh)
- ✅ 英文 (en)

## 🚀 **下一步**

1. **测试当前功能** - 确认回退方案正常工作
2. **配置 Firebase** - 按照上述步骤设置 AI Logic
3. **升级体验** - 享受真正的 AI 对话能力

## 📞 **需要帮助？**

如果配置过程中遇到问题，可以：
1. 查看 [Firebase AI Logic 文档](https://firebase.google.com/docs/ai)
2. 检查 [Firebase 控制台](https://console.firebase.google.com/)
3. 联系 Firebase 支持团队 