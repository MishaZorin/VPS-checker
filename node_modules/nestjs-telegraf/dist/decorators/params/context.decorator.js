"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Ctx = exports.Context = void 0;
const param_decorator_util_1 = require("../../utils/param-decorator.util");
const telegraf_paramtype_enum_1 = require("../../enums/telegraf-paramtype.enum");
exports.Context = (0, param_decorator_util_1.createTelegrafParamDecorator)(telegraf_paramtype_enum_1.TelegrafParamtype.CONTEXT);
exports.Ctx = exports.Context;
