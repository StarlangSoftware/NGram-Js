import { SimpleSmoothing } from "./SimpleSmoothing";
import { NGram } from "./NGram";
export declare class LaplaceSmoothing<Symbol> extends SimpleSmoothing<Symbol> {
    private readonly delta;
    /**
     * Constructor for Laplace smoothing. Sets the delta.
     * @param delta Delta value in Laplace smoothing.
     */
    constructor(delta?: number);
    /**
     * Wrapper function to set the N-gram probabilities with laplace smoothing.
     *
     * @param nGram N-Gram for which the probabilities will be set.
     * @param level Level for which N-Gram probabilities will be set. Probabilities for different levels of the
     *              N-gram can be set with this function. If level = 1, N-Gram is treated as UniGram, if level = 2,
     *              N-Gram is treated as Bigram, etc.
     */
    setProbabilitiesWithLevel(nGram: NGram<Symbol>, level: number): void;
}
