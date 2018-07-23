import socket from './socket';
import utils from './utils';

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




socket.on('disconnect', () => {

});


var Message = {}
var messageWatcher = new Watcher();

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

Message.watch = function(watcher) {
    messageWatcher.add(watcher);
};
Emitter.on('onmessage', function(message) {
    // if (message.messageDirection != 1 && supportNot) {
    //     pushMessage(message);
    // }
    messageWatcher.notify(message);
});





var setListener = function() {
    socket.on('receiveMessage', function(message) {
        Emitter.fire('onmessage', message);
        console.log(message)
    });
};


var connect = function(token, callback) {
    callback = callback || utils.noop;
    socket.on('connect', function() {
        setListener()
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