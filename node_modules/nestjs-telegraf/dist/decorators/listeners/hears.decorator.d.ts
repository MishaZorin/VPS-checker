/**
 * Registers middleware for handling text messages.
 *
 * @see https://telegraf.js.org/#/?id=hears
 */
export declare const Hears: (...args: [string] | [RegExp] | [(value: string, ctx: import("telegraf").NarrowedContext<never, {
    message: import("@telegraf/types").Update.New & import("@telegraf/types").Update.NonChannel & import("@telegraf/types").Message.TextMessage;
    update_id: number;
}>) => RegExpExecArray | null] | [(string | RegExp | ((value: string, ctx: import("telegraf").NarrowedContext<never, {
    message: import("@telegraf/types").Update.New & import("@telegraf/types").Update.NonChannel & import("@telegraf/types").Message.TextMessage;
    update_id: number;
}>) => RegExpExecArray | null))[]]) => MethodDecorator;
