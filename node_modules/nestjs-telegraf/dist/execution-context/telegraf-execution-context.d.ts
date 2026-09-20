import { ContextType, ExecutionContext } from '@nestjs/common';
import { ExecutionContextHost } from '@nestjs/core/helpers/execution-context-host';
import { TgArgumentsHost } from './tg-arguments-host.interface';
export type TelegrafContextType = 'telegraf' | ContextType;
export declare class TelegrafExecutionContext extends ExecutionContextHost implements TgArgumentsHost {
    static create(context: ExecutionContext): TelegrafExecutionContext;
    getType<TContext extends string = TelegrafContextType>(): TContext;
    getContext<T = any>(): T;
    getNext<T = any>(): T;
}
