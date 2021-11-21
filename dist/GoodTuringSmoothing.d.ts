import { SimpleSmoothing } from "./SimpleSmoothing";
import { NGram } from "./NGram";
export declare class GoodTuringSmoothing<Symbol> extends SimpleSmoothing<Symbol> {
    /**
     * Given counts of counts, this function will calculate the estimated counts of counts c$^*$ with
     * Good-Turing smoothing. First, the algorithm filters the non-zero counts from counts of counts array and constructs
     * c and r arrays. Then it constructs Z_n array with Z_n = (2C_n / (r_{n+1} - r_{n-1})). The algorithm then uses
     * simple linear regression on Z_n values to estimate w_1 and w_0, where log(N[i]) = w_1log(i) + w_0
     * @param countsOfCounts Counts of counts. countsOfCounts[1] is the number of words occurred once in the corpus.
     *                       countsOfCounts[i] is the number of words occurred i times in the corpus.
     * @return Estimated counts of counts array. N[1] is the estimated count for out of vocabulary words.
     */
    private linearRegressionOnCountsOfCounts;
    /**
     * Wrapper function to set the N-gram probabilities with Good-Turing smoothing. N[1] / \sum_{i=1}^infty N_i is
     * the out of vocabulary probability.
     * @param nGram N-Gram for which the probabilities will be set.
     * @param level Level for which N-Gram probabilities will be set. Probabilities for different levels of the
     *              N-gram can be set with this function. If level = 1, N-Gram is treated as UniGram, if level = 2,
     *              N-Gram is treated as Bigram, etc.
     */
    setProbabilitiesWithLevel(nGram: NGram<Symbol>, level: number): void;
}
