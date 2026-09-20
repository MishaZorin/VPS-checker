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
var TelegrafCoreModule_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.TelegrafCoreModule = void 0;
const core_1 = require("@nestjs/core");
const common_1 = require("@nestjs/common");
const telegraf_constants_1 = require("./telegraf.constants");
const services_1 = require("./services");
const stage_provider_1 = require("./stage.provider");
const telegraf_all_bots_provider_1 = require("./telegraf-all-bots.provider");
const utils_1 = require("./utils");
let TelegrafCoreModule = TelegrafCoreModule_1 = class TelegrafCoreModule {
    constructor(botName, moduleRef) {
        this.botName = botName;
        this.moduleRef = moduleRef;
    }
    static forRoot(options) {
        const telegrafBotName = (0, utils_1.getBotToken)(options.botName);
        const telegrafBotNameProvider = {
            provide: telegraf_constants_1.TELEGRAF_BOT_NAME,
            useValue: telegrafBotName,
        };
        const telegrafBotProvider = {
            provide: telegrafBotName,
            useFactory: async () => {
                const bot = await (0, utils_1.createBotFactory)(options);
                telegraf_all_bots_provider_1.allBotsMap.set(telegrafBotName, bot);
                return bot;
            },
        };
        return {
            module: TelegrafCoreModule_1,
            providers: [
                {
                    provide: telegraf_constants_1.TELEGRAF_MODULE_OPTIONS,
                    useValue: options,
                },
                stage_provider_1.telegrafStageProvider,
                telegrafBotNameProvider,
                telegrafBotProvider,
                telegraf_all_bots_provider_1.telegrafAllBotsProvider,
            ],
            exports: [
                stage_provider_1.telegrafStageProvider,
                telegrafBotNameProvider,
                telegrafBotProvider,
                telegraf_all_bots_provider_1.telegrafAllBotsProvider,
            ],
        };
    }
    static forRootAsync(options) {
        const telegrafBotName = (0, utils_1.getBotToken)(options.botName);
        const telegrafBotNameProvider = {
            provide: telegraf_constants_1.TELEGRAF_BOT_NAME,
            useValue: telegrafBotName,
        };
        const telegrafBotProvider = {
            provide: telegrafBotName,
            useFactory: async (options) => {
                const bot = await (0, utils_1.createBotFactory)(options);
                telegraf_all_bots_provider_1.allBotsMap.set(telegrafBotName, bot);
                return bot;
            },
            inject: [telegraf_constants_1.TELEGRAF_MODULE_OPTIONS],
        };
        const asyncProviders = this.createAsyncProviders(options);
        return {
            module: TelegrafCoreModule_1,
            imports: options.imports,
            providers: [
                ...asyncProviders,
                stage_provider_1.telegrafStageProvider,
                telegrafBotNameProvider,
                telegrafBotProvider,
                telegraf_all_bots_provider_1.telegrafAllBotsProvider,
            ],
            exports: [
                stage_provider_1.telegrafStageProvider,
                telegrafBotNameProvider,
                telegrafBotProvider,
                telegraf_all_bots_provider_1.telegrafAllBotsProvider,
            ],
        };
    }
    async onApplicationShutdown() {
        const bot = this.moduleRef.get(this.botName);
        bot && (await bot.stop());
    }
    static createAsyncProviders(options) {
        if (options.useExisting || options.useFactory) {
            return [this.createAsyncOptionsProvider(options)];
        }
        const useClass = options.useClass;
        return [
            this.createAsyncOptionsProvider(options),
            {
                provide: useClass,
                useClass,
            },
        ];
    }
    static createAsyncOptionsProvider(options) {
        if (options.useFactory) {
            return {
                provide: telegraf_constants_1.TELEGRAF_MODULE_OPTIONS,
                useFactory: options.useFactory,
                inject: options.inject || [],
            };
        }
        // `as Type<TelegrafOptionsFactory>` is a workaround for microsoft/TypeScript#31603
        const inject = [
            (options.useClass || options.useExisting),
        ];
        return {
            provide: telegraf_constants_1.TELEGRAF_MODULE_OPTIONS,
            useFactory: async (optionsFactory) => await optionsFactory.createTelegrafOptions(),
            inject,
        };
    }
};
exports.TelegrafCoreModule = TelegrafCoreModule;
exports.TelegrafCoreModule = TelegrafCoreModule = TelegrafCoreModule_1 = __decorate([
    (0, common_1.Global)(),
    (0, common_1.Module)({
        imports: [core_1.DiscoveryModule],
        providers: [services_1.ListenersExplorerService, services_1.MetadataAccessorService],
    }),
    __param(0, (0, common_1.Inject)(telegraf_constants_1.TELEGRAF_BOT_NAME)),
    __metadata("design:paramtypes", [String, core_1.ModuleRef])
], TelegrafCoreModule);
