"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Message = Message;
const param_decorator_util_1 = require("../../utils/param-decorator.util");
const telegraf_paramtype_enum_1 = require("../../enums/telegraf-paramtype.enum");
function Message(property, ...pipes) {
    return (0, param_decorator_util_1.createTelegrafPipesParamDecorator)(telegraf_paramtype_enum_1.TelegrafParamtype.MESSAGE)(property, ...pipes);
}
