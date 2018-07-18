<template>
    <section class="section">
        <div class="chat_wrapper">
            <div class="chat_left">
                <ul class="person_list" v-if="conversationList.length">
                    <li @click="changeUser(item)" :class="{'active':targetId==item.targetId}" v-for="(item,index) in conversationList" :key="index">
                        <div class="avatar">
                            <img :src="item._target.portrait" alt="">
                        </div>
                        <div class="rongcloud-ext">
                            <div class="rongcloud-attr clearfix">
                                <span class="rongcloud-badge" v-show="item.unreadMessageCount>0">{{item.unreadMessageCount>99?"99+":item.unreadMessageCount}}</span>
                            </div>
                        </div>
                        <div class="person_info">
                            <div class="name">
                                {{item._target.name}}
                                <p>
                                    <!-- <i style="font-size:12px;color:#f1f1f1;" v-show="item._target.online=='1'">[在线]</i> -->
                                    <i style="font-size:12px;color:#999999;" v-show="item._target.online=='0'">[离线]</i>
                                </p>
                            </div> 
                            <div class="lasted_msg">
                                <span v-show="item.latestMessage.content.messageName=='ImageMessage'">[图片]</span>
                                <span v-show="item.latestMessage.content.messageName=='TextMessage'">{{item.latestMessage.content.content}}</span>
                            </div>
                        </div>
                       
                    </li>

                </ul>
            </div>
            <div class="chat_right" v-show="targetId" v-loading="loading" element-loading-background="transparent" element-loading-text="加载中...">
                <div class="layim-chat-main" style="height:auto;position:relative;padding:15px 0;">
                    <div style="padding:10px 0;border-bottom:1px solid #eee;position:absolute;top:0;left:0;right:0;background:#fff;z-index:2;">
                         <div class="layim-chat-other" style="top:0;height:50px;line-height:50px;">
                            <img :src="currentUser.portrait">
                            <span socket-event="">{{currentUser.name}}</span>
                        </div>
                    </div>
                    <div ref="messageList" class="messageList" style="padding:60px 10px 0 10px;height: 460px;overflow-y:auto;">
                        <div style="text-align:center;">
                            <span v-show="messages.list.length&&messages.hasMsg" @click="loadHisMessages" style="cursor:pointer;font-size: 12px;font-weight: normal;color: #8e969f;background-color: #f9fbfd;display: inline-block;padding:3px 20px;border-radius:3px;">
                                查看历史消息
                            </span>
                        </div>
                        <ul>
                            <li :class="{'layim-chat-mine':item.messageDirection==1}"  v-for="(item,index) in messages.list" :key="index">
                                <div>
                                    <div class="layim-chat-user">
                                        <img :src="item._sender.portrait" :alt="item._sender.name">
                                        <cite>
                                            <i>{{item._sentTime}}</i>
                                            <span>{{item._sender.name}}</span>
                                        </cite>
                                    </div>
                                    <div v-if="item.messageType=='TextMessage'" class="layim-chat-text" v-html="item._content">
                                    </div>
                                    <div v-if="item.messageType=='ImageMessage'">
                                        <img :src="item.content.imageUri" style="max-width: 230px;max-height: 250px;margin-top:25px;">
                                    </div>
                                </div>
                            </li>
                        </ul>
                    </div>
                    
                </div>
                <div class="layim-chat-footer">
                    <div class="chat-footer-con">
                        <div class="chat-footer-tools">
                           <div class="messageForm-tool"></div>
                           <div class="messageForm-tool">
                                <i class="iconfont-emoji pointer" @click="toggleEmoji" style="position:relative;">
                                </i>
                                <i class="iconfont-upload pointer" style="position:relative;">
                                    <input @change="uploadImg($event)" type="file" style="position:absolute;width:100%;height:100%;opacity:0; cursor: pointer;">
                                </i>
                                 <div class="rongcloud-expressionWrap" v-show="showEmoji">
                                    <span class="fl pointer" style="padding:5px;" @click="clickEmoji(item)" :title="item.symbol" v-for="(item,index) in emojiList" :key="index" v-html="item.node.outerHTML">
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="layim-chat-textarea">
                         <textarea
                            class="chat-textarea"
                            type="textarea"
                            placeholder="请输入内容"
                            v-model="content"
                            ref="content"
                            @keyup="sendEnter($event)"
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
import RC from './service'
const conversationType = RongIMLib.ConversationType.PRIVATE;

export default {
    data() {
        return {
            loading:false,
            conversationList:[],
            messages:{
                list:[],
                hasMsg:true
            },
            messageList:[],
            emojiList:[],
            showEmoji:false,
            content:'',
            targetId:'',
            currentUser:{},
            appKey:'qd46yzrfqibvf',
        };
    },
    mounted() {
        this.init();
        RongIMLib.RongIMEmoji.init();
        this.emojiList = RongIMLib.RongIMEmoji.list;
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
    methods: {
        uploadImg(e){
            var ctx = this;
            var files = e.target.files;
            for (var i = 0; i < files.length; i++) {
                var formData = new FormData();
                var file = files[i];
                formData.append('file', file);

                this.$Api.addFile(formData).then(function(res) {
                        if (res.data.code == 1) {
                            let data = res.data;
                            data.fileType = 'image';
                            var targetId = ctx.targetId;
                            RC.Message.send({
                                content: new RongIMLib.ImageMessage({
                                    imageUri: data.url
                                }),
                                type:conversationType,
                                targetId:targetId
                            }, (error, message)=> {
                                ctx.messages.list.push(message);
                                ctx.content = '';
                                ctx.scrollBottom()
                            });
                        } else {
                            alert(res.data.message);
                        }
                    })
            }
        },
        scrollBottom(ref="messageList"){
            this.$nextTick(()=>{
                this.$refs[ref].scrollTop =this.$refs[ref].scrollHeight;
            })
        },
        init(){
            let appKey = this.appKey;
            let token = this.token;
            var modules = {
                RongIMLib: window.RongIMLib
            };
            RC.init({
                appKey,
                token
            }, (services, currentUser)=> {
                console.log('CurrentUser %o', currentUser);
                this.getConversationList()
                messageWatch(this);
                conversationWatch(this)
            }, modules);
        },
        loadHisMessages(){
            this.loading = true;
            var targetId = this.targetId;
            RC.Message.get({
                type: conversationType,
                targetId: targetId,
                timestrap:null
            }, (error, data)=> {
                var oldHeight = this.$refs['messageList'].scrollHeight;
                var {messageList,hasMsg} = data;
                this.messages.hasMsg = hasMsg;
                this.messages.list = [...messageList,...this.messages.list];
                this.$nextTick(()=>{
                    var newHeight = this.$refs['messageList'].scrollHeight;
                    this.$refs['messageList'].scrollTop = newHeight-oldHeight;
                    this.loading = false;
                })
            })
        },
        getHistoryMessages(targetId) {
            this.loading = true;
            this.messages.list = [];
            this.messages.hasMsg = true;
            RC.Message.get({
                type: conversationType,
                targetId: targetId,
                timestrap:0
            }, (error, data)=> {
                if (error) {
                    console.error('Conversation.get Error: %s', error);
                    return;
                }
                var {messageList,hasMsg} = data;
                this.messages.list = messageList;
                this.messages.hasMsg = hasMsg;
                this.scrollBottom()
                this.$nextTick(()=>{
                    this.loading = false;
                })
            });
        },
        getConversationList(){
            getConversationList(this);
        },
        sendMessage() {
            var content = this.content;
            var targetId = this.targetId;
            if (content) {
                RC.Message.send({
                    content: new RongIMLib.TextMessage({
                        content: content
                    }),
                    type:conversationType,
                    targetId:targetId
                }, (error, message)=> {
                    this.messages.list.push(message);
                    this.content = '';
                    this.$nextTick(()=>{
                        this.scrollBottom()
                    })
                });
            }
        },
        sendEnter(event){
            if (event.keyCode == '13' && !event.shiftKey) {
                event.preventDefault()
                this.sendMessage()
            }
        },
        changeUser(item){
            this.targetId = item.targetId;
            this.currentUser = item._target;
            RC.Conversation.clearUnreadCount({
                conversationType:conversationType,
                targetId:item.targetId
            });
            this.getHistoryMessages(this.targetId)
        },
        clickEmoji(item){
            this.content = this.content + item.symbol;
            this.toggleEmoji()
            this.$refs['content'].focus()
        },
        toggleEmoji(){
            this.showEmoji = !this.showEmoji;
        }
    }
}




var isActive = function(message, ctx){
    var type = conversationType;
    var id = ctx.targetId;
    return (message.conversationType == type && message.targetId == id);
};

function getConversationList(ctx){
    RC.Conversation.get( (error, conversationList)=> {
        if (error) {
            console.error('Conversation.get Error: %s', error);
            return;
        }
        console.log(conversationList)
        ctx.conversationList = conversationList;
    });
}

function messageWatch(ctx){
    RC.Message.watch(function(message){
        if (isActive(message, ctx)) {
            console.log(message)
           ctx.messages.list.push(message);
        }
    });
};
function conversationWatch(ctx){
    RC.Conversation.watch(()=> {
       getConversationList(ctx)
    });
};

var calcPosition = function(width, height, opts) {
    var isheight = width < height;
    var scale = isheight ? height / width : width / height;
    var zoom, x = 0,
        y = 0,
        w, h;

    var gtScale = function() {
        if (isheight) {
            zoom = width / 100;
            w = 100;
            h = height / zoom;
            y = (h - opts.maxHeight) / 2;
        } else {
            zoom = height / 100;
            h = 100;
            w = width / zoom;
            x = (w - opts.maxWidth) / 2;
        }
        return {
            w: w,
            h: h,
            x: -x,
            y: -y
        };
    };

    var ltScale = function() {
        if (isheight) {
            zoom = height / opts.maxHeight;
            h = opts.maxHeight;
            w = width / zoom;
        } else {
            zoom = width / opts.maxWidth;
            w = opts.maxWidth;
            h = height / zoom;
        }
        return {
            w: w,
            h: h,
            x: -x,
            y: -y
        };
    };
    return scale > opts.scale ? gtScale() : ltScale();
};

var getBlobUrl = function(file) {
    var URL = window.URL || window.webkitURL;
    return URL ? URL.createObjectURL(file) : "";
};

var getThumbnail = function(file, opts, callback) {
    opts = {
        maxHeight: 240,
        maxWidth: 240,
        quality: 0.5,
        scale: 2.4
    }
    var canvas = document.createElement("canvas"),
        context = canvas.getContext('2d');
    var img = new Image();
    img.onload = function() {
        var pos = calcPosition(img.width, img.height, opts);
        canvas.width = pos.w > opts.maxWidth ? opts.maxWidth : pos.w;
        canvas.height = pos.h > opts.maxHeight ? opts.maxHeight : pos.h;
        context.drawImage(img, pos.x, pos.y, pos.w, pos.h);
        try {
            var base64 = canvas.toDataURL(file.type, opts.quality);
            var reg = new RegExp('^data:image/[^;]+;base64,');
            base64 = base64.replace(reg, '');
            callback(base64);
        } catch (e) {
            throw new Error(e);
        }
    };
    img.src = typeof file == 'string' ? 'data:image/jpg;base64,' + file : getBlobUrl(file);
};


</script>

<style lang="less" scoped>
@import './index.less';
.messageList::-webkit-scrollbar{
    width: 5px;
    height: 8px;
}
.rongcloud-expressionWrap{
    border: 1px solid #D9DADC;
    width: 290px;
    padding: 5px 8px;
    position: absolute;
    left: -2px;
    top: -198px;
    height: 180px;
    background: #fff;
    z-index: 1100;
    overflow: auto;
    -webkit-tap-highlight-color: rgba(0,0,0,0);
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
}
.rongcloud-ext {
    position: absolute;
    right: 15px;
    color: #6b6f7c;
    font-size: 13px;
    text-align: right;
    min-width: 55px;
    .rongcloud-attr {
        height: 22px;
        font-size: 12px;
        margin-top: 10px;
        .rongcloud-badge {
            display: inline-block;
            min-width: 10px;
            padding: 3px 7px;
            font-size: 12px;
            font-weight: bold;
            line-height: 1;
            color: #fff;
            text-align: center;
            white-space: nowrap;
            vertical-align: baseline;
            background-color: #0099ff;
            border-radius: 10px;
        }
    }
}
.iconfont-emoji{
    display: inline-block;
    width: 20px;
    height: 20px;
    background: url('../../assets/images/icon/emoji.png');
    cursor: pointer;
}
.iconfont-upload{
    display: inline-block;
    width: 26px;
    height: 20px;
    background: url('../../assets/images/icon/image.png');
    cursor: pointer;
}
.chat-footer-tools {
    line-height: 22px;
    height: 22px;
    position: relative;
    margin-top: 10px;
    margin-left: 10px;
    margin-right: 10px;
}
.messageForm-tool {
    position: relative;
    margin-right: 8px;
    float: left;
    &>i{
        margin-right: 10px;
    }
}
.chat_wrapper{
    display: flex;
    width: 1000px;
    height: 630px;
    .chat_left{
        min-width: 200px;
        width: 200px;
        height: 100%;
        background-color: #25313e;
        border: 1px solid #eee;
        border-right: 0;
        .person_list{
            li{
                position: relative;
                cursor: pointer;
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
                    margin-right: 10px;
                    position: relative;
                    vertical-align: middle;
                    display: inline-block;
                    img{
                        width: 100%;
                        height:100%;
                        border-radius: 50%;
                    }
                    .dot_badge{
                        position: absolute;
                        top: 0;
                        height: 8px;
                        width: 8px;
                        padding: 0;
                        right: 0;
                        border-radius: 50%;
                        background-color: #2e93f0;
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
                        overflow: hidden;
                        text-overflow: ellipsis;
                        white-space: nowrap;
                        width: 100px;
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

