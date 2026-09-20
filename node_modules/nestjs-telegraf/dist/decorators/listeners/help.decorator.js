"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Help = void 0;
const utils_1 = require("../../utils");
/**
 * Handler for /help command.
 *
 * @see https://telegraf.js.org/#/?id=help
 */
exports.Help = (0, utils_1.createListenerDecorator)('help');
