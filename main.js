const WebSocket=require("ws")
var baike=require("./baike")
// baike.search("罗小黑战记")

var ws=new WebSocket("ws://127.0.0.1:6700")
ws.onopen=function(){
    console.log("ws已连接");
}
ws.onmessage=function(ev){
    var message=JSON.parse(ev.data).message;
    if(message){
        baike.check(message);
    }
}
