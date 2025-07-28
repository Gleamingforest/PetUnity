#!/bin/bash

echo "🚀 启动两个 expo run:ios 实例..."

# 启动第一个实例（iPhone 16 Pro）
echo "📱 启动第一个实例 (iPhone 16 Pro)..."
npx expo run:ios --device "iPhone 16 Pro" &
PID1=$!

# 等待5秒让第一个实例启动
sleep 5

# 启动第二个实例（iPhone 16 Pro Max）
echo "📱 启动第二个实例 (iPhone 16 Pro Max)..."
npx expo run:ios --device "iPhone 16 Pro Max" &
PID2=$!

echo "✅ 两个实例已启动！"
echo "📱 实例1 PID: $PID1 (iPhone 16 Pro)"
echo "📱 实例2 PID: $PID2 (iPhone 16 Pro Max)"
echo ""
echo "💡 测试提示："
echo "1. 在第一个模拟器中注册账号1"
echo "2. 在第二个模拟器中注册账号2"
echo "3. 测试好友添加和聊天功能"
echo "4. 按 Ctrl+C 停止所有实例"
echo ""

# 等待用户中断
wait 