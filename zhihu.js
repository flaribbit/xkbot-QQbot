//https://www.zhihu.com/api/v3/feed/topstory/hot-lists/total?limit=50
const bot = require("./bot");
const { default: Axios } = require("axios");

exports.check = function (message) {
    var text = message.message;
    var send = message.message_type == "group" ? bot.SendGroupMessage : bot.SendPrivateMessage;
    var sender = message.sender.card || message.sender.nickname;
    var target = message.group_id || message.user_id;
    if (text == ".zhihu") {
        Axios.get("https://www.zhihu.com/api/v3/feed/topstory/hot-lists/total?limit=10").then(res => {
            var items = res.data.data;
            var s = ["知乎热榜"];
            for (var i = 0; i < 10; i++) {
                s.push(String(i + 1) + ". " + items[i].target.title);
            }
            send(target, s.join("\n"));
        });
    }
}
