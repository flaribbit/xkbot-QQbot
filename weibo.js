const bot = require("./bot");
const { default: Axios } = require("axios");

//api: https://m.weibo.cn/api/container/getIndex?containerid=107603${id}
Axios.get("https://m.weibo.cn/api/container/getIndex?containerid=1076031470809487").then(res => {
    res.data.data.cards.forEach(card => {
        if (card.card_type != 9) return;
        var text = card.mblog.text.replace(/<span class="url-icon"><img alt=([^ ]+).*?\/span>/g, "$1");
        // text = text.replace(/<a href="\/status.*?\/a>/, "");
        text = text.replace(/<a .*?>(.*?)<\/a>/g, "$1");
        text = text.replace(/<span .*?>(.*?)<\/span>/g, "$1");
        console.log(text);
        console.log(card.scheme.split("?")[0]);
    });
});
