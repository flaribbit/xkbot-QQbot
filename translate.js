var bot = require("./bot")
var Axios = require("axios").default;
var cheerio = require("cheerio");

exports.check = function (message) {
    var text = message.message;
    var send = message.message_type == "group" ? bot.SendGroupMessage : bot.SendPrivateMessage;
    var sender = message.sender.card || message.sender.nickname;
    var target = message.group_id || message.user_id;
    var res;
    res = text.match(/\.en ?(.+)/);
    if (res) {
        wordEN(send, target, res[1]);
        return;
    }
    res = text.match(/\.jp ?(.+)/);
    if (res) {
        wordJP(send, target, res[1]);
        return;
    }
}

function wordEN(send, target, w) {
    Axios.get("http://fanyi.so.com/index/search?eng=1&query=" + w, { headers: { "pro": "fanyi" } }).then(res => {
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
    Axios.get("https://dict.hjenglish.com/jp/jc/" + encodeURIComponent(w), {
        headers: { cookie: "HJ_UID=40e16cb0-69f2-8b35-d09b-4a8627f5cf3b; HJ_SID=s063zt-a49b-40d0-b3dc-e3625b640f9f" }
    }).then(res => {
        var $ = cheerio.load(res.data);
        var pane = $(".word-details-pane-header");
        var s = [];
        s.push(pane.find(".pronounces>span:nth-child(1)").text())
        s.push(pane.find(".word-text>h2").text());
        pane.find(".simple h2,li").each((_, e) => s.push($(e).text()));
        send(target, s.join("\n"));
    }).catch(e => {
        send(target, e.message);
    });
}
