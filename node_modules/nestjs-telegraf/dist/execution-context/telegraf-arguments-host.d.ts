import { ArgumentsHost } from '@nestjs/common';
import { ExecutionContextHost } from '@nestjs/core/helpers/execution-context-host';
import { TgArgumentsHost } from './tg-arguments-host.interface';
export declare class TelegrafArgumentsHost extends ExecutionContextHost implements TgArgumentsHost {
    static create(context: ArgumentsHost): TelegrafArgumentsHost;
    getContext<T = any>(): T;
    getNext<T = any>(): T;
}
