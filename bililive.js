// api: https://api.live.bilibili.com/room/v1/Room/get_info?room_id=
// online: 在线人数
// live_status: 是否在线
// title: 直播间标题
const DATAPATH = "data/bililive.json";
var fs = require("fs");
var bot = require("./bot");
var axios = require("axios").default;
var watchList = [];
var timer = 0;

function checkAll(send) {
    console.log("[info] bililive: 检查直播状态");
    watchList.forEach(up => {
        axios.get("https://api.live.bilibili.com/room/v1/Room/get_info?room_id=" + up.room_id).then(res => {
            if (res.data.live_status && !up.status) {
                //开播了
                up.status = true;
                if (send) {
                    up.groups.forEach(group => send(group, up.name + "开播了！\nhttps://live.bilibili.com/" + up.room_id));
                }
            } else {
                up.status = false;
            }
        });
    });
}

function start() {
    if (!timer) {
        checkAll();
        timer = setInterval(checkAll, 120000, bot.SendGroupMessage);
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

exports.check = function (message) {
    var text = message.message;
    var send = message.message_type == "group" ? bot.SendGroupMessage : bot.SendPrivateMessage;
    var sender = message.sender.card || message.sender.nickname;
    var target = message.group_id || message.user_id;
    var res = text.match(/^\.bililive (\S+) ?(\S+)?$/);
    if (!res) return;
    if (res[1] == "list") {
        var result = [];
        watchList.forEach(up => up.groups.find(e => e == target) ? result.push(up.name) : 0);
        send(target, "本群已关注直播间" + result.length + "个：\n" + result.join("\n"));
    } else if (res[1] == "add" && res[2]) {
        axios.get("https://api.bilibili.com/x/web-interface/search/type?search_type=live_user&keyword=" + encodeURIComponent(res[2])).then(res => {
            if (res.data.code != 0) {
                send(target, "接口返回错误");
                return;
            }
            var live_user = res.data.data.result;
            if (live_user) {
                var name = live_user[0].uname.replace(/<em class="keyword">(.+?)<\/em>/, "$1");
                var roomid = live_user[0].roomid;
                add(target, name, roomid);
                send(target, `已关注${name}(直播间${roomid})`);
            } else {
                send(target, "找不到" + res[2]);
            }
        });
    } else if (res[1] == "del" && res[2]) {
        //查找up
        var up = watchList.find(up => up.name == res[2]);
        if (up) {
            //找到了就取消关注
            var index = up.groups.findIndex(g => g == target);
            if (index > -1) {
                up.groups.splice(index, 1);
            }
            send(target, "已取消关注" + up.name);
        } else {
            send(target, "找不到或没有关注" + up.name);
        }
    } else if (res[1] == "start") {
        start();
    } else if (res[1] == "stop") {
        stop();
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
