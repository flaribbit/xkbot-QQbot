const fs = require("fs");
const dayjs = require("dayjs");
const CONFIG_PATH = "data/config.json";
const LOG_LEVEL = ["DEBUG", "INFO", "ERROR"];

var config;
var client;
var plugins = [];

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
    if (plugins.some(e => e.name == plugin.name)) return;
    plugins.push(plugin);
}

exports.loadConfig = function () {
    if (!fs.existsSync("data")) fs.mkdirSync("data");
    if (fs.existsSync(CONFIG_PATH)) {
        exports.info("加载配置文件");
        config = JSON.parse(fs.readFileSync(CONFIG_PATH));
    } else {
        config = { admin: [], groups: [] };
    }
}

exports.saveConfig = function () {
    fs.writeFileSync(CONFIG_PATH, JSON.stringify(config));
}

exports.isEnabled = function (group_id) {
    return config.groups.includes(group_id);
}

exports.isAdmin = function (user_id) {
    return config.admin.includes(user_id);
}

exports.setClient = function (ws) {
    client = ws;
}

exports.image = function (path) {
    return "[CQ:image,file=" + path + "]";
}

/**
 * send group message
 * @param {number} group_id 
 * @param {string} message 
 */
exports.sendGroupMessage = function (group_id, message) {
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
 * @param {number} user_id
 * @param {string} message
 */
exports.sendPrivateMessage = function (user_id, message) {
    client.send(JSON.stringify({
        "action": "send_private_msg",
        "params": {
            "user_id": user_id,
            "message": message
        }
    }));
    console.log("[info] >>>", message);
}

exports.loadConfig()
