import utils from './utils';
import $config from '@/config/env'

var emoji = RongIMLib.RongIMEmoji;

var IMLib = null,
    IMClient = null,
    imInstance = null;
var terminal;
var supportNot = false; //页面是否支持notification


var Logger = {
    warn: console.warn,
    log: console.log
};

var Emitter = (function() {
    var events = {};
    var fire = function(name, args) {
        if (name in events) {
            for (var i = 0, len = events[name].length; i < len; i++) {
                events[name][i](args);
            }
        }
    };

    var on = function(name, event) {
        var isFunc = utils.isFunction(event);
        if (!isFunc) {
            return;
        }
        events[name] = events[name] || [];
        events[name].push(event);
    };

    return {
        fire: fire,
        on: on
    };
})();

function Watcher() {
    var checkIndexOutBound = function(index, bound) {
        return index > -1 && index < bound;
    };

    this.watcherList = [];

    this.add = function(observer, force) {
        if (force) {
            this.watcherList.length = 0;
        }
        this.watcherList.push(observer);
    };

    this.get = function(index) {
        if (checkIndexOutBound(index, this.watcherList.length)) {
            return this.watcherList[index];
        }
    };

    this.count = function() {
        return this.watcherList.length;
    };

    this.removeAt = function(index) {
        checkIndexOutBound(index, this.watcherList.length) && this.watcherList.splice(index, 1);
    };

    this.remove = function(observer) {
        if (!observer) {
            this.watcherList.length = 0;
            return;
        }
        var isFunction = (Object.prototype.toString.call(observer) === '[object Function]');
        var watcherList = isFunction ? [observer] : observer;
        for (var i = 0, len = this.watcherList.length; i < len; i++) {
            for (var j = 0; j < watcherList.length; j++) {
                if (this.watcherList[i] === watcherList[j]) {
                    this.removeAt(i);
                    break;
                }
            }
        }
    };

    this.notify = function(val) {
        for (var i = 0, len = this.watcherList.length; i < len; i++) {
            this.watcherList[i](val);
        }
    };

    this.indexOf = function(observer, startIndex) {
        var i = startIndex || 0,
            len = this.watcherList.length;
        while (i < len) {
            if (this.watcherList[i] === observer) {
                return i;
            }
            i++;
        }
        return -1;
    };
}

var User = {
    multi: true,
    _Cache: {},
    ajax: function(params, callback) {
        var ids = params.ids;
        var GET_USER_INFO_URL = $config.baseUrl + `/chat/users/${ids}/info`;
        $.ajax({
            url: GET_USER_INFO_URL,
            type: 'GET', //GET
            async: false, //或false,是否异步
            timeout: 5000, //超时时间
            dataType: 'json', //返回的数据格式：
            success: function(data, textStatus, jqXHR) {
                callback && callback(data);
            },
            error: function(xhr, textStatus) {},

        })
    }
};

/*
    此处只为演示，实际应用需请求应用服务器获取用户信息
*/
//批量获取用户信息（只在第一次获取回话列表的时候调用)
User.getMulti = function(ids) {
    User.ajax({ ids: ids }, function(data) {
        User.multi = false;
        var users = data.data;
        for (var i = 0; i < users.length; i++) {
            var user = users[i];
            var id = users[i].userId;
            var cacheuser = User._Cache[id];
            if (!cacheuser) {
                User._Cache[id] = {
                    name: user.username,
                    portrait: user.avatar,
                    online: user.online
                };
            }
        }
    })
}

//单个获取用户信息
User.get = function(user) {
    var id = user.id;
    //保证不刷新页面情况下，同一个 userId 的信息是一致的
    user = User._Cache[id];
    if (user) {
        return user;
    }
    User.ajax({ ids: id }, function(data) {
        user = {
            name: data.data[0].username,
            portrait: data.data[0].avatar,
            online: data.data[0].online
        };
    })
    User._Cache[id] = user;
    return user;
};

//内容格式化
var textMessageFormat = function(content) {
    if (!content || content.length === 0) {
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
    return emoji.symbolToHTML(content);
}

//显示Notification通知
var pushMessage = function(msg) {
    if (window.Notification && Notification.permission !== "denied") {
        var title = (msg._sender && msg._sender.name) ? msg._sender.name + ' 回复了你' : '消息提醒';
        var options = {
            body: "您有一条新消息，请及时回复",
            icon: (msg._sender && msg._sender.portrait) ? msg._sender.portrait : "",
        };
        var notification = new Notification(title, options);

        notification.onclick = function(event) {
            window.focus();
            notification.close();
        }
        notification.onshow = function() {
            setTimeout(function() {
                notification.close();
            }, 3000);
        };
    }
}

//解析内容类型
var getMessageContent = function(message) {
    var content = '[暂未解析此类型消息]';
    var messageMap = {
        TextMessage: textMessageFormat(message.content.content),
        FileMessage: '[文件]',
        ImageMessage: '[图片]'
    };
    var messageType = message.messageType;
    return messageMap[messageType] || content;
};

//格式化内容返回符合的内容
var formartMessage = function(message) {
    var sender = User.get({
        id: message.senderUserId
    });
    var sentTime = message.sentTime;
    sentTime = utils.getTime(sentTime);

    var direction = (message.messageDirection == 1) ? 'sender' : 'receiver';

    var content = getMessageContent(message);

    utils.copy(message, {
        _sender: sender,
        _sentTime: sentTime,
        _direction: direction,
        _content: content
    });
}

var conversationWatcher = new Watcher();

var Conversation = {};

Conversation.get = function(callback) {
    callback = callback || utils.noop;
    // 过滤会话类型，null 为不过滤，获取全部会话类型, conversationTypes = null | [1, 3]
    var conversationTypes = null;
    imInstance.getConversationList({
        onSuccess: function(conversationList) {
            var error = null;
            // 示例暂时只演示单聊
            conversationList = conversationList.filter(function(conversation) {
                var isPrivate = (conversation.conversationType == IMLib.ConversationType.PRIVATE);
                return isPrivate;
            });
            if (User.multi) {
                var userIds = conversationList.map(function(item) {
                    return item.targetId
                })
                if (userIds.length) {
                    User.getMulti(userIds.join(','));
                }
            }
            utils.forEach(conversationList, function(conversation) {
                var target = User.get({
                    id: conversation.targetId
                });

                var sentTime = conversation.sentTime;
                sentTime = utils.getTime(sentTime);
                var message = conversation.latestMessage;
                var content = getMessageContent(message);
                var sender = User.get({
                    id: message.senderUserId
                });

                utils.copy(message, {
                    _content: content
                });
                utils.copy(conversation, {
                    _target: target,
                    _sentTime: sentTime,
                    _sender: sender
                });
            });

            callback(error, conversationList);
        },
        onError: function(error) {
            Logger.log('Conversation.get Error: %s', error);
            callback(error);
        }
    }, conversationTypes);
};


//获取会话未读数
Conversation.getUnreadCount = function(params, callback) {
    var conversationType = params.conversationType;
    var targetId = params.targetId;
    RongIMClient.getInstance().getUnreadCount(conversationType, targetId, {
        onSuccess: function(count) {
            var error = null;
            callback(error, count)
        },
        onError: function(error) {
            callback(error)
        }
    });;
}

// Conversation.sendReadReceiptMessage = function(targetId, type) {
//     console.log(targetId, type)
//     RongIMLib.RongIMClient.getInstance()
//         .getConversation(Number(type), targetId, {
//             onSuccess: function(data) {
//                 console.log(data)
//                 if (data) {

//                     var read = RongIMLib.ReadReceiptMessage
//                         .obtain(data.latestMessage.messageUId, data.latestMessage.sentTime, "1");
//                     Message.send({
//                         type: type,
//                         targetId: targetId,
//                         content: read
//                     }, function(message) {
//                         console.log(message)
//                     })
//                 }
//             },
//             onError: function() {}
//         });
// };


//清除会话未读数
Conversation.clearUnreadCount = function(params, callback) {
    var conversationType = params.conversationType;
    var targetId = params.targetId;
    RongIMClient.getInstance().clearUnreadCount(conversationType, targetId, {
        onSuccess: function(data) {
            // Conversation.sendReadReceiptMessage(targetId, conversationType)
        },
        onError: function(errorCode) {

        }
    });
}



Conversation.watch = function(watcher) {
    conversationWatcher.add(watcher);
};

Emitter.on('onconversation', function(conversation) {
    Conversation.get(function(conversationList) {
        conversationWatcher.notify(conversationList);
    });
});





var Message = {};
var messageWatcher = new Watcher();

//获取历史消息
Message.get = function(conversation, callback) {
    var type = conversation.type;
    var targetId = conversation.targetId;
    var count = conversation.count || 20;
    // 获取历史消息起始时间，0 表示从最近的一条消息开始向前获取 20 条, 详细说明：http://www.rongcloud.cn/docs/web_api_demo.html#message_history
    var timestrap = conversation.timestrap;
    imInstance.getHistoryMessages(type, targetId, timestrap, count, {
        onSuccess: function(messageList, hasMsg) {
            var error = null;
            utils.forEach(messageList, function(message) {
                formartMessage(message);
            });
            var data = {
                messageList: messageList,
                hasMsg: hasMsg
            }
            callback(error, data);
        },
        onError: function(error) {
            Logger.log('Message.get Error: %s', error);
            callback(error);
        }
    });
};

//清除消息记录
Message.clearHistory = function(params, callback) {
    RongIMLib.RongIMClient.getInstance().clearRemoteHistoryMessages({
        conversationType: params.conversationType, // 会话类型
        targetId: params.targetId, // 目标 Id
        timestamp: params.timestamp // 清除时间点
    }, {
        onSuccess: function(data) {
            callback && callback(data)
        },
        onError: function(error) {
            // 请排查：单群聊消息云存储是否开通
            console.log(error);
        }
    });
}

//发送消息
Message.send = function(message, callback) {
    callback = callback || utils.noop;
    var conversationtype = message.type
    var targetId = message.targetId;
    var content = message.content;

    RongIMClient.getInstance().sendMessage(conversationtype, targetId, content, {
        // 发送消息成功
        onSuccess: function(message) {
            var error = null;
            formartMessage(message);
            callback(error, message);
            Emitter.fire('onconversation');
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
};

Message.watch = function(watcher) {
    messageWatcher.add(watcher);
};
Emitter.on('onmessage', function(message) {
    if (message.messageDirection != 1 && supportNot) {
        pushMessage(message);
    }
    messageWatcher.notify(message);
});


var setListener = function() {
    IMClient.setConnectionStatusListener({
        onChanged: function(status) {
            var info = '';
            switch (status) {
                case RongIMLib.ConnectionStatus.CONNECTED:
                    info = '链接成功'
                    break;
                case RongIMLib.ConnectionStatus.CONNECTING:
                    info = '正在链接'
                    break;
                case RongIMLib.ConnectionStatus.DISCONNECTED:
                    info = '断开连接'
                    break;
                case RongIMLib.ConnectionStatus.KICKED_OFFLINE_BY_OTHER_CLIENT:
                    info = '其他设备登录'
                    break;
                case RongIMLib.ConnectionStatus.DOMAIN_INCORRECT:
                    info = '域名不正确'
                    break;
                case RongIMLib.ConnectionStatus.NETWORK_UNAVAILABLE:
                    info = '网络不可用'
                    break;
            }
            //Status 说明可参考 http://www.rongcloud.cn/docs/web_api_demo.html#init_listener
            Logger.log('WebSDK Status Changed: ', info);
        }
    });
    IMClient.setOnReceiveMessageListener({
        onReceived: function(message) {
            formartMessage(message);
            Emitter.fire('onmessage', message);
            Emitter.fire('onconversation');
        }
    });
};

var services = {
    Conversation: Conversation,
    Message: Message
};

var connect = function(token, callback) {
    callback = callback || utils.noop;
    IMClient.connect(token, {
        onSuccess: function(id) {
            var currentUser = {
                id: id
            };
            callback(services, currentUser);
        },
        onTokenIncorrect: function() {
            Logger.log('token 无效, 请参考: http://support.rongcloud.cn/kb/NDQ1');
        },
        onError: function(code) {
            Logger.log(code);
        }
    });
};

/*
    var options = {
    appKey: '',
    sdk: {
        navi: '',
        protobuf: ''
    }
    };
    
    var callback = function(services, currentUser){
    
    };
    var modules = {
    RongIMLib: RongIMLib,
    protobuf: protobuf
    };
*/

//设置是否开启桌面通知
var setNotification = function() {
    utils.browserRedirect(function(phoneOrPc) {
        terminal = phoneOrPc;
    });
    if (terminal == 'pc') {
        if (Notification.permission === "granted") {
            supportNot = true;
        }
        // Otherwise, we need to ask the user for permission
        else if (Notification.permission !== "denied") {
            Notification.requestPermission(function(permission) {
                // If the user accepts, let's create a notification
                if (permission === "granted") {
                    supportNot = true;
                }
            });
        }
    }
}



var init = function(options, callback, modules) {
    IMLib = modules.RongIMLib;
    IMClient = IMLib.RongIMClient;
    var appKey = options.appKey;
    var sdk = options.sdk;
    IMClient.init(appKey, null, sdk);
    imInstance = IMClient.getInstance();
    setListener();
    setNotification();
    var token = options.token;
    connect(token, callback);
};

export default {
    init: init,
    Message,
    Conversation
}