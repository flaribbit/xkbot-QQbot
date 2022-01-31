import { type Handle, image } from "../bot"
import axios from "axios"
import dayjs from "dayjs"

const API = "http://api.bilibili.com/x/web-interface/view"
export let name = "BV号解析"
export let help = "消息中包含B站视频链接或BV号时会自动解析"
export let handle: Handle = function (message, reply, info) {
    const text = message.message
    var res: RegExpMatchArray | null
    if (res = text.match(/BV[0-9a-zA-Z]{10}/)) {
        getInfo(res[0]).then(reply).catch(e => reply("解析失败: " + e.message))
        return true
    }
    if (res = text.match(/https:\/\/b23.tv\/[0-9a-zA-Z]+/)) {
        shortLink(res[0]).then(reply).catch(e => reply("解析失败: " + e.message))
        return true
    }
    return false
}

async function getInfo(bv: string) {
    const { "data": {
        "data": {
            "bvid": bvid, "aid": avid, "pic": pic, "title": title, "pubdate": pubdate, "desc": desc,
            "owner": { "name": upname },
            "stat": { "view": view, "danmaku": danmaku, "reply": reply, "favorite": favorite, "coin": coin, "like": like },
        }
    } } = await axios.get(API + "?bvid=" + bv)
    return `${image(pic)}
${upname} b23.tv/av${avid} ${bvid}
${title}
${dayjs(pubdate * 1000).format("YYYY/MM/DD HH:mm:ss")}
${str(view)}播放 ${str(like)}点赞
${str(coin)}硬币 ${str(favorite)}收藏`
}

async function shortLink(url: string) {
    const res = await axios.get(url, { maxRedirects: 0 })
    const bvid = res.headers.location.match(/BV[0-9a-zA-Z]{10}/)
    return await getInfo(bvid[0])
}

function str(n: number) {
    if (n > 1e4) {
        return (n / 10000).toFixed(1) + "w"
    } else {
        return String(n)
    }
}

if (require.main === module) {
    handle({ message: "https://b23.tv/BV1Vs41187Gt" } as any, console.log, {} as any)
}
