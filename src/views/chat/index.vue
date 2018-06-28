<template>
    <section class="section">
        <div class="chat_wrapper">
            <div class="chat_left">
                <ul class="person_list">
                    <li @click="changeUser(item)" :class="{'active':targetId==item.userId}" v-for="(item,index) in userList" :key="index">
                        <div class="avatar">
                            <img :src="item.avatar" alt="">
                        </div>
                        <div class="person_info">
                            <div class="name">{{item.username}}</div>
                            <div class="lasted_msg">hello</div>
                        </div>
                    </li>
                </ul>
            </div>
            <div class="chat_right">
                <ul class="chat_list">
                    <li :class="{'msg_item_left':item.content.user.id!==uid,'msg_item_right':item.content.user.id==uid}" v-for="(item,index) in chatList" :key="index">
                        <div class="avatar">
                            <img :src="item.content.user.avatar" alt="">
                        </div>
                        <p class="chat_content">{{item.content.content}}</p>
                        <p v-if="item.content.user.id!==uid">{{item.receivedTime|moment}}</p>
                        <p v-else>{{item.sentTime|moment}}</p>
                    </li>
                </ul>
                <div class="sendForm">
                    <form>
                        <el-input
                        type="textarea"
                        :autosize="{ minRows: 2, maxRows: 4}"
                        placeholder="请输入内容"
                        v-model="msg"
                        @keyup.enter.native="sendMessage"
                        >
                        </el-input>
                        <div class="">
                            <el-button type="info" @click="sendMessage">发送</el-button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
      



         <!-- <el-form ref="form" :model="form" label-width="80px">
            <el-form-item label="用户名">
                <el-input v-model="form.name"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="onRegister">注册</el-button>
            </el-form-item>
        </el-form>  -->
    </section>
</template>

<script>
import Init from './init';
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
        // let t = this.userList.map(item=>{
        //     if(item.userId!==this.uid){
        //         return item;
        //     }
        // })
        // console.log(t)
        this.targetId = this.uid;
        this.ready()
        
	},
    methods: {
        changeUser(item){
            this.targetId = item.userId;
            if(this.instance==null){
                this.ready()
            }else{
                this.getHistoryMessages()
            }
           
        },
        ready(){
           let params = {
               appKey:this.appKey,
               token:this.token
           }
           Init(params,{
                getInstance: (_instance) =>{
                    this.instance = _instance;
                    this.getHistoryMessages()
                    this.getConversationList()
                },
                receiveNewMessage: (message)=> {
                    this.chatList.push(message)
                    let userIds = this.userList.map(item=>item.userId);
                    console.log(userIds)
                    if(userIds.indexOf(message.targetId)==-1){
                         let t = message.content;
                        this.userList.push({
                            username:t.user.username,
                            avatar:t.user.avatar,
                            userId:t.user.id,
                            lastMsg:t.content
                        })
                    }



                    console.log(message)
                    console.log("messageUId:" + message.messageUId + ",   messageId:" + message.messageId);
                },
                getCurrentUser: (userInfo)=> {
                   console.log("链接成功 用户id：" + userInfo.userId);
                  
                  
                }
           });
       },
       //获取回话列表
       getConversationList(){
            this.instance.getConversationList({
                onSuccess: (list)=> {
                    console.log(list)
                    this.userList = list.map(item=>{
                        let t = item.latestMessage.content;
                        return {
                            username:t.user.username,
                            avatar:t.user.avatar,
                            userId:t.user.id,
                            lastMsg:t.content
                        }
                    })
                    // let ids = list.map(item=>item.targetId)
                    // this.conversationList = this.userList.find(item=>{
                    //     return item.targetId === 
                    // })
                },
                onError: function(error) {
                    // do something...
                }
            },null);
       },
       //获取历史消息
       getHistoryMessages(){
            this.instance.getHistoryMessages(conversationType, this.targetId, null, 20, {
                onSuccess:  (list, hasMsg) => {
                    console.log(list,hasMsg)
                    this.chatList = list;
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
            var msg = new RongIMLib.TextMessage(content);
            this.instance.sendMessage(conversationType, this.targetId, msg, {
                onSuccess: (message)=> {
                    console.log("发送文字消息 成功", message)
                    this.chatList.push(message)
                    this.msg = ''
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
        .sendForm{
            height: 200px;
        }
        .chat_list{
            height: 500px;
            overflow-y: scroll;
            li{
                display: flex;
                align-items: center;
                padding: 10px 15px;
                .avatar{
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
                .chat_content{
                    border-radius: 4px;
                    padding: 10px 20px;
                }
                &.msg_item_left{
                     .chat_content{
                       background-color: #f3f3f3;
                    }
                }
                 &.msg_item_right{
                    justify-content: flex-end ;
                    .chat_content{
                       background-color: #7c7ae4;
                       color: #fff;
                    }
                }
            }
        }

    }
}
</style>