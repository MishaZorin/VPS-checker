"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TelegrafExecutionContext = void 0;
const execution_context_host_1 = require("@nestjs/core/helpers/execution-context-host");
class TelegrafExecutionContext extends execution_context_host_1.ExecutionContextHost {
    static create(context) {
        const type = context.getType();
        const tgContext = new TelegrafExecutionContext(context.getArgs(), context.getClass(), context.getHandler());
        tgContext.setType(type);
        return tgContext;
    }
    getType() {
        return super.getType();
    }
    getContext() {
        return this.getArgByIndex(0);
    }
    getNext() {
        return this.getArgByIndex(1);
    }
}
exports.TelegrafExecutionContext = TelegrafExecutionContext;
