const bot = require("./bot");
const { default: Axios } = require("axios");
const dayjs = require("dayjs")

const API = "http://api.bilibili.com/x/web-interface/view";
exports.check = function (message) {
    if (message.message_type == "group") {
        var send = bot.SendGroupMessage, target = message.group_id;
    } else {
        var send = bot.SendPrivateMessage, target = message.user_id;
    }
    var text = message.message;
    var res = text.match(/BV[0-9a-zA-Z]{10}/);
    if (res) {
        Axios.get(API + "?bvid=" + res[0]).then(({ "data": {
            "data": {
                "bvid": bvid,
                "aid": avid,
                "pic": pic,
                "title": title,
                "pubdate": pubdate,
                "desc": desc,
                "owner": {
                    "name": upname,
                },
                "stat": {
                    "view": view,
                    "danmaku": danmaku,
                    "reply": reply,
                    "favorite": favorite,
                    "coin": coin,
                    "like": like,
                }
            }
        } }) => {
            send(target, `${bot.ImageUrl(pic)}
@${upname} b23.tv/av${avid}
${dayjs(pubdate * 1000).format("YYYY/MM/DD HH:mm:ss")}
${title}
${Str(view)}播放 ${Str(coin)}硬币`);
            return true;
        });
    }
}

function Str(n) {
    if (n > 1e5) {
        return (n / 10000).toFixed(1) + "w";
    } else {
        return String(n);
    }
}
