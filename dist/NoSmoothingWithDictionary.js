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
    exports.NoSmoothingWithDictionary = void 0;
    const NoSmoothing_1 = require("./NoSmoothing");
    class NoSmoothingWithDictionary extends NoSmoothing_1.NoSmoothing {
        /**
         * Constructor of {@link NoSmoothingWithDictionary}
         * @param dictionary Dictionary to use in smoothing
         */
        constructor(dictionary) {
            super();
            this.dictionary = dictionary;
        }
        /**
         * Wrapper function to set the N-gram probabilities with no smoothing and replacing unknown words not found in {@link HashSet} the dictionary.
         * @param nGram N-Gram for which the probabilities will be set.
         * @param level Level for which N-Gram probabilities will be set. Probabilities for different levels of the
         *              N-gram can be set with this function. If level = 1, N-Gram is treated as UniGram, if level = 2,
         *              N-Gram is treated as Bigram, etc.
         */
        setProbabilitiesWithLevel(nGram, level) {
            nGram.replaceUnknownWords(this.dictionary);
            super.setProbabilitiesWithLevel(nGram, level);
        }
    }
    exports.NoSmoothingWithDictionary = NoSmoothingWithDictionary;
});
//# sourceMappingURL=NoSmoothingWithDictionary.js.map