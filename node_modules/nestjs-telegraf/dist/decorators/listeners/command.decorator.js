"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Command = void 0;
const utils_1 = require("../../utils");
/**
 * Command handling.
 *
 * @see https://telegraf.js.org/#/?id=command
 */
exports.Command = (0, utils_1.createListenerDecorator)('command');
