"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getBotToken = getBotToken;
const telegraf_constants_1 = require("../telegraf.constants");
function getBotToken(name) {
    return name && name !== telegraf_constants_1.DEFAULT_BOT_NAME ? `${name}Bot` : telegraf_constants_1.DEFAULT_BOT_NAME;
}
