var fs = require("fs");
var bot = require("./bot")

const DATAPATH = "data/trivia_user.json";
var question = JSON.parse(fs.readFileSync("data/trivia.json"));

//存储各个群的答题情况
var status = {
    0: {
        id: 0,
        wrong: [],
    }
};

//存储各个用户的答题情况
var users = {};

function element(list, el) {
    for (var i = 0; i < list.length; i++)
        if (list[i] == el) return true;
    return false;
}

exports.check = function (message) {
    var text = message.message;
    var send = message.message_type == "group" ? bot.SendGroupMessage : bot.SendPrivateMessage;
    var sender = message.sender.card || message.sender.nickname;
    var target = message.group_id || message.user_id;
    var res;
    if (message.message_type == "group") {
        var st = status[message.group_id];
        //管理员功能
        if (true) {
            if (text == "测试随机题目") {
                var id = Math.floor(Math.random() * question.length);
                send(target, getTrivia(id));
                status[message.group_id] = { id: id, wrong: [] };
            } else if (text == "公布答案") {
                var msg = "正确答案是: " + question[st.id].answer;
                if (question[st.id].analytic) msg += "\n" + question[st.id].analytic;
                send(target, msg);
                delete status[message.group_id];
            }
        }
        //没有待回答的问题就跳过
        if (!st) return;
        //忽略不是回答问题的消息
        if (!text.match(/^[A-Da-d]$/)) return;
        //如果答过了就跳过
        if (element(st.wrong, message.user_id)) return;
        //如果答对了就结束
        if (text.toUpperCase() == question[st.id].answer) {
            send(target, `${sender} 回答正确`);
            delete status[message.group_id];
        } else {
            send(target, `${sender} 回答错误`);
            st.wrong.push(message.user_id);
        }
    }
}

exports.load = function () {
    if (fs.existsSync(DATAPATH)) {
        users = JSON.parse(fs.readFileSync(DATAPATH));
        console.log("[info] Trivia: 已载入用户数据");
    }
}

exports.save = function () {
    fs.writeFileSync(DATAPATH, JSON.stringify(users));
    console.log("[info] Trivia: 已保存用户数据");
}

function getTrivia(id) {
    var q = question[id];
    return q.title + "\nA) " + q.answerA + "\nB) " + q.answerB + "\nC) " + q.answerC + "\nD) " + q.answerD;
}
