const bot = require("./bot");
const { default: Axios } = require("axios");
const dayjs = require("dayjs")

exports.check = function (message) {
    var text = message.message;
    var send = message.message_type == "group" ? bot.SendGroupMessage : bot.SendPrivateMessage;
    var target = message.group_id || message.user_id;
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
                "\n来源: b站@" + name + ", 时间: " + dayjs(publish_time * 1000).format("YYYY-MM-DD HH:mm:ss"));
        });
    }
}
