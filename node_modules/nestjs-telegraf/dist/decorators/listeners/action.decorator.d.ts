/**
 * Registers middleware for handling callback_data actions with regular expressions.
 *
 * @see https://telegraf.js.org/#/?id=action
 */
export declare const Action: (...args: [string] | [RegExp] | [(value: string, ctx: import("telegraf").NarrowedContext<never, import("@telegraf/types").Update.CallbackQueryUpdate<import("@telegraf/types").CallbackQuery>>) => RegExpExecArray | null] | [(string | RegExp | ((value: string, ctx: import("telegraf").NarrowedContext<never, import("@telegraf/types").Update.CallbackQueryUpdate<import("@telegraf/types").CallbackQuery>>) => RegExpExecArray | null))[]]) => MethodDecorator;
