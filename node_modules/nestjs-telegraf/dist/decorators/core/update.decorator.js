"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Update = void 0;
const common_1 = require("@nestjs/common");
const telegraf_constants_1 = require("../../telegraf.constants");
/**
 * `@Update` decorator, it's like NestJS `@Controller` decorator,
 * but for Telegram Bot API updates.
 */
const Update = () => (0, common_1.SetMetadata)(telegraf_constants_1.UPDATE_METADATA, true);
exports.Update = Update;
