// sk-Q3t227RThQ0w7DJyq5GTQOkP6wxZ4uK7cMvLENJbZQRpHUHq
import OpenAI from 'openai';
import mockData from './mockData';

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
    //上一条数据，用于判断代码块结束
    let preData = '';
    let startCode = false;
    let status = 0;
    for(const chunk of mockData){
      const msgData = chunk.choices[0]?.delta || {};
      const { role, content } = msgData
      preData = content;
      role ==='assistant' && (status = 1)
      // 判断代码块开始
      if(content === '```' && !startCode) {
        startCode = true;
      }
      // 代码块结束
      if(content === "`\n\n" && startCode && preData === "``"){
        startCode = false;
      }
      // 返回结束
      if(chunk.choices[0]?.finish_reason === 'stop'){
        status = 0
      }
      cb({ content, startCode, status })
    }

    // 最后应用层渲染的数据结构；
    const mockMsg = [
      {content:'文字内容',type:'text'},
      {content:'console.log("hello")',type:'code'},
      {content:'文字内容',type:'text'},
    ]

    // try {
    //   const stream = await this.client.beta.chat.completions.stream({
    //     messages: messages,
    //     model: 'gpt-3.5-turbo',
    //     stream: true
    //   });
    //   let msgCache = ''
    //   for await (const chunk of stream) {
    //     // 这里比较理想的状态是开一个定时器调用cb函数，当chunk.choices[0]?.delta?.role === 'assistant'时，说明流数据开始返回了，这时候开始存储返回的数据
    //     // 然后每隔固定时间，将存储的数据返回并且清空，一直当chunk.choices[0]?.finish_reason为stop的时候，说明服务端已经推送完数据了，这时候则直接返回并且关闭定时器
    //     console.log("Chat ~ forawait ~ chunk", chunk)
    //     const { delta, finish_reason } = chunk.choices[0] || {}
    //     if(delta.role === 'assistant'){
    //       interval = setInterval(() => {

    //       }, this.replyDurning)
    //     }
    //     if (delta && delta.content) {
    //       msgCache += delta.content
    //     }
    //     if (finish_reason === 'stop') {
    //       typeof cb === 'function' && cb(msgCache);
    //       clearInterval(interval);
    //       return;
    //     }
    //     const message = chunk.choices[0]?.delta?.content || ''
    //     typeof cb === 'function' && cb(message);
    //   }
    //   const chatCompletion = await stream.finalChatCompletion();
    // } catch (error) {
    //   throw new Error('Stream encountered an error');
    // }
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
