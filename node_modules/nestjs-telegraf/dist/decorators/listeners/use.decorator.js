"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Use = void 0;
const utils_1 = require("../../utils");
/**
 * Registers a middleware.
 *
 * @see https://telegraf.js.org/#/?id=use
 */
exports.Use = (0, utils_1.createListenerDecorator)('use');
