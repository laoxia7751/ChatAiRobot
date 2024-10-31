import { defineComponent, h, computed } from 'vue';  

export default defineComponent({  
    name: 'MessageItem',  
    props: {  
        content: {  
            type: [String, Array],  
            default: ''  
        },  
        role: {  
            type: String,  
            required: true  
        }  
    },  
    setup(props) {  
        const { role, content } = props;  

        const main = computed(() => {  
            if (role === 'user' || typeof content === 'string') {  
                return h('div', { class: ['message', role], innerText: content });  
            }  
            
            // 处理内容为数组的情况  
            const contentItems = content.map(item =>  item.type === 'code' ? h('pre',{innerHTML: `<code class="language-html">${item.content}</code>`}) : h('div',{class: 'message-content', innerHTML: item.content})
            );  

            return h('div', { class: ['message', role] }, contentItems);  
        });  

        return () => main.value;  
    }  
});