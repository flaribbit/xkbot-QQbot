//全局加载的模块
var botModule = [
    "./dice",
    "./trivia",
    "./translate",
    "./bililive",
    "./weibo"
].map(m => require(m));

botModule.forEach(m => m.load ? m.load() : false);

const http = require('http');
var server = http.createServer((req, res) => {
    var chunk = "";
    req
        .on("data", d => chunk += d)
        .on("end", () => {
            var message = JSON.parse(chunk);
            if (message.message_type) {
                console.log(chunk);
                botModule.forEach(m => m.check(message));
            }
        });
    res.end();
}).listen(5701);

process.on("SIGINT", () => {
    botModule.forEach(m => m.save ? m.save() : false);
    server.close();
    process.exit();
});
