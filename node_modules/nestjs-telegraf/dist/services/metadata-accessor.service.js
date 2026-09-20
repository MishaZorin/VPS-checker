"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MetadataAccessorService = void 0;
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const telegraf_constants_1 = require("../telegraf.constants");
let MetadataAccessorService = class MetadataAccessorService {
    constructor(reflector) {
        this.reflector = reflector;
    }
    isComposer(target) {
        if (!target)
            return false;
        return !!this.reflector.get(telegraf_constants_1.COMPOSER_METADATA, target);
    }
    isUpdate(target) {
        if (!target)
            return false;
        return !!this.reflector.get(telegraf_constants_1.UPDATE_METADATA, target);
    }
    isScene(target) {
        if (!target)
            return false;
        return !!this.reflector.get(telegraf_constants_1.SCENE_METADATA, target);
    }
    getListenerMetadata(target) {
        return this.reflector.get(telegraf_constants_1.LISTENERS_METADATA, target);
    }
    getSceneMetadata(target) {
        return this.reflector.get(telegraf_constants_1.SCENE_METADATA, target);
    }
    getWizardStepMetadata(target) {
        return this.reflector.get(telegraf_constants_1.WIZARD_STEP_METADATA, target);
    }
};
exports.MetadataAccessorService = MetadataAccessorService;
exports.MetadataAccessorService = MetadataAccessorService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [core_1.Reflector])
], MetadataAccessorService);
