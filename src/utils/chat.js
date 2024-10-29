// sk-Q3t227RThQ0w7DJyq5GTQOkP6wxZ4uK7cMvLENJbZQRpHUHq
import OpenAI from "openai";

class Chat {
    constructor(){
        this.client = null;
    }

    #init(){
        if(this.client) return this.client;

        this.client = new OpenAI({
            apiKey:'sk-Q3t227RThQ0w7DJyq5GTQOkP6wxZ4uK7cMvLENJbZQRpHUHq0',
            baseURL: 'https://api.chatanywhere.tech/v1'
        })
        return this.client;
    }

    async send(content, cb){
        if(!this.client){
            this.#init()
        }

       const chatCompletion = await this.client.chat.completions.create({
            messages: [{role:'user',content}],
            model:'gpt-3.5-turbo'
        })

        console.log(123,chatCompletion)

        cb(chatCompletion.choices[0])
    }
}

export default new Chat()