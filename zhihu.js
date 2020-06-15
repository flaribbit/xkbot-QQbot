const https = require("https");
const cheerio = require("cheerio");

function getHot(callback){
    https.get("https://www.zhihu.com/hot", function (res) {
        if (res.statusCode == 200) {
            var data = "";
            res.on("data", function (chunk) {
                data += chunk;
            });
            res.on("end", function () {
                callback(data);
                return true;
            });
        }
    }).on("error", function () {
        callback(null,"请求错误");
        return false;
    }).setTimeout(10000, function () {
        callback(null,"请求超时");
    });
}

exports.check=function(message,send){
    // console.log(message);
    if(message.message=="知乎热榜"){
        getHot(function(data,error){
            console.log(data);
            if(error){
                console.log(error);
                send(message.group_id,error);
            }else{
                var $ = cheerio.load(data);
                var content = $(".HotItem-title");
                console.log(content);
            }
        });
    }
}
