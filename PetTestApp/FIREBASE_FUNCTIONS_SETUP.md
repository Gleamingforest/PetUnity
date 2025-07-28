# Firebase Functions AI 设置指南

## 🎯 **目标**
通过 Firebase Functions 在移动端使用真正的 Google AI (Gemini) 服务。

## 📋 **前置条件**

### 1. **Google Cloud 项目设置**
- 确保你的 Firebase 项目已启用 Google Cloud
- 在 Google Cloud Console 中启用 AI Platform API
- 获取项目 ID（在 Firebase Console 中查看）

### 2. **服务账户权限**
- 创建服务账户密钥
- 确保有 AI Platform 访问权限

## 🚀 **部署步骤**

### **步骤 1：安装 Firebase CLI**
```bash
npm install -g firebase-tools
```

### **步骤 2：登录 Firebase**
```bash
firebase login
```

### **步骤 3：初始化 Functions**
```bash
cd PetTestApp
firebase init functions
```

### **步骤 4：配置项目**
在 `functions/index.js` 中：
1. 替换 `your-project-id` 为你的实际项目 ID
2. 确保 Google Cloud 项目已启用 AI Platform API

### **步骤 5：安装依赖**
```bash
cd functions
npm install
```

### **步骤 6：部署 Functions**
```bash
firebase deploy --only functions
```

## 🔧 **配置检查清单**

### **Google Cloud Console**
- [ ] 启用 AI Platform API
- [ ] 创建服务账户
- [ ] 下载服务账户密钥
- [ ] 设置环境变量

### **Firebase Console**
- [ ] 项目 ID 正确
- [ ] Functions 已部署
- [ ] 权限设置正确

### **本地配置**
- [ ] 更新 `functions/index.js` 中的项目 ID
- [ ] 设置服务账户密钥路径
- [ ] 测试本地 Functions

## 🧪 **测试步骤**

### **1. 本地测试**
```bash
cd functions
npm run serve
```

### **2. 部署后测试**
```bash
firebase functions:log
```

### **3. 应用内测试**
- 运行 `npx expo run ios`
- 打开 AI 聊天功能
- 发送测试消息

## 🔍 **故障排除**

### **常见错误**

#### **1. 权限错误**
```
Error: 7 PERMISSION_DENIED
```
**解决方案**：
- 检查服务账户权限
- 确保 AI Platform API 已启用

#### **2. 项目 ID 错误**
```
Error: 3 INVALID_ARGUMENT
```
**解决方案**：
- 检查 `functions/index.js` 中的项目 ID
- 确保项目 ID 正确

#### **3. 模型不可用**
```
Error: Model not found
```
**解决方案**：
- 检查模型名称是否正确
- 确保模型在指定区域可用

## 📱 **应用集成**

### **已完成的更改**
- ✅ 更新了 `AIChat.tsx` 使用 Firebase Functions
- ✅ 添加了错误处理和回退机制
- ✅ 保持了双语支持

### **测试验证**
1. 发送消息到 AI
2. 检查是否调用 Firebase Functions
3. 验证 AI 回复质量
4. 确认聊天历史保存

## 🎉 **成功标志**

当一切正常工作时，你应该看到：
- ✅ 控制台显示 "🤖 尝试使用 Firebase Functions AI 服务"
- ✅ 然后是 "✅ Firebase Functions AI 调用成功"
- ✅ 收到真正的 AI 回复（不是回退方案）
- ✅ 聊天历史保存在 Firebase 数据库中

## 🔄 **回退机制**

如果 Firebase Functions 失败：
- 自动使用本地回退方案
- 用户无感知切换
- 保持功能可用性

## 📞 **支持**

如果遇到问题：
1. 检查 Firebase Functions 日志
2. 验证 Google Cloud 配置
3. 确认网络连接
4. 查看错误详情

---

**现在你的移动端应用可以使用真正的 Google AI 了！** 🚀 