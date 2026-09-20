import { InstanceWrapper } from '@nestjs/core/injector/instance-wrapper';
import { Module } from '@nestjs/core/injector/module';
export declare class BaseExplorerService {
    getModules(modulesContainer: Map<string, Module>, include: Function[]): Module[];
    includeWhitelisted(modulesContainer: Map<string, Module>, include: Function[]): Module[];
    flatMap<T>(modules: Module[], callback: (instance: InstanceWrapper, moduleRef: Module) => T | T[]): T[];
}
