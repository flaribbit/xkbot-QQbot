var fs = require("fs");
var bot = require("./bot")

var question = JSON.parse(fs.readFileSync("data/trivia.json"));

exports.check = function (message) {
    var text = message.message;
    var send = message.message_type == "group" ? bot.SendGroupMessage : bot.SendPrivateMessage;
    var sender = message.sender.card || message.sender.nickname;
    var target = message.group_id || message.user_id;
    var res;
    if (text == "随机题目") {
        send(target, getTrivia());
    }
}

function getTrivia() {
    var q = question[Math.floor(Math.random() * question.length)];
    return q.title + "\nA) " + q.answerA + "\nB) " + q.answerB + "\nC) " + q.answerC + "\nD) " + q.answerD;
}
