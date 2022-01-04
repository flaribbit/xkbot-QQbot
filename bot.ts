import fs from "fs";
import type { WebSocket } from "ws";
import dayjs from "dayjs";
const CONFIG_PATH = "config.json";

export type Plugin = { name: string, handle: Handle, save?: () => void };
export type Config = { admin: number[], groups: { [id: string]: string[] }, plugins: { [name: string]: Plugin } };
export type Message = { post_type: string, message: string, self_id: number, user_id: number, group_id?: number, message_type: string, sender: { card: string, nickname: string, role: string } };
export type Info = { name: string, isAdmin: boolean };
export type Handle = (message: Message, reply: (message: string) => void, info: Info) => void;

var config: Config;
const plugins: { [name: string]: Plugin } = {};

function logHeader(level: string) {
    process.stdout.write(`${dayjs().format("YYYY-MM-DD HH:mm:ss")} [${level}] `);
}
export const log = {
    debug(...args: any[]) {
        logHeader("DEBUG");
        console.log.apply(this, args);
    },
    info(...args: any[]) {
        logHeader("INFO");
        console.log.apply(this, args);
    },
    error(...args: any[]) {
        logHeader("ERROR");
        console.log.apply(this, args);
    },
}

export const use = function (plugin: Plugin) {
    plugins[plugin.name] = plugin;
}

export const getConfig = function () {
    return config;
}

export const loadConfig = function () {
    log.info("已安装插件: " + Object.keys(plugins).join(" "));
    if (fs.existsSync(CONFIG_PATH)) {
        log.info("加载配置文件");
        config = JSON.parse(fs.readFileSync(CONFIG_PATH, "utf8"));
    } else {
        log.info("创建配置文件");
        config = { admin: [], groups: {}, plugins: {} };
    }
}

export const saveConfig = function () {
    log.info("保存配置文件");
    fs.writeFileSync(CONFIG_PATH, JSON.stringify(config));
}

export const handle: Handle = function (message, reply, info) {
    const text = message.message;
    let res = text.match(/^\.bot (\S+) ?(.*)?/);
    if (!res) return;
    if (res[1] == 'plugins') {
        reply("已安装插件: " + Object.keys(plugins).join(", "));
    } else if (res[1] == 'status') {
        if (message.message_type == 'group') {
            const list = config.groups[message.group_id];
            if (list) {
                reply("本群已开启插件: " + list.join(", "));
            } else {
                reply("本群未开启任何插件");
            }
        }
    } else if (res[1] == 'on') {
        if (!res[2]) return reply("请输入插件名称");
        if (message.message_type == 'group') {
            if (!info.isAdmin) {
                reply("无权限操作");
                return;
            }
            // 创建群组配置
            if (!config.groups[message.group_id]) config.groups[message.group_id] = [];
            const list = res[2].split(' ');
            for (const name of list) {
                if (!(name in plugins)) continue;
                if (config.groups[message.group_id].includes(name)) continue;
                config.groups[message.group_id].push(name);
            }
            reply("已开启插件: " + res[2]);
        }
    } else if (res[1] == 'off') {
        if (!res[2]) return reply("请输入插件名称");
        if (message.message_type == 'group') {
            if (!info.isAdmin) {
                reply("无权限操作");
                return;
            }
            let list = res[2].split(' ');
            config.groups[message.group_id] = config.groups[message.group_id].filter(name => !list.includes(name));
            reply("已关闭插件: " + res[2]);
        }
    }
}

export const onMessage = function (client: WebSocket, message: Message) {
    if (message.post_type != 'message') return;
    // additional message infomation
    const info: Info = {
        name: message.sender.card || message.sender.nickname,
        isAdmin: message.sender.role == 'admin' || message.sender.role == 'owner' || config.admin.includes(message.user_id),
    };
    // handle group message
    if (message.message_type == 'group') {
        const reply = (msg: string) => sendGroupMessage(client, message.group_id, msg);
        handle(message, reply, info);
        const list = config.groups[message.group_id];
        if (!list) return;
        for (const name of config.groups[message.group_id]) {
            plugins[name].handle(message, reply, info);
        }
    }
    // handle private message
    else if (message.message_type == 'private') {
        const reply = (msg: string) => sendPrivateMessage(client, message.user_id, msg);
        handle(message, reply, info);
        for (const name in plugins) {
            plugins[name].handle(message, reply, info);
        }
    }
}

export const image = function (path: string): string {
    return `[CQ:image,file=${path}]`;
}

export const sendGroupMessage = function (client: WebSocket, group_id: number, message: string) {
    client.send(JSON.stringify({
        "action": "send_group_msg",
        "params": {
            "group_id": group_id,
            "message": message,
        }
    }));
    if (message.startsWith("[CQ:image,file=base64")) message = "[图片]";
    log.info("发送群消息:", message);
}

export const sendPrivateMessage = function (client: WebSocket, user_id: number, message: string) {
    client.send(JSON.stringify({
        "action": "send_private_msg",
        "params": {
            "user_id": user_id,
            "message": message,
        }
    }));
    if (message.startsWith("[CQ:image,file=base64")) message = "[图片]";
    log.info("发送私聊消息:", message);
}

export default {
    use,
    loadConfig,
    saveConfig,
    onMessage,
}
