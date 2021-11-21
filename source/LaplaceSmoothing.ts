import {SimpleSmoothing} from "./SimpleSmoothing";
import {NGram} from "./NGram";

export class LaplaceSmoothing<Symbol> extends SimpleSmoothing<Symbol>{

    private readonly delta: number

    constructor(delta: number = 1.0) {
        super();
        this.delta = delta
    }

    /**
     * Wrapper function to set the N-gram probabilities with laplace smoothing.
     *
     * @param nGram N-Gram for which the probabilities will be set.
     * @param level Level for which N-Gram probabilities will be set. Probabilities for different levels of the
     *              N-gram can be set with this function. If level = 1, N-Gram is treated as UniGram, if level = 2,
     *              N-Gram is treated as Bigram, etc.
     */
    public setProbabilitiesWithLevel(nGram: NGram<Symbol>, level: number){
        nGram.setProbabilityWithPseudoCount(this.delta, level);
    }
}