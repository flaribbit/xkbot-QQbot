// load bot module
const PORT = process.env.PORT || 5700;
const bot = require("./bot");
const WebSocket = require('ws');

// load plugins
bot.use(require("./baike"));
bot.use(require("./dice"));
bot.use(require("./trivia"));
bot.use(require("./translate"));
bot.use(require("./bililive"));
bot.use(require("./weibo"));
bot.use(require("./zhihu"));
bot.use(require("./reply"));
bot.use(require("./daxuexi"));
bot.use(require("./bvinfo"));
bot.use(require("./setu"));
bot.use(require("./tio"));

bot.loadConfig();
const wss = new WebSocket.Server({ port: PORT }, () => {
    bot.info("WebSocket Server started on port " + PORT);
});
wss.on('connection', function connection(ws) {
    bot.setClient(ws);
    bot.info("bot: 已连接");
    ws.on('message', msg => {
        var message = JSON.parse(msg);
        if (message.message_type) {
            if (message.message_type == "group" && !bot.isEnabled(message.group_id)) {
                return;
            }
            botModule.forEach(m => m.check(message));
        }
    });
});

//保存数据后退出
process.on("SIGINT", () => {
    botModule.forEach(m => m.save ? m.save() : false);
    bot.info("bot: 已退出");
    bot.saveConfig();
    wss.close();
    process.exit();
});
