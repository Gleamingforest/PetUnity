import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import { useLanguage } from '../contexts/LanguageContext';
import { colors } from '../constants/Styles';
import OpenAIConfig from '../components/OpenAIConfig';

export default function AISettings() {
  const { isDarkMode } = useTheme();
  const { t } = useLanguage();

  return (
    <ScrollView 
      style={[styles.container, { backgroundColor: isDarkMode ? colors.dark.background : colors.light.background }]}
      contentContainerStyle={styles.contentContainer}
    >
      <View style={styles.header}>
        <Text style={[styles.title, { color: isDarkMode ? colors.dark.text : colors.light.text }]}>
          AI 设置
        </Text>
        <Text style={[styles.subtitle, { color: isDarkMode ? colors.dark.secondaryText : colors.light.secondaryText }]}>
          配置 AI 聊天功能
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: isDarkMode ? colors.dark.text : colors.light.text }]}>
          AI 服务优先级
        </Text>
        <View style={[styles.priorityList, { backgroundColor: isDarkMode ? colors.dark.surface : colors.light.surface }]}>
          <View style={styles.priorityItem}>
            <Text style={[styles.priorityNumber, { color: isDarkMode ? colors.dark.primary : colors.light.primary }]}>1</Text>
            <Text style={[styles.priorityText, { color: isDarkMode ? colors.dark.text : colors.light.text }]}>
              OpenAI API（推荐）
            </Text>
          </View>
          <View style={styles.priorityItem}>
            <Text style={[styles.priorityNumber, { color: isDarkMode ? colors.dark.primary : colors.light.primary }]}>2</Text>
            <Text style={[styles.priorityText, { color: isDarkMode ? colors.dark.text : colors.light.text }]}>
              Firebase Functions AI
            </Text>
          </View>
          <View style={styles.priorityItem}>
            <Text style={[styles.priorityNumber, { color: isDarkMode ? colors.dark.primary : colors.light.primary }]}>3</Text>
            <Text style={[styles.priorityText, { color: isDarkMode ? colors.dark.text : colors.light.text }]}>
              本地回退方案
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: isDarkMode ? colors.dark.text : colors.light.text }]}>
          OpenAI 配置
        </Text>
        <Text style={[styles.sectionDescription, { color: isDarkMode ? colors.dark.secondaryText : colors.light.secondaryText }]}>
          配置 OpenAI API Key 以获得最佳的 AI 聊天体验
        </Text>
        <OpenAIConfig />
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: isDarkMode ? colors.dark.text : colors.light.text }]}>
          功能说明
        </Text>
        <View style={[styles.infoCard, { backgroundColor: isDarkMode ? colors.dark.surface : colors.light.surface }]}>
          <Text style={[styles.infoTitle, { color: isDarkMode ? colors.dark.text : colors.light.text }]}>
            🤖 OpenAI API
          </Text>
          <Text style={[styles.infoText, { color: isDarkMode ? colors.dark.secondaryText : colors.light.secondaryText }]}>
            • 使用 GPT-3.5-turbo 模型{'\n'}
            • 响应速度快，质量高{'\n'}
            • 需要 OpenAI API Key{'\n'}
            • 支持中英文对话
          </Text>
        </View>

        <View style={[styles.infoCard, { backgroundColor: isDarkMode ? colors.dark.surface : colors.light.surface }]}>
          <Text style={[styles.infoTitle, { color: isDarkMode ? colors.dark.text : colors.light.text }]}>
            🔥 Firebase Functions AI
          </Text>
          <Text style={[styles.infoText, { color: isDarkMode ? colors.dark.secondaryText : colors.light.secondaryText }]}>
            • 使用 Google Gemini 模型{'\n'}
            • 通过 Firebase Functions 调用{'\n'}
            • 需要部署 Firebase Functions{'\n'}
            • 自动保存聊天历史
          </Text>
        </View>

        <View style={[styles.infoCard, { backgroundColor: isDarkMode ? colors.dark.surface : colors.light.surface }]}>
          <Text style={[styles.infoTitle, { color: isDarkMode ? colors.dark.text : colors.light.text }]}>
            📱 本地回退方案
          </Text>
          <Text style={[styles.infoText, { color: isDarkMode ? colors.dark.secondaryText : colors.light.secondaryText }]}>
            • 无需网络连接{'\n'}
            • 基于关键词匹配{'\n'}
            • 支持基本对话{'\n'}
            • 始终可用
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
  },
  header: {
    marginBottom: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  sectionDescription: {
    fontSize: 14,
    marginBottom: 16,
    lineHeight: 20,
  },
  priorityList: {
    borderRadius: 12,
    padding: 16,
  },
  priorityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  priorityNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    width: 30,
    textAlign: 'center',
  },
  priorityText: {
    fontSize: 16,
    marginLeft: 12,
  },
  infoCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    lineHeight: 20,
  },
}); 