const fs = require("fs");
const dayjs = require("dayjs");
const CONFIG_PATH = "config.json";
const LOG_LEVEL = ["DEBUG", "INFO", "ERROR"];

var config;
var plugins = {};

function logHeader(level) {
    process.stdout.write(`${dayjs().format("YYYY-MM-DD HH:mm:ss")} [${LOG_LEVEL[level]}] `);
}
exports.info = function (...args) {
    logHeader(1);
    console.log.apply(this, args);
}
exports.error = function (...args) {
    logHeader(2);
    console.log.apply(this, args);
}

exports.use = function (plugin) {
    plugins[plugin.name] = plugin;
    return exports;
}

exports.getConfig = function () {
    return config;
}

exports.loadConfig = function () {
    if (fs.existsSync(CONFIG_PATH)) {
        exports.info("加载配置文件");
        config = JSON.parse(fs.readFileSync(CONFIG_PATH));
    } else {
        exports.info("创建配置文件");
        config = { admin: [], groups: {}, plugins: {} };
    }
}

exports.saveConfig = function () {
    fs.writeFileSync(CONFIG_PATH, JSON.stringify(config));
    for (const name in plugins) {
        if (!plugins[name].save) continue;
        exports.info(`插件${e.name}保存配置文件`);
        plugins[name].save();
    }
}

/**
 * handle message
 * @param {object} client websocket object
 * @param {object} message message object
 */
exports.handle = function (client, message) {
    // additional message infomation
    const info = {
        name: message.sender.card || message.sender.nickname,
        isAdmin: message.sender.role == 'admin' || config.admin.includes(message.user_id),
    };
    // handle group message
    if (message.message_type == 'group') {
        const reply = (msg) => exports.sendGroupMessage(client, message.group_id, msg);
        for (const name in config.groups[message.group_id]) {
            plugins[name].handle(message, info, reply);
        }
    } else if (message.message_type == 'private') {
        // handle private message
        const reply = (msg) => exports.sendPrivateMessage(client, message.user_id, msg);
        for (const name in plugins) {
            plugins[name].handle(message, info, reply);
        }
    }
}

/**
 * image message
 * @param {string} path file path or url
 */
exports.image = function (path) {
    return "[CQ:image,file=" + path + "]";
}

/**
 * send group message
 * @param {object} client
 * @param {number} group_id
 * @param {string} message
 */
exports.sendGroupMessage = function (client, group_id, message) {
    client.send(JSON.stringify({
        "action": "send_group_msg",
        "params": {
            "group_id": group_id,
            "message": message
        }
    }));
    console.log("[info] >>>", message);
}

/**
 * send private message
 * @param {object} client
 * @param {number} user_id
 * @param {string} message
 */
exports.sendPrivateMessage = function (client, user_id, message) {
    client.send(JSON.stringify({
        "action": "send_private_msg",
        "params": {
            "user_id": user_id,
            "message": message
        }
    }));
    console.log("[info] >>>", message);
}
