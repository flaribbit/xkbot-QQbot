import bot from "./bot"

// load plugins
bot.use(require("./plugins/baike"))
bot.use(require("./plugins/bvinfo"))
bot.use(require("./plugins/setu"))
bot.use(require("./plugins/dice"))
bot.use(require("./plugins/throwit"))
bot.use(require("./plugins/latex"))
bot.use(require("./plugins/techmino"))
bot.use(require("./plugins/translate"))
bot.use(require("./plugins/chat"))

bot.run()
