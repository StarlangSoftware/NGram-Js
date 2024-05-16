import { SimpleSmoothing } from "./SimpleSmoothing";
import { NGram } from "./NGram";
export declare class NoSmoothing<Symbol> extends SimpleSmoothing<Symbol> {
    /**
     * Calculates the N-Gram probabilities with no smoothing
     * @param nGram N-Gram for which no smoothing is done.
     * @param level Height of the NGram node.
     */
    setProbabilitiesWithLevel(nGram: NGram<Symbol>, level: number): void;
}
