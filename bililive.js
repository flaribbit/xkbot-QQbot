// api: https://api.live.bilibili.com/room/v1/Room/get_info?room_id=
// online: 在线人数
// live_status: 是否在线
// title: 直播间标题

const https = require("https");

var WatchList=[{
    room_id: 0,
    name: "",
    status: false,
    group: [],
}];
var Timer=0;

function checkAll(callback){
    for(var i=0;i<WatchList.length;i++){
        https.get("https://api.live.bilibili.com/room/v1/Room/get_info?room_id="+WatchList[i].room,function (res) {
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
        }).setTimeout(5000, function () {
            callback(null,"请求超时");
            return false;
        });
    }
}

function callback(text,error){
    if(error){
        console.log(error);
    }else{
        var data=JSON.parse(text);
        if(data.live_status&&!WatchList[i].status){
            send();
            WatchList[i].status=true;
        }
    }
}

function start(){
    if(!Timer){
        for(var i=0;i<WatchList.length;i++){
            WatchList[i].status=true;
        }
        Timer=setInterval(checkAll,120000);
    }
}

function stop(){
    if(Timer){
        clearInterval(Timer);
    }
}

function add(group,name,room_id){
    //判断是否已经关注该直播间
    var item=WatchList.find(e=>e.room_id==room_id);
    if(item){
        //如果其他群已经关注了就把此群也加入
        if(!item.group.find(e=>e==group)){
            item.group.push(group);
        }
    }else{
        //否则关注直播间
        WatchList.push({
            room_id: room_id,
            name: name,
            status: false,
            group: [group],
        });
    }
}

exports.check=function(message,send){
    
}
