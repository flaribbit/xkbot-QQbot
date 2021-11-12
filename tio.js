const bot = require("./bot");
const { default: axios } = require("axios");
const { deflateRawSync, gunzipSync } = require('zlib');
const API_URL = "https://tio.run/cgi-bin/static/fb67788fd3d1ebf92e66b295525335af-run/caec94796945a978a097dd02138def0d"

function getRequestBody(code, lang) {
    if (lang == "py") lang = "python3";
    else if (lang == "js") lang = "javascript-node";
    return deflateRawSync(Buffer.from(`Vlang\x001\x00${lang}\x00VTIO_OPTIONS\x000\x00F.code.tio\x00${code.length}\x00${code}F.input.tio\x000\x00Vargs\x000\0R`));
}

exports.check = function (message) {
    if (message.message_type == "group") {
        var send = bot.SendGroupMessage, target = message.group_id;
    } else {
        var send = bot.SendPrivateMessage, target = message.user_id;
    }
    var text = message.message;
    var sender = message.sender.card || message.sender.nickname;
    if (message.message_type == "group") {
        var res = text.match(/#([a-z0-9\-]+)\n([\s\S]+)/);
        if (res) {
            console.log("运行代码", res[2]);
            axios.post(API_URL, getRequestBody(res[2], res[1]), {
                responseType: "arraybuffer"
            }).then(res => {
                var result = gunzipSync(res.data).toString();
                send(target, result.split(result.substring(0, 16))[1]);
            })
        }
    }
    return false;
}
