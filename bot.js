const fs = require("fs");
const CONFIG_PATH = "data/config.json";

var config;
var client;

exports.LoadConfig = function () {
    if (!fs.existsSync("data")) fs.mkdirSync("data");
    config = fs.existsSync(CONFIG_PATH) ?
        JSON.parse(fs.readFileSync(CONFIG_PATH)) :
        { admin: [], groups: [] };
}

exports.SaveConfig = function () {
    fs.writeFileSync(CONFIG_PATH, JSON.stringify(config));
}

exports.IsEnabled = function (group_id) {
    return config.groups.includes(group_id);
}

exports.IsAdmin = function (user_id) {
    return config.admin.includes(user_id);
}

exports.SetClient = function (ws) {
    client = ws;
}

exports.Image = function (path) {
    return "[CQ:image,file=" + path + "]";
}

exports.SendGroupMessage = function (group_id, message) {
    client.send(JSON.stringify({
        "action": "send_group_msg",
        "params": {
            "group_id": group_id,
            "message": message
        }
    }));
    console.log("[info] >>>", message);
}

exports.SendPrivateMessage = function (user_id, message) {
    client.send(JSON.stringify({
        "action": "send_private_msg",
        "params": {
            "user_id": user_id,
            "message": message
        }
    }));
    console.log("[info] >>>", message);
}
