import { PipeTransform, Type } from '@nestjs/common';
export declare function Sender(): ParameterDecorator;
export declare function Sender(...pipes: (Type<PipeTransform> | PipeTransform)[]): ParameterDecorator;
export declare function Sender(property: string, ...pipes: (Type<PipeTransform> | PipeTransform)[]): ParameterDecorator;
