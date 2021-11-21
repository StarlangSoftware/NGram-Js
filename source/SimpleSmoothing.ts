import {NGram} from "./NGram";

export abstract class SimpleSmoothing<Symbol> {
    public abstract setProbabilitiesWithLevel(nGram: NGram<Symbol>, level: number):void

    public setProbabilities(nGram: NGram<Symbol>){
        this.setProbabilitiesWithLevel(nGram, nGram.getN());
    }
}