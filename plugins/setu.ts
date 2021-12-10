import { image } from "../bot";
import type { Handle } from "../bot";
import axios from "axios";
const API = "https://setu.flaribbit.workers.dev/";

export let name = "色图";
export let handle: Handle = function (message, reply, info) {
    const text = message.message;
    if (message.message_type == "group") {
        var res = text.match(/^\[CQ:at,qq=(\d+)\] ?来张色图$/);
        if (res && parseInt(res[1]) == message.self_id) {
            send_pic(reply);
        }
    } else if (message.message_type == "private") {
        if (text == "来张色图") {
            send_pic(reply);
        }
    }
    return false;
}

function send_pic(reply: (message: string) => void) {
    axios.get(API).then(({ data: data }) => {
        reply(`${data.title}\n${data.userName} ${data.id}`);
        reply(image(data.image))
    });
}
