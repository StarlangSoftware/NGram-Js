(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.SimpleSmoothing = void 0;
    class SimpleSmoothing {
        /**
         * Calculates the N-Gram probabilities with simple smoothing.
         * @param nGram N-Gram for which simple smoothing calculation is done.
         */
        setProbabilities(nGram) {
            this.setProbabilitiesWithLevel(nGram, nGram.getN());
        }
    }
    exports.SimpleSmoothing = SimpleSmoothing;
});
//# sourceMappingURL=SimpleSmoothing.js.map