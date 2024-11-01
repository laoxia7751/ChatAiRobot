// sk-Q3t227RThQ0w7DJyq5GTQOkP6wxZ4uK7cMvLENJbZQRpHUHq
import OpenAI from 'openai';
import mockData from './mockData';

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

    // message数据转化
    const msg = this.transferMsg(messages)
    try {
      const stream = await this.client.beta.chat.completions.stream({
        messages: msg,
        model: 'gpt-3.5-turbo',
        stream: true
      });
      this.stream = stream;
      let preData = '';
      let startCode = false;
      let status = 0;
      let ignoreTag = 0;
      for await (const chunk of stream) {
        const msgData = chunk.choices[0]?.delta || {};
        const { role, content } = msgData
        role ==='assistant' && (status = 1)
        // 判断代码块开始
        if(content === '```' && !startCode) {
          startCode = true;
          ignoreTag = 3;
        }
        // 代码块结束
        if(content === "`\n\n" && startCode && preData === "``"){
          ignoreTag = 1;
          startCode = false;
        }
        preData = content;
        // 返回结束
        if(chunk.choices[0]?.finish_reason === 'stop'){
          status = 0
        }
        if(ignoreTag){
          cb({ content:'', startCode, status })
          ignoreTag -=1;
        } else {
          cb({ content, startCode, status })
        }
      }
    } catch (error) {
      throw new Error('Stream encountered an error',error);
    }
  }

  async clearStream(){
    this.stream && await this.stream.finalChatCompletion();
  }

  transferMsg(msg){
    if(!Array.isArray(msg) || !msg.at(-1).content){
      throw new Error('提交数据不能为空');
    }
    return msg.map(item => {
      if(Array.isArray(item.content)){
        return {...item,content:item.content.reduce((str, i) => {
          if(i.type === 'text') return str + i.content;
          if(i.type === 'code') return str + i.content;
        },'')}
      }
      return item
    })
  }

  
}

export default new Chat();
