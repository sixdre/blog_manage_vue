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
                        <li class="rongcloud-conversation" @click="changeUser(item,index)"  :class="{'active':targetId==item.userId}" v-for="(item,index) in conversationList" :key="index">
                            <div class="avatar">
                                <img :class="{'offline':item.online=='0'}" :src="item.avatar" alt="">
                            </div>
                            <div class="rongcloud-ext">
                                <div class="rongcloud-attr clearfix">
                                    <span class="rongcloud-badge" v-show="item.unreadMessageCount>0">{{item.unreadMessageCount>99?"99+":item.unreadMessageCount}}</span>
                                </div>
                            </div>
                            <div class="rongcloud-user">
                                <div class="name">
                                    {{item.username}}
                                    <p>
                                        <!-- <i class="rongcloud-online online" v-show="item._target.online=='1'">[在线]</i> -->
                                        <i class="rongcloud-online offline" v-show="item.online=='0'">[离线]</i>
                                    </p>
                                </div> 
                                <div class="rongcloud-lasted-msg" v-if="item.latestMessage">
                                    <span v-show="item.latestMessage.type=='Text'" :title="item.latestMessage.content">{{item.latestMessage.content}}</span>
                                    <span v-show="item.latestMessage.type=='Image'">[图片]</span>
                                    <span v-show="item.latestMessage.type=='File'">[文件]</span>
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
                            <img :src="currentUser.avatar">
                            <span socket-event="">{{currentUser.username}}</span>
                        </div>
                    </div>
                    <div ref="messageList" class="rcs-message-list">
                        <div class="rongcloud-Messages-history">
                            <span v-show="messages.list.length&&messages.hasMore" @click="loadHisMessages">
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
                                        <div v-if="item.type=='Image'">
                                            <img v-preview class="pointer" :src="item.content" style="max-width: 230px;max-height: 250px;">
                                        </div>
                                        <div class="rongcloud-Message-file" v-if="item.type=='File'">
                                            <div class="rongcloud-sprite rongcloud-file-icon"></div>
                                            <div class="rongcloud-file-name">{{transformJsonContent(item.content).fileName}}</div>
                                            <div class="rongcloud-file-name">{{handleFileSize(transformJsonContent(item.content).fileSize)}}</div>
                                            <a class="rongcloud-sprite rongcloud-file-download" :href="transformJsonContent(item.content).fileUrl"></a>
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
                                    <input accept="image/*" @change="uploadImg($event)"  type="file" style="position:absolute;width:100%;height:100%;opacity:0; cursor: pointer;">
                                </i>
                            </div>
                             <div class="rongcloud-MessageForm-tool">
                                 <i class="iconfont-file pointer">
                                    <input  type="file" @change="uploadFile($event)" style="position:absolute;width:100%;height:100%;opacity:0; cursor: pointer;">
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
                            @keyup.enter="sendMessage"
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

//conversationType    1 私聊  2 群聊


var isActive = function(message, ctx){
    var id = ctx.targetId;
    if(ctx.conversationType==2){
        return message.target == id;
    }
    return (message.senderUserId == id);
};
function messageWatch(ctx){
    RC.Message.watch(function(message){
        if (isActive(message, ctx)) {
           ctx.messages.list.push(message);
           ctx.scrollBottom()
        }
    });
};
function conversationWatch(ctx){
    RC.Conversation.watch(()=> {
       ctx.getConversationList()
    });
};
export default {
    data() {
        return {
            loading:false,
            page:1,
            searchUserName:'',
            searchState:0,
            searchUserList:[],
            hasSearchUser:true,
            conversationList:[],
            messages:{
                list:[],
                hasMore:false
            },
            emojiList:[],
            showEmoji:false,
            targetId:'5b58251db4031514b096680c',
            conversationType:2,
            content:'',
            currentUser:{

            },
        };
    },
    mounted() {

    },
    computed:{
        token(){
            return this.$store.state.user.token
        }
    },
    created() {
        console.log(this.$route.query.conversationType)
        this.emojiList = RongIMLib.RongIMEmoji.list;
        this.init();
	},
    methods: {
        init(){
            RC.init({
                token:this.token,
            },(currentUser)=>{
                console.log(currentUser)
                this.getConversationList()
                this.getHistoryMessages()
                messageWatch(this);
                conversationWatch(this);
            })
        },
        handleFileSize(size){
			let kb = size/1024;
			if(kb<1024){
				return kb.toFixed(2)+'KB';
			}else{
				return (kb/1024).toFixed(2)+'MB'
			}
        },
        transformJsonContent(content){
            return JSON.parse(content)
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
            let conversation = this.conversationList.find(con=>con.userId===item._id);
            if(!conversation){
                newconversation={
                    username:item.username,
                    userId:item._id,
                    avatar:item.avatar
                }
                this.conversationList.push(newconversation)
            }else{
                newconversation = conversation;
            } 
            this.targetId = item._id;
            this.searchState=0;
            this.changeUser(newconversation)
        },
        changeUser(item,index){
            this.page=1;
            this.targetId = item.userId;
            this.currentUser = item;
            this.conversationType = 1;
            RC.Conversation.clearUnreadCount({
                targetId:item.userId
            },(err,data)=>{
                if(!err){
                    if(index!==undefined||index!==null){
                        this.$set(this.conversationList,index,{...item,unreadMessageCount:0})
                    } 
                }
            });
            this.getHistoryMessages()
        },
        scrollBottom(ref="messageList"){
            this.$nextTick(()=>{
                this.$refs[ref].scrollTop = this.$refs[ref].scrollHeight;
            })
        },
        getConversationList(){
            RC.Conversation.get((error, data)=> {
                if (error) {
                    console.error('Conversation.get Error: %s', error);
                    return;
                }
                console.log(data)
                this.conversationList = data;
            });
        },
        getHistoryMessages() {
            var targetId = this.targetId;
            var conversationType = this.conversationType;
            this.messages.list = [];
            this.messages.hasMsg = true;
            RC.Message.getHistoryMessages({
                targetId: targetId,
                conversationType,
            }, (error, data)=> {
                if (error) {
                    console.error('Conversation.get Error: %s', error);
                    return;
                }
                var {list,hasMore} = data;
                this.messages.list = list;
                this.messages.hasMore = hasMore;
                this.scrollBottom()
            });
        },
        loadHisMessages(){
            this.loading = true;
            this.page++;
            var targetId = this.targetId;
            var conversationType = this.conversationType;
            RC.Message.getHistoryMessages({
                targetId: targetId,
                page:this.page,
                conversationType
            }, (error, data)=> {
                if (error) {
                    console.error('message.get Error: %s', error);
                    return;
                }
                // console.log(data)
                var oldHeight = this.$refs['messageList'].scrollHeight;
                var {list,hasMore} = data;
                this.messages.hasMore = hasMore;
                this.messages.list = [...list,...this.messages.list];
                this.$nextTick(()=>{
                    var newHeight = this.$refs['messageList'].scrollHeight;
                    this.$refs['messageList'].scrollTop = newHeight-oldHeight;
                    this.loading = false;
                })
            })
        },
        send(content,type="Text"){
            var targetId = this.targetId;
            var conversationType = this.conversationType;
            if (content) {
                RC.Message.send({
                    content: content,
                    type:type,
                    targetId:targetId,
                    conversationType:conversationType
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
        sendMessage() {
            var content = this.content;
            this.send(content)
        },
        uploadImg(e){
            var files = e.target.files;
            for (var i = 0; i < files.length; i++) {
                var formData = new FormData();
                var file = files[i];
                formData.append('file', file);
                this.$Api.addFile(formData).then((res)=> {
                    if (res.data.code == 1) {
                        let data = res.data;
                        this.send(data.url,'Image')
                    } else {
                        alert(res.data.message);
                    }
                })
            }
        },
        uploadFile(e){
            var files = e.target.files;
            for (var i = 0; i < files.length; i++) {
                var formData = new FormData();
                var file = files[i];
                formData.append('file', file);
                this.$Api.addFile(formData).then((res)=> {
                    if (res.data.code == 1) {
                        let data = res.data;
                        let content = JSON.stringify({
                            fileName: file.name,
                            fileSize: file.size,
                            fileUrl: data.url
                        }) 
                        this.send(content,'File')
                    } else {
                        alert(res.data.message);
                    }
                })
            }
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