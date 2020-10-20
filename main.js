
var http = require('http');
var baike = require("./baike")
var dice = require("./dice")
var zhihu = require("./zhihu")

http.createServer(function (req, res) {
    var data = "";
    req
        .on("data", d => data += d)
        .on("end", () => {
            var message = JSON.parse(data);
            if (message.message_type && message.message_type == "group") {
                console.log(data);
                dice.check(message, SendGroupMessage);
                baike.check(message, SendGroupMessage);
                zhihu.check(message, SendGroupMessage);
            }
        });
    res.end();
}).listen(5701);

function SendGroupMessage(group_id, message) {
    var req = http.request("http://localhost:5700", {
        path: "/send_group_msg",
        method: "POST",
    }, res => {
        res.on("data", data => {
            console.log(data.toString());
        });
    });
    req.write(JSON.stringify({
        "group_id": group_id,
        "message": message
    }));
    req.end();
    console.log("发送");
}
