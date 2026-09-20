"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.telegrafStageProvider = void 0;
const telegraf_1 = require("telegraf");
const telegraf_constants_1 = require("./telegraf.constants");
exports.telegrafStageProvider = {
    provide: telegraf_constants_1.TELEGRAF_STAGE,
    useClass: telegraf_1.Scenes.Stage,
};
