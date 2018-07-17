import utils from './utils';

var emoji = RongIMLib.RongIMEmoji;

var IMLib = null,
    IMClient = null,
    imInstance = null;


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
    _Cache: {}
};

/*
    此处只为演示，实际应用需请求应用服务器获取用户信息
*/
//批量获取用户信息（只在第一次获取回话列表的时候调用)
User.getMulti = function(ids) {
    let url = `http://localhost:7893/api/chat/${ids}/info`;
    $.ajax({
        url: url,
        type: 'get', //GET
        async: false, //或false,是否异步
        timeout: 5000, //超时时间
        dataType: 'json', //返回的数据格式：
        success: function(data, textStatus, jqXHR) {
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
        },
        error: function(xhr, textStatus) {},

    })
}

User.get = function(user) {
    var id = user.id;
    //保证不刷新页面情况下，同一个 userId 的信息是一致的
    user = User._Cache[id];
    if (user) {
        return user;
    }
    let url = `http://localhost:7893/api/chat/${id}/info`;
    $.ajax({
        url: url,
        type: 'get', //GET
        async: false, //或false,是否异步
        timeout: 5000, //超时时间
        dataType: 'json', //返回的数据格式：
        success: function(data, textStatus, jqXHR) {
            user = {
                name: data.data[0].username,
                portrait: data.data[0].avatar,
                online: data.data[0].online
            };
        },
        error: function(xhr, textStatus) {},

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
                User.getMulti(userIds.join(','));
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
            callback(data)
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
    messageWatcher.notify(message);
});


var setListener = function() {
    IMClient.setConnectionStatusListener({
        onChanged: function(status) {
            //Status 说明可参考 http://www.rongcloud.cn/docs/web_api_demo.html#init_listener
            Logger.warn('WebSDK Status Changed: %d', status);
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
var init = function(options, callback, modules) {
    IMLib = modules.RongIMLib;
    IMClient = IMLib.RongIMClient;

    var appKey = options.appKey;
    var sdk = options.sdk;
    IMClient.init(appKey, null, sdk);
    imInstance = IMClient.getInstance();

    setListener();

    var token = options.token;
    connect(token, callback);

};

export default {
    init: init,
    Message,
    Conversation
}