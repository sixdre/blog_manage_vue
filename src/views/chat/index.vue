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
                            <div class="lasted_msg">{{item.latestMessage.content.content}}</div>
                        </div>
                    </li>

                </ul>
            </div>
            <div class="chat_right" v-show="targetId">
                <div class="layim-chat-main" style="height:auto;position:relative;">
                    <div style="padding:10px 0;border-bottom:1px solid #eee;position:absolute;top:0;left:0;right:0;background:#fff;z-index:9;">
                         <div class="layim-chat-other" style="top:0;height:50px;line-height:50px;">
                            <img :src="currentUser.portrait">
                            <span socket-event="">{{currentUser.name}}</span>
                        </div>
                    </div>
                    <ul  ref="messageList" style="padding-top:60px;height: 460px;overflow-y:auto;">
                        <li :class="{'layim-chat-mine':item.messageDirection==1}"  v-for="(item,index) in messageList" :key="index">
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
                                    <span class="fl pointer" @click="clickEmoji(item)" v-for="(item,index) in emojiList" :key="index" v-html="item.node.outerHTML">
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
            conversationList:[],
            form:{
                name:''
            },
            messages:{},
            messageList:[],
            emojiList:[],
            showEmoji:false,
            content:'',
            targetId:'',
            currentUser:{},
            instance:null,
            appKey:'qd46yzrfqibvf',
        };
    },
    mounted() {
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
    created() {
        this.init();
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
                                ctx.messageList.push(message);
                                ctx.content = '';
                                ctx.scrollBottom()
                            });
                            // getThumbnail(file, {}, function(base64) {
                            //     data.thumbnail = base64;
                            //     var targetId = ctx.targetId;
                            //     RC.Message.send({
                            //         content: new RongIMLib.ImageMessage({
                            //             content: data.thumbnail, 
                            //             imageUri: data.url
                            //         }),
                            //         type:conversationType,
                            //         targetId:targetId
                            //     }, (error, message)=> {
                            //         ctx.messageList.push(message);
                            //         ctx.content = '';
                            //         ctx.scrollBottom()
                            //     });
                            // })
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
                var Conversation = services.Conversation;
                var Message = services.Message;
                this.getConversationList()
                messageWatch(this);
                conversationWatch(this)
            }, modules);
        },
        getHistoryMessages(targetId) {
            RC.Message.get({
                type: conversationType,
                targetId: targetId
            }, (error, data)=> {
                if (error) {
                    console.error('Conversation.get Error: %s', error);
                    return;
                }
                var {messageList,hasMsg} = data;
                this.messageList = messageList;
                console.log(messageList)
                this.scrollBottom()
                // if(!this.messages[this.targetId]){
                //     this.messages[this.targetId] = {};
                //     this.messages[this.targetId].messageList = [];
                //     this.messages[this.targetId].messageList = messageList;
                    
                // }else{
                //     var tm = this.messages[this.targetId].messageList;
                //     this.messages[this.targetId].messageList = [...tm,...messageList];
                // }
                // console.log(this.messages[this.targetId].messageList)
                // this.messages[this.targetId].hasMsg = hasMsg;
                // this.messageList = this.messages[this.targetId].messageList;
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
                    this.messageList.push(message);
                    this.content = '';
                    this.scrollBottom()
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
            console.log(item)
            this.getHistoryMessages(this.targetId)
        },
        clickEmoji(item){
            this.content = this.content + item.symbol;
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
        ctx.conversationList = conversationList;
    });
}

function messageWatch(ctx){
    RC.Message.watch(function(message){
        if (isActive(message, ctx)) {
            ctx.messageList.push(message);
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

