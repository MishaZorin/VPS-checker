"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Settings = void 0;
const utils_1 = require("../../utils");
/**
 * Handler for /settings command.
 *
 * @see https://telegraf.js.org/#/?id=settings
 */
exports.Settings = (0, utils_1.createListenerDecorator)('settings');
