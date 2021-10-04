const bot = require("./bot")
const axios = require("axios").default;
const cheerio = require("cheerio");

exports.check = function (message) {
    if (message.message_type == "group") {
        var send = bot.SendGroupMessage, target = message.group_id;
    } else {
        var send = bot.SendPrivateMessage, target = message.user_id;
    }
    var text = message.message;
    var res;
    res = text.match(/^\.en ?(.+)$/);
    if (res) {
        wordEN(send, target, res[1]);
        return true;
    }
    res = text.match(/^\.jp ?(.+)$/);
    if (res) {
        wordJP(send, target, res[1]);
        return true;
    }
}

function wordEN(send, target, w) {
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
    }).catch(e => {
        send(target, e.message);
    });
}

function wordJP(send, target, w) {
    axios.get("http://dict.hjenglish.com/jp/jc/" + encodeURIComponent(w), {
        headers: { cookie: "HJ_UID=40e16cb0-69f2-8b35-d09b-4a8627f5cf3b; HJ_SID=s063zt-a49b-40d0-b3dc-e3625b640f9f" }
    }).then(res => {
        var s = [];
        var $ = cheerio.load(res.data);
        $(".word-details-pane-header").each((_, e) => {
            var pane = $(e);
            s.push(pane.find(".word-text>h2").text() + " " + pane.find(".pronounces>span:nth-child(1)").text());
            pane.find(".simple h2,li").each((_, l) => s.push($(l).text()));
        });
        send(target, s.join("\n"));
    }).catch(e => {
        send(target, e.message);
    });
}
