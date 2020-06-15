const https = require("https");
const cheerio = require("cheerio");

function getHTML(url, callback) {
    https.get(url, function (res) {
        if (res.statusCode == 200) {
            var data = "";
            res.on("data", function (chunk) {
                data += chunk;
            });
            res.on("end", function () {
                callback(data);
                return true;
            });
        } else if (res.statusCode == 302) {
            if (res.headers.location.search("item") > -1) {
                getHTML("https://baike.baidu.com" + res.headers.location, callback);
            } else {
                callback(null,"没有查询到该词条");
                return false;
            }
        }
    }).on("error", function () {
        callback(null,"http get error");
        return false;
    }).setTimeout(10000, function () {
        callback(null,"请求超时");
    });
}

exports.check = function (message, send) {
    var text = message.message;
    var at = `[CQ:at,qq=${self_id}]`;
    if (text.indexOf(at) == 0) {
        text = message.replace(at, "").trim().match(/(.*?)是(谁|什么)/);
        if (res) {
            getHTML("https://baike.baidu.com/item/" + res[1], function (data, error) {
                if (error) {
                    console.log(error);
                } else {
                    var $ = cheerio.load(data);
                    var content = $(".lemma-summary").text().trim();
                    if (content.length > 200) {
                        content = content.substr(0, 200) + "...";
                    }
                }
            });
        }
    }
}
