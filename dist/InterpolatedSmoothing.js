(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "./TrainedSmoothing", "./GoodTuringSmoothing", "./NGram", "nlptoolkit-sampling/dist/KFoldCrossValidation"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.InterpolatedSmoothing = void 0;
    const TrainedSmoothing_1 = require("./TrainedSmoothing");
    const GoodTuringSmoothing_1 = require("./GoodTuringSmoothing");
    const NGram_1 = require("./NGram");
    const KFoldCrossValidation_1 = require("nlptoolkit-sampling/dist/KFoldCrossValidation");
    class InterpolatedSmoothing extends TrainedSmoothing_1.TrainedSmoothing {
        /**
         * Constructor of {@link InterpolatedSmoothing}
         * @param simpleSmoothing smoothing method.
         */
        constructor(simpleSmoothing = new GoodTuringSmoothing_1.GoodTuringSmoothing()) {
            super();
            this.simpleSmoothing = simpleSmoothing;
        }
        /**
         * The algorithm tries to optimize the best lambda for a given corpus. The algorithm uses perplexity on the validation
         * set as the optimization criterion.
         *
         * @param nGrams 10 N-Grams learned for different folds of the corpus. nGrams[i] is the N-Gram trained with i'th train fold of the corpus.
         * @param kFoldCrossValidation Cross-validation data used in training and testing the N-grams.
         * @param lowerBound Initial lower bound for optimizing the best lambda.
         * @return  Best lambda optimized with k-fold crossvalidation.
         */
        learnBestLambda(nGrams, kFoldCrossValidation, lowerBound) {
            let bestPrevious = -1, upperBound = 0.999, bestLambda = (lowerBound + upperBound) / 2;
            let numberOfParts = 5;
            let testFolds = new Array();
            for (let i = 0; i < 10; i++) {
                testFolds.push(kFoldCrossValidation.getTestFold(i));
            }
            while (true) {
                let bestPerplexity = Number.POSITIVE_INFINITY;
                for (let value = lowerBound; value <= upperBound; value += (upperBound - lowerBound) / numberOfParts) {
                    let perplexity = 0;
                    for (let i = 0; i < 10; i++) {
                        nGrams[i].setLambda(value);
                        perplexity += nGrams[i].getPerplexity(testFolds[i]);
                    }
                    if (perplexity < bestPerplexity) {
                        bestPerplexity = perplexity;
                        bestLambda = value;
                    }
                }
                lowerBound = this.newLowerBound(bestLambda, lowerBound, upperBound, numberOfParts);
                upperBound = this.newUpperBound(bestLambda, lowerBound, upperBound, numberOfParts);
                if (bestPrevious != -1) {
                    if (Math.abs(bestPrevious - bestPerplexity) / bestPerplexity < 0.001) {
                        break;
                    }
                }
                bestPrevious = bestPerplexity;
            }
            return bestLambda;
        }
        /**
         * The algorithm tries to optimize the best lambdas (lambda1, lambda2) for a given corpus. The algorithm uses perplexity on the validation
         * set as the optimization criterion.
         *
         * @param nGrams 10 N-Grams learned for different folds of the corpus. nGrams[i] is the N-Gram trained with i'th train fold of the corpus.
         * @param kFoldCrossValidation Cross-validation data used in training and testing the N-grams.
         * @param lowerBound1 Initial lower bound for optimizing the best lambda1.
         * @param lowerBound2 Initial lower bound for optimizing the best lambda2.
         */
        learnBestLambdas(nGrams, kFoldCrossValidation, lowerBound1, lowerBound2) {
            let upperBound1 = 0.999, upperBound2 = 0.999, bestPrevious = -1, bestLambda1 = (lowerBound1 + upperBound1) / 2, bestLambda2 = (lowerBound2 + upperBound2) / 2;
            let numberOfParts = 5;
            let testFolds = new Array();
            for (let i = 0; i < 10; i++) {
                testFolds.push(kFoldCrossValidation.getTestFold(i));
            }
            while (true) {
                let bestPerplexity = Number.POSITIVE_INFINITY;
                for (let value1 = lowerBound1; value1 <= upperBound1; value1 += (upperBound1 - lowerBound1) / numberOfParts) {
                    for (let value2 = lowerBound2; value2 <= upperBound2 && value1 + value2 < 1; value2 += (upperBound2 - lowerBound2) / numberOfParts) {
                        let perplexity = 0;
                        for (let i = 0; i < 10; i++) {
                            nGrams[i].setLambda(value1, value2);
                            perplexity += nGrams[i].getPerplexity(testFolds[i]);
                        }
                        if (perplexity < bestPerplexity) {
                            bestPerplexity = perplexity;
                            bestLambda1 = value1;
                            bestLambda2 = value2;
                        }
                    }
                }
                lowerBound1 = this.newLowerBound(bestLambda1, lowerBound1, upperBound1, numberOfParts);
                upperBound1 = this.newUpperBound(bestLambda1, lowerBound1, upperBound1, numberOfParts);
                lowerBound2 = this.newLowerBound(bestLambda2, lowerBound2, upperBound2, numberOfParts);
                upperBound2 = this.newUpperBound(bestLambda2, lowerBound2, upperBound2, numberOfParts);
                if (bestPrevious != -1) {
                    if (Math.abs(bestPrevious - bestPerplexity) / bestPerplexity < 0.001) {
                        break;
                    }
                }
                bestPrevious = bestPerplexity;
            }
            return [bestLambda1, bestLambda2];
        }
        /**
         * Wrapper function to learn the parameters (lambda1 and lambda2) in interpolated smoothing. The function first creates K NGrams
         * with the train folds of the corpus. Then optimizes lambdas with respect to the test folds of the corpus depending on given N.
         * @param corpus Train corpus used to optimize lambda parameters
         * @param N N in N-Gram.
         */
        learnParameters(corpus, N) {
            if (N <= 1) {
                return;
            }
            let K = 10;
            let nGrams = new Array();
            let kFoldCrossValidation = new KFoldCrossValidation_1.KFoldCrossValidation(corpus, K, 0);
            for (let i = 0; i < K; i++) {
                nGrams[i] = new NGram_1.NGram(kFoldCrossValidation.getTrainFold(i), N);
                for (let j = 2; j <= N; j++) {
                    nGrams[i].calculateNGramProbabilitiesSimpleWithLevel(this.simpleSmoothing, j);
                }
                nGrams[i].calculateNGramProbabilitiesSimpleWithLevel(this.simpleSmoothing, 1);
            }
            if (N == 2) {
                this.lambda1 = this.learnBestLambda(nGrams, kFoldCrossValidation, 0.1);
            }
            else {
                if (N == 3) {
                    let bestLambdas = this.learnBestLambdas(nGrams, kFoldCrossValidation, 0.1, 0.1);
                    this.lambda1 = bestLambdas[0];
                    this.lambda2 = bestLambdas[1];
                }
            }
        }
        /**
         * Wrapper function to set the N-gram probabilities with interpolated smoothing.
         * @param nGram N-Gram for which the probabilities will be set.
         * @param level Level for which N-Gram probabilities will be set. Probabilities for different levels of the
         *              N-gram can be set with this function. If level = 1, N-Gram is treated as UniGram, if level = 2,
         *              N-Gram is treated as Bigram, etc.
         *
         */
        setProbabilitiesWithLevel(nGram, level) {
            for (let j = 2; j <= nGram.getN(); j++) {
                nGram.calculateNGramProbabilitiesSimpleWithLevel(this.simpleSmoothing, j);
            }
            nGram.calculateNGramProbabilitiesSimpleWithLevel(this.simpleSmoothing, 1);
            switch (nGram.getN()) {
                case 2:
                    nGram.setLambda(this.lambda1);
                    break;
                case 3:
                    nGram.setLambda(this.lambda1, this.lambda2);
                    break;
            }
        }
    }
    exports.InterpolatedSmoothing = InterpolatedSmoothing;
});
//# sourceMappingURL=InterpolatedSmoothing.js.map