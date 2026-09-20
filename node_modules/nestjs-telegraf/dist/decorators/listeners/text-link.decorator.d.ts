/**
 * Registers middleware for handling messages with text_link entity.
 *
 * @see https://telegraf.js.org/#/?id=telegraf-textlink
 */
export declare const TextLink: (...args: [string] | [RegExp] | [(value: string, ctx: never) => RegExpExecArray | null] | [(string | RegExp | ((value: string, ctx: never) => RegExpExecArray | null))[]]) => MethodDecorator;
