<template>
    <section class="section">
        <div class="rongcloud-wrapper">
            <div class="rongcloud-left">
                <div style="position:absolute;width:100%;top:0;height:42px;text-align:center;border-bottom:1px solid #eee;padding:10px 15px;background:#28b779;">
                    <span style="font-size:14px;color:#fff;" v-show="!searchState">最近联系人</span>
                    <input @keyup.enter="searchUser" style="width:110px;height:23px;" v-model="searchUserName" v-show="searchState" type="text">
                    <i v-show="searchState" @click="searchState=0" style="float:right;margin-top:3px;color:#fff;cursor:pointer;margin-left:5px;" class="el-icon-error"></i>
                    <i style="float:right;margin-top:3px;color:#fff;cursor:pointer;" @click="searchUser" class="el-icon-search"></i>
                </div>
                <div class="scroll" style="position:absolute;top:42px;bottom:0;width:100%;overflow-y:scroll;">
                    <div v-show="searchState" style="position:absolute;top:0;bottom:0;left:0;right:0;background:#fff;z-index:2;">
                        <ul class="rongcloud-conversation-list" v-show="searchUserList.length">
                            <li class="rongcloud-conversation" @click="toConversation(item)" v-for="(item,index) in searchUserList" :key="index">
                                <div class="avatar">
                                    <img :src="item.avatar" alt="">
                                </div>
                                <div class="rongcloud-user">
                                    <div class="name">
                                        {{item.username}}
                                    </div> 
                                </div>
                            </li>
                        </ul>
                        <p v-show="!hasSearchUser" style="text-align:center;">没有找到相关用户</p>
                    </div>

                    <ul class="rongcloud-conversation-list" v-if="conversationList.length">
                        <li class="rongcloud-conversation" @click="changeUser(item)" :class="{'active':targetId==item.targetId}" v-for="(item,index) in conversationList" :key="index">
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
                                        <img :src="item._sender.portrait" :alt="item._sender.name">
                                        <cite>
                                            <i>{{item._sentTime}}</i>
                                            <span>{{item._sender.name}}</span>
                                        </cite>
                                    </div>
                                    <div class="rongcloud-Message-body" >
                                        <div v-if="item.messageType=='TextMessage'" class="rongcloud-Message-text" >
                                            <pre v-html="item._content"></pre>
                                        </div>
                                        <div v-if="item.messageType=='ImageMessage'">
                                            <img v-preview class="pointer" :src="item.content.imageUri" style="max-width: 230px;max-height: 250px;">
                                        </div>
                                        <div class="rongcloud-Message-file" v-if="item.messageType=='FileMessage'">
                                            <div class="rongcloud-sprite rongcloud-file-icon"></div>
                                            <div class="rongcloud-file-name">{{item.content.name}}</div>
                                            <div class="rongcloud-file-name">{{handleFileSize(item.content.size)}}</div>
                                            <a class="rongcloud-sprite rongcloud-file-download" :href="item.content.fileUrl"></a>
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
                                <i class="iconfont-emoji pointer" @click="toggleEmoji"></i>
                                <div class="rongcloud-expressionWrap" v-show="showEmoji">
                                    <span class="fl pointer" style="padding:5px;" @click="clickEmoji(item)" :title="item.symbol" v-for="(item,index) in emojiList" :key="index" v-html="item.node.outerHTML">
                                    </span>
                                </div>
                            </div>
                            <div class="rongcloud-MessageForm-tool">
                                <i class="iconfont-image pointer">
                                    <input accept="image/*" @change="uploadImg($event)" type="file" style="position:absolute;width:100%;height:100%;opacity:0; cursor: pointer;">
                                </i>
                            </div>
                             <div class="rongcloud-MessageForm-tool">
                                 <i class="iconfont-file pointer">
                                    <input @change="uploadFile($event)" type="file" style="position:absolute;width:100%;height:100%;opacity:0; cursor: pointer;">
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
                            @keyup="sendEnter($event)"
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
import RC from './service'
const conversationType = RongIMLib.ConversationType.PRIVATE;

export default {
    data() {
        return {
            loading:false,
            searchUserName:'',
            searchState:0,
            searchUserList:[],
            hasSearchUser:true,
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
        this.getRongToken().then(()=>{
            this.init();
            RongIMLib.RongIMEmoji.init();
            this.emojiList = RongIMLib.RongIMEmoji.list;
        },()=>{

        })
    },
    methods: {
        handleFileSize(size){
			let kb = size/1024;
			if(kb<1024){
				return kb.toFixed(2)+'KB';
			}else{
				return (kb/1024).toFixed(2)+'MB'
			}
        },
        async searchUser(){
            this.searchState = 1;
            var searchUserName = this.searchUserName
            if(!searchUserName){
                return ;
            }
            let res= await this.$Api.searchUser(searchUserName);
            if (res.data.code === 1) {
				this.searchUserList = res.data.data;
                if(!this.searchUserList.length){
                    this.hasSearchUser = false;
                }else{
                    this.hasSearchUser = true;
                }
			} else {
				alert(res.data.message);
			}
        },
        toConversation(item){
            let newconversation= {};
            let conversation = this.conversationList.find(con=>con.targetId===item.id);
            if(!conversation){
                newconversation={
                    targetId:item.id,
                    _target:{
                        name:item.username,
                        portrait:item.avatar
                    }
                }
                this.conversationList.push(newconversation)
            }else{
                newconversation = conversation;
            } 
            this.targetId = item.id;
            this.searchState=0;
            this.changeUser(newconversation)
        },
        async getRongToken(){
            let res= await this.$Api.getRongToken();
            if (res.data.code === 1) {
				this.token = res.data.ryToken;
			} else {
				alert(res.data.message);
			}
        },
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
        uploadFile(e){
            var ctx = this;
            var files = e.target.files;
            for (var i = 0; i < files.length; i++) {
                var formData = new FormData();
                var file = files[i];
                formData.append('file', file);
                this.$Api.addFile(formData).then(function(res) {
                    if (res.data.code == 1) {
                        let data = res.data;
                        data.fileType = 'file';
                        var targetId = ctx.targetId;
                        RC.Message.send({
                            content: new RongIMLib.FileMessage({
                                name: file.name,
                                size: file.size,
                                fileUrl: data.url
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
                this.$refs[ref].scrollTop = this.$refs[ref].scrollHeight;
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

