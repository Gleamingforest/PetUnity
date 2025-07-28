#!/bin/bash

echo "🚀 启动两个Expo实例进行测试..."

# 启动第一个实例（后台运行）
echo "📱 启动第一个实例 (端口 8081)..."
npx expo start --port 8081 &
PID1=$!

# 等待3秒
sleep 3

# 启动第二个实例（后台运行）
echo "📱 启动第二个实例 (端口 8082)..."
npx expo start --port 8082 &
PID2=$!

echo "✅ 两个实例已启动！"
echo "📱 实例1 PID: $PID1 (端口 8081)"
echo "📱 实例2 PID: $PID2 (端口 8082)"
echo ""
echo "💡 提示："
echo "1. 在第一个终端窗口中按 'i' 启动第一个模拟器"
echo "2. 在第二个终端窗口中按 'i' 启动第二个模拟器"
echo "3. 按 Ctrl+C 停止所有实例"
echo ""

# 等待用户中断
wait 