import socket from './socket';
import utils from './utils';

var Logger = {
    warn: console.warn,
    log: console.log
};
socket.on('disconnect', () => {

});


var Message = {}

//发送消息
Message.send = function(message, callback) {
    callback = callback || utils.noop;
    var type = message.type
    var to = message.to;
    var content = message.content;
    socket.emit('sendMessage', { to, type, content }, function(err, message) {
        if (err) {
            Logger.log(err)
            callback(err, message)
            return;
        }
        callback(null, message)
    });
};


Message.getHistoryMessages = function(conversation, callback) {
    var targetId = conversation.targetId;
    var limit = conversation.limit || 20;
    // 获取历史消息起始时间，0 表示从最近的一条消息开始向前获取 20 条, 
    socket.emit('getHistoryMessages', { targetId, limit }, function(err, data) {
        if (err) {
            Logger.log(err)
            callback(err, data)
            return;
        }
        callback(null, data)
    });
};










var connect = function(token, callback) {
    callback = callback || utils.noop;
    socket.on('connect', function() {
        socket.emit('login', { token: token }, function(err, res) {
            if (err) {
                console.log(err);
                Logger.log(err)
                return;
            }
            callback(res);
        });
    });
};

var init = function(options, callback) {
    var token = options.token;
    connect(token, callback);
};

export default {
    init,
    Message
}