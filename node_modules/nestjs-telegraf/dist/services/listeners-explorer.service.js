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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ListenersExplorerService = void 0;
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const metadata_scanner_1 = require("@nestjs/core/metadata-scanner");
const external_context_creator_1 = require("@nestjs/core/helpers/external-context-creator");
const telegraf_1 = require("telegraf");
const metadata_accessor_service_1 = require("./metadata-accessor.service");
const telegraf_constants_1 = require("../telegraf.constants");
const base_explorer_service_1 = require("./base-explorer.service");
const telegraf_params_factory_1 = require("../factories/telegraf-params-factory");
let ListenersExplorerService = class ListenersExplorerService extends base_explorer_service_1.BaseExplorerService {
    constructor(stage, telegrafOptions, botName, moduleRef, discoveryService, metadataAccessor, metadataScanner, modulesContainer, externalContextCreator) {
        super();
        this.stage = stage;
        this.telegrafOptions = telegrafOptions;
        this.botName = botName;
        this.moduleRef = moduleRef;
        this.discoveryService = discoveryService;
        this.metadataAccessor = metadataAccessor;
        this.metadataScanner = metadataScanner;
        this.modulesContainer = modulesContainer;
        this.externalContextCreator = externalContextCreator;
        this.telegrafParamsFactory = new telegraf_params_factory_1.TelegrafParamsFactory();
    }
    onModuleInit() {
        this.bot = this.moduleRef.get(this.botName, {
            strict: false,
        });
        this.explore();
        this.bot.use(this.stage.middleware());
        this.exploreUpdates();
    }
    explore() {
        const modules = this.getModules(this.modulesContainer, this.telegrafOptions.include || []);
        this.registerComposers(modules);
        this.registerScenes(modules);
    }
    exploreUpdates() {
        const modules = this.getModules(this.modulesContainer, this.telegrafOptions.include || []);
        this.registerUpdates(modules);
    }
    registerComposers(modules) {
        const updates = this.flatMap(modules, (instance) => this.filterComposers(instance));
        updates.forEach((wrapper) => {
            const composer = new telegraf_1.Composer();
            this.registerListeners(composer, wrapper);
            this.stage.use(composer);
        });
    }
    registerUpdates(modules) {
        const updates = this.flatMap(modules, (instance) => this.filterUpdates(instance));
        updates.forEach((wrapper) => this.registerListeners(this.bot, wrapper));
    }
    registerScenes(modules) {
        const scenes = this.flatMap(modules, (wrapper) => this.filterScenes(wrapper));
        const sceneIds = [];
        scenes.forEach((wrapper) => {
            const { sceneId, type, options } = this.metadataAccessor.getSceneMetadata(wrapper.instance.constructor);
            if (sceneIds.includes(sceneId)) {
                throw new Error(`Two scenes with the same id ${sceneId} were detected`);
            }
            sceneIds.push(sceneId);
            const scene = type === 'base'
                ? new telegraf_1.Scenes.BaseScene(sceneId, options || {})
                : new telegraf_1.Scenes.WizardScene(sceneId, options || {});
            this.stage.register(scene);
            if (type === 'base') {
                this.registerListeners(scene, wrapper);
            }
            else {
                this.registerWizardListeners(scene, wrapper);
            }
        });
    }
    filterComposers(wrapper) {
        const { instance } = wrapper;
        if (!instance)
            return undefined;
        const isComposer = this.metadataAccessor.isComposer(wrapper.metatype);
        if (!isComposer)
            return undefined;
        return wrapper;
    }
    filterUpdates(wrapper) {
        const { instance } = wrapper;
        if (!instance)
            return undefined;
        const isUpdate = this.metadataAccessor.isUpdate(wrapper.metatype);
        if (!isUpdate)
            return undefined;
        return wrapper;
    }
    filterScenes(wrapper) {
        const { instance } = wrapper;
        if (!instance)
            return undefined;
        const isScene = this.metadataAccessor.isScene(wrapper.metatype);
        if (!isScene)
            return undefined;
        return wrapper;
    }
    registerListeners(composer, wrapper) {
        const { instance } = wrapper;
        const prototype = Object.getPrototypeOf(instance);
        this.metadataScanner.scanFromPrototype(instance, prototype, (name) => this.registerIfListener(composer, instance, prototype, name));
    }
    registerWizardListeners(wizard, wrapper) {
        const { instance } = wrapper;
        const prototype = Object.getPrototypeOf(instance);
        const wizardSteps = [];
        const basicListeners = [];
        this.metadataScanner.scanFromPrototype(instance, prototype, (methodName) => {
            const methodRef = prototype[methodName];
            const metadata = this.metadataAccessor.getWizardStepMetadata(methodRef);
            if (!metadata) {
                basicListeners.push(methodName);
                return undefined;
            }
            wizardSteps.push({ step: metadata.step, methodName });
        });
        for (const methodName of basicListeners) {
            this.registerIfListener(wizard, instance, prototype, methodName);
        }
        const group = wizardSteps
            .sort((a, b) => a.step - b.step)
            .reduce((prev, cur) => (Object.assign(Object.assign({}, prev), { [cur.step]: [...(prev[cur.step] || []), cur] })), {});
        wizard.steps = Object.values(group).map((stepsMetadata) => {
            const composer = new telegraf_1.Composer();
            stepsMetadata.forEach((stepMethod) => {
                this.registerIfListener(composer, instance, prototype, stepMethod.methodName, [{ method: 'use', args: [] }]);
            });
            return composer.middleware();
        });
    }
    registerIfListener(composer, instance, prototype, methodName, defaultMetadata) {
        const methodRef = prototype[methodName];
        const metadata = this.metadataAccessor.getListenerMetadata(methodRef) || defaultMetadata;
        if (!metadata || metadata.length < 1) {
            return undefined;
        }
        const listenerCallbackFn = this.createContextCallback(instance, prototype, methodName);
        for (const { method, args } of metadata) {
            /* Basic callback */
            // composer[method](...args, listenerCallbackFn);
            /* Complex callback return value handing */
            composer[method](...args, async (ctx, next) => {
                const result = await listenerCallbackFn(ctx, next);
                if (result) {
                    await ctx.reply(String(result));
                }
                // TODO-Possible-Feature: Add more supported return types
            });
        }
    }
    createContextCallback(instance, prototype, methodName) {
        const paramsFactory = this.telegrafParamsFactory;
        return this.externalContextCreator.create(instance, prototype[methodName], methodName, telegraf_constants_1.PARAM_ARGS_METADATA, paramsFactory, undefined, undefined, undefined, 'telegraf');
    }
};
exports.ListenersExplorerService = ListenersExplorerService;
exports.ListenersExplorerService = ListenersExplorerService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(telegraf_constants_1.TELEGRAF_STAGE)),
    __param(1, (0, common_1.Inject)(telegraf_constants_1.TELEGRAF_MODULE_OPTIONS)),
    __param(2, (0, common_1.Inject)(telegraf_constants_1.TELEGRAF_BOT_NAME)),
    __metadata("design:paramtypes", [telegraf_1.Scenes.Stage, Object, String, core_1.ModuleRef,
        core_1.DiscoveryService,
        metadata_accessor_service_1.MetadataAccessorService,
        metadata_scanner_1.MetadataScanner,
        core_1.ModulesContainer,
        external_context_creator_1.ExternalContextCreator])
], ListenersExplorerService);
