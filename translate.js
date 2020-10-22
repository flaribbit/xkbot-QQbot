var http = require("http");
var bot = require("./bot")

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
    var req = http.request("http://fanyi.so.com/index/search?eng=1&query=" + w, {
        method: "POST",
        headers: {
            "pro": "fanyi"
        }
    }, res => {
        var chunk = "";
        res.on("data", d => chunk += d);
        res.on("end", () => {
            var data = JSON.parse(chunk);
            if (data.data && data.data.explain) {
                var d = data.data.explain;
                try {
                    send(target, d.word + "\n" + d.phonetic["英"] + d.phonetic["美"] + "\n" + d.translation.join("\n"));
                } catch (error) {
                    send(target, error.toString());
                }
            } else {
                console.log("failed");
            }
        });
    });
    req.end();
}
