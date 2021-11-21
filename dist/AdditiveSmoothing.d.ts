import { TrainedSmoothing } from "./TrainedSmoothing";
import { NGram } from "./NGram";
export declare class AdditiveSmoothing<Symbol> extends TrainedSmoothing<Symbol> {
    /**
     * Additive pseudocount parameter used in Additive Smoothing. The parameter will be learned using 10-fold cross
     * validation.
     */
    private delta;
    /**
     * The algorithm tries to optimize the best delta for a given corpus. The algorithm uses perplexity on the validation
     * set as the optimization criterion.
     * @param nGrams 10 N-Grams learned for different folds of the corpus. nGrams[i] is the N-Gram trained with i'th train
     *               fold of the corpus.
     * @param kFoldCrossValidation Cross-validation data used in training and testing the N-grams.
     * @param lowerBound Initial lower bound for optimizing the best delta.
     * @return Best delta optimized with k-fold crossvalidation.
     */
    private learnBestDelta;
    /**
     * Wrapper function to learn the parameter (delta) in additive smoothing. The function first creates K NGrams
     * with the train folds of the corpus. Then optimizes delta with respect to the test folds of the corpus.
     * @param corpus Train corpus used to optimize delta parameter
     * @param N N in N-Gram.
     */
    protected learnParameters(corpus: Array<Array<Symbol>>, N: number): void;
    /**
     * Wrapper function to set the N-gram probabilities with additive smoothing.
     * @param nGram N-Gram for which the probabilities will be set.
     * @param level Level for which N-Gram probabilities will be set. Probabilities for different levels of the
     *              N-gram can be set with this function. If level = 1, N-Gram is treated as UniGram, if level = 2,
     *              N-Gram is treated as Bigram, etc.
     */
    setProbabilitiesWithLevel(nGram: NGram<Symbol>, level: number): void;
    /**
     * Gets the best delta.
     * @return Learned best delta.
     */
    getDelta(): number;
}
