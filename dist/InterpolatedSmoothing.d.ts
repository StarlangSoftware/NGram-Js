import { TrainedSmoothing } from "./TrainedSmoothing";
import { SimpleSmoothing } from "./SimpleSmoothing";
import { NGram } from "./NGram";
export declare class InterpolatedSmoothing<Symbol> extends TrainedSmoothing<Symbol> {
    private lambda1;
    private lambda2;
    private simpleSmoothing;
    /**
     * Constructor of {@link InterpolatedSmoothing}
     * @param simpleSmoothing smoothing method.
     */
    constructor(simpleSmoothing?: SimpleSmoothing<Symbol>);
    /**
     * The algorithm tries to optimize the best lambda for a given corpus. The algorithm uses perplexity on the validation
     * set as the optimization criterion.
     *
     * @param nGrams 10 N-Grams learned for different folds of the corpus. nGrams[i] is the N-Gram trained with i'th train fold of the corpus.
     * @param kFoldCrossValidation Cross-validation data used in training and testing the N-grams.
     * @param lowerBound Initial lower bound for optimizing the best lambda.
     * @return  Best lambda optimized with k-fold crossvalidation.
     */
    private learnBestLambda;
    /**
     * The algorithm tries to optimize the best lambdas (lambda1, lambda2) for a given corpus. The algorithm uses perplexity on the validation
     * set as the optimization criterion.
     *
     * @param nGrams 10 N-Grams learned for different folds of the corpus. nGrams[i] is the N-Gram trained with i'th train fold of the corpus.
     * @param kFoldCrossValidation Cross-validation data used in training and testing the N-grams.
     * @param lowerBound1 Initial lower bound for optimizing the best lambda1.
     * @param lowerBound2 Initial lower bound for optimizing the best lambda2.
     */
    private learnBestLambdas;
    /**
     * Wrapper function to learn the parameters (lambda1 and lambda2) in interpolated smoothing. The function first creates K NGrams
     * with the train folds of the corpus. Then optimizes lambdas with respect to the test folds of the corpus depending on given N.
     * @param corpus Train corpus used to optimize lambda parameters
     * @param N N in N-Gram.
     */
    protected learnParameters(corpus: Array<Array<Symbol>>, N: number): void;
    /**
     * Wrapper function to set the N-gram probabilities with interpolated smoothing.
     * @param nGram N-Gram for which the probabilities will be set.
     * @param level Level for which N-Gram probabilities will be set. Probabilities for different levels of the
     *              N-gram can be set with this function. If level = 1, N-Gram is treated as UniGram, if level = 2,
     *              N-Gram is treated as Bigram, etc.
     *
     */
    setProbabilitiesWithLevel(nGram: NGram<Symbol>, level: number): void;
}
