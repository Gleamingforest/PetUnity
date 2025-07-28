import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FontAwesome5 } from '@expo/vector-icons';
import { colors } from '../constants/Styles';
import { useTheme } from '../contexts/ThemeContext';
import { useLanguage } from '../contexts/LanguageContext';
import openaiService from '../services/openaiService';

const OPENAI_API_KEY_STORAGE_KEY = 'openai_api_key';

export default function OpenAIConfig() {
  const { isDarkMode } = useTheme();
  const { t } = useLanguage();
  
  const [apiKey, setApiKey] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [isValid, setIsValid] = useState(false);

  // 加载保存的 API Key
  useEffect(() => {
    loadApiKey();
  }, []);

  const loadApiKey = async () => {
    try {
      const savedKey = await AsyncStorage.getItem(OPENAI_API_KEY_STORAGE_KEY);
      if (savedKey) {
        setApiKey(savedKey);
        openaiService.setApiKey(savedKey);
        setIsValid(true);
      }
    } catch (error) {
      console.error('加载 API Key 失败:', error);
    }
  };

  const saveApiKey = async () => {
    if (!apiKey.trim()) {
      Alert.alert(t('common.error'), t('common.aiChat.apiKeyRequired'));
      return;
    }

    setIsLoading(true);
    try {
      await AsyncStorage.setItem(OPENAI_API_KEY_STORAGE_KEY, apiKey.trim());
      openaiService.setApiKey(apiKey.trim());
      setIsValid(true);
      Alert.alert(t('common.success'), t('common.aiChat.apiKeySaved'));
    } catch (error) {
      console.error('保存 API Key 失败:', error);
      Alert.alert(t('common.error'), t('common.aiChat.saveFailed'));
    } finally {
      setIsLoading(false);
    }
  };

  const testApiKey = async () => {
    if (!apiKey.trim()) {
      Alert.alert(t('common.error'), t('common.aiChat.apiKeyRequired'));
      return;
    }

    setIsTesting(true);
    try {
      openaiService.setApiKey(apiKey.trim());
      const isConnected = await openaiService.testConnection();
      
      if (isConnected) {
        Alert.alert(t('common.success'), t('common.aiChat.apiKeyValid'));
        setIsValid(true);
      } else {
        Alert.alert(t('common.error'), t('common.aiChat.apiKeyInvalid'));
        setIsValid(false);
      }
    } catch (error) {
      console.error('测试 API Key 失败:', error);
      Alert.alert(t('common.error'), t('common.aiChat.testFailed'));
      setIsValid(false);
    } finally {
      setIsTesting(false);
    }
  };

  const clearApiKey = async () => {
    Alert.alert(
      t('common.confirm'),
      t('common.aiChat.clearConfirm'),
      [
        { text: t('common.cancel'), style: 'cancel' },
        {
          text: t('common.confirm'),
          style: 'destructive',
          onPress: async () => {
            try {
              await AsyncStorage.removeItem(OPENAI_API_KEY_STORAGE_KEY);
              setApiKey('');
              openaiService.setApiKey('');
              setIsValid(false);
              Alert.alert(t('common.success'), t('common.aiChat.apiKeyCleared'));
            } catch (error) {
              console.error('清除 API Key 失败:', error);
              Alert.alert(t('common.error'), t('common.aiChat.clearFailed'));
            }
          }
        }
      ]
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: isDarkMode ? colors.dark.background : colors.light.background }]}>
      <View style={styles.header}>
        <FontAwesome5 
          name="robot" 
          size={24} 
          color={isDarkMode ? colors.dark.primary : colors.light.primary} 
        />
        <Text style={[styles.title, { color: isDarkMode ? colors.dark.text : colors.light.text }]}>
          OpenAI 配置
        </Text>
      </View>

      <View style={styles.statusContainer}>
        <View style={[styles.statusIndicator, { backgroundColor: isValid ? '#4CAF50' : '#F44336' }]} />
        <Text style={[styles.statusText, { color: isDarkMode ? colors.dark.text : colors.light.text }]}>
          {isValid ? 'API Key 已配置' : 'API Key 未配置'}
        </Text>
      </View>

      <View style={styles.inputContainer}>
        <Text style={[styles.label, { color: isDarkMode ? colors.dark.text : colors.light.text }]}>
          OpenAI API Key
        </Text>
        <TextInput
          style={[
            styles.input,
            {
              backgroundColor: isDarkMode ? colors.dark.surface : colors.light.surface,
              color: isDarkMode ? colors.dark.text : colors.light.text,
              borderColor: isDarkMode ? colors.dark.border : colors.light.border
            }
          ]}
          value={apiKey}
          onChangeText={setApiKey}
          placeholder="sk-..."
          placeholderTextColor={isDarkMode ? colors.dark.placeholder : colors.light.placeholder}
          secureTextEntry
          autoCapitalize="none"
          autoCorrect={false}
        />
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, styles.saveButton]}
          onPress={saveApiKey}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="white" />
          ) : (
            <>
              <FontAwesome5 name="save" size={16} color="white" />
              <Text style={styles.buttonText}>保存</Text>
            </>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.testButton]}
          onPress={testApiKey}
          disabled={isTesting}
        >
          {isTesting ? (
            <ActivityIndicator color="white" />
          ) : (
            <>
              <FontAwesome5 name="check" size={16} color="white" />
              <Text style={styles.buttonText}>测试</Text>
            </>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.clearButton]}
          onPress={clearApiKey}
        >
          <FontAwesome5 name="trash" size={16} color="white" />
          <Text style={styles.buttonText}>清除</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.infoContainer}>
        <Text style={[styles.infoText, { color: isDarkMode ? colors.dark.secondaryText : colors.light.secondaryText }]}>
          获取 OpenAI API Key：
        </Text>
        <Text style={[styles.infoText, { color: isDarkMode ? colors.dark.secondaryText : colors.light.secondaryText }]}>
          1. 访问 https://platform.openai.com
        </Text>
        <Text style={[styles.infoText, { color: isDarkMode ? colors.dark.secondaryText : colors.light.secondaryText }]}>
          2. 注册并登录账户
        </Text>
        <Text style={[styles.infoText, { color: isDarkMode ? colors.dark.secondaryText : colors.light.secondaryText }]}>
          3. 在 API Keys 页面创建新的 Key
        </Text>
        <Text style={[styles.infoText, { color: isDarkMode ? colors.dark.secondaryText : colors.light.secondaryText }]}>
          4. 复制 Key 并粘贴到上方输入框
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginLeft: 12,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  statusIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  statusText: {
    fontSize: 16,
    fontWeight: '500',
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  button: {
    flex: 1,
    height: 44,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 4,
  },
  saveButton: {
    backgroundColor: '#2196F3',
  },
  testButton: {
    backgroundColor: '#4CAF50',
  },
  clearButton: {
    backgroundColor: '#F44336',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 8,
  },
  infoContainer: {
    backgroundColor: 'rgba(0,0,0,0.05)',
    padding: 16,
    borderRadius: 8,
  },
  infoText: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 4,
  },
}); 