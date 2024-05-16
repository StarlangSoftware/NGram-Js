import { NGram } from "./NGram";
export declare abstract class SimpleSmoothing<Symbol> {
    abstract setProbabilitiesWithLevel(nGram: NGram<Symbol>, level: number): void;
    /**
     * Calculates the N-Gram probabilities with simple smoothing.
     * @param nGram N-Gram for which simple smoothing calculation is done.
     */
    setProbabilities(nGram: NGram<Symbol>): void;
}
