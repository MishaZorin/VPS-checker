"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InlineQuery = void 0;
const utils_1 = require("../../utils");
/**
 * Registers middleware for handling inline_query actions with regular expressions.
 *
 * @see https://telegraf.js.org/#/?id=inlinequery
 */
exports.InlineQuery = (0, utils_1.createListenerDecorator)('inlineQuery');
