
import { type Handle, image } from "../bot"
import axios from "axios"
import { Aes } from './chat-aes';
const key = '3d9d5f16-5df0-43d7-902e-19274eecdc41';

export const name = "聊天"
export const help = "机器人也想和群友聊天"
export const handle: Handle = function (message, reply, info) {
    const text = message.message
    if (message.message_type == "group") {
        const res = text.match(/\[CQ:at,qq=(\d+)\] ?(.+)/)
        if (res && parseInt(res[1]) == message.self_id) {
            chat(res[2]).then(reply).catch(console.log);
        } else if (Math.random() < 0.02) {
            chat(text).then(reply).catch(console.log);
        }
    } else if (message.message_type == "private") {
        chat(text).then(reply).catch(console.log);
    }
    return false
}

async function chat(text: string) {
    const res = await axios.post("https://www.bing.com/english/zochatv2?cc=cn&ensearch=0", {
        "zoTextResponse": "原来是这样",
        "zoIsGCSResponse": "true",
        "zoSearchQuery": "百科",
        "zoTimestampUtc": "Fri, 15 Jul 2022 15:00:00 GMT",
        "zoIsStartOfSession": "false",
        "zoRequestId": "c54f7a3cae161d0e4616447fd073c23a",
        "conversationId": "d1c9b3b7-5c93-4144-9657-8afa0bdcc642",
        "query": { "NormalizedQuery": Aes.encrypt(text, key, 256) },
        "from": "chatbox",
        "traceId": "1C81CA55548D44EFAE008C50C0B69A3D",
    }, {
        headers: {
            "Referrer": "https://www.bing.com/",
        },
    });
    console.log(res.data);
    if (res.data && res.data.content) {
        return res.data.content;
    }
    return '';
}
