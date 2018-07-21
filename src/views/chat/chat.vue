<template>
    <section class="section">
        <div class="rongcloud-wrapper">
            <div class="rongcloud-left">
                <div class="scroll" style="position:absolute;top:42px;bottom:0;width:100%;overflow-y:scroll;">
                    <ul class="rongcloud-conversation-list" v-if="conversationList.length">
                        <li class="rongcloud-conversation"  :class="{'active':targetId==item.targetId}" v-for="(item,index) in conversationList" :key="index">
                            <div class="avatar">
                                <img :class="{'offline':item._target.online=='0'}" :src="item._target.portrait" alt="">
                            </div>
                            <div class="rongcloud-ext">
                                <div class="rongcloud-attr clearfix">
                                    <span class="rongcloud-badge" v-show="item.unreadMessageCount>0">{{item.unreadMessageCount>99?"99+":item.unreadMessageCount}}</span>
                                </div>
                            </div>
                            <div class="rongcloud-user">
                                <div class="name">
                                    {{item._target.name}}
                                    <p>
                                        <!-- <i class="rongcloud-online online" v-show="item._target.online=='1'">[在线]</i> -->
                                        <i class="rongcloud-online offline" v-show="item._target.online=='0'">[离线]</i>
                                    </p>
                                </div> 
                                <div class="rongcloud-lasted-msg" v-if="item.latestMessage">
                                    <span v-show="item.latestMessage.content.messageName=='TextMessage'" :title="item.latestMessage.content.content">{{item.latestMessage.content.content}}</span>
                                    <span v-show="item.latestMessage.content.messageName=='ImageMessage'">[图片]</span>
                                    <span v-show="item.latestMessage.content.messageName=='FileMessage'">[文件]</span>
                                </div>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
            <div class="rongcloud-right" v-show="targetId" v-loading="loading" element-loading-background="transparent" element-loading-text="加载中...">
                <div class="rongcloud-rong-pannel layim-chat-main">
                    <div class="rongcloud-rong-header">
                         <div class="rongcloud-infoBar">
                            <img :src="currentUser.portrait">
                            <span socket-event="">{{currentUser.name}}</span>
                        </div>
                    </div>
                    <div ref="messageList" class="rcs-message-list">
                        <div class="rongcloud-Messages-history">
                            <span v-show="messages.list.length&&messages.hasMsg" @click="loadHisMessages">
                                查看历史消息
                            </span>
                        </div>
                        <ul class="rong-message-list">
                            <li class="rongcloud-Message" :class="{'rongcloud-Message-send':item.messageDirection==1}"  v-for="(item,index) in messages.list" :key="index">
                                <div class="clearfix">
                                    <div class="rongcloud-Message-user">
                                        <img :src="item.sender.avatar" :alt="item.sender.username">
                                        <cite>
                                            <i>{{item.sendTime}}</i>
                                            <span>{{item.sender.username}}</span>
                                        </cite>
                                    </div>
                                    <div class="rongcloud-Message-body" >
                                        <div v-if="item.type=='Text'" class="rongcloud-Message-text" >
                                            <pre v-html="item.content"></pre>
                                        </div>
                                    </div>
                                </div>
                            </li>
                        </ul>
                    </div>
                    
                </div>
                <div class="rongcloud-rong-footer">
                    <div class="chat-footer-con">
                        <div class="rongcloud-footer-tools">
                            <div class="rongcloud-MessageForm-tool">
                                <i class="iconfont-image pointer">
                                    <input accept="image/*"  type="file" style="position:absolute;width:100%;height:100%;opacity:0; cursor: pointer;">
                                </i>
                            </div>
                             <div class="rongcloud-MessageForm-tool">
                                 <i class="iconfont-file pointer">
                                    <input  type="file" style="position:absolute;width:100%;height:100%;opacity:0; cursor: pointer;">
                                </i>
                            </div>
                        </div>
                    </div>
                    <div class="rongcloud-footer-textarea">
                         <textarea
                            type="textarea"
                            placeholder="请输入内容"
                            v-model="content"
                            ref="content"
                           > 
                        </textarea>
                    </div>
                    <div class="rongcloud-MessageForm-bottom">
                        <div class="rongcloud-MessageForm-send">
                            <span class="rongcloud-MessageForm-send-btn" @click="sendMessage">发送</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      

    </section>
</template>

<script>
import RC from './chatService';

export default {
    data() {
        return {
            conversationList:[{
                _target:{
                    name:'张三'
                }
            }],
            messages:{
                list:[],
                hasMsg:false
            },
            targetId:'5ae449a30b382d220c3042ef',
            currentUser:{

            },
        };
    },
    mounted() {

    },
    created() {
        this.init();
	},
    methods: {
        init(){
            RC.init({
                token:'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1YWU0NDlhMzBiMzgyZDIyMGMzMDQyZWUiLCJ1c2VybmFtZSI6ImFkbWluIiwiZW1haWwiOiIxMjNAcXEuY29tIiwiaXNBZG1pbiI6dHJ1ZSwiaWF0IjoxNTMyMTM1NDk4LCJleHAiOjE1MzIyMjE4OTh9.RryQMVXbVv6TVXjh-SnnlvU4ksSZCH_GXt6wkzEQlQc'
            },(currentUser)=>{
                console.log(currentUser)
                setTimeout(()=>{
                    this.getHistoryMessages()
                })
                
            })
        },
        scrollBottom(ref="messageList"){
            this.$nextTick(()=>{
                this.$refs[ref].scrollTop = this.$refs[ref].scrollHeight;
            })
        },
        getHistoryMessages() {
            var targetId = this.targetId;
            this.messages.list = [];
            this.messages.hasMsg = true;
            RC.Message.getHistoryMessages({
                targetId: targetId,
            }, (error, data)=> {
                if (error) {
                    console.error('Conversation.get Error: %s', error);
                    return;
                }
                this.messages.list = data;
                console.log(data)
            });
        },
        sendMessage() {
            var content = this.content;
            var targetId = this.targetId;
            if (content) {
                RC.Message.send({
                    content: content,
                    type:"Text",
                    to:targetId
                }, (error, message)=> {
                    console.log(message)
                    this.messages.list.push(message);
                    this.content = '';
                    this.$nextTick(()=>{
                        this.scrollBottom()
                    })
                });
            }
        },
        onserverMessage(){
           
        }
    }
}
</script>

<style lang="less" scoped>
@import './index.less';

.iconfont-emoji{
    display: inline-block;
    width: 20px;
    height: 20px;
    background: url('../../assets/images/icon/emoji.png');
    cursor: pointer;
}
.iconfont-image{
    display: inline-block;
    width: 26px;
    height: 20px;
    background: url('../../assets/images/icon/image.png');
    cursor: pointer;
}
.iconfont-file{
    display: inline-block;
    width: 22px;
    height: 20px;
    background: url('../../assets/images/icon/file.png');
    cursor: pointer;
}
</style>