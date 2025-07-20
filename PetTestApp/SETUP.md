# PetTestApp 设置指南

## 快速开始

### 1. 安装依赖
```bash
npm install
```

### 2. Firebase 项目设置

#### 2.1 创建 Firebase 项目
1. 访问 [Firebase Console](https://console.firebase.google.com/)
2. 点击 "创建项目"
3. 输入项目名称（例如：pettest-app）
4. 选择是否启用 Google Analytics（可选）
5. 点击 "创建项目"

#### 2.2 添加 Web 应用
1. 在项目概览页面，点击 "Web" 图标 (</>)
2. 输入应用昵称（例如：PetTestApp Web）
3. 选择是否设置 Firebase Hosting（可选）
4. 点击 "注册应用"
5. 复制配置对象，它看起来像这样：

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyC...",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc123"
};
```

#### 2.3 更新 Firebase 配置
1. 打开 `firebase.ts` 文件
2. 用您的实际配置替换示例配置
3. 保存文件

#### 2.4 启用 Authentication
1. 在 Firebase 控制台中，点击左侧菜单的 "Authentication"
2. 点击 "开始使用"
3. 在 "登录方式" 标签页中，启用 "电子邮件/密码"
4. 点击 "保存"

### 3. 运行应用

#### 3.1 Web 版本
```bash
npm run web
```

#### 3.2 iOS 版本
```bash
npm run ios
```
注意：需要 macOS 和 Xcode

#### 3.3 Android 版本
```bash
npm run android
```
注意：需要 Android Studio 和 Android SDK

### 4. 测试应用

#### 4.1 创建测试用户
1. 在 Firebase 控制台中，转到 "Authentication" > "用户"
2. 点击 "添加用户"
3. 输入邮箱和密码
4. 点击 "添加"

#### 4.2 在应用中测试
1. 使用创建的测试用户凭据登录
2. 或者使用注册功能创建新用户
3. 测试登录/登出功能

## 故障排除

### 常见问题

#### 1. Firebase 配置错误
- 确保 `firebase.ts` 中的配置正确
- 检查项目 ID 和 API 密钥是否匹配

#### 2. Authentication 未启用
- 确保在 Firebase 控制台中启用了 "电子邮件/密码" 登录方式

#### 3. 网络错误
- 检查网络连接
- 确保 Firebase 项目设置正确

#### 4. 应用无法启动
- 运行 `npm install` 重新安装依赖
- 清除缓存：`npx expo start --clear`

## 开发提示

### 1. 环境变量
在生产环境中，建议使用环境变量存储 Firebase 配置：

```typescript
const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  // ... 其他配置
};
```

### 2. 调试
- 使用 React Native Debugger 或 Chrome DevTools
- 在 Firebase 控制台中查看 Authentication 日志

### 3. 安全规则
在生产环境中，确保设置适当的 Firebase 安全规则。

## 下一步

- [ ] 添加密码重置功能
- [ ] 实现社交媒体登录
- [ ] 添加用户资料管理
- [ ] 集成 Firestore 数据库
- [ ] 添加推送通知 