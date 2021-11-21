(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "./NoSmoothing"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.NoSmoothingWithNonRareWords = void 0;
    const NoSmoothing_1 = require("./NoSmoothing");
    class NoSmoothingWithNonRareWords extends NoSmoothing_1.NoSmoothing {
        /**
         * Constructor of {@link NoSmoothingWithNonRareWords}
         *
         * @param probability Setter for the probability.
         */
        constructor(probability) {
            super();
            this.probability = probability;
        }
        /**
         * Wrapper function to set the N-gram probabilities with no smoothing and replacing unknown words not found in nonrare words.
         * @param nGram N-Gram for which the probabilities will be set.
         * @param level Level for which N-Gram probabilities will be set. Probabilities for different levels of the
         *              N-gram can be set with this function. If level = 1, N-Gram is treated as UniGram, if level = 2,
         *              N-Gram is treated as Bigram, etc.
         *
         */
        setProbabilitiesWithLevel(nGram, level) {
            this.dictionary = nGram.constructDictionaryWithNonRareWords(level, this.probability);
            nGram.replaceUnknownWords(this.dictionary);
            super.setProbabilitiesWithLevel(nGram, level);
        }
    }
    exports.NoSmoothingWithNonRareWords = NoSmoothingWithNonRareWords;
});
//# sourceMappingURL=NoSmoothingWithNonRareWords.js.map