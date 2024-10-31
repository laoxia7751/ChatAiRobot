<template>
  <div class="chat-container">
    <div class="chat-header">
      <h3>OpenAI 聊天</h3>
    </div>
    <div class="chat-messages" ref="messages">
      <!-- <div class="message" v-for="(msg, index) in messages" :key="index" :class="msg.role">
        <div class="message-content">{{ msg.content }}</div>
      </div> -->
      <MessageItem v-for="(item,index) in messages" :key="index" v-bind="item"></MessageItem>
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
      messages: [
        {"role":"user","content":"三国演义是谁写的"},
        {"role":"assistant","content":"三国演义是由明代小说家罗贯中创作的。"},
        {"role":"user","content":"帮我用css实现1个三角形"},
        {
          "role": "assistant", "content":[
            {content:'文字内容',type:'text'},
            {content:'console.log("hello")',type:'code'},
            {content:'文字内容',type:'text'},
          ]
        }
    ],
    };
  },
  methods: {
    sendMessage() {
      if (this.inputMessage.trim() === '') return;

      // 模拟发送的消息
      this.messages.push({ role: 'user', content: this.inputMessage });
      this.inputMessage = '';
      let message = { role:'assistant',content:[] }
      let codeStart = false;
      chat.send(this.messages, ({ content, startCode, status }) => {
        // 开启一个代码块
        if(codeStart && !startCode){
          message.content.push({content:'',type:'code'});
          codeStart = startCode;
          return;
          // 此时要忽略掉之前传入的```
        }
        // 结束1个代码块
        if(!codeStart && startCode){
          //先清除掉最后一条数据里的无效内容
          
          message.content.push({content:'',type:'text'});
          codeStart = startCode;
          return;
        }
        if(!message.content.length) {
          message.content.push({content:'',type:'text'});
        }
        message.content.at(-1).content += content
        if(!status){
          this.messages.push(message)
        }
        console.log(12232,message )
        // this.messages.push(data.message);
        // this.$nextTick(() => {
        //   const messagesDiv = this.$refs.messages;
        //   messagesDiv.scrollTop = messagesDiv.scrollHeight;
        // });
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
  text-align: center;
}

.chat-messages {
  flex: 1;
  padding: 10px;
  overflow:hidden auto;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
}

.message {
  margin: 5px 0;
  padding: 10px;
  border-radius: 5px;
  width: calc(100% - 50px);
  position: relative;
  &:before{
    content:'';
    width: 40px;
    height: 40px;
    border-radius: 50%;
    position: absolute;
    top: 0;
    color: #fff;
    line-height: 40px;
    text-align: center;
  }
  &.user {
    align-self: flex-end;
    background-color: #dcf8c6;
    float: left;
    &:before{
      right: -50px;
      content:'Me';
      background-color: $bg;
    }
  }
  
  &.assistant {
    align-self: flex-start;
    float: right;
    background-color: #eee;
    &:before{
      left: -50px;
      content:'Ai';
      background-color: $c;
    }
  }
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
