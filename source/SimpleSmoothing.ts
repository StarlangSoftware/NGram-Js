import {NGram} from "./NGram";

export abstract class SimpleSmoothing<Symbol> {
    public abstract setProbabilitiesWithLevel(nGram: NGram<Symbol>, level: number):void

    /**
     * Calculates the N-Gram probabilities with simple smoothing.
     * @param nGram N-Gram for which simple smoothing calculation is done.
     */
    public setProbabilities(nGram: NGram<Symbol>){
        this.setProbabilitiesWithLevel(nGram, nGram.getN());
    }
}