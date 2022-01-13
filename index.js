// load bot module
const PORT = process.env.PORT || 5700;
const bot = require("./bot");
const WebSocket = require('ws');

// load plugins
bot.use(require("./plugins/baike"));
// bot.use(require("./dice"));
// bot.use(require("./trivia"));
// bot.use(require("./translate"));
// bot.use(require("./bililive"));
// bot.use(require("./weibo"));
// bot.use(require("./zhihu"));
// bot.use(require("./reply"));
// bot.use(require("./daxuexi"));
// bot.use(require("./bvinfo"));
// bot.use(require("./setu"));
// bot.use(require("./tio"));

bot.loadConfig();
const wss = new WebSocket.Server({ port: PORT }, () => {
    bot.info("WebSocket Server started on port " + PORT);
});
wss.on('connection', function connection(ws) {
    bot.info("cqhttp已连接");
    ws.on('message', msg => {
        bot.onMessage(ws, JSON.parse(msg));
    });
});

//保存数据后退出
process.on("SIGINT", () => {
    bot.saveConfig();
    bot.info("Websocket Server closed")
    wss.close();
    process.exit();
});
