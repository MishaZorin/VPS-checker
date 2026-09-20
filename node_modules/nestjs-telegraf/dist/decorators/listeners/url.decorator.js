"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Url = void 0;
const utils_1 = require("../../utils");
/**
 * Registers middleware for handling messages with url entity.
 *
 * @see https://telegraf.js.org/#/?id=telegraf-url
 */
exports.Url = (0, utils_1.createListenerDecorator)('url');
