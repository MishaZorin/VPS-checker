"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WizardStep = void 0;
const common_1 = require("@nestjs/common");
const telegraf_constants_1 = require("../../telegraf.constants");
const WizardStep = (step) => (0, common_1.SetMetadata)(telegraf_constants_1.WIZARD_STEP_METADATA, { step });
exports.WizardStep = WizardStep;
