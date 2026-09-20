"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addPipesMetadata = exports.createTelegrafPipesParamDecorator = exports.createTelegrafParamDecorator = void 0;
const common_1 = require("@nestjs/common");
const shared_utils_1 = require("@nestjs/common/utils/shared.utils");
const telegraf_constants_1 = require("../telegraf.constants");
const createTelegrafParamDecorator = (paramtype) => (data) => (target, key, index) => {
    const args = Reflect.getMetadata(telegraf_constants_1.PARAM_ARGS_METADATA, target.constructor, key) || {};
    Reflect.defineMetadata(telegraf_constants_1.PARAM_ARGS_METADATA, (0, common_1.assignMetadata)(args, paramtype, index, data), target.constructor, key);
};
exports.createTelegrafParamDecorator = createTelegrafParamDecorator;
const createTelegrafPipesParamDecorator = (paramtype) => (data, ...pipes) => (target, key, index) => {
    (0, exports.addPipesMetadata)(paramtype, data, pipes, target, key, index);
};
exports.createTelegrafPipesParamDecorator = createTelegrafPipesParamDecorator;
const addPipesMetadata = (paramtype, data, pipes, target, key, index) => {
    const args = Reflect.getMetadata(telegraf_constants_1.PARAM_ARGS_METADATA, target.constructor, key) || {};
    const hasParamData = (0, shared_utils_1.isNil)(data) || (0, shared_utils_1.isString)(data);
    const paramData = hasParamData ? data : undefined;
    const paramPipes = hasParamData ? pipes : [data, ...pipes];
    Reflect.defineMetadata(telegraf_constants_1.PARAM_ARGS_METADATA, (0, common_1.assignMetadata)(args, paramtype, index, paramData, ...paramPipes), target.constructor, key);
};
exports.addPipesMetadata = addPipesMetadata;
