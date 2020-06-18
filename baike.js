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
            //处理重定向和词条不存在的情况
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
    //判断是否@机器人
    var at = `[CQ:at,qq=${message.self_id}]`;
    if (text.indexOf(at) == 0) {
        //判断是否触发查询百科的关键词
        var res = text.replace(at, "").trim().match(/(.*?)是(谁|啥|什么)/);
        if (res) {
            getHTML("https://baike.baidu.com/item/" + res[1], function (data, error) {
                if (error) {
                    //如果发生了错误就报告错误
                    console.log(error);
                    send(message.group_id,error);
                } else {
                    //提取百科中的摘要部分
                    var $ = cheerio.load(data);
                    var content = $(".lemma-summary").text().trim();
                    //截掉过长的部分
                    if (content.length > 200) {
                        content = content.substr(0, 200) + "...";
                    }
                    send(message.group_id,content);
                }
            });
        }
    }
}
