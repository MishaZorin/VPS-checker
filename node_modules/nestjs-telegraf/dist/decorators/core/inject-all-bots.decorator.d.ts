import { Telegraf } from 'telegraf';
export type AllBotsMap = Map<string, Telegraf<any>>;
export declare const InjectAllBots: () => ParameterDecorator;
