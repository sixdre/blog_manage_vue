<template>
    <section class="section">
        <div class="layim-chat-main" style="height:490px" ref="chatList">
            <ul>
                <li :class="{'layim-chat-mine':item.messageDirection==1}"  v-for="(item,index) in messageList" :key="index">
                    <div class="layim-chat-user">
                        <img :src="item._sender.portrait" :alt="item._sender.name">
                        <cite>
                            <i>{{item.sentTime|moment}}</i>
                            <span>{{item._sender.name}}</span>
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
    </section>
</template>

<script>

export default {
    data() {
        return {
            conversationList:[],
            form:{
                name:''
            },
            messageList:[],
            content:'',
            targetId:'',
            instance:null,
            appKey:'qd46yzrfqibvf',
        };
    },
    mounted(){
        console.log(window.RongIM)
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