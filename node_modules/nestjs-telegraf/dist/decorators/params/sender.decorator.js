"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Sender = Sender;
const param_decorator_util_1 = require("../../utils/param-decorator.util");
const telegraf_paramtype_enum_1 = require("../../enums/telegraf-paramtype.enum");
function Sender(property, ...pipes) {
    return (0, param_decorator_util_1.createTelegrafPipesParamDecorator)(telegraf_paramtype_enum_1.TelegrafParamtype.SENDER)(property, ...pipes);
}
