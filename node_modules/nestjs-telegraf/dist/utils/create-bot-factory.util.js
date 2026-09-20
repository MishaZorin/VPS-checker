"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createBotFactory = createBotFactory;
const telegraf_1 = require("telegraf");
const common_1 = require("@nestjs/common");
async function createBotFactory(options) {
    var _a;
    const bot = new telegraf_1.Telegraf(options.token, options.options);
    bot.use(...((_a = options.middlewares) !== null && _a !== void 0 ? _a : []));
    bot.catch((err, ctx) => common_1.Logger.error(err, `Telegraf: ${ctx.botInfo.username}`));
    if (options.launchOptions !== false) {
        bot.launch(options.launchOptions);
    }
    return bot;
}
