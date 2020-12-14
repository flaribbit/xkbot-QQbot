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

const fs = require("fs");
const http = require("http");
const CONFIG_PATH = "data/config.json";
//检查目录
if (!fs.existsSync("data")) fs.mkdirSync("data");
//载入设置
var config = fs.existsSync(CONFIG_PATH) ? JSON.parse(fs.readFileSync(CONFIG_PATH)) : {};
var server = http.createServer((req, res) => {
    var chunk = "";
    req
        .on("data", d => chunk += d)
        .on("end", () => {
            var message = JSON.parse(chunk);
            if (message.message_type) {
                botModule.forEach(m => m.check(message));
            }
        });
    res.end();
}).listen(5701);

//保存数据后退出
process.on("SIGINT", () => {
    botModule.forEach(m => m.save ? m.save() : false);
    fs.writeFileSync(CONFIG_PATH, JSON.stringify(config));
    console.log("[info] bot: 已保存设置");
    server.close();
    process.exit();
});
