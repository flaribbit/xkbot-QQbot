import { image } from "../bot";
import type { Handle } from "../bot";
import axios from "axios";
import dayjs from "dayjs";

const API = "http://api.bilibili.com/x/web-interface/view";
export let name = "BV号解析";
export let handle: Handle = async function (message, reply, info) {
    const text = message.message;
    var res: RegExpMatchArray | null;
    if (res = text.match(/BV[0-9a-zA-Z]{10}/)) {
        reply(await getInfo(res[0]));
        return true;
    }
    if (res = text.match(/https:\/\/b23.tv\/[0-9a-zA-Z]+/)) {
        res = await axios.get(res[0], { maxRedirects: 0 }).catch(err => err.response.headers.location.match(/BV[0-9a-zA-Z]{10}/));
        if (!res) return false;
        reply(await getInfo(res[0]));
        return true;
    }
    return false;
}

async function getInfo(bv: string) {
    const { "data": {
        "data": {
            "bvid": bvid, "aid": avid, "pic": pic, "title": title, "pubdate": pubdate, "desc": desc,
            "owner": { "name": upname },
            "stat": { "view": view, "danmaku": danmaku, "reply": reply, "favorite": favorite, "coin": coin, "like": like },
        }
    } } = await axios.get(API + "?bvid=" + bv);
    return `${image(pic)}
${upname} b23.tv/av${avid} ${bvid}
${title}
${dayjs(pubdate * 1000).format("YYYY/MM/DD HH:mm:ss")}
${str(view)}播放 ${str(like)}点赞
${str(coin)}硬币 ${str(favorite)}收藏`;
}

function str(n: number) {
    if (n > 1e5) {
        return (n / 10000).toFixed(1) + "w";
    } else {
        return String(n);
    }
}
