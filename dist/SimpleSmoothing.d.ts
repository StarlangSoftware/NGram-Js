import { NGram } from "./NGram";
export declare abstract class SimpleSmoothing<Symbol> {
    abstract setProbabilitiesWithLevel(nGram: NGram<Symbol>, level: number): void;
    setProbabilities(nGram: NGram<Symbol>): void;
}
