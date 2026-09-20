"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TextMention = void 0;
const utils_1 = require("../../utils");
/**
 * Registers middleware for handling messages with text_mention entity.
 *
 * @see https://telegraf.js.org/#/?id=telegraf-textlink
 */
exports.TextMention = (0, utils_1.createListenerDecorator)('textMention');
