"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Phone = void 0;
const utils_1 = require("../../utils");
/**
 * Phone number handling.
 *
 * @see https://telegraf.js.org/#/?id=phone
 */
exports.Phone = (0, utils_1.createListenerDecorator)('phone');
