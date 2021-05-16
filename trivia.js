var fs = require("fs");
var bot = require("./bot")

const DATAPATH = "data/trivia_user.json";
var question = JSON.parse(fs.readFileSync("data/trivia.json"));

//存储各个群的答题情况
var status = {};

//存储各个用户的答题情况
var users = {};

function element(list, el) {
    for (var i = 0; i < list.length; i++)
        if (list[i] == el) return true;
    return false;
}

exports.check = function (message) {
    if (message.message_type == "group") {
        var send = bot.SendGroupMessage, target = message.group_id;
    } else {
        var send = bot.SendPrivateMessage, target = message.user_id;
    }
    var text = message.message;
    var sender = message.sender.card || message.sender.nickname;
    if (message.message_type == "group") {
        var st = status[message.group_id];
        if (text == "来道题" || text == "下一题") {
            var id = Math.floor(Math.random() * question.length);
            send(target, getTrivia(id));
            status[message.group_id] = {
                id: id,
                pass: [],
                score: 10
            };
            return;
        } else if (text == "公布答案") {
            var msg = "正确答案是: " + question[st.id].answer;
            if (question[st.id].analytic) msg += "\n" + question[st.id].analytic;
            send(target, msg);
            delete status[message.group_id];
            return;
        }
        if (text == "查询积分" || text == "积分查询") {
            if (users[message.user_id]) {
                send(target, `${sender}积分：${users[message.user_id]}`);
            } else {
                send(target, `${sender}还没答过题哦~`);
            }
            return;
        }
        //没有待回答的问题就跳过
        if (!st) return;
        //忽略不是回答问题的消息
        if (!text.match(/^[A-Da-d]$/)) return;
        //用户不存在积分数据就创建
        if (!(message.user_id in users)) {
            users[message.user_id] = 0;
            console.log(`[info] 已创建${sender}(${message.user_id})`);
        };
        //如果答对了
        if (text.toUpperCase() == question[st.id].answer) {
            //重复回答爬
            if (element(st.pass, message.user_id)) return;
            //加分
            send(target, `${sender}回答正确，积分+${st.score}`);
            users[message.user_id] += st.score;
            st.pass.push(message.user_id);
            //调整后续加分
            if (st.score > 2) {
                st.score -= 2;
            } else {
                st.score = 1;
            }
        } else {
            send(target, `${sender}回答错误，积分-5`);
            users[message.user_id] -= 5;
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
