"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Action = void 0;
const utils_1 = require("../../utils");
/**
 * Registers middleware for handling callback_data actions with regular expressions.
 *
 * @see https://telegraf.js.org/#/?id=action
 */
exports.Action = (0, utils_1.createListenerDecorator)('action');
