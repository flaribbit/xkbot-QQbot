const bot = require("./bot");
const { default: Axios } = require("axios");
const dayjs = require("dayjs")

exports.check = function (message) {
    if (message.message_type == "group") {
        var send = bot.SendGroupMessage, target = message.group_id;
    } else {
        var send = bot.SendPrivateMessage, target = message.user_id;
    }
    var text = message.message;
    if (text == ".大学习" || text == "。大学习") {
        Axios.get("https://api.bilibili.com/x/space/article?mid=524927654&pn=1&ps=12&sort=publish_time&jsonp=json", {
            headers: {
                "referer": "https://space.bilibili.com/524927654/article",
            }
        }).then(({ data: {
            data: {
                articles: [{
                    summary: summary,
                    publish_time: publish_time,
                    id: id,
                    author: { name: name }
                }]
            }
        } }) => {
            send(target, summary + "\nhttps://www.bilibili.com/read/cv" + id +
                "\n来源: b站@" + name + ", 时间: " + dayjs(publish_time * 1000).format("YYYY/MM/DD HH:mm:ss"));
        });
    }
}
