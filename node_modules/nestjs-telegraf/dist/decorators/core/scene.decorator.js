"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Scene = void 0;
const common_1 = require("@nestjs/common");
const telegraf_constants_1 = require("../../telegraf.constants");
const Scene = (sceneId, options) => (0, common_1.SetMetadata)(telegraf_constants_1.SCENE_METADATA, {
    sceneId,
    type: 'base',
    options,
});
exports.Scene = Scene;
