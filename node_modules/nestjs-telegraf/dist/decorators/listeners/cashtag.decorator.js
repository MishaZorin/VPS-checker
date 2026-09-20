"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Cashtag = void 0;
const utils_1 = require("../../utils");
/**
 * Cashtag handling.
 *
 * @see https://telegraf.js.org/#/?id=cashtag
 */
exports.Cashtag = (0, utils_1.createListenerDecorator)('cashtag');
