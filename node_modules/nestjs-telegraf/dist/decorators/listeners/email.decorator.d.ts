/**
 * Registers middleware for handling messages with email entity.
 *
 * @see https://telegraf.js.org/#/?id=telegraf-email
 */
export declare const Email: (...args: [string] | [RegExp] | [(value: string, ctx: never) => RegExpExecArray | null] | [(string | RegExp | ((value: string, ctx: never) => RegExpExecArray | null))[]]) => MethodDecorator;
