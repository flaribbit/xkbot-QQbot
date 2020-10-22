var http = require('http');
var baike = require("./baike");
var dice = require("./dice");
var zhihu = require("./zhihu");
var trivia = require("./trivia");
var translate = require("./translate");

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
                translate.check(message);
            }
        });
    res.end();
}).listen(5701);
