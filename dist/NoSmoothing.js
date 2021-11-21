(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "./SimpleSmoothing"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.NoSmoothing = void 0;
    const SimpleSmoothing_1 = require("./SimpleSmoothing");
    class NoSmoothing extends SimpleSmoothing_1.SimpleSmoothing {
        setProbabilitiesWithLevel(nGram, level) {
            nGram.setProbabilityWithPseudoCount(0.0, level);
        }
    }
    exports.NoSmoothing = NoSmoothing;
});
//# sourceMappingURL=NoSmoothing.js.map