import { ParamData } from '@nestjs/common';
import { ParamsFactory } from '@nestjs/core/helpers/external-context-creator';
import { TelegrafParamtype } from '../enums/telegraf-paramtype.enum';
export declare class TelegrafParamsFactory implements ParamsFactory {
    exchangeKeyForValue(type: TelegrafParamtype, data: ParamData, args: unknown[]): unknown;
}
