const fs = require("fs");
const bot = require("./bot");
const DATAPATH = "data/reply.json";
var replyList = {};

exports.check = function (message) {
    var text = message.message;
    var send = message.message_type == "group" ? bot.SendGroupMessage : bot.SendPrivateMessage;
    var sender = message.sender.card || message.sender.nickname;
    var target = message.group_id || message.user_id;
    if (message.message_type == "group") {
        //群消息
        var res = text.match(/^\[CQ:at,qq=(\d+)\] ?！(\S+) (\S+)$/);
        if (res && res[1] == message.self_id) {
            add(res[2], res[3]);
            send(target, `谢谢${sender}的知识，我已经记住了呢`);
            return true;
        }
        res = text.match(/^\[CQ:at,qq=(\d+)\] ?(\S+)$/);
        if (res && res[1] == message.self_id) {
            var reply = get(res[2]);
            if (reply) send(target, reply);
        }
    } else if (message.message_type == "private") {
        //私聊
        //管理员命令
        if (bot.IsAdmin(message.user_id)) {
            var res = text.match(/^\.reply (\S+) ?(\S+)?$/);
            if (res) {
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
                } else if (res[1] == "save") {
                    exports.save();
                    send(target, "已保存数据");
                    return true;
                }
            }
        }
        //其他
        res = text.match(/^！(\S+) (\S+)$/);
        if (res) {
            add(res[1], res[2]);
            send(target, `谢谢你的知识，我已经记住了呢`);
            return true;
        }
        var reply = get(text);
        if (reply) send(target, reply);
        return true;
    }
}

function add(msg, rep) {
    replyList[msg + "_" + count(msg)] = rep;
    console.log("[info] reply:", msg, "==>", rep);
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
