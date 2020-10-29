var bot = require("./bot")
var axios = require("axios").default;

exports.check = function (message) {
    var text = message.message;
    var send = message.message_type == "group" ? bot.SendGroupMessage : bot.SendPrivateMessage;
    var sender = message.sender.card || message.sender.nickname;
    var target = message.group_id || message.user_id;
    var res;
    res = text.match(/查词(.+)/);
    if (res) {
        word(send, target, res[1]);
    }
}

function word(send, target, w) {
    axios.get("http://fanyi.so.com/index/search?eng=1&query=" + w, { headers: { "pro": "fanyi" } }).then(res => {
        var data = res.data.data;
        if (data && data.explain) {
            if (data.explain.word) {
                var e = data.explain;
                send(target, e.word + "\n" + e.phonetic["英"] + e.phonetic["美"] + "\n" + e.translation.join("\n"));
            } else {
                send(target, data.fanyi);
            }
        }
    });
}
