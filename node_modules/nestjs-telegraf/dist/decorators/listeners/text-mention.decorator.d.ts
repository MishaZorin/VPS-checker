/**
 * Registers middleware for handling messages with text_mention entity.
 *
 * @see https://telegraf.js.org/#/?id=telegraf-textlink
 */
export declare const TextMention: (...args: [string] | [RegExp] | [(value: string, ctx: never) => RegExpExecArray | null] | [(string | RegExp | ((value: string, ctx: never) => RegExpExecArray | null))[]]) => MethodDecorator;
