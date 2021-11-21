import { NoSmoothing } from "./NoSmoothing";
import { NGram } from "./NGram";
export declare class NoSmoothingWithNonRareWords<Symbol> extends NoSmoothing<Symbol> {
    private dictionary;
    private probability;
    /**
     * Constructor of {@link NoSmoothingWithNonRareWords}
     *
     * @param probability Setter for the probability.
     */
    constructor(probability: number);
    /**
     * Wrapper function to set the N-gram probabilities with no smoothing and replacing unknown words not found in nonrare words.
     * @param nGram N-Gram for which the probabilities will be set.
     * @param level Level for which N-Gram probabilities will be set. Probabilities for different levels of the
     *              N-gram can be set with this function. If level = 1, N-Gram is treated as UniGram, if level = 2,
     *              N-Gram is treated as Bigram, etc.
     *
     */
    setProbabilitiesWithLevel(nGram: NGram<Symbol>, level: number): void;
}
