/**
 * Registers middleware for handling messages with url entity.
 *
 * @see https://telegraf.js.org/#/?id=telegraf-url
 */
export declare const Url: (...args: [string] | [RegExp] | [(value: string, ctx: never) => RegExpExecArray | null] | [(string | RegExp | ((value: string, ctx: never) => RegExpExecArray | null))[]]) => MethodDecorator;
