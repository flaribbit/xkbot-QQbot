var http = require('http');
var baike = require("./baike");
var dice = require("./dice");
var zhihu = require("./zhihu");
var trivia = require("./trivia");

http.createServer(function (req, res) {
    var data = "";
    req
        .on("data", d => data += d)
        .on("end", () => {
            var message = JSON.parse(data);
            if (message.message_type) {
                console.log(data);
                dice.check(message);
                trivia.check(message);
            }
        });
    res.end();
}).listen(5701);
