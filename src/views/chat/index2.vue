

<template>
    <section class="section">
        <div class="chat_wrapper">
            <div class="chat_left">
                <ul class="person_list" v-if="conversationList.length">
                    <li @click="changeUser(item)" :class="{'active':targetId==item.targetId}" v-for="(item,index) in conversationList" :key="index">
                        <div class="avatar">
                            <img :src="item._target.portrait" alt="">
                        </div>
                        <div class="person_info">
                            <div class="name">{{item._target.name}}</div> 
                            <div class="lasted_msg">{{item.latestMessage._content}}</div>
                        </div>
                    </li>

                </ul>
            </div>
            <div class="chat_right">
                <!-- <router-view></router-view> -->
                <div class="layim-chat-main" style="height:490px" ref="messageList">
                    <ul>
                        <li :class="{'layim-chat-mine':item.messageDirection==1}"  v-for="(item,index) in messageList" :key="index">
                            <div class="layim-chat-user">
                                <img :src="item._sender.portrait" :alt="item._sender.name">
                                <cite>
                                    <i>{{item.sentTime|moment}}</i>
                                    <span>{{item._sender.name}}</span>
                                </cite>
                            </div>
                            <div class="layim-chat-text" v-html="item._content">
                                
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
                            v-model="content"
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
import RC from './im'
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
            messages:{},
            messageList:[],
            content:'',
            targetId:'',
            instance:null,
            appKey:'qd46yzrfqibvf',
        };
    },
    mounted() {
        // var Conversation = RongIM.Conversation;
        // Conversation.watch(()=> {
        //     this.getConversationList();
        // });
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
        },
        
    },
    created() {
        this.init();
	},
    methods: {
        scrollBottom(ref="messageList"){
            this.$nextTick(()=>{
                this.$refs[ref].scrollTop =this.$refs[ref].scrollHeight;
            })
        },
        init(){
            var ctx = this;
            let appKey = this.appKey;
            let token = this.token;
            RC.init({
                appKey: appKey,
                token: token,
            },function(instance){
                RC.getConversationList(function(conversationList){
                    console.log(conversationList)
                    ctx.conversationList = conversationList;
                })
            })
        },
        changeUser(item){
            this.targetId = item.targetId;
            RC.startConversation(item.targetId);
        },
        sendMessage() {
            let content = this.content;
            RC.send(content,function(message){
                console.log(message)
            });
        },
       
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