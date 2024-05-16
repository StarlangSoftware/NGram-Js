import {SimpleSmoothing} from "./SimpleSmoothing";
import {NGram} from "./NGram";

export class NoSmoothing<Symbol> extends SimpleSmoothing<Symbol>{

    /**
     * Calculates the N-Gram probabilities with no smoothing
     * @param nGram N-Gram for which no smoothing is done.
     * @param level Height of the NGram node.
     */
    public setProbabilitiesWithLevel(nGram: NGram<Symbol>, level: number): void {
        nGram.setProbabilityWithPseudoCount(0.0, level);
    }

}