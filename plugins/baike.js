const cheerio = require("cheerio");
const { default: axios } = require("axios");

exports.name = "baike";
exports.handle = function (message, info, reply) {
    const text = message.message;
    const res = text.match(/^萌娘百科查(.+)$/);
    if (res) {
        const url = "https://mzh.moegirl.org.cn/" + encodeURI(res[1]);
        axios.get(url).then(res => {
            const $ = cheerio.load(res.data);
            var s = $("#mf-section-0>p").filter(i => i <= 3).text().trim();
            if (s.length > 200) {
                s = s.substr(0, 200) + "...";
            }
            s += "\n" + url;
            reply(s);
        }).catch(_ => {
            reply(`萌娘百科未收录${res[1]}`);
        });
        return true;
    }
    return false;
}
