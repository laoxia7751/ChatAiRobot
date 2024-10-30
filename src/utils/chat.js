// sk-Q3t227RThQ0w7DJyq5GTQOkP6wxZ4uK7cMvLENJbZQRpHUHq
import OpenAI from 'openai';

class Chat {
  constructor() {
    this.client = null;
    this.history = [];
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
    try {
      const stream = await this.client.beta.chat.completions.stream({
        messages: messages,
        model: 'gpt-3.5-turbo',
        stream: true
      });

      for await (const chunk of stream) {
        console.log("Chat ~ forawait ~ chunk", chunk)
        const message = chunk.choices[0]?.delta?.content || ''
        typeof cb === 'function' && cb(message);
      }
      const chatCompletion = await stream.finalChatCompletion();
    } catch (error) {
      throw new Error('Stream encountered an error');
    }
  }



  /**
   * 对openAi返回的数据进行解析，识别返回的内容中是否含有代码
   */
  parseMessage(message) {
    // 实现方式，先对数据打上标记，判断是文字类型还是代码类型还是混合类型
    // 绝大多数情况下只有文字类型和混合类型，
    return {
      role: message.role,
      content: message.content,
    };
  }

  /**
   * content信息归类
   * @param {String} content 返回字符串
   */
  classifyContent(content){  
    const codeRegex = /```([\s\S]*?)```/g;  
    const hasCode = codeRegex.test(content);  
    const isTextOnly = !hasCode && content.trim().length > 0;  
    if (isTextOnly) {  
        return 'text'; // 文字类型  
    } else if (hasCode && content.trim().length > 0) {  
        const codeMatches = content.match(codeRegex);  
        const codeContent = codeMatches.join(''); // 获取所有代码块  
        if (content.replace(codeContent, '').trim().length > 0) {  
            return 'mixed'; // 文字代码混合类型  
        }  
        return 'code'; // 代码类型  
    }  

    return 'unknown'; // 未知类型  
}; 
}

export default new Chat();
