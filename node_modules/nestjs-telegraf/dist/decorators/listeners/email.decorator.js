"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Email = void 0;
const utils_1 = require("../../utils");
/**
 * Registers middleware for handling messages with email entity.
 *
 * @see https://telegraf.js.org/#/?id=telegraf-email
 */
exports.Email = (0, utils_1.createListenerDecorator)('email');
