//全局加载的模块
var botModule = [
    "./baike",
    "./dice",
    "./trivia",
    "./translate",
    "./bililive",
    "./weibo",
    "./zhihu",
    "./reply",
    "./daxuexi",
    "./bvinfo",
    "./setu",
].map(m => require(m));

botModule.forEach(m => m.load ? m.load() : false);

const WebSocket = require('ws');
const bot = require("./bot");
bot.LoadConfig();
const wss = new WebSocket.Server({ port: 5700 });
wss.on('connection', function connection(ws) {
    bot.SetClient(ws);
    console.log("[info] bot: 已连接");
    ws.on('message', msg => {
        var message = JSON.parse(msg);
        if (message.message_type) {
            if (message.message_type == "group" && !bot.IsEnabled(message.group_id)) {
                return;
            }
            botModule.forEach(m => m.check(message));
        }
    });
});

//保存数据后退出
process.on("SIGINT", () => {
    botModule.forEach(m => m.save ? m.save() : false);
    bot.SaveConfig();
    console.log("[info] bot: 已保存设置");
    wss.close();
    process.exit();
});
