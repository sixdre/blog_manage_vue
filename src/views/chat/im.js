import emoji from './emoji'
import utils from './utils'

var render = utils.render;
var conversation = {};
conversation.lastSendTime = 0;
conversation.messageContent = [];
var voicePlay = null;
var userInfoValue = {}; //保存收集用户信息的相关数据
var templates = {};
var $ = window.$ || utils.$;
var terminal;
var supportNot = false; //页面是否支持notification
var User = {
    _Cache: {}
};

/*
    此处只为演示，实际应用需请求应用服务器获取用户信息
*/
User.get = function(user) {
    var id = user.id;
    //保证不刷新页面情况下，同一个 userId 的信息是一致的
    user = User._Cache[id];
    if (user) {
        return user;
    }

    let url = `http://localhost:7893/api/users/${id}/info`;
    $.ajax({
        url: url,
        type: 'get', //GET
        async: false, //或false,是否异步
        timeout: 5000, //超时时间
        dataType: 'json', //返回的数据格式：
        success: function(data, textStatus, jqXHR) {

            user = {
                name: data.data.userInfo.username,
                portrait: data.data.userInfo.avatar
            };
        },
        error: function(xhr, textStatus) {},

    })

    User._Cache[id] = user;
    return user;
};

function textMessageFormat(content) {
    if (content.length === 0) {
        return '';
    }

    content = utils.encodeHtmlStr(content);

    content = utils.replaceUri(content, function(uri, protocol) {
        var link = uri;
        if (!protocol) {
            link = 'http://' + uri;
        }
        return '<a class="rong-link-site" target="_blank" href="' + link + '">' + uri + '</a>';
    });

    content = utils.replaceEmail(content, function(email) {
        return '<a class="rong-link-email" href="mailto:' + email + '">' + email + '<a>';
    });

    return emoji.emojiToHTML(content, 18);
}


//开始会话
var startConversation = function(targetId) {
    conversation.targetType = RongIMLib.ConversationType.PRIVATE;
    conversation.messageContent = [];
    conversation.id = targetId;

    // clearUnreadCount(targetId);

}



//清楚未读消息数
var clearUnreadCount = function(targetId) {
    var conversationType = RongIMLib.ConversationType.PRIVATE;
    RongIMClient.getInstance().clearUnreadCount(conversationType, targetId, {
        onSuccess: function() {
            console.log('清除未读消息成功');
            // 清除未读消息成功。
        },
        onError: function(error) {
            // error => 清除未读消息数错误码。
        }
    });
}


var formartMessage = function(message) {
    var sender = User.get({
        id: message.senderUserId
    });
    var direction = (message.messageDirection == 1) ? 'sender' : 'receiver';
    var content = modifyMessage(message);
    utils.copy(message, {
        _sender: sender,
        _direction: direction,
        _content: content.content.content
    });
}


//发送消息
var sendMessage = function(msg, callback) {
    console.log(msg)
    var targetId = conversation.id; // 目标 Id
    RongIMClient.getInstance().sendMessage(conversation.targetType, targetId, msg, {
        // 发送消息成功
        onSuccess: function(message) {
            console.log(message);
            //message 为发送的消息对象并且包含服务器返回的消息唯一Id和发送消息时间戳
            console.log("Send successfully");
            formartMessage(message);
            callback && callback(message);
        },
        onError: function(errorCode, message) {
            var info = '';
            switch (errorCode) {
                case RongIMLib.ErrorCode.TIMEOUT:
                    info = '超时';
                    break;
                case RongIMLib.ErrorCode.UNKNOWN_ERROR:
                    info = '未知错误';
                    break;
                case RongIMLib.ErrorCode.REJECTED_BY_BLACKLIST:
                    info = '在黑名单中，无法向对方发送消息';
                    break;
                case RongIMLib.ErrorCode.NOT_IN_DISCUSSION:
                    info = '不在讨论组中';
                    break;
                case RongIMLib.ErrorCode.NOT_IN_GROUP:
                    info = '不在群组中';
                    break;
                case RongIMLib.ErrorCode.NOT_IN_CHATROOM:
                    info = '不在聊天室中';
                    break;
                default:
                    info = x;
                    break;
            }
            console.log('发送失败:' + info);
        }
    });
}



//单条消息修饰
var modifyMessage = function(msg) {
    if (msg.messageType == 'TextMessage') {
        msg.content.content = textMessageFormat(msg.content.content);
    } else if (msg.messageType == 'FileMessage') {
        msg.content.size = utils.getFileSize(msg.content.size);
    } else if (msg.messageType == 'VoiceMessage') {
        RongIMLib.RongIMVoice.preLoaded(msg.content.content);
    }
    return msg;
}

//web push message
var pushMessage = function(msg) {
    if (terminal == 'pc') {
        var title = '消息提醒';
        var options = {
            body: "您有一条新消息，请及时回复",
            icon: (msg.content.user && msg.content.user.icon) ? msg.content.user.icon : "./images/kefu.png",
        };
        var notification = new Notification(title, options);

        notification.onclick = function(event) {
            window.focus();
            notification.close();
        }
        notification.onshow = function() {
            setTimeout(function() {
                notification.close();
            }, 5000);
        };
    }
}

//显示新消息
var updateMessage = function(message) {
    console.log(message)
        // if (message.messageType == 'ReadReceiptMessage') {
        //     return; //ReadReceiptMessage的messageType
        // }
        // conversation.messageContent.push(message);
        // var newMessage = modifyMessage(utils.cloneObj(message));
        // if (message.messageDirection != 1 && supportNot) {
        //     pushMessage(newMessage);
        // }
        // var messageList = $(".rcs-message-box")[0];
        // if (!messageList) {
        //     return;
        // }
        // if (newMessage.sentTime - conversation.lastSendTime >= 60000) { //超过1分钟
        //     var messageTime = {};
        //     messageTime.content = {};
        //     messageTime.messageType = 'TimeMessage';
        //     messageTime.sentTime = utils.getTime(newMessage.sentTime);
        //     messageList.innerHTML += render(templates.imMessageTemplate, messageTime);
        //     conversation.lastSendTime = newMessage.sentTime;
        // }
        // messageList.innerHTML += render(templates.imMessageTemplate, newMessage);
        // messageList.scrollTop = messageList.scrollHeight;
}


//获取历史记录消息
var getHisMessage = function(conversationId, timestrap, count, callbacks) {
    var conversationType = RongIMLib.ConversationType.PRIVATE; //私聊,其他会话选择相应的消息类型即可。
    var targetId = conversationId; // 想获取自己和谁的历史消息，targetId 赋值为对方的 Id。
    // timestrap默认传 null，若从头开始获取历史消息，请赋值为 0 ,timestrap = 0;
    // count每次获取的历史消息条数，范围 0-20 条，可以多次获取。
    RongIMLib.RongIMClient.getInstance().getHistoryMessages(conversationType, targetId, timestrap, count, {
        onSuccess: function(list, hasMsg) {
            conversation.messageContent = list.concat(conversation.messageContent);
            callbacks(list, hasMsg);
        },
        onError: function(error) {
            console.log("GetHistoryMessages,errorcode:" + error);
        }
    });
}




//获取会话列表
var getConversationList = function(callback) {
    RongIMClient.getInstance().getConversationList({
        onSuccess: function(list) {
            //用户信息处理 http://support.rongcloud.cn/kb/NjQ5
            var _list = [];
            for (var i = 0; i < list.length; i++) {
                if (list[i].conversationType == RongIMLib.ConversationType.PRIVATE) {
                    _list.push(list[i]);
                }
            }
            var temp = _list[0];
            for (var i = 0; i < _list.length; i++) {
                for (var j = i + 1; j < _list.length; j++) {
                    if (_list[i].sentTime < _list[j].sentTime) {
                        var temp = _list[i];
                        _list[i] = _list[j];
                        _list[j] = temp;
                    }
                }
            }
            utils.forEach(_list, function(conversation) {
                var target = User.get({
                    id: conversation.targetId
                });
                var message = conversation.latestMessage;
                var content = modifyMessage(message);
                var sender = User.get({
                    id: message.senderUserId
                });
                utils.copy(message, {
                    _content: content.content.content
                });
                utils.copy(conversation, {
                    _target: target,
                    _sender: sender
                });
            });
            callback && callback(_list);
        },
        onError: function(error) {
            // do something...
        }
    }, null);
}


var send = function(message, callback) {
    if (message) {
        message = emoji.symbolToEmoji(message);
        sendMessage(new RongIMLib.TextMessage({ content: message, extra: "附加信息" }), callback);
    }
}






var sdkInit = function(params, callbacks) {
    var appKey = params.appKey;
    var token = params.token;
    var navi = params.navi || "";

    if (navi !== "") {
        //私有云
        var config = {
            navi: navi
        };
        console.log("私有云");
        console.log(params);
        RongIMLib.RongIMClient.init(appKey, null, config);
    } else {
        //公有云
        console.log("公有云");
        console.log(params);
        RongIMLib.RongIMClient.init(appKey);
    }

    var instance = RongIMClient.getInstance();

    // 连接状态监听器
    RongIMClient.setConnectionStatusListener({
        onChanged: function(status) {
            switch (status) {
                case RongIMLib.ConnectionStatus.CONNECTED:
                    callbacks.getInstance && callbacks.getInstance(instance);
                    break;
                case RongIMLib.ConnectionStatus.CONNECTING:
                    console.log('正在链接');
                    break;
                case RongIMLib.ConnectionStatus.DISCONNECTED:
                    console.log('断开连接');
                    break;
                case RongIMLib.ConnectionStatus.KICKED_OFFLINE_BY_OTHER_CLIENT:
                    console.log('其他设备登录');
                    break;
                case RongIMLib.ConnectionStatus.DOMAIN_INCORRECT:
                    console.log('域名不正确');
                    break;
                case RongIMLib.ConnectionStatus.NETWORK_UNAVAILABLE:
                    console.log('网络不可用');
                    break;
                case RongIMLib.ConnectionStatus.DISCONNECTED:
                    console.log('断开连接');
                    break;
                case 4:
                    console.log('token无效');
                    break;
                default:
                    console.log('未知错误');
                    break;
            }
        }
    });

    RongIMClient.setOnReceiveMessageListener({
        // 接收到的消息
        onReceived: function(message) {
            // 判断消息类型
            console.log("新消息: " + message.targetId);
            if (message.offLineMessage) {
                return;
            }
            console.log(message);
            if (message.conversationType == RongIMLib.ConversationType.PRIVATE) {
                if (message.targetId == conversation.id) {
                    //updateMessage(message);
                    //clearUnreadCount(conversation.id);
                }
                //updateConversationList();
            }
        }
    });

    //开始链接
    RongIMClient.connect(token, {
        onSuccess: function(userId) {
            callbacks.getCurrentUser && callbacks.getCurrentUser(userId);
            console.log("链接成功，用户id：" + userId);
        },
        onTokenIncorrect: function() {
            console.log('token无效');
        },
        onError: function(errorCode) {
            console.log("=============================================");
            console.log(errorCode);
        }
    });
}

//im组件初始化
var init = function(config, callback) {
    config.isIM = true;
    var callbacks = {
        getInstance: function(instance) {
            emoji.init();
            callback(instance)
        },
        getCurrentUser: function(userId) {
            // console.log('currentUser% ' + userId)
            //showInfo(userId);
        }
    }
    sdkInit(config, callbacks);
}


export default {
    init: init,
    send,
    getConversationList,
    startConversation
}