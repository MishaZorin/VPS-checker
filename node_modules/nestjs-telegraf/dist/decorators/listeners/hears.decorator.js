"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Hears = void 0;
const utils_1 = require("../../utils");
/**
 * Registers middleware for handling text messages.
 *
 * @see https://telegraf.js.org/#/?id=hears
 */
exports.Hears = (0, utils_1.createListenerDecorator)('hears');
