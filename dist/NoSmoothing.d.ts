import { SimpleSmoothing } from "./SimpleSmoothing";
import { NGram } from "./NGram";
export declare class NoSmoothing<Symbol> extends SimpleSmoothing<Symbol> {
    setProbabilitiesWithLevel(nGram: NGram<Symbol>, level: number): void;
}
