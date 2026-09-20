"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.On = void 0;
const utils_1 = require("../../utils");
/**
 * Registers middleware for provided update type.
 *
 * @see https://telegraf.js.org/#/?id=on
 */
exports.On = (0, utils_1.createListenerDecorator)('on');
