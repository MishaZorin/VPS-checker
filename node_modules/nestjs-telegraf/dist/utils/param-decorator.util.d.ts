import { PipeTransform, Type } from '@nestjs/common';
import { TelegrafParamtype } from '../enums/telegraf-paramtype.enum';
export type ParamData = object | string | number;
export declare const createTelegrafParamDecorator: (paramtype: TelegrafParamtype) => (data?: ParamData) => ParameterDecorator;
export declare const createTelegrafPipesParamDecorator: (paramtype: TelegrafParamtype) => (data?: any, ...pipes: (Type<PipeTransform> | PipeTransform)[]) => ParameterDecorator;
export declare const addPipesMetadata: (paramtype: TelegrafParamtype, data: any, pipes: (Type<PipeTransform> | PipeTransform)[], target: Record<string, any>, key: string | symbol, index: number) => void;
