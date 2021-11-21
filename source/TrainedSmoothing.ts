import {SimpleSmoothing} from "./SimpleSmoothing";
import {NGram} from "./NGram";

export abstract class TrainedSmoothing<Symbol> extends SimpleSmoothing<Symbol>{

    protected abstract learnParameters(corpus: Array<Array<Symbol>>, N: number): void;

    /**
     * Calculates new lower bound.
     * @param current current value.
     * @param currentLowerBound current lower bound
     * @param currentUpperBound current upper bound
     * @param numberOfParts number of parts between lower and upper bound.
     * @return new lower bound
     */
    protected newLowerBound(current: number, currentLowerBound: number, currentUpperBound: number, numberOfParts: number){
        if (current != currentLowerBound){
            return current - (currentUpperBound - currentLowerBound) / numberOfParts;
        } else {
            return current / numberOfParts;
        }
    }

    /**
     * Calculates new upper bound.
     * @param current current value.
     * @param currentLowerBound current lower bound
     * @param currentUpperBound current upper bound
     * @param numberOfParts number of parts between lower and upper bound.
     * @return new upper bound
     */
    protected newUpperBound(current: number, currentLowerBound: number, currentUpperBound: number, numberOfParts: number){
        if (current != currentUpperBound){
            return current + (currentUpperBound - currentLowerBound) / numberOfParts;
        } else {
            return current * numberOfParts;
        }
    }

    /**
     * Wrapper function to learn parameters of the smoothing method and set the N-gram probabilities.
     *
     * @param corpus Train corpus used to optimize parameters of the smoothing method.
     * @param nGram N-Gram for which the probabilities will be set.
     */
    train(corpus: Array<Array<Symbol>>, nGram: NGram<Symbol>){
        this.learnParameters(corpus, nGram.getN());
        this.setProbabilities(nGram);
    }
}