"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createListenerDecorator = createListenerDecorator;
const telegraf_constants_1 = require("../telegraf.constants");
function createListenerDecorator(method) {
    return (...args) => {
        return (target, _key, descriptor) => {
            const metadata = [
                {
                    method,
                    args,
                },
            ];
            if (descriptor) {
                const previousValue = Reflect.getMetadata(telegraf_constants_1.LISTENERS_METADATA, descriptor.value) || [];
                const value = [...previousValue, ...metadata];
                Reflect.defineMetadata(telegraf_constants_1.LISTENERS_METADATA, value, descriptor.value);
                return descriptor;
            }
            Reflect.defineMetadata(telegraf_constants_1.LISTENERS_METADATA, metadata, target);
            return target;
        };
    };
}
