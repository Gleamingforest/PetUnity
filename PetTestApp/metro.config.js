const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// 添加对 react-unity-webgl 的支持
config.resolver.assetExts.push('unity');

// 配置 HMR
config.server = {
  ...config.server,
  enhanceMiddleware: (middleware, server) => {
    return (req, res, next) => {
      // 处理 Unity 相关请求
      if (req.url && req.url.includes('/unity/')) {
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
      }
      return middleware(req, res, next);
    };
  },
};

module.exports = config; 