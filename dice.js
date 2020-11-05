var bot = require("./bot")

exports.check = function (message) {
    var text = message.message;
    var send = message.message_type == "group" ? bot.SendGroupMessage : bot.SendPrivateMessage;
    var sender = message.sender.card || message.sender.nickname;
    var target = message.group_id || message.user_id;
    var res;
    res = text.match(/^[\.。]r ?d?(\d+)?$/);
    if (res) {
        if (res[1]) {
            if (res[1] > 200) {
                send(target, "在 你家骰子这么多面的");
                return true;
            }
            send(target, `${sender}骰到了: ${Math.floor(Math.random() * res[1] + 1)}`);
            return true;
        } else {
            send(target, `${sender}骰到了: ${Math.floor(Math.random() * 6 + 1)}`);
            return true;
        }
    }
    res = text.match(/^[\.。]draw ?(.*)?$/);
    if (res) {
        if (res[1]) {
            if (res[1] == "地主") {
                send(target, `${sender}抽到了: ${doudizhu(20)}`);
                return true;
            } else if (res[1] == "农民" || res[1] == "斗地主") {
                send(target, `${sender}抽到了: ${doudizhu(17)}`);
                return true;
            } else if (res[1] == "麻将") {
                send(target, `${sender}摸到了: ${mahjong()}`);
                return true;
            }
            return false;
        } else {
            send(target, "请输入要抽什么牌哦（当前支持：斗地主、麻将）");
            return false;
        }
    }
    res = text.match(/^[\.。]jrrp$/);
    if (res) {
        send(target, `${sender}今天的人品值是: ${jrrp(message.sender.user_id)}`);
    }
}

exports.help = [
    ".r\t掷一个6面骰",
    ".r d20\t掷一个20面骰",
    ".draw 地主/农民/麻将\t抽牌",
].join("\n");

function doudizhu(num) {
    var cards = [
        "A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K",
        "A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K",
        "A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K",
        "A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K",
        "小王", "大王",
    ];
    var index = {
        "2": 12, "3": 0, "4": 1, "5": 2, "6": 3, "7": 4, "8": 5, "9": 6, "10": 7,
        "J": 8, "Q": 9, "K": 10, "A": 11, "小王": 13, "大王": 14
    };
    //抽牌
    var hand = [];
    for (var i = 0; i < num; i++) {
        hand[i] = cards.splice(Math.floor(Math.random() * cards.length), 1)[0];
    }
    //排序
    hand.sort(function (a, b) { return index[a] - index[b] });
    return hand.join(" ");
}

function mahjong() {
    var cards = [
        "一万", "二万", "三万", "四万", "五万", "六万", "七万", "八万", "九万",
        "一万", "二万", "三万", "四万", "五万", "六万", "七万", "八万", "九万",
        "一万", "二万", "三万", "四万", "五万", "六万", "七万", "八万", "九万",
        "一万", "二万", "三万", "四万", "五万", "六万", "七万", "八万", "九万",
        "1索", "2索", "3索", "4索", "5索", "6索", "7索", "8索", "9索",
        "1索", "2索", "3索", "4索", "5索", "6索", "7索", "8索", "9索",
        "1索", "2索", "3索", "4索", "5索", "6索", "7索", "8索", "9索",
        "1索", "2索", "3索", "4索", "5索", "6索", "7索", "8索", "9索",
        "1饼", "2饼", "3饼", "4饼", "5饼", "6饼", "7饼", "8饼", "9饼",
        "1饼", "2饼", "3饼", "4饼", "5饼", "6饼", "7饼", "8饼", "9饼",
        "1饼", "2饼", "3饼", "4饼", "5饼", "6饼", "7饼", "8饼", "9饼",
        "1饼", "2饼", "3饼", "4饼", "5饼", "6饼", "7饼", "8饼", "9饼",
        "东", "南", "西", "北", "白", "发", "中",
        "东", "南", "西", "北", "白", "发", "中",
        "东", "南", "西", "北", "白", "发", "中",
        "东", "南", "西", "北", "白", "发", "中",
    ];
    var index = {
        "一万": 0, "二万": 1, "三万": 2, "四万": 3, "五万": 4, "六万": 5, "七万": 6, "八万": 7, "九万": 8,
        "1索": 9, "2索": 10, "3索": 11, "4索": 12, "5索": 13, "6索": 14, "7索": 15, "8索": 16, "9索": 17,
        "1饼": 18, "2饼": 19, "3饼": 20, "4饼": 21, "5饼": 22, "6饼": 23, "7饼": 24, "8饼": 25, "9饼": 26,
        "东": 27, "南": 28, "西": 29, "北": 30, "白": 31, "发": 32, "中": 33
    };
    //抽牌
    var hand = [];
    for (var i = 0; i < 14; i++) {
        hand[i] = cards.splice(Math.floor(Math.random() * cards.length), 1)[0];
    }
    //排序
    hand.sort(function (a, b) { return index[a] - index[b] });
    //简化
    for (var i = 0; i < hand.length; i++) {
        if (hand[i + 1] && hand[i + 1][1] && hand[i + 1][1] == hand[i][1]) {
            hand[i] = hand[i].substr(0, 1);
        }
    }
    return hand.join("");
}

function jrrp(user_id) {
    return Math.floor(Math.abs(Math.sin(Math.floor(+new Date() / 86400000 + 8 / 24) * 1e10 + user_id)) * 1e4) % 100;
}

function generateindex(list) {
    index = {};
    for (var i = 0; i < list.length; i++) {
        index[list[i]] = i;
    }
    console.log(JSON.stringify(index));
}
