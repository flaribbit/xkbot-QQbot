const bot = require("./bot");
const { default: Axios } = require("axios");

exports.check = function (message) {
    var text = message.message;
    var send = message.message_type == "group" ? bot.SendGroupMessage : bot.SendPrivateMessage;
    var sender = message.sender.card || message.sender.nickname;
    var target = message.group_id || message.user_id;
    var res = text.match(/^.weibo ?(\d+)$/);
    if (res) {
        sendLatestById(res[1], send, target);
        return true;
    }
}

function sendLatestById(id, send, target) {
    Axios.get("https://m.weibo.cn/api/container/getIndex?containerid=107603" + id).then(res => {
        var cards = res.data.data.cards;
        for (var i = 0; i < cards.length; i++) {
            if (cards[i].card_type == 9) {
                var text = cards[i].mblog.text.replace(/<span class="url-icon"><img alt=([^ ]+).*?\/span>/g, "$1");
                text = text.replace(/<a .*?>(.*?)<\/a>/g, "$1");
                text = text.replace(/<span .*?>(.*?)<\/span>/g, "$1");
                send(target, text + "\n" + cards[i].scheme.split("?")[0]);
                return;
            }
        }
    });
}
