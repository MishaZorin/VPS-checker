"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InjectAllBots = void 0;
const common_1 = require("@nestjs/common");
const get_all_bots_token_util_1 = require("../../utils/get-all-bots-token.util");
const InjectAllBots = () => (0, common_1.Inject)((0, get_all_bots_token_util_1.getAllBotsToken)());
exports.InjectAllBots = InjectAllBots;
