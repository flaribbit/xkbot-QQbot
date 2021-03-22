//全局加载的模块
var botModule = [
    "./dice",
    "./trivia",
    "./translate",
    "./bililive",
    "./weibo",
    "./zhihu",
    "./reply",
    "./daxuexi",
].map(m => require(m));

botModule.forEach(m => m.load ? m.load() : false);

const WebSocket = require('ws');
const fs = require("fs");
const bot = require("./bot");
const CONFIG_PATH = "data/config.json";
//检查目录
if (!fs.existsSync("data")) fs.mkdirSync("data");
//载入设置
var config = fs.existsSync(CONFIG_PATH) ? JSON.parse(fs.readFileSync(CONFIG_PATH)) : {};
var wss = new WebSocket.Server({ port: 5700 });
wss.on('connection', function connection(ws) {
    console.log("[info] bot: 已连接");
    ws.on('message', msg => {
        var message = JSON.parse(msg);
        if (message.message_type) {
            bot.SetClient(ws);
            botModule.forEach(m => m.check(message));
        }
    });
});

//保存数据后退出
process.on("SIGINT", () => {
    botModule.forEach(m => m.save ? m.save() : false);
    fs.writeFileSync(CONFIG_PATH, JSON.stringify(config));
    console.log("[info] bot: 已保存设置");
    wss.close();
    process.exit();
});
