var IMLib = null,
    IMClient = null,
    imInstance = null;

var utils = {
    isFunction: function(func) {
        return (typeof func == 'function');
    },
    isArray: function(arrs) {
        return (Object.prototype.toString.call(arrs) == '[object Array]');
    },
    noop: function() {},
    forEach: function(arrs, callback) {
        for (var i = 0, len = arrs.length; i < len; i++) {
            var item = arrs[i];
            callback(item, i);
        }
    },
    copy: function(target, source) {
        for (var key in source) {
            target[key] = source[key];
        }
    }
};



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

            utils.forEach(conversationList, function(conversation) {
                var target = User.get({
                    id: conversation.targetId
                });

                var sentTime = conversation.sentTime;
                sentTime = formatSentTime(sentTime);

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