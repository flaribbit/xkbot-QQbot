const bot = require("./bot");
const { default: axios } = require("axios");
const dayjs = require("dayjs")

const API = "http://api.bilibili.com/x/web-interface/view";
exports.check = async function (message) {
    if (message.message_type == "group") {
        var send = bot.SendGroupMessage, target = message.group_id;
    } else {
        var send = bot.SendPrivateMessage, target = message.user_id;
    }
    var text = message.message;
    var res = text.match(/BV[0-9a-zA-Z]{10}/);
    if (res) {
        send(target, await getInfo(res[0]));
        return true;
    }
    res = text.match(/https:\/\/b23.tv\/[0-9a-zA-Z]+/);
    if (res) {
        res = await axios.get(res[0], { maxRedirects: 0 }).then(_ => {
        }, err => err.response.headers.location.match(/BV[0-9a-zA-Z]{10}/));
        send(target, await getInfo(res[0]));
        return true;
    }
    return false;
}

function getInfo(bv) {
    return axios.get(API + "?bvid=" + bv).then(({ "data": {
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
    } }) => `${bot.Image(pic)}
@${upname} b23.tv/av${avid}
${title}
${dayjs(pubdate * 1000).format("YYYY/MM/DD HH:mm:ss")}
${str(view)}播放 ${str(coin)}硬币`);
}

function str(n) {
    if (n > 1e5) {
        return (n / 10000).toFixed(1) + "w";
    } else {
        return String(n);
    }
}
