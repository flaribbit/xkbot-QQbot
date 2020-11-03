// api: https://api.live.bilibili.com/room/v1/Room/get_info?room_id=
// online: 在线人数
// live_status: 是否在线
// title: 直播间标题
const DATAPATH = "data/bililive.json";
var bot = require("./bot");
var axios = require("axios").default;
var watchList = [];
var timer = 0;

function checkAll() {
    watchList.forEach(up => {
        axios.get("https://api.live.bilibili.com/room/v1/Room/get_info?room_id=" + up.room_id)
            .then(res => {
                if (res.data.live_status && !up.status) {
                    //开播了
                }
            });
    });
}

function start() {
    if (!timer) {
        watchList.forEach(up => up.status = true);
        timer = setInterval(checkAll, 120000);
    }
}

function stop() {
    if (timer) {
        clearInterval(timer);
        timer = 0;
    }
}

function add(group, name, room_id) {
    //判断是否已经关注该直播间
    var item = watchList.find(e => e.room_id == room_id);
    if (item) {
        //如果其他群已经关注了就把此群也加入
        if (!item.groups.find(e => e == group)) {
            item.groups.push(group);
            bot.SendGroupMessage(group, "已关注" + room_id);
        }
    } else {
        //否则关注直播间
        watchList.push({
            room_id: room_id,
            name: name,
            status: false,
            groups: [group],
        });
    }
}

exports.check = function (message, send) {
    var text = message.message;
    var send = message.message_type == "group" ? bot.SendGroupMessage : bot.SendPrivateMessage;
    var sender = message.sender.card || message.sender.nickname;
    var target = message.group_id || message.user_id;
    if (text == "直播间列表") {
        send(target, "本群已关注直播间0个\nundefined");
    }
}

exports.load = function () {
    if (fs.existsSync(DATAPATH)) {
        watchList = JSON.parse(fs.readFileSync(DATAPATH));
        console.log("[info] bililive: 已载入数据");
    }
}

exports.save = function () {
    fs.writeFileSync(DATAPATH, JSON.stringify(watchList));
    console.log("[info] bililive: 已保存数据");
}
