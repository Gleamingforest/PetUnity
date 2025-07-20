# PetTestApp - React Native + Firebase Auth

这是一个使用React Native和Firebase Auth构建的宠物测试应用，包含登录界面和欢迎界面。

## 功能特性

- 🔐 Firebase Authentication 用户认证
- 📱 响应式登录界面
- 👋 个性化欢迎界面
- 🔄 自动登录状态管理
- 🎨 现代化UI设计

## 项目结构

```
PetTestApp/
├── App.tsx                 # 主应用组件
├── firebase.ts             # Firebase配置
├── contexts/
│   └── AuthContext.tsx     # 认证上下文
├── screens/
│   ├── LoginScreen.tsx     # 登录界面
│   └── WelcomeScreen.tsx   # 欢迎界面
├── components/
│   └── LoadingScreen.tsx   # 加载界面
└── README.md              # 项目说明
```

## 设置步骤

### 1. 安装依赖

```bash
npm install
```

### 2. 配置Firebase

1. 访问 [Firebase Console](https://console.firebase.google.com/)
2. 创建新项目或选择现有项目
3. 在项目设置中获取Web应用的配置信息
4. 编辑 `firebase.ts` 文件，替换以下配置：

```typescript
const firebaseConfig = {
  apiKey: "your-api-key",
  authDomain: "your-project-id.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project-id.appspot.com",
  messagingSenderId: "your-messaging-sender-id",
  appId: "your-app-id"
};
```

### 3. 启用Firebase Authentication

1. 在Firebase控制台中，转到 "Authentication" 部分
2. 点击 "Get started"
3. 在 "Sign-in method" 标签页中启用 "Email/Password" 提供商
4. 创建测试用户或使用注册功能

### 4. 运行应用

```bash
# iOS
npm run ios

# Android
npm run android

# Web
npm run web
```

## 使用说明

### 登录界面
- 输入有效的邮箱和密码
- 点击登录按钮
- 系统会自动验证凭据并跳转到欢迎界面

### 欢迎界面
- 显示用户邮箱和账户信息
- 显示账户创建时间和验证状态
- 提供登出功能

## 技术栈

- **React Native** - 跨平台移动应用开发
- **TypeScript** - 类型安全的JavaScript
- **Firebase Auth** - 用户认证服务
- **Expo** - React Native开发工具链

## 注意事项

1. 确保在Firebase控制台中正确配置了Authentication服务
2. 测试用户需要在Firebase控制台中手动创建，或实现注册功能
3. 在生产环境中，请使用环境变量来存储Firebase配置

## 下一步开发

- [ ] 添加用户注册功能
- [ ] 实现密码重置
- [ ] 添加社交媒体登录
- [ ] 实现用户资料管理
- [ ] 添加数据持久化 