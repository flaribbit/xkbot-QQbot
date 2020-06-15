const WebSocket=require("ws")
var baike=require("./baike")
var dice=require("./dice")

var ws=new WebSocket("ws://127.0.0.1:6700")
ws.onopen=function(){
    console.log("ws已连接");
}
ws.onmessage=function(ev){
    var message=JSON.parse(ev.data);
    if(message.message){
        // console.log(message);
        dice.check(message,SendGroupMessage);
        baike.check(message,SendGroupMessage);
    }
}

function SendGroupMessage(group_id,message){
    ws.send(JSON.stringify({
        "action": "send_group_msg",
        "params": {
            "group_id": group_id,
            "message": message
        }
    }));
}
