"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TextLink = void 0;
const utils_1 = require("../../utils");
/**
 * Registers middleware for handling messages with text_link entity.
 *
 * @see https://telegraf.js.org/#/?id=telegraf-textlink
 */
exports.TextLink = (0, utils_1.createListenerDecorator)('textLink');
