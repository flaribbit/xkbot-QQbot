const https = require("https");
const cheerio = require("cheerio");
const STRING_AT="[CQ:at,qq=]";

function getHTML(url, callback) {
    https.get(url, function (res) {
        if(res.statusCode==200){
            var data = "";
            res.on("data", function (chunk) {
                data += chunk;
            });
            res.on("end", function () {
                callback(data);
                return true;
            });
        }else if(res.statusCode==302){
            if(res.headers.location.search("item")>-1){
                getHTML("https://baike.baidu.com"+res.headers.location,callback);
            }else{
                console.log("没有查询到该词条");
                return false;
            }
        }
    }).on("error", function () {
        console.log("http get error");
        return false;
    }).setTimeout(10000,function(){
        console.log("请求超时");
    });
}

function search(keyword) {
    getHTML("https://baike.baidu.com/item/"+keyword,function (data){
        var $=cheerio.load(data);
        var content=$(".lemma-summary").text().trim();
        if(content.length>200){
            content=content.substr(0,200)+"...";
        }
        console.log(content);
    });
}

function SendGroupMessage(ws,group_id,message){
    ws.send(JSON.stringify({
        "action": "send_group_msg",
        "params": {
            "group_id": group_id,
            "message": message
        }
    }));
}

exports.check = function (message) {
    if(message.indexOf(STRING_AT)==0){
        var res=message.replace(STRING_AT,"").trim().match(/(.*?)是(谁|什么)/);
        if(res){
            search(res[1]);
        }
    }
}
