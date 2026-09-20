"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameQuery = void 0;
const utils_1 = require("../../utils");
/**
 * Registers middleware for handling callback_data actions with game query.
 *
 * @see https://telegraf.js.org/#/?id=inlinequery
 */
exports.GameQuery = (0, utils_1.createListenerDecorator)('gameQuery');
