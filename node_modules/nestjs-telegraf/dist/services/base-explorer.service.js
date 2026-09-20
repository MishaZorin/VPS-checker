"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseExplorerService = void 0;
const lodash_1 = require("lodash");
class BaseExplorerService {
    getModules(modulesContainer, include) {
        if (!include || (0, lodash_1.isEmpty)(include)) {
            return [...modulesContainer.values()];
        }
        return this.includeWhitelisted(modulesContainer, include);
    }
    includeWhitelisted(modulesContainer, include) {
        const modules = [...modulesContainer.values()];
        return modules.filter(({ metatype }) => include.includes(metatype));
    }
    flatMap(modules, callback) {
        const visitedModules = new Set();
        const unwrap = (moduleRef) => {
            var _a;
            // protection from circular recursion
            if (visitedModules.has(moduleRef)) {
                return [];
            }
            else {
                visitedModules.add(moduleRef);
            }
            const providers = [...moduleRef.providers.values()];
            const defined = providers.map((wrapper) => callback(wrapper, moduleRef));
            const imported = ((_a = moduleRef.imports) === null || _a === void 0 ? void 0 : _a.size)
                ? [...moduleRef.imports.values()].reduce((prev, cur) => {
                    return [...prev, ...unwrap(cur)];
                }, [])
                : [];
            return [...defined, ...imported];
        };
        return (0, lodash_1.flattenDeep)(modules.map(unwrap)).filter(lodash_1.identity);
    }
}
exports.BaseExplorerService = BaseExplorerService;
