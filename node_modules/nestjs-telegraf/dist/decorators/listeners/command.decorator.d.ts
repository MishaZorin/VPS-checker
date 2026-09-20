/**
 * Command handling.
 *
 * @see https://telegraf.js.org/#/?id=command
 */
export declare const Command: (...args: [string] | [RegExp] | [(value: string, ctx: import("telegraf").NarrowedContext<never, {
    message: import("@telegraf/types").Update.New & import("@telegraf/types").Update.NonChannel & import("@telegraf/types").Message.TextMessage;
    update_id: number;
}>) => RegExpExecArray | null] | [(string | RegExp | ((value: string, ctx: import("telegraf").NarrowedContext<never, {
    message: import("@telegraf/types").Update.New & import("@telegraf/types").Update.NonChannel & import("@telegraf/types").Message.TextMessage;
    update_id: number;
}>) => RegExpExecArray | null))[]]) => MethodDecorator;
