# Firebase AI Logic 配置检查清单

## 🔍 **当前错误分析**

错误信息：`FirebaseError: AI: Invalid backend: {"backendType":"GOOGLE_AI"} (AI/error)`

这表明 Firebase AI Logic 的后端配置有问题，需要完成以下配置步骤。

## ✅ **配置检查清单**

### **1. Firebase 项目基础配置**

#### **1.1 启用必要的 API**
在 [Google Cloud Console](https://console.cloud.google.com/) 中：

1. 选择你的项目 `petapp-e1059`
2. 进入 **"API 和服务"** > **"库"**
3. 搜索并启用以下 API：
   - ✅ **Firebase AI Logic API**
   - ✅ **Google AI API**
   - ✅ **Vertex AI API**
   - ✅ **Cloud Functions API**

#### **1.2 检查服务账户权限**
1. 进入 **"IAM 和管理"** > **"服务账户"**
2. 确保 Firebase 服务账户有足够权限
3. 可能需要添加以下角色：
   - `Firebase AI Logic User`
   - `AI Platform Developer`

### **2. Firebase 控制台配置**

#### **2.1 AI Logic 服务设置**
1. 打开 [Firebase 控制台](https://console.firebase.google.com/)
2. 选择项目 `petapp-e1059`
3. 进入 **"AI Logic"**
4. 在 **"设置"** 标签页中：
   - ✅ 确认 **"Gemini Developer API"** 显示 **"已启用"**
   - ⚠️ 可选：启用 **"Vertex AI Gemini API"**

#### **2.2 应用注册**
1. 在 **"所有应用"** 标签页中：
   - ✅ 确认你的应用已注册
   - ✅ 检查 Bundle ID 是否正确

#### **2.3 App Check 配置（推荐）**
1. 进入 **"App Check"**
2. 为你的应用启用 App Check
3. 这将提高安全性并防止滥用

### **3. 计费和配额设置**

#### **3.1 启用计费**
1. 进入 **"项目设置"** > **"计费"**
2. 确保项目已关联计费账户
3. Firebase AI Logic 可能需要启用计费

#### **3.2 检查配额**
1. 在 Google Cloud Console 中检查配额
2. 确保没有达到限制

### **4. 网络和权限检查**

#### **4.1 网络访问**
1. 确保应用可以访问 Google 服务
2. 检查防火墙设置

#### **4.2 区域设置**
1. 确认 Firebase 项目区域设置
2. 某些 AI 服务可能有区域限制

## 🧪 **测试步骤**

### **配置完成后测试**
1. 重新运行应用：`expo run ios`
2. 测试 AI 聊天功能
3. 查看控制台日志

### **预期结果**
- ✅ 无 Firebase AI Logic 错误
- ✅ AI 聊天正常工作
- ✅ 控制台显示 "Firebase AI Logic 初始化成功"

## 🔄 **当前状态**

### **临时解决方案**
- ✅ 应用使用回退方案，功能正常
- ✅ 用户可以正常使用 AI 聊天
- ✅ 无错误提示

### **升级路径**
完成上述配置后，可以：
1. 取消注释 `firebase.ts` 中的 AI 相关代码
2. 享受真正的 Gemini AI 对话

## 📞 **需要帮助？**

如果配置过程中遇到问题：
1. 查看 [Firebase AI Logic 文档](https://firebase.google.com/docs/ai)
2. 检查 [Google Cloud Console](https://console.cloud.google.com/)
3. 联系 Firebase 支持团队

## 🎯 **总结**

**当前状态**: ✅ 应用功能正常（使用回退方案）
**下一步**: 按照上述清单配置 Firebase 项目
**目标**: 启用真正的 Firebase AI Logic 功能 