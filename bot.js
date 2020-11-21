var http = require("http")
exports.SendGroupMessage = function (group_id, message) {
    var req = http.request("http://localhost:5700/send_group_msg", {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        }
    });
    req.write(JSON.stringify({
        "group_id": group_id,
        "message": message
    }));
    req.end();
    console.log("[info] >>>", message);
}
exports.SendPrivateMessage = function (user_id, message) {
    var req = http.request("http://localhost:5700/send_private_msg", {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        }
    });
    req.write(JSON.stringify({
        "user_id": user_id,
        "message": message
    }));
    req.end();
    console.log("[info] >>>", message);
}
