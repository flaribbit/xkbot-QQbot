const fs = require("fs");
const bot = require("./bot");
const DATAPATH = "data/reply.json";
var replyList = {};

exports.check = function (message) {
    var text = message.message;
    var send = message.message_type == "group" ? bot.SendGroupMessage : bot.SendPrivateMessage;
    var sender = message.sender.card || message.sender.nickname;
    var target = message.group_id || message.user_id;
    var res = text.match(/^！(\S+) (\S+)$/);
    if (res) {
        console.log(`遇到 ${res[1]} 回答 ${res[2]}`);
        add(res[1], res[2]);
        return true;
    }
    res = text.match(/^！(\S+)$/);
    if (res) {
        var res = get(res[1]);
        if (res) send(target, res);
        return true;
    }
    res = text.match(/^\.reply (\S+) (\S+)$/);
    if (!res) return false;
    if (res[1] == "list" && res[2]) {
        var result = [];
        var key = "";
        for (var i = 0; key = res[2] + "_" + String(i), replyList[key]; i++) {
            result.push(key + " ==> " + replyList[key]);
        }
        send(target, result.join("\n"));
        return true;
    } else if (res[1] == "del" && res[2]) {
        del(res[2]);
        send(target, "已删除" + res[2]);
        return true;
    }
}

function add(msg, rep) {
    replyList[msg + "_" + count(msg)] = rep;
}

function count(msg) {
    var i = 0;
    while (replyList[msg + "_" + String(i)]) i++;
    return i;
}

function get(msg) {
    var n = count(msg);
    if (n > 0) {
        return replyList[msg + "_" + String(Math.floor(Math.random() * n))];
    } else {
        return "";
    }
}

function del(msg) {
    var key = msg.split("_");
    for (var i = Number(key[1]); replyList[key[0] + "_" + String(i + 1)]; i++) {
        replyList[key[0] + "_" + String(i)] = replyList[key[0] + "_" + String(i + 1)];
    }
    delete replyList[key[0] + "_" + String(i)];
}

exports.load = function () {
    if (fs.existsSync(DATAPATH)) {
        replyList = JSON.parse(fs.readFileSync(DATAPATH));
        console.log("[info] reply: 已载入数据");
    }
}

exports.save = function () {
    fs.writeFileSync(DATAPATH, JSON.stringify(replyList));
    console.log("[info] reply: 已保存数据");
}
