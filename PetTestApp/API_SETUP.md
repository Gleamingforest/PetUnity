# API 设置说明

## OpenAI API 配置

1. 获取 OpenAI API 密钥：
   - 访问 https://platform.openai.com/api-keys
   - 创建新的 API 密钥

2. 配置 API 密钥：
   - 在应用中的 AI 设置页面输入 API 密钥
   - 或者设置环境变量 `OPENAI_API_KEY`

## Firebase 配置

1. 创建 Firebase 项目
2. 下载配置文件并重命名为 `firebase.ts`
3. 放置在项目根目录

## 安全注意事项

- 不要将 API 密钥提交到版本控制系统
- 使用环境变量或安全的配置管理
- 定期轮换 API 密钥 