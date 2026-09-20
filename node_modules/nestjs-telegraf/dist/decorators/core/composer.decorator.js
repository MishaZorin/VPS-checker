"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Composer = void 0;
const common_1 = require("@nestjs/common");
const telegraf_constants_1 = require("../../telegraf.constants");
/**
 * `@Composer` like Update decorator, executed before scene handlers.
 */
const Composer = () => (0, common_1.SetMetadata)(telegraf_constants_1.COMPOSER_METADATA, true);
exports.Composer = Composer;
