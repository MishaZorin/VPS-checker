import { Reflector } from '@nestjs/core';
import { ListenerMetadata, SceneMetadata, WizardStepMetadata } from '../interfaces';
export declare class MetadataAccessorService {
    private readonly reflector;
    constructor(reflector: Reflector);
    isComposer(target: Function): boolean;
    isUpdate(target: Function): boolean;
    isScene(target: Function): boolean;
    getListenerMetadata(target: Function): ListenerMetadata[] | undefined;
    getSceneMetadata(target: Function): SceneMetadata | undefined;
    getWizardStepMetadata(target: Function): WizardStepMetadata | undefined;
}
