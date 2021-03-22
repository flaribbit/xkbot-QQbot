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
        }).then(res => {
            if (res.data.data && res.data.data.articles) {
                var article = res.data.data.articles[0];
                send(target, article.summary + "\nhttps://www.bilibili.com/read/cv" + article.id +
                    "\n来源: b站@" + article.author.name + ", 时间: " + dayjs(article.publish_time * 1000).format("YYYY-MM-DD HH:mm:ss"));
            }
        });
    }
}
