import { PipeTransform, Type } from '@nestjs/common';
export declare function Message(): ParameterDecorator;
export declare function Message(...pipes: (Type<PipeTransform> | PipeTransform)[]): ParameterDecorator;
export declare function Message(property: string, ...pipes: (Type<PipeTransform> | PipeTransform)[]): ParameterDecorator;
