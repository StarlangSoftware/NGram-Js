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
    exports.LaplaceSmoothing = void 0;
    const SimpleSmoothing_1 = require("./SimpleSmoothing");
    class LaplaceSmoothing extends SimpleSmoothing_1.SimpleSmoothing {
        constructor(delta = 1.0) {
            super();
            this.delta = delta;
        }
        /**
         * Wrapper function to set the N-gram probabilities with laplace smoothing.
         *
         * @param nGram N-Gram for which the probabilities will be set.
         * @param level Level for which N-Gram probabilities will be set. Probabilities for different levels of the
         *              N-gram can be set with this function. If level = 1, N-Gram is treated as UniGram, if level = 2,
         *              N-Gram is treated as Bigram, etc.
         */
        setProbabilitiesWithLevel(nGram, level) {
            nGram.setProbabilityWithPseudoCount(this.delta, level);
        }
    }
    exports.LaplaceSmoothing = LaplaceSmoothing;
});
//# sourceMappingURL=LaplaceSmoothing.js.map