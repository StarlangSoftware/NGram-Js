import { SimpleSmoothing } from "./SimpleSmoothing";
import { NGram } from "./NGram";
export declare abstract class TrainedSmoothing<Symbol> extends SimpleSmoothing<Symbol> {
    protected abstract learnParameters(corpus: Array<Array<Symbol>>, N: number): void;
    /**
     * Calculates new lower bound.
     * @param current current value.
     * @param currentLowerBound current lower bound
     * @param currentUpperBound current upper bound
     * @param numberOfParts number of parts between lower and upper bound.
     * @return new lower bound
     */
    protected newLowerBound(current: number, currentLowerBound: number, currentUpperBound: number, numberOfParts: number): number;
    /**
     * Calculates new upper bound.
     * @param current current value.
     * @param currentLowerBound current lower bound
     * @param currentUpperBound current upper bound
     * @param numberOfParts number of parts between lower and upper bound.
     * @return new upper bound
     */
    protected newUpperBound(current: number, currentLowerBound: number, currentUpperBound: number, numberOfParts: number): number;
    /**
     * Wrapper function to learn parameters of the smoothing method and set the N-gram probabilities.
     *
     * @param corpus Train corpus used to optimize parameters of the smoothing method.
     * @param nGram N-Gram for which the probabilities will be set.
     */
    train(corpus: Array<Array<Symbol>>, nGram: NGram<Symbol>): void;
}
