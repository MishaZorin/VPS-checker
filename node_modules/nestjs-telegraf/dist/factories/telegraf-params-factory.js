"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TelegrafParamsFactory = void 0;
const telegraf_paramtype_enum_1 = require("../enums/telegraf-paramtype.enum");
class TelegrafParamsFactory {
    exchangeKeyForValue(type, data, args) {
        const ctx = args[0];
        const next = args[1];
        switch (type) {
            case telegraf_paramtype_enum_1.TelegrafParamtype.CONTEXT:
                return ctx;
            case telegraf_paramtype_enum_1.TelegrafParamtype.NEXT:
                return next;
            case telegraf_paramtype_enum_1.TelegrafParamtype.SENDER:
                return data && ctx.from ? ctx.from[data] : ctx.from;
            case telegraf_paramtype_enum_1.TelegrafParamtype.MESSAGE:
                return data && ctx.message ? ctx.message[data] : ctx.message;
            default:
                return null;
        }
    }
}
exports.TelegrafParamsFactory = TelegrafParamsFactory;
