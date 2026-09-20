import { Telegraf } from 'telegraf';
import { TelegrafModuleOptions } from '../interfaces';
export declare function createBotFactory(options: TelegrafModuleOptions): Promise<Telegraf<any>>;
