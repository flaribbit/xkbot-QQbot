import cheerio from "cheerio"
import axios from "axios"
import type { Handle } from "../bot"

export let name = "萌娘百科"
export let usage = "萌娘百科搜<搜索内容>"
export let handle: Handle = function (message, reply, info) {
    const text = message.message
    const res = text.match(/^萌娘百科(?:查|搜)(.+)$/)
    if (res) {
        const url = "https://mzh.moegirl.org.cn/" + encodeURI(res[1])
        axios.get(url).then(res => {
            const $ = cheerio.load(res.data)
            var s = $("#mf-section-0>p").filter(i => i <= 3).text().trim()
            if (s.length > 200) {
                s = s.substring(0, 200) + "..."
            }
            s += "\n" + url
            reply(s)
        }).catch(_ => {
            reply(`萌娘百科未收录${res[1]}`)
        })
        return true
    }
    return false
}
