import { Handle } from "../bot"
import { load } from "cheerio"
import axios from "axios"

export const name = "翻译"
export const help = ".en 或 /en 切换英中查单词模式\n/en <word> 查询英语翻译\n.jp 或 /jp 切换日中查单词模式\n/jp <word> 查询日语翻译"
const enMode = new Set<string>()
const jpMode = new Set<string>()
export const handle: Handle = function (message, reply, info) {
    const text = message.message.trim()
    if (!text) return
    const key = message.message_type == "group" ? (message.group_id || 0) + "-" + message.user_id : "private-" + message.user_id
    var res: RegExpMatchArray | null
    if (res = text.match(/^(?:\/en|\.en)(?:\s+(.*))?$/)) {
        const word = res[1] ? res[1].trim() : ""
        if (word) {
            translate_en(word).then(reply).catch(e => reply(e.message))
        } else {
            enMode.has(key) ? enMode.delete(key) : enMode.add(key)
            reply(enMode.has(key) ? "英中查单词模式已开启，直接发送单词即可查询" : "英中查单词模式已关闭")
        }
        return
    }
    if (res = text.match(/^(?:\/jp|\/ｊｐ|\.jp)(?:\s+(.*))?$/)) {
        const word = res[1] ? res[1].trim() : ""
        if (word) {
            translate_jp(word).then(reply).catch(e => reply(e.message))
        } else {
            jpMode.has(key) ? jpMode.delete(key) : jpMode.add(key)
            reply(jpMode.has(key) ? "日中查单词模式已开启，直接发送单词即可查询" : "日中查单词模式已关闭")
        }
        return
    }
    if ((enMode.has(key) || jpMode.has(key)) && !/^[.\/]/.test(text)) {
        if (enMode.has(key)) {
            translate_en(text).then(reply).catch(e => reply(e.message))
        }
        if (jpMode.has(key)) {
            translate_jp(text).then(reply).catch(e => reply(e.message))
        }
    }
}

async function translate_en(word: string): Promise<string> {
    const res = await axios.get("http://fanyi.so.com/index/search?eng=1&query=" + word, { headers: { "pro": "fanyi" } })
    const data = res.data.data
    if (data && data.explain) {
        if (data.explain.word) {
            const e = data.explain
            return e.word + "\n英: " + e.phonetic["英"] + ", 美: " + e.phonetic["美"] + "\n" + e.translation.join("\n")
        } else {
            return data.fanyi
        }
    }
    return "未知错误"
}

async function translate_jp(word: string): Promise<string> {
    const res = await axios.get("http://dict.hjenglish.com/jp/jc/" + encodeURIComponent(word), {
        headers: { cookie: "HJ_UID=40e16cb0-69f2-8b35-d09b-4a8627f5cf3b; HJ_SID=s063zt-a49b-40d0-b3dc-e3625b640f9f" }
    })
    const ret: string[] = []
    const $ = load(res.data)
    $(".word-details-pane-header").each((_, e) => {
        const pane = $(e)
        ret.push(pane.find(".word-text>h2").text() + " " + pane.find(".pronounces>span:nth-child(1)").text())
        pane.find(".simple h2,li").each((_, l) => { ret.push($(l).text()) })
    })
    if (ret.length) {
        return ret.join("\n")
    } else {
        return "没有找到" + word
    }
}
