import { ModuleRef } from '@nestjs/core';
import { DynamicModule, OnApplicationShutdown } from '@nestjs/common';
import { TelegrafModuleAsyncOptions, TelegrafModuleOptions } from './interfaces';
export declare class TelegrafCoreModule implements OnApplicationShutdown {
    private readonly botName;
    private readonly moduleRef;
    constructor(botName: string, moduleRef: ModuleRef);
    static forRoot(options: TelegrafModuleOptions): DynamicModule;
    static forRootAsync(options: TelegrafModuleAsyncOptions): DynamicModule;
    onApplicationShutdown(): Promise<void>;
    private static createAsyncProviders;
    private static createAsyncOptionsProvider;
}
