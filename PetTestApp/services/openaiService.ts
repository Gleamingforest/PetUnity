interface OpenAIResponse {
  choices: Array<{
    message: {
      content: string;
    };
  }>;
}

interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

class OpenAIService {
  private apiKey: string;
  private baseURL: string = 'https://api.openai.com/v1';
  private model: string = 'gpt-3.5-turbo';

  constructor() {
    // 从环境变量或配置文件获取 API Key
    this.apiKey = process.env.OPENAI_API_KEY || '';
  }

  // 设置 API Key
  setApiKey(apiKey: string) {
    this.apiKey = apiKey;
  }

  // 检查 API Key 是否有效
  isValidApiKey(): boolean {
    return this.apiKey.length > 0;
  }

  // 发送聊天消息
  async sendMessage(message: string, language: 'zh' | 'en' = 'zh'): Promise<string> {
    if (!this.isValidApiKey()) {
      throw new Error('OpenAI API Key 未设置');
    }

    try {
      const systemPrompt = this.getSystemPrompt(language);
      const messages: ChatMessage[] = [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: message }
      ];

      const response = await fetch(`${this.baseURL}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify({
          model: this.model,
          messages: messages,
          max_tokens: 1000,
          temperature: 0.7,
          top_p: 1,
          frequency_penalty: 0,
          presence_penalty: 0
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`OpenAI API 错误: ${errorData.error?.message || response.statusText}`);
      }

      const data: OpenAIResponse = await response.json();
      return data.choices[0]?.message?.content || '抱歉，我现在无法回答这个问题。';

    } catch (error) {
      console.error('OpenAI API 调用失败:', error);
      throw error;
    }
  }

  // 获取系统提示
  private getSystemPrompt(language: 'zh' | 'en'): string {
    if (language === 'zh') {
      return `你是一个专业的宠物护理助手。请用中文回答用户关于宠物护理的问题。

你的专业领域包括：
- 宠物健康护理
- 宠物饮食营养
- 宠物行为训练
- 宠物疾病预防
- 宠物日常护理

请提供专业、友好、实用的建议。如果用户的问题超出宠物护理范围，请礼貌地引导他们回到宠物相关话题。

请保持回答简洁明了，适合移动端阅读。`;
    } else {
      return `You are a professional pet care assistant. Please answer user questions about pet care in English.

Your areas of expertise include:
- Pet health care
- Pet nutrition and diet
- Pet behavior training
- Pet disease prevention
- Pet daily care

Please provide professional, friendly, and practical advice. If the user's question is outside the scope of pet care, please politely guide them back to pet-related topics.

Keep your answers concise and suitable for mobile reading.`;
    }
  }

  // 测试 API 连接
  async testConnection(): Promise<boolean> {
    try {
      await this.sendMessage('Hello', 'en');
      return true;
    } catch (error) {
      console.error('OpenAI API 连接测试失败:', error);
      return false;
    }
  }
}

export default new OpenAIService(); 