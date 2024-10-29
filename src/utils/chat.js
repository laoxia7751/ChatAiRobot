// sk-Q3t227RThQ0w7DJyq5GTQOkP6wxZ4uK7cMvLENJbZQRpHUHq
import OpenAI from 'openai';

class Chat {
  constructor() {
    this.client = null;
  }

  #init() {
    if (this.client) return this.client;

    this.client = new OpenAI({
      apiKey: 'sk-ulLqWZikPeyASJfeSb5TS8tbZMJkWuujwrEUkI0JNcZJqaPH',
      baseURL: 'https://xiaoai.plus/v1',
      dangerouslyAllowBrowser: true,
    });
    return this.client;
  }

  async send(messages, cb) {
    if (!this.client) {
      this.#init();
    }

    const chatCompletion = await this.client.chat.completions.create({
      messages: messages,
      model: 'gpt-3.5-turbo',
    });

    if (chatCompletion.error) {
      throw new Error('请求失败', chatCompletion.error.messages);
    }

    if (typeof cb === 'function') cb(chatCompletion.choices[0]);
    return chatCompletion.choices[0];
  }
}

export default new Chat();
