<template>
    <section class="section">
        <div class="chat_wrapper">
            <div class="chat_left">
                <ul class="person_list">
                    <li>
                        <div class="avatar">
                            <img src="http://www.jq22.com/demo/html5-slider-chat-panel20151110/img/1.png" alt="">
                        </div>
                        <div class="person_info">
                            <div class="name">张三</div>
                            <div class="lasted_msg">hello</div>
                        </div>
                    </li>
                </ul>
            </div>
            <div class="chat_right">
                <ul class="chat_list">
                    <li class="msg_item_left" v-for="(item,index) in chatList" :key="index">
                        <div class="avatar">
                            <img src="http://www.jq22.com/demo/html5-slider-chat-panel20151110/img/1.png" alt="">
                        </div>
                        <p class="chat_content">{{item.data}}</p>
                    </li>
                     <!-- <li class="msg_item_right">
                        <div class="avatar">
                            <img src="http://www.jq22.com/demo/html5-slider-chat-panel20151110/img/1.png" alt="">
                        </div>
                        <p class="chat_content">2222</p>
                    </li> -->
                </ul>
                <div class="sendForm">
                    <form>
                        <el-input
                        type="textarea"
                        :autosize="{ minRows: 2, maxRows: 4}"
                        placeholder="请输入内容"
                        v-model="msg"
                        >
                        </el-input>
                        <div class="">
                            <el-button type="info" @click="sendMsg">发送</el-button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
      



         <el-form ref="form" :model="form" label-width="80px">
            <el-form-item label="用户名">
                <el-input v-model="form.name"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="onRegister">注册</el-button>
            </el-form-item>
        </el-form> 
    </section>
</template>

<script>
var socket = io.connect('127.0.0.1:7893');
socket.on('tip', function(msg){
    alert(msg)
});

export default {
    data() {
        return {
            form:{
                name:''
            },
            chatList:[{
                data:'1111',
                time:new Date()
            }],
            msg:''
        };
    },
    mounted() {
        this.onserverMessage()
    },
    created() {
        socket.on('connectNum', function (num) {
            console.log("连接数：" + num);
            if(num===1){
                alert()
            }
        });
	},
    methods: {
        onRegister(){
            var from = this.form.name;
            socket.emit('setName', from);
            //sessionStorage.setItem('name', from);
        },
        sendMsg(){
            socket.emit('client message', this.msg);
            console.log(this.msg)
        },
        onserverMessage(){
            socket.on('server message', (data)=> {
                this.chatList.push({
                    data:data,
                    time:new Date()
                })
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
            height: 400px;
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