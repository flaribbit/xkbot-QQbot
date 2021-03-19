var client = null;

exports.SetClient = function (ws) {
    client = ws;
}

exports.SendGroupMessage = function (group_id, message) {
    client.send(JSON.stringify({
        "action": "send_group_msg",
        "params": {
            "group_id": group_id,
            "message": message
        }
    }));
    console.log("[info] >>>", message);
}

exports.SendPrivateMessage = function (user_id, message) {
    client.send(JSON.stringify({
        "action": "send_private_msg",
        "params": {
            "user_id": user_id,
            "message": message
        }
    }));
    console.log("[info] >>>", message);
}
