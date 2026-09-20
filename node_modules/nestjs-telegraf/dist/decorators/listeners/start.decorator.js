"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Start = void 0;
const utils_1 = require("../../utils");
/**
 * Handler for /start command.
 *
 * @see https://telegraf.js.org/#/?id=start
 */
exports.Start = (0, utils_1.createListenerDecorator)('start');
