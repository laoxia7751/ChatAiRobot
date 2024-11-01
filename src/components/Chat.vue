<template>
  <div class="chat-container">
    <div class="chat-header">
      <h3>OpenAI 聊天</h3>
      <span class="clear" @click="clearChat">清空</span>
    </div>
    <div class="chat-messages" ref="messages">
      <MessageItem v-for="(item, index) in messages" :key="index" v-bind="item"></MessageItem>
      <div class="noData" v-if="!messages.length">暂无内容</div>
    </div>
    <div class="chat-input-container">
      <input type="text" v-model="inputMessage" @keyup.enter="sendMessage" placeholder="请输入消息..." class="chat-input" />
      <button @click="sendMessage" class="send-button">发送</button>
    </div>
  </div>
</template>

<script>
import chat from '../utils/chat';
import MessageItem from './MessageItem';
export default {
  components: {
    MessageItem
  },
  data() {
    return {
      inputMessage: '',
      messages: []
    };
  },
  methods: {
    sendMessage() {
      if (this.inputMessage.trim() === '') return;
      this.messages.push({ role: 'user', content: this.inputMessage });
      this.inputMessage = '';
      let message = { role: 'assistant', content: [] }
      let codeStart = false;
      // 发送消息
      chat.send(this.messages, ({ content, startCode, status }) => {
        // 开启一个代码块
        if (!codeStart && startCode) {
          message.content.push({ content: '', type: 'code' });
          codeStart = startCode;
          return;
        }
        // 结束1个代码块
        if (codeStart && !startCode) {
          //先清除掉最后一条数据里的无效内容
          if(message.content.at(-1).content.endsWith('``')){
            message.content.at(-1).content = message.content.at(-1).content.replace(/``$/,'')
          } 
          message.content.push({ content: '', type: 'text' });
          codeStart = startCode;
          return;
        }
        if (!message.content.length) {
          message.content.push({ content: '', type: 'text' });
        }
        content && (message.content.at(-1).content += content)
        if (!status) {
          this.messages.push(message)
          this.$nextTick(() => {
            hljs.highlightAll();
            const messagesDiv = this.$refs.messages;
            messagesDiv.scrollTop = messagesDiv.scrollHeight;
          });
        }
      });
    },
    clearChat(){
      this.messages = []
      this.inputMessage = ''
      chat.clearStream()
    }
  },
};
</script>

<style lang="scss">
$bg: #333;
$c: #157518;
$c1: #198f1d;
$bc: rgba(255, 255, 255, 0.1);

$primary-color: #282c34;
$secondary-color: #f5f5f5;
$highlight-color: #f8f8f8;

.chat-container {
  width: 100%;
  height: 100%;
  border-radius: 8px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background: $bg;
}

.chat-header {
  background-color: $c;
  color: white;
  padding: 12px;
  display: flex;
  justify-content: center;
  h3{
    flex: 1;
    padding-left: 1em;
    text-align: center;
  }
  .clear{
    cursor: pointer;
  }
}

.chat-messages {
  flex: 1;
  padding: 10px;
  overflow: hidden auto;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  .noData{
    color: rgba(0,0,0,0.1);
    text-align: center;
    font-size: 36px;
    font-weight: bold;
    margin: 30% 0;
  }
}

.message {
  margin: 5px 0;
  padding: 10px;
  border-radius: 5px;
  width: calc(100% - 40px);
  position: relative;
  &:before {
    content: '';
    width: 30px;
    height: 30px;
    border-radius: 50%;
    position: absolute;
    top: 0;
    color: #fff;
    line-height: 30px;
    text-align: center;
  }

  &.user {
    align-self: flex-end;
    background-color: #dcf8c6;
    float: left;

    &:before {
      right: -40px;
      content: 'Me';
      background-color: $bg;
    }
  }

  &.assistant {
    align-self: flex-start;
    float: right;
    background-color: #eee;

    &:before {
      left: -40px;
      content: 'Ai';
      background-color: $c;
    }
  }
}


.chat-input-container {
  display: flex;
  border-top: 1px solid rgba(255, 255, 255, 0.8);
  font-size: 16px;
}

.chat-input {
  flex: 1;
  padding: 1em;
  border: none;
  border-radius: 0;
  caret-color: $c1;
  color: #222;
}

.send-button {
  padding: 1em 1em;
  background-color: $c;
  color: white;
  border: none;
  cursor: pointer;
}

.send-button:hover {
  background-color: $c1;
}
</style>
