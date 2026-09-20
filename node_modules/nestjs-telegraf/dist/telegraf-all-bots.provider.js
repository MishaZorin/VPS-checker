"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.telegrafAllBotsProvider = exports.allBotsMap = void 0;
const telegraf_constants_1 = require("./telegraf.constants");
exports.allBotsMap = new Map();
exports.telegrafAllBotsProvider = {
    provide: telegraf_constants_1.TELEGRAF_ALL_BOTS,
    useValue: exports.allBotsMap,
};
