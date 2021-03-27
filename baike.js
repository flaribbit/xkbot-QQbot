const bot = require("./bot");
const cheerio = require("cheerio");
const { default: axios } = require("axios");

// 百度百科
// var $ = cheerio.load(data);
// var content = $(".lemma-summary").text().trim();

exports.check = function (message, send) {
    if (message.message_type == "group") {
        var send = bot.SendGroupMessage, target = message.group_id;
    } else {
        var send = bot.SendPrivateMessage, target = message.user_id;
    }
    var text = message.message;
    var sender = message.sender.card || message.sender.nickname;
    var res = text.match(/^萌娘百科查(.+)$/);
    if (res) {
        var url = "https://mzh.moegirl.org.cn/" + encodeURI(res[1]);
        axios.get(url).then(res => {
            var $ = cheerio.load(res.data);
            var s = $("#mf-section-0>p").filter(i => i <= 3).text().trim();
            if (s.length > 200)
                s = s.substr(0, 200) + "...";
            s += "\n" + url;
            send(target, s);
        }).catch(_ => {
            send(target, `萌娘百科未收录${res[1]}`);
        });
        return true;
    }
    return false;
}
