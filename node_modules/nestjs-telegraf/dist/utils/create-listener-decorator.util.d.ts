import { Composer } from 'telegraf';
import { ComposerMethodArgs, OnlyFunctionPropertyNames } from '../types';
export declare function createListenerDecorator<TComposer extends Composer<never>, TMethod extends OnlyFunctionPropertyNames<TComposer> = OnlyFunctionPropertyNames<TComposer>>(method: TMethod): (...args: ComposerMethodArgs<TComposer, TMethod>) => MethodDecorator;
