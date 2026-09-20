"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TelegrafArgumentsHost = void 0;
const execution_context_host_1 = require("@nestjs/core/helpers/execution-context-host");
class TelegrafArgumentsHost extends execution_context_host_1.ExecutionContextHost {
    static create(context) {
        const type = context.getType();
        const tgContext = new TelegrafArgumentsHost(context.getArgs());
        tgContext.setType(type);
        return tgContext;
    }
    getContext() {
        return this.getArgByIndex(0);
    }
    getNext() {
        return this.getArgByIndex(1);
    }
}
exports.TelegrafArgumentsHost = TelegrafArgumentsHost;
