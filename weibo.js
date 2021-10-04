const fs = require("fs");
const bot = require("./bot");
const { default: axios } = require("axios");
const DATAPATH = "data/weibo.json";

var nameList = {};

exports.check = function (message) {
    if (message.message_type == "group") {
        var send = bot.SendGroupMessage, target = message.group_id;
    } else {
        var send = bot.SendPrivateMessage, target = message.user_id;
    }
    var text = message.message;
    var res = text.match(/^\.weibo add (\S+) (\d+)$/);
    if (res) {
        if (nameList[res[1]]) {
            send(target, `${res[1]}已在列表中`);
        } else {
            nameList[res[1]] = res[2];
            send(target, `已添加${res[1]}(${res[2]})`);
        }
        return true;
    }
    res = text.match(/^\.weibo ?(.+)$/);
    if (res) {
        // sendLatestById(res[1], send, target);
        if (nameList[res[1]]) {
            sendLatestById(nameList[res[1]], send, target);
        } else {
            send(target, `未关注${res[1]}，可使用'.weibo add 昵称 id'添加关注`);
        }
        return true;
    }
}

function sendLatestById(id, send, target) {
    axios.get("https://m.weibo.cn/api/container/getIndex?containerid=107603" + id).then(res => {
        var cards = res.data.data.cards;
        for (var i = 0; i < cards.length; i++) {
            if (cards[i].card_type == 9 && cards[i].mblog.mblogtype == 0) {
                send(target, toPlainText(cards[i].mblog.text) + "\n" + cards[i].scheme.split("?")[0]);
                return;
            }
        }
    });
}

function toPlainText(html) {
    return html
        .replace(/<span class="url-icon"><img alt=([^ ]+).*?\/span>/g, "$1")
        .replace(/<a .*?>(.*?)<\/a>/g, "$1")
        .replace(/<br \/>/g, "\n")
        .replace(/<img .*?>/g, "")
        .replace(/<span .*?>(.*?)<\/span>/g, "$1");
}

exports.load = function () {
    if (fs.existsSync(DATAPATH)) {
        nameList = JSON.parse(fs.readFileSync(DATAPATH));
        console.log("[info] weibo: 已载入数据");
    }
}

exports.save = function () {
    fs.writeFileSync(DATAPATH, JSON.stringify(nameList));
    console.log("[info] weibo: 已保存数据");
}
