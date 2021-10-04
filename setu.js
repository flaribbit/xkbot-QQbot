const bot = require("./bot");
const { default: axios } = require("axios");
const SETU_API = "https://setu.flaribbit.workers.dev/";

exports.check = function (message) {
    if (message.message_type == "group") {
        var send = bot.SendGroupMessage, target = message.group_id;
    } else {
        var send = bot.SendPrivateMessage, target = message.user_id;
    }
    var text = message.message;
    var sender = message.sender.card || message.sender.nickname;
    if (message.message_type == "group") {
        //群消息
        var res = text.match(/^\[CQ:at,qq=(\d+)\] ?来张色图$/);
        if (res && res[1] == message.self_id) {
            axios.get(SETU_API).then(({ data: data }) => {
                send(target, `${data.title}\n${data.userName} ${data.id}`);
                send(target, bot.Image(data.image))
            })
            return true;
        }
    } else if (message.message_type == "private") {
        if (text == "来张色图") {
            axios.get(SETU_API).then(({ data: data }) => {
                send(target, `${data.title}\n${data.userName} ${data.id}`);
                send(target, bot.Image(data.image))
            })
            return true;
        }
    }
}
