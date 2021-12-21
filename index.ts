import bot, { log } from "./bot";
import { Server } from "ws";

// load plugins
bot.use(require("./plugins/baike"));
bot.use(require("./plugins/bvinfo"));
bot.use(require("./plugins/setu"));
bot.use(require("./plugins/dice"));
bot.use(require("./plugins/throwit"));

const PORT = parseInt(process.env.PORT) || 5700;
const wss = new Server({ port: PORT }, () => {
    log.info("WebSocket Server started on port " + PORT);
});
wss.on('connection', ws => {
    log.info("cqhttp已连接");
    ws.on('message', (msg: string) => bot.onMessage(ws, JSON.parse(msg)));
});
bot.loadConfig();

process.on("SIGINT", () => {
    bot.saveConfig();
    log.info("Websocket Server closed");
    wss.close();
    process.exit();
});
