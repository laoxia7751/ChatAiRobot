<template>
  <div class="chat-container">
    <div class="chat-header">
      <h3>OpenAI 聊天</h3>
    </div>
    <div class="chat-messages" ref="messages">
      <div class="message" v-for="(msg, index) in messages" :key="index" :class="msg.role">
        <div class="message-content">{{ msg.content }}</div>
      </div>
    </div>
    <div class="chat-input-container">
      <input type="text" v-model="inputMessage" @keyup.enter="sendMessage" placeholder="请输入消息..." class="chat-input" />
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
      messages: [{"role":"user","content":"三国演义是谁写的"},{"role":"assistant","content":"三国演义是由明代小说家罗贯中创作的。"}],
    };
  },
  methods: {
    sendMessage() {
      if (this.inputMessage.trim() === '') return;

      // 模拟发送的消息
      this.messages.push({ role: 'user', content: this.inputMessage });
      this.inputMessage = '';

      chat.send(this.messages, (data) => {
        this.messages.push(data.message);
        this.$nextTick(() => {
          const messagesDiv = this.$refs.messages;
          messagesDiv.scrollTop = messagesDiv.scrollHeight;
        });
      });
    },
  },
};
</script>

<style lang="scss" scoped>
$bg: #333;
$c:#157518;
$c1: #198f1d;
$bc: rgba(255,255,255,0.1);

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
  text-align: center;
}

.chat-messages {
  flex: 1;
  padding: 10px;
  overflow-y: auto;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
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

.message.assistant {
  align-self: flex-start;
  background-color: #eee;
}

.chat-input-container {
  display: flex;
  border-top: 1px solid $bc;
  font-size: 16px;
}

.chat-input {
  flex: 1;
  padding: 1em;
  border: none;
  border-radius: 0;
  caret-color: $c1;
  color:#222;
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
