# PetUnity - 宠物社交应用

一个基于React Native和Expo的宠物社交应用，集成了Firebase认证、Unity 3D虚拟宠物等功能。

## 🚀 功能特性

- **用户认证**: 使用Firebase Auth实现登录注册
- **多语言支持**: 支持中英文切换
- **主题切换**: 支持深色/浅色主题
- **虚拟宠物**: 集成Unity 3D虚拟宠物系统
- **社交功能**: 宠物社交、附近宠物发现
- **GPS定位**: 宠物GPS项圈地图功能
- **健康记录**: 宠物健康数据管理

## 📱 技术栈

- **前端框架**: React Native + Expo
- **导航**: React Navigation
- **状态管理**: React Context
- **认证**: Firebase Auth
- **数据库**: Firebase Firestore
- **3D引擎**: Unity (计划集成)
- **地图**: React Native Maps
- **UI组件**: 自定义组件 + Expo Vector Icons

## 🛠️ 安装和运行

### 环境要求

- Node.js 18+
- npm 或 yarn
- Expo CLI
- iOS Simulator (macOS) 或 Android Studio

### 安装步骤

1. **克隆项目**
   ```bash
   git clone https://github.com/Gleamingforest/PetUnity.git
   cd PetUnity
   ```

2. **安装依赖**
   ```bash
   npm install
   ```

3. **配置Firebase**
   - 在Firebase控制台创建项目
   - 下载配置文件并重命名为`firebase.ts`
   - 放置在项目根目录

4. **运行项目**
   ```bash
   # iOS
   npx expo run:ios
   
   # Android
   npx expo run:android
   
   # 开发模式
   npx expo start
   ```

## 📁 项目结构

```
PetUnity/
├── PetTestApp/           # 主应用目录
│   ├── components/       # 可复用组件
│   ├── screens/         # 页面组件
│   ├── contexts/        # React Context
│   ├── constants/       # 常量定义
│   ├── navigation/      # 导航配置
│   ├── assets/          # 静态资源
│   └── locales/         # 国际化文件
├── ios/                 # iOS原生代码
├── android/             # Android原生代码
└── docs/               # 文档
```

## 🔧 配置说明

### Firebase配置

在`PetTestApp/firebase.ts`中配置你的Firebase项目：

```typescript
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  // 你的Firebase配置
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
```

### 环境变量

创建`.env`文件（可选）：

```env
EXPO_PUBLIC_FIREBASE_API_KEY=your_api_key
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
EXPO_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
```

## 📱 应用截图

[这里可以添加应用截图]

## 🤝 贡献指南

1. Fork 项目
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 打开 Pull Request

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情

## 📞 联系方式

- 项目链接: [https://github.com/Gleamingforest/PetUnity](https://github.com/Gleamingforest/PetUnity)
- 邮箱: [your-email@example.com]

## 🙏 致谢

- [Expo](https://expo.dev/) - 优秀的React Native开发平台
- [Firebase](https://firebase.google.com/) - 强大的后端服务
- [React Navigation](https://reactnavigation.org/) - 优秀的导航库
- [Unity](https://unity.com/) - 3D游戏引擎 