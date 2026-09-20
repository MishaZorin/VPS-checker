import { DynamicModule } from '@nestjs/common';
import { TelegrafModuleOptions, TelegrafModuleAsyncOptions } from './interfaces';
export declare class TelegrafModule {
    static forRoot(options: TelegrafModuleOptions): DynamicModule;
    static forRootAsync(options: TelegrafModuleAsyncOptions): DynamicModule;
}
