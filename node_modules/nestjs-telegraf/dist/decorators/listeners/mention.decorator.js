"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Mention = void 0;
const utils_1 = require("../../utils");
/**
 * Mention handling.
 *
 * @see https://telegraf.js.org/#/?id=mention
 */
exports.Mention = (0, utils_1.createListenerDecorator)('mention');
