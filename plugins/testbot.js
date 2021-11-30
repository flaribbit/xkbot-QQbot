//要测试的模块
var botModule = [
    "./bililive",
].map(m => require(m));

botModule.forEach(m => m.load ? m.load() : false);

const fs = require("fs");
const http = require("http");
const CONFIG_PATH = "data/config.json";
//检查目录
if (!fs.existsSync("data")) fs.mkdirSync("data");
//载入设置
var config = fs.existsSync(CONFIG_PATH) ? JSON.parse(fs.readFileSync(CONFIG_PATH)) : {};
process.stdin.on("data", buffer => {
    var message = buildMessage(String(buffer).trimEnd())
    botModule.forEach(m => m.check(message));
});
const server = http.createServer((req, res) => {
    req.on("end", () => console.log("已发送"));
    res.end();
}).listen(5700);

//保存数据后退出
process.on("SIGINT", () => {
    botModule.forEach(m => m.save ? m.save() : false);
    fs.writeFileSync(CONFIG_PATH, JSON.stringify(config));
    console.log("[info] bot: 已保存设置");
    server.close();
    process.exit();
});

function buildMessage(message) {
    return {
        "anonymous": null,
        "font": 0,
        "group_id": 100000,
        "message": message,
        "message_id": 100000,
        "message_type": "group",
        "post_type": "message",
        "raw_message": message,
        "self_id": 0,
        "sender": {
            "age": 0,
            "area": "",
            "card": "admin",
            "level": "",
            "nickname": "admin",
            "role": "admin",
            "sex": "unknown",
            "title": "",
            "user_id": 100000
        },
        "sub_type": "normal",
        "time": +new Date(),
        "user_id": 100000
    };
}

