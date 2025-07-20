import React, { useEffect, useRef } from 'react';
import { View, Animated, Easing, StyleSheet } from 'react-native';
import { colors } from '../constants/Styles';

const RadarScan = () => {
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // 持续旋转动画
    const startRotation = () => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(rotateAnim, {
            toValue: 1,
            duration: 3000,
            easing: Easing.linear,
            useNativeDriver: true,
          }),
          Animated.timing(rotateAnim, {
            toValue: 0,
            duration: 0,
            useNativeDriver: true,
          }),
        ])
      ).start();
    };

    startRotation();

    // 脉冲动画
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1500,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 0,
          duration: 1500,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // 清理函数
    return () => {
      rotateAnim.stopAnimation();
      pulseAnim.stopAnimation();
    };
  }, []);

  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const pulse = pulseAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 1],
  });

  return (
    <View style={styles.container}>
      {/* 背景圆环 */}
      <View style={styles.backgroundCircle} />
      
      {/* 扫描线 */}
      <Animated.View
        style={[
          styles.scanLine,
          {
            transform: [{ rotate: spin }],
          },
        ]}
      />

      {/* 脉冲圆环 */}
      <Animated.View
        style={[
          styles.pulseCircle,
          {
            opacity: pulse,
            transform: [{ scale: pulse }],
          },
        ]}
      />

      {/* 多个红点标记 */}
      <View style={[styles.redDot, { top: 40, right: 40 }]} />
      <View style={[styles.redDot, { top: 80, left: 60 }]} />
      <View style={[styles.redDot, { bottom: 50, right: 70 }]} />
      <View style={[styles.redDot, { bottom: 30, left: 40 }]} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 200,
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backgroundCircle: {
    width: 180,
    height: 180,
    borderRadius: 90,
    borderWidth: 2,
    borderColor: colors.gray[300],
    position: 'absolute',
  },
  scanLine: {
    width: 2,
    height: 90,
    backgroundColor: colors.primary,
    position: 'absolute',
    left: '50%',
    top: '50%',
    marginLeft: -1,
    marginTop: -90,
    transformOrigin: 'bottom',
  },
  pulseCircle: {
    width: 180,
    height: 180,
    borderRadius: 90,
    borderWidth: 2,
    borderColor: colors.primary,
    position: 'absolute',
  },
  redDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FF3B30',
    position: 'absolute',
  },
});

export default RadarScan; 