<template>
    <section class="section">
        <div class="chat_wrapper">
            <div class="chat_left">
                <ul class="person_list" v-if="conversationList.length">
                    <li @click="changeUser(item)" :class="{'active':targetId==item.targetId}" v-for="(item,index) in conversationList" :key="index">
                        <div class="avatar">
                            <img :src="item._target.portrait" alt="">
                        </div>
                        <!-- <div class="person_info">
                            <div class="name">{{item.username}}</div> -->
                            <!-- <div class="lasted_msg">{{item.lastMsg}}</div> -->
                        <!-- </div> -->
                    </li>

                </ul>
            </div>
            <div class="chat_right">
                <div class="layim-chat-main" style="height:490px" ref="chatList">
                    <ul>
                        <li :class="{'layim-chat-mine':item.messageDirection==1}"  v-for="(item,index) in chatList" :key="index">
                            <div class="layim-chat-user">
                                <img :src="item.content.user.avatar" :alt="item.content.user.username">
                                <cite>
                                    <i>{{item.sentTime|moment}}</i>
                                    <span>{{item.content.user.username}}</span>
                                </cite>
                            </div>
                            <div class="layim-chat-text">
                                {{item.content.content}}
                            </div>
                        </li>
                    </ul>
                </div>
                <div class="layim-chat-footer">
                    <div class="layim-chat-textarea">
                         <textarea
                            class="chat-textarea"
                            type="textarea"
                            placeholder="请输入内容"
                            v-model="msg"
                           > 
                        </textarea>
                    </div>
                    <div class="layim-chat-bottom">
                        <div class="layim-chat-send">
                            <span class="layim-send-btn" @click="sendMessage">发送</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      

    </section>
</template>

<script>
import RongService from './service'
import RongIM from './config'
const conversationType = RongIMLib.ConversationType.PRIVATE;

export default {
    data() {
        return {
            // userList:[{
            //     username:'admin',
            //     avatar:'http://osf6cl53d.bkt.clouddn.com/01d2f582-8d88-4d70-a87e-ea4985c2c754.png',
            //     userId:'5ae449a30b382d220c3042ee'
            // },{
            //     username:'test',
            //     avatar:'https://gravatar.com/avatar/d9e8e7d540309dfa1ca67e804ad92b52?size=48',
            //     userId:'5ae449a30b382d220c3042ef'
            // },{
            //     username:'benben',
            //     avatar:'https://ubmcmm.baidustatic.com/media/v1/0f000aR7ZspWhwESfrNrwf.jpg',
            //     userId:'5ae449a30b382d220c3042f1'
            // }],
            conversationList:[],
            form:{
                name:''
            },
            chatList:[],
            msg:'',
            targetId:'',
            instance:null,
            appKey:'qd46yzrfqibvf',
        };
    },
    mounted() {
       
    },
    computed:{
        token(){
            return this.$store.state.user.ryToken;
        },
        uid(){
            return this.$store.state.user.userId;
        },
        username(){
            return this.$store.state.user.username;
        },
        avatar(){
            return this.$store.state.user.avatar;
        }
    },
    created() {
        this.init();
	},
    methods: {
        init(){
            var config = RongIM.config;
            config.token = this.token;
            var modules = {
                RongIMLib: window.RongIMLib
            };
            RongService.init(config, (services, currentUser)=> {
                console.log('CurrentUser %o', currentUser);
                var Conversation = services.Conversation;
                var Message = services.Message;
                RongIM.Conversation = Conversation;
                RongIM.Message = Message;
               this.getConversationList()
                
            }, modules);
        },
        getHistoryMessages(targetId) {
            // console.log(targetId)
            RongIM.Message.get({
                type: conversationType,
                targetId: targetId
            }, (error, messageList)=> {
                if (error) {
                    console.error('Conversation.get Error: %s', error);
                    return;
                }
                // ctx.messageList = messageList;
            });
        },
        getConversationList(){
            RongIM.Conversation.get( (error, conversationList)=> {
                if (error) {
                    console.error('Conversation.get Error: %s', error);
                    return;
                }
                this.conversationList =  conversationList;
                 console.log(this.conversationList)
                console.log(this.conversationList[0])
            });
        },



        sendMessage() {
            var Message = RongIM.Message;
            var content = this.msg;
            var targetId = this.targetId;

            Message.sendTxt({
                content: content,
                type:conversationType,
                targetId:targetId
            }, (error, message)=> {
                // ctx.messageList.push(message);
                // ctx.content = '';
            });
        },
        changeUser(item){
            this.targetId = item.targetId;
        }
    }
}
</script>

<style lang="less" scoped>
@import './index.less';
.chat_wrapper{
    display: flex;
    width: 800px;
    height: 600px;
    .chat_left{
        width: 200px;
        height: 100%;
        background-color: #25313e;
        .person_list{
            li{
                display: flex;
                align-items: center;
                padding: 10px 15px;
                &:hover,&.active{
                    background-color: rgb(50, 65, 87);
                }
                .avatar{
                    min-width:50px;
                    width: 50px;
                    height: 50px;
                    border-radius: 50%;
                    overflow: hidden;
                    background-color: #ddd;
                    margin-right: 10px;
                    img{
                        width: 100%;
                        height:100%;
                    }
                }
                .person_info{
                    color: #fff;
                    .name{
                        font-size: 14px;
                        margin-bottom: 3px;
                    }
                    .lasted_msg{
                        color: #98a6ad;
                        font-size: 13px;
                    }
                }
            }
        }
        
    }
    .chat_right{
        flex: auto;
        border: 1px solid #eee;
   
    }
}

</style>