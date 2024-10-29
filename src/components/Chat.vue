<template>  
    <div class="chat-container">  
      <div class="chat-header">  
        <h2>OpenAI 聊天</h2>  
      </div>  
      <div class="chat-messages" ref="messages">  
        <div class="message" v-for="(msg, index) in messages" :key="index" :class="msg.type">  
          <div class="message-content">{{ msg.content }}</div>  
        </div>  
      </div>  
      <div class="chat-input-container">  
        <input  
          type="text"  
          v-model="inputMessage"  
          @keyup.enter="sendMessage"  
          placeholder="请输入消息..."  
          class="chat-input"  
        />  
        <button @click="sendMessage" class="send-button">发送</button>  
      </div>  
    </div>  
  </template>  
  
  <script>  
  import chat from '../utils/chat';
  export default {  
    data() {  
      return {  
        inputMessage: '',  
        messages: [],  
      };  
    },  
    methods: {  
        sendMessage() {  
        if (this.inputMessage.trim() === '') return;  
  
        // 模拟发送的消息  
        this.messages.push({ type: 'user', content: this.inputMessage });  
        this.inputMessage = '';  

        chat.send
  
        // 模拟接收 OpenAI 的消息  
        setTimeout(() => {  
          this.messages.push({ type: 'ai', content: '这是 OpenAI 的响应：' + this.messages[this.messages.length - 1].content });  
          this.$nextTick(() => {  
            const messagesDiv = this.$refs.messages;  
            messagesDiv.scrollTop = messagesDiv.scrollHeight;  
          });  
        }, 1000);  
      },  
    },  
  };  
  </script>  
  
  <style scoped>  
  .chat-container {  
    width: 100%;  
    height: 100%;
    border: 1px solid #ddd;  
    border-radius: 8px;  
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);  
    display: flex;  
    flex-direction: column;  
    overflow: hidden;  
  }  
  
  .chat-header {  
    background-color: #4CAF50;  
    color: white;  
    padding: 15px;  
    text-align: center;  
  }  
  
  .chat-messages {  
    flex: 1;  
    padding: 10px;  
    overflow-y: auto;  
    background-color: #f9f9f9;  
  }  
  
  .message {  
    margin: 5px 0;  
    padding: 10px;  
    border-radius: 5px;  
    max-width: 80%;  
  }  
  
  .message.user {  
    align-self: flex-end;  
    background-color: #dcf8c6;  
  }  
  
  .message.ai {  
    align-self: flex-start;  
    background-color: #eee;  
  }  
  
  .chat-input-container {  
    display: flex;  
    border-top: 1px solid #ddd;  
  }  
  
  .chat-input {  
    flex: 1;  
    padding: 10px;  
    border: none;  
    border-radius: 0;  
  }  
  
  .send-button {  
    padding: 10px;  
    background-color: #4CAF50;  
    color: white;  
    border: none;  
    cursor: pointer;  
  }  
  
  .send-button:hover {  
    background-color: #45a049;  
  }  
  </style>