/**
 * Registers middleware for handling inline_query actions with regular expressions.
 *
 * @see https://telegraf.js.org/#/?id=inlinequery
 */
export declare const InlineQuery: (...args: [string] | [RegExp] | [(value: string, ctx: import("telegraf").NarrowedContext<never, import("@telegraf/types").Update.InlineQueryUpdate>) => RegExpExecArray | null] | [(string | RegExp | ((value: string, ctx: import("telegraf").NarrowedContext<never, import("@telegraf/types").Update.InlineQueryUpdate>) => RegExpExecArray | null))[]]) => MethodDecorator;
