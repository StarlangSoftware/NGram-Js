(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "./TrainedSmoothing", "./NGram", "nlptoolkit-sampling/dist/KFoldCrossValidation"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.AdditiveSmoothing = void 0;
    const TrainedSmoothing_1 = require("./TrainedSmoothing");
    const NGram_1 = require("./NGram");
    const KFoldCrossValidation_1 = require("nlptoolkit-sampling/dist/KFoldCrossValidation");
    class AdditiveSmoothing extends TrainedSmoothing_1.TrainedSmoothing {
        /**
         * The algorithm tries to optimize the best delta for a given corpus. The algorithm uses perplexity on the validation
         * set as the optimization criterion.
         * @param nGrams 10 N-Grams learned for different folds of the corpus. nGrams[i] is the N-Gram trained with i'th train
         *               fold of the corpus.
         * @param kFoldCrossValidation Cross-validation data used in training and testing the N-grams.
         * @param lowerBound Initial lower bound for optimizing the best delta.
         * @return Best delta optimized with k-fold crossvalidation.
         */
        learnBestDelta(nGrams, kFoldCrossValidation, lowerBound) {
            let bestPrevious = -1;
            let upperBound = 1;
            let bestDelta = (lowerBound + upperBound) / 2;
            let numberOfParts = 5;
            while (true) {
                let bestPerplexity = Number.POSITIVE_INFINITY;
                for (let value = lowerBound; value <= upperBound; value += (upperBound - lowerBound) / numberOfParts) {
                    let perplexity = 0;
                    for (let i = 0; i < 10; i++) {
                        nGrams[i].setProbabilityWithPseudoCount(value, nGrams[i].getN());
                        perplexity += nGrams[i].getPerplexity(kFoldCrossValidation.getTestFold(i));
                    }
                    if (perplexity < bestPerplexity) {
                        bestPerplexity = perplexity;
                        bestDelta = value;
                    }
                }
                lowerBound = this.newLowerBound(bestDelta, lowerBound, upperBound, numberOfParts);
                upperBound = this.newUpperBound(bestDelta, lowerBound, upperBound, numberOfParts);
                if (bestPrevious != -1) {
                    if (Math.abs(bestPrevious - bestPerplexity) / bestPerplexity < 0.001) {
                        break;
                    }
                }
                bestPrevious = bestPerplexity;
            }
            return bestDelta;
        }
        /**
         * Wrapper function to learn the parameter (delta) in additive smoothing. The function first creates K NGrams
         * with the train folds of the corpus. Then optimizes delta with respect to the test folds of the corpus.
         * @param corpus Train corpus used to optimize delta parameter
         * @param N N in N-Gram.
         */
        learnParameters(corpus, N) {
            let K = 10;
            let nGrams = new Array();
            let kFoldCrossValidation = new KFoldCrossValidation_1.KFoldCrossValidation(corpus, K, 0);
            for (let i = 0; i < K; i++) {
                nGrams.push(new NGram_1.NGram(kFoldCrossValidation.getTrainFold(i), N));
            }
            this.delta = this.learnBestDelta(nGrams, kFoldCrossValidation, 0.1);
        }
        /**
         * Wrapper function to set the N-gram probabilities with additive smoothing.
         * @param nGram N-Gram for which the probabilities will be set.
         * @param level Level for which N-Gram probabilities will be set. Probabilities for different levels of the
         *              N-gram can be set with this function. If level = 1, N-Gram is treated as UniGram, if level = 2,
         *              N-Gram is treated as Bigram, etc.
         */
        setProbabilitiesWithLevel(nGram, level) {
            nGram.setProbabilityWithPseudoCount(this.delta, level);
        }
        /**
         * Gets the best delta.
         * @return Learned best delta.
         */
        getDelta() {
            return this.delta;
        }
    }
    exports.AdditiveSmoothing = AdditiveSmoothing;
});
//# sourceMappingURL=AdditiveSmoothing.js.map