var http = require('http');
var baike = require("./baike");
var dice = require("./dice");
var zhihu = require("./zhihu");
var trivia = require("./trivia");

http.createServer(function (req, res) {
    var chunk = "";
    req
        .on("data", d => chunk += d)
        .on("end", () => {
            var message = JSON.parse(chunk);
            if (message.message_type) {
                console.log(chunk);
                dice.check(message);
                trivia.check(message);
            }
        });
    res.end();
}).listen(5701);
