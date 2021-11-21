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
    exports.TrainedSmoothing = void 0;
    const SimpleSmoothing_1 = require("./SimpleSmoothing");
    class TrainedSmoothing extends SimpleSmoothing_1.SimpleSmoothing {
        /**
         * Calculates new lower bound.
         * @param current current value.
         * @param currentLowerBound current lower bound
         * @param currentUpperBound current upper bound
         * @param numberOfParts number of parts between lower and upper bound.
         * @return new lower bound
         */
        newLowerBound(current, currentLowerBound, currentUpperBound, numberOfParts) {
            if (current != currentLowerBound) {
                return current - (currentUpperBound - currentLowerBound) / numberOfParts;
            }
            else {
                return current / numberOfParts;
            }
        }
        /**
         * Calculates new upper bound.
         * @param current current value.
         * @param currentLowerBound current lower bound
         * @param currentUpperBound current upper bound
         * @param numberOfParts number of parts between lower and upper bound.
         * @return new upper bound
         */
        newUpperBound(current, currentLowerBound, currentUpperBound, numberOfParts) {
            if (current != currentUpperBound) {
                return current + (currentUpperBound - currentLowerBound) / numberOfParts;
            }
            else {
                return current * numberOfParts;
            }
        }
        /**
         * Wrapper function to learn parameters of the smoothing method and set the N-gram probabilities.
         *
         * @param corpus Train corpus used to optimize parameters of the smoothing method.
         * @param nGram N-Gram for which the probabilities will be set.
         */
        train(corpus, nGram) {
            this.learnParameters(corpus, nGram.getN());
            this.setProbabilities(nGram);
        }
    }
    exports.TrainedSmoothing = TrainedSmoothing;
});
//# sourceMappingURL=TrainedSmoothing.js.map