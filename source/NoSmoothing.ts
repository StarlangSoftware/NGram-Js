import {SimpleSmoothing} from "./SimpleSmoothing";
import {NGram} from "./NGram";

export class NoSmoothing<Symbol> extends SimpleSmoothing<Symbol>{

    public setProbabilitiesWithLevel(nGram: NGram<Symbol>, level: number): void {
        nGram.setProbabilityWithPseudoCount(0.0, level);
    }

}