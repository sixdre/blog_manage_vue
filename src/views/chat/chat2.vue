<template>
    <section class="section" id="chat_section">
        <div class="">
            <div class="block-header">
                <div class="row">
                    <div class="col-lg-5 col-md-8 col-sm-12">                        
                        <h2>Chat</h2>
                    </div>            
                </div>
            </div>
            <div class="row clearfix">
                <div class="col-lg-12">
                    <div class="chat-app">
                        <div class="row">
                            <div class="col-lg-3 col-md-4">
                                <div class="hidden-xs">
                                    <div id="plist" class="people-list">
                                        <div class="input-group p-3 bg-white border-bottom">
                                            <div class="input-group-prepend">
                                                <span class="input-group-text"><i class="fa fa-search"></i></span>
                                            </div>
                                            <input type="text" class="form-control" placeholder="Search...">
                                        </div>
                                        <div class="slimScrollDiv" style="position: relative; overflow-y: scroll; width: auto; height: calc(100vh - 220px);">
                                            <ul v-if="conversationList.length" class="list-unstyled chat-list mt-2 mb-0">
                                                <li @click="changeUser(item,index)" 
                                                :class="{'active':targetId==item.userId}" v-for="(item,index) in conversationList" :key="index" class="clearfix">
                                                    <div class="float-left list-left">
                                                        <div class="img-preview">
                                                            <img :src="item.avatar" alt="avatar">
                                                            <div class="status" v-if="item.online==1"><i class="fa fa-circle online"></i></div>
                                                        </div>
                                                        <div class="about">
                                                            <div class="name">{{item.username}}</div>
                                                            <div class="msg">
                                                                <span v-if="item.latestMessage&&item.latestMessage.type=='Text'" :title="item.latestMessage.content">{{item.latestMessage.content}}</span>
                                                                <span v-if="item.latestMessage&&item.latestMessage.type=='Image'">[图片]</span>
                                                                <span v-if="item.latestMessage&&item.latestMessage.type=='File'">[文件]</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div class="float-right">
                                                        <!-- <div class="time">latestMessage</div> -->
                                                        <div class="badge badge-danger bg-danger text-white" v-if="item.unreadMessageCount>0">{{item.unreadMessageCount>99?"99+":item.unreadMessageCount}}</div>
                                                    </div>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="col-lg-9 col-md-8" v-if="targetId">
                                <div id="chat-left" class="chat bg-white">
                                    <div class="chat-header clearfix">
                                        <div class="row">
                                            <div class="col-lg-6">
                                                <a href="javascript:void(0);">
                                                    <img :src="currentUser.avatar" alt="avatar">
                                                </a>
                                                <div class="chat-about">
                                                    <h6 class="m-b-0">{{currentUser.username}}</h6>
                                                    <small>Last seen: 2 hours ago</small>
                                                </div>
                                            </div>
                                           
                                        </div>
                                    </div>
                                    <div class="chat-history" ref="messageList" style="position: relative; overflow-y: scroll; width: auto; height: calc(100vh - 380px);">
                                        <div class="chat-Messages-history">
                                            <span v-show="messages.list.length&&messages.hasMore" @click="loadHisMessages">
                                                查看历史消息
                                            </span>
                                        </div>
                                        <ul class="chat-history-list">
                                            <li class="chat-Message-item" :class="{'chat-Message-item-send':item.messageDirection==1}"  v-for="(item,index) in messages.list" :key="index">
                                                <div class="clearfix">
                                                    <div class="chat-Message-item-user">
                                                        <img :src="item.sender.avatar" :alt="item.sender.username">
                                                        <cite>
                                                            <i>{{item.sendTime}}</i>
                                                        </cite>
                                                    </div>
                                                    <div class="chat-Message-item-body" >
                                                        <div v-if="item.type=='Text'" class="chat-Message-item-text" >
                                                            <pre v-html="item.content"></pre>
                                                        </div>
                                                        <div v-if="item.type=='Image'" class="chat-Message-item-text">
                                                            <img v-preview class="pointer" :src="item.content" style="max-width: 230px;max-height: 250px;">
                                                        </div>
                                                        <div class="chat-Message-item-file" v-if="item.type=='File'">
                                                            <div class="chat-sprite chat-file-icon"></div>
                                                            <div class="chat-file-name">{{transformJsonContent(item.content).fileName}}</div>
                                                            <div class="chat-file-name">{{handleFileSize(transformJsonContent(item.content).fileSize)}}</div>
                                                            <a class="chat-sprite chat-file-download" :href="transformJsonContent(item.content).fileUrl"></a>
                                                        </div>
                                                    </div>
                                                </div>
                                            </li>
                                        </ul>
                                    </div>
                                    <div class="chat-message clearfix">
                                        <div class="chat-footer-tools">
                                            <div class="chat-MessageForm-tool">
                                                <i class="iconfont-emoji pointer" @click="toggleEmoji"></i>
                                                <div class="chat-expressionWrap" v-show="showEmoji">
                                                    <span class="fl pointer" style="padding:5px;" @click="clickEmoji(item)" :title="item.symbol" v-for="(item,index) in emojiList" :key="index" v-html="item.node.outerHTML">
                                                    </span>
                                                </div>
                                            </div>
                                            <div class="chat-MessageForm-tool">
                                                <i class="iconfont-image pointer">
                                                    <input accept="image/*" @change="uploadImg($event)"  type="file" style="position:absolute;width:100%;height:100%;opacity:0; cursor: pointer;">
                                                </i>
                                            </div>
                                            <div class="chat-MessageForm-tool">
                                                <i class="iconfont-file pointer">
                                                    <input  type="file" @change="uploadFile($event)" style="position:absolute;width:100%;height:100%;opacity:0; cursor: pointer;">
                                                </i>
                                            </div>
                                        </div>
                                        <div class="input-group mb-0">
                                            <textarea type="textarea" v-model="content" ref="content"
                                            @keyup.enter="sendMessage"
                                            @paste="handlePaste" class="form-control" placeholder="Enter text here..."/>
                                            <div class="input-group-append"  @click="sendMessage">
                                                <span class="input-group-text"><i class="fa fa-paper-plane"></i></span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
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
            targetId:'',
            conversationType:1,
            content:'',
        };
    },
    mounted() {

    },
    computed:{
        token(){
            return this.$store.state.user.token
        },
        currentUser(){
            let user = this.conversationList.find(item=>item.userId==this.targetId);
            return user?user:{}
        }
    },
    created() {
        this.conversationType = this.$route.query.conversationType ||1;
        this.targetId = this.$route.query.targetId;
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
            // this.currentUser = item;
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
            this.$router.push({
                path:'/chat2',
                query:{
                    conversationType:this.conversationType,
                    targetId:this.targetId
                }
            })
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
            this.loading = true;
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
                this.loading = false;
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
                    if(!error){
                        this.messages.list.push(message);
                        this.content = '';
                        this.$nextTick(()=>{
                            this.scrollBottom()
                        })
                    }
                });
            }
        },
        sendMessage() {
            var content = this.content;
            this.send(content,'Text')
        },
        sendImageMessage(file){
            var formData = new FormData();
            formData.append('file', file);
            this.$Api.addFile(formData).then((res)=> {
                if (res.data.code == 1) {
                    let data = res.data;
                    this.send(data.url,'Image')
                } else {
                    alert(res.data.message);
                }
            })
        },
        sendFileMessage(file){
            var formData = new FormData();
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
        },
        uploadImg(e){
            var files = e.target.files;
            for (var i = 0; i < files.length; i++) {
                var file = files[i];
                this.sendImageMessage(file)
            }
        },
        uploadFile(e){
            var files = e.target.files;
            for (var i = 0; i < files.length; i++) {
                var file = files[i];
                this.sendFileMessage(file)
            }
        },
        handlePaste(event) {
            console.log(event)
            var data = event.clipboardData;
            if (typeof data !== 'object') {
                return;
            }
            [...data.items].forEach((item, index)=>{
                    if (item.kind === 'file' && item.type.indexOf('image/') !== -1) {
                    var blob = item.getAsFile();
                    this.sendImageMessage(blob);
                }
            })
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
@import './chat.less';
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