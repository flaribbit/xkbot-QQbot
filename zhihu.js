//https://www.zhihu.com/api/v3/feed/topstory/hot-lists/total?limit=50
const bot = require("./bot");
const { default: Axios } = require("axios");

exports.check = function (message) {
    if (message.message_type == "group") {
        var send = bot.SendGroupMessage, target = message.group_id;
    } else {
        var send = bot.SendPrivateMessage, target = message.user_id;
    }
    var text = message.message;
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
