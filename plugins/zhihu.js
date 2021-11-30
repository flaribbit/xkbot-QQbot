//https://www.zhihu.com/api/v3/feed/topstory/hot-lists/total?limit=50
const bot = require("./bot");
const { default: axios } = require("axios");

exports.check = function (message) {
    if (message.message_type == "group") {
        var send = bot.SendGroupMessage, target = message.group_id;
    } else {
        var send = bot.SendPrivateMessage, target = message.user_id;
    }
    var text = message.message;
    if (text == ".zhihu") {
        axios.get("https://www.zhihu.com/api/v3/feed/topstory/hot-lists/total?limit=10").then(res => {
            var items = res.data.data;
            var s = "知乎热榜";
            for (var i = 0; i < 10; i++)
                s += "\n" + String(i + 1) + ". " + items[i].target.title +
                    "\nzhihu.com/question/" + items[i].target.id;
            send(target, s);
        });
    }
}
