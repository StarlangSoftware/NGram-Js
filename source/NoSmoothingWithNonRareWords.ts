import {NoSmoothing} from "./NoSmoothing";
import {NGram} from "./NGram";

export class NoSmoothingWithNonRareWords<Symbol> extends NoSmoothing<Symbol>{

    private dictionary: Set<Symbol>
    private probability: number

    /**
     * Constructor of {@link NoSmoothingWithNonRareWords}
     *
     * @param probability Setter for the probability.
     */
    constructor(probability: number) {
        super();
        this.probability = probability
    }

    /**
     * Wrapper function to set the N-gram probabilities with no smoothing and replacing unknown words not found in nonrare words.
     * @param nGram N-Gram for which the probabilities will be set.
     * @param level Level for which N-Gram probabilities will be set. Probabilities for different levels of the
     *              N-gram can be set with this function. If level = 1, N-Gram is treated as UniGram, if level = 2,
     *              N-Gram is treated as Bigram, etc.
     *
     */
    public setProbabilitiesWithLevel(nGram: NGram<Symbol>, level: number){
        this.dictionary = nGram.constructDictionaryWithNonRareWords(level, this.probability);
        nGram.replaceUnknownWords(this.dictionary);
        super.setProbabilitiesWithLevel(nGram, level);
    }
}