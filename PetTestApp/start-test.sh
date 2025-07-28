#!/bin/bash

echo "🚀 启动开发服务器用于多设备测试..."

# 启动开发服务器
echo "📱 启动Expo开发服务器..."
echo "💡 提示："
echo "1. 在第一个模拟器中按 'i' 运行"
echo "2. 在第二个模拟器中按 'i' 运行"
echo "3. 或者使用Expo Go扫描二维码"
echo ""

npx expo start --tunnel 