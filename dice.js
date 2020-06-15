exports.check=function(message,send){
    var text=message.message;
    var res=test.match(/\.dice ?(.*)?/);
    if(res[1]){
        if(res[1]=="地主"){
            send(message.group_id,message.sender.card+"抽到了"+doudizhu(20));
        }else if(res[1]=="农民"){
            send(message.group_id,message.sender.card+"抽到了"+doudizhu(17));
        }else if(res[1]=="麻将"){

        }
    }else{
        send(message.group_id,message.sender.card+"骰到了: "+Math.floor(1+6*Math.random()));
    }
}

function doudizhu(num){
    var poker=[
        "A","2","3","4","5","6","7","8","9","10","J","Q","K",
        "A","2","3","4","5","6","7","8","9","10","J","Q","K",
        "A","2","3","4","5","6","7","8","9","10","J","Q","K",
        "A","2","3","4","5","6","7","8","9","10","J","Q","K",
        "小王","大王",
    ];
    var index=[];
    var hand=[];
    for(var i=0;i<poker.length;i++){
        index[i]=i;
    }
    for(var i=0;i<num;i++){
        hand[i]=index[Math.floor(Math.random()*index.length)];
        index.splice(hand[i],1);
    }
    hand.sort(function(a, b){return a - b});
    for(var i=0;i<hand.length;i++){
        hand[i]=poker[hand[i]];
    }
    return hand.join(" ");
}

function mahjong(){
    var cards=[
        "一万","二万","三万","四万","五万","六万","七万","八万","九万",
        "一万","二万","三万","四万","五万","六万","七万","八万","九万",
        "一万","二万","三万","四万","五万","六万","七万","八万","九万",
        "一万","二万","三万","四万","五万","六万","七万","八万","九万",
        "1索","2索","3索","4索","5索","6索","7索","8索","9索",
        "1索","2索","3索","4索","5索","6索","7索","8索","9索",
        "1索","2索","3索","4索","5索","6索","7索","8索","9索",
        "1索","2索","3索","4索","5索","6索","7索","8索","9索",
        "1饼","2饼","3饼","4饼","5饼","6饼","7饼","8饼","9饼",
        "1饼","2饼","3饼","4饼","5饼","6饼","7饼","8饼","9饼",
        "1饼","2饼","3饼","4饼","5饼","6饼","7饼","8饼","9饼",
        "1饼","2饼","3饼","4饼","5饼","6饼","7饼","8饼","9饼",
        "东","南","西","北","白","发","中",
        "东","南","西","北","白","发","中",
        "东","南","西","北","白","发","中",
        "东","南","西","北","白","发","中",
    ];
}
