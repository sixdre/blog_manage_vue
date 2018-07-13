<template>
    <section class="section">
        <div class="chat_wrapper">
            <div class="chat_left">
                <ul class="person_list">
                    <li @click="changeUser(item)" :class="{'active':targetId==item.id}" v-for="(item,index) in userList" :key="index">
                        <div class="avatar">
                            <img :src="item.avatar" alt="">
                        </div>
                        <div class="person_info">
                            <div class="name">{{item.username}}</div>
                            <!-- <div class="lasted_msg">{{item.lastMsg}}</div> -->
                        </div>
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
import Init from './init';
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
            userList:[],
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
        // var config = RongIM.config;
        // config.token = this.token;
        // var modules = {
        //     RongIMLib: window.RongIMLib
        // };
        // RongService.init(config, function(services, currentUser) {
        //     console.log('CurrentUser %o', currentUser);
            
        //     var Conversation = services.Conversation;
        //     var Message = services.Message;

        //     RongIM.Conversation = Conversation;
        //     RongIM.Message = Message;

        //     Conversation.get(function(error, conversationList) {
        //         if (error) {
        //             console.error('Conversation.get Error: %s', error);
        //             return;
        //         }
        //         this.userList = conversationList.map(item=>{
        //             let t = item.latestMessage.content;
        //             return {
        //                 username:t.user.username,
        //                 avatar:t.user.avatar,
        //                 id:t.user.id,
        //                 lastMsg:t.content
        //             }
        //         })
        //         console.log(conversationList)
               
        //     });
            
        //     // init();

        // }, modules);
        
        this.ready().then(()=>{
            this.getConversationList();
        })
	},
    methods: {
        changeUser(item){
            if(this.targetId == item.id){
                return ;
            }
            this.getHistoryMessages(item.id)
            this.targetId = item.id;
            if(this.instance==null){
                this.ready()
            }else{
                // this.scrollBottom()
                // this.instance.clearConversations({
                //     onSuccess: (list)=> {

                //     },
                //     onError: function(error) {
                //         // do something...
                //     }
                // })
            }
           
        },
        //添加会话列表到本地缓存
        updateUserListToLocal(users){
            sessionStorage.setItem('chatList',JSON.stringify(users));
        },
        scrollBottom(ref="chatList"){
            this.$nextTick(()=>{
                this.$refs[ref].scrollTop =this.$refs[ref].scrollHeight;
            })
        },
        ready(){
           let params = {
               appKey:this.appKey,
               token:this.token
            }
            return new Promise((resolve,reject)=>{
                try{
                    Init(params,{
                        getInstance: (_instance) =>{
                            this.instance = _instance;
                            resolve();
                        },
                        receiveNewMessage: (message)=> {
                            this.chatList.push(message)
                            let userIds = this.userList.map(item=>item.id);
                            if(userIds.indexOf(message.senderUserId)==-1){
                                let t = message.content;
                                this.userList.push({
                                    username:t.user.username,
                                    avatar:t.user.avatar,
                                    id:t.user.id,
                                    lastMsg:t.content
                                })
                            }
                            if(message.senderUserId===this.targetId){
                                this.scrollBottom('chatList');
                            }else{
                                //alert('您有一条新消息')
                            }
                            console.log(message)
                            console.log("messageUId:" + message.messageUId + ",   messageId:" + message.messageId);
                        },
                        getCurrentUser: (userInfo)=> {
                            console.log("链接成功 用户id：" + userInfo.userId);
                        }
                    });
                }catch(err){
                    reject(err)
                }
            })
       },
       //获取会话列表
       getConversationList(){
            this.instance.getConversationList({
                onSuccess: (list)=> {
                    console.log(list)
                    list = list.filter(function(conversation) {
                        var isPrivate = (conversation.conversationType == conversationType);
                        return isPrivate;
                    });
                    this.userList = list.map(item=>{
                        let t = item.latestMessage.content;
                        return {
                            username:t.user.username,
                            avatar:t.user.avatar,
                            id:t.user.id,
                            lastMsg:t.content
                        }
                    })
                  
                },
                onError: function(error) {
                    // do something...
                }
            },null);
       },
       //获取历史消息
       getHistoryMessages(targetId){
            this.instance.getHistoryMessages(conversationType, targetId, null, 10, {
                onSuccess:  (list, hasMsg) => {
                    console.log(list,hasMsg)
                    this.chatList = list;
                    this.scrollBottom()
                    //this.chatList = [...this.chatList,...list];
                    // list 为拉取到的历史消息列表
                    // hasMsg 为 boolean 值，如果为 true 则表示还有剩余历史消息可拉取，为 false 的话表示没有剩余历史消息可供拉取。
                    // renderHistoryMessages 为自定义的渲染页面方法
                    // renderHistoryMessages(list, hasMsg, instance);
                },
                onError: (error)=>  {
                    console.log("获取历史记录 失败", error);
                }
            });
       },
       sendMessage(){
            let msg = this.msg;
            if(!msg.length){
                alert('请输入内容')
                return
            }
            let user = {
                'id':this.uid,
                'username':this.username,
                'avatar':this.avatar
            }
            var content = {
                content: this.msg,
                user,
                extra: "{\"key\":\"value\", \"key2\" : 12, \"key3\":true}"
            };
            var message = new RongIMLib.TextMessage(content);
            this.instance.sendMessage(conversationType, this.targetId, message, {
                onSuccess: (message)=> {
                    console.log("发送文字消息 成功", message)
                    this.msg = ''
                    this.chatList.push(message)
                    this.scrollBottom('chatList');
                },
                onError: (errorCode, message)=>  {
                    console.log("发送文字消息 失败", message);
                }
            })
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