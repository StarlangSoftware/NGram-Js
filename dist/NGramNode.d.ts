import { MultipleFile } from "./MultipleFile";
import { CounterHashMap } from "nlptoolkit-datastructure/dist/CounterHashMap";
export declare class NGramNode<Symbol> {
    private children;
    private symbol;
    private count;
    private probability;
    private probabilityOfUnseen;
    private unknown;
    /**
     * Constructor of {@link NGramNode}
     *
     * @param symbol symbol to be kept in this node.
     * @param multipleFile Multiple file structure to read the nGram.
     */
    constructor(symbol: any, multipleFile?: MultipleFile);
    /**
     * Merges this NGramNode with the corresponding NGramNode in another NGram.
     * @param toBeMerged Parallel NGramNode of the parallel NGram tree.
     */
    merge(toBeMerged: NGramNode<Symbol>): void;
    /**
     * Gets count of this node.
     *
     * @return count of this node.
     */
    getCount(): number;
    /**
     * Gets the size of children of this node.
     *
     * @return size of children of {@link NGramNode} this node.
     */
    size(): number;
    /**
     * Finds maximum occurrence. If height is 0, returns the count of this node.
     * Otherwise, traverses this nodes' children recursively and returns maximum occurrence.
     *
     * @param height height for NGram.
     * @return maximum occurrence.
     */
    maximumOccurrence(height: number): number;
    /**
     * @return sum of counts of children nodes.
     */
    childSum(): number;
    /**
     * Traverses nodes and updates counts of counts for each node.
     *
     * @param countsOfCounts counts of counts of NGrams.
     * @param height         height for NGram. if height = 1, If level = 1, N-Gram is treated as UniGram, if level = 2,
     *                       N-Gram is treated as Bigram, etc.
     */
    updateCountsOfCounts(countsOfCounts: Array<number>, height: number): void;
    /**
     * Sets probabilities by traversing nodes and adding pseudocount for each NGram.
     *
     * @param pseudoCount    pseudocount added to each NGram.
     * @param height         height for NGram. if height = 1, If level = 1, N-Gram is treated as UniGram, if level = 2,
     *                       N-Gram is treated as Bigram, etc.
     * @param vocabularySize size of vocabulary
     */
    setProbabilityWithPseudoCount(pseudoCount: number, height: number, vocabularySize: number): void;
    /**
     * Sets adjusted probabilities with counts of counts of NGrams.
     * For count < 5, count is considered as ((r + 1) * N[r + 1]) / N[r]), otherwise, count is considered as it is.
     * Sum of children counts are computed. Then, probability of a child node is (1 - pZero) * (r / sum) if r > 5
     * otherwise, r is replaced with ((r + 1) * N[r + 1]) / N[r]) and calculated the same.
     *
     * @param N              counts of counts of NGrams.
     * @param height         height for NGram. if height = 1, If level = 1, N-Gram is treated as UniGram, if level = 2,
     *                       N-Gram is treated as Bigram, etc.
     * @param vocabularySize size of vocabulary.
     * @param pZero          probability of zero.
     */
    setAdjustedProbability(N: Array<number>, height: number, vocabularySize: number, pZero: number): void;
    /**
     * Adds count times NGram given as array of symbols to the node as a child.
     *
     * @param s      array of symbols
     * @param index  start index of NGram
     * @param height height for NGram. if height = 1, If level = 1, N-Gram is treated as UniGram, if level = 2,
     *               N-Gram is treated as Bigram, etc.
     * @param count  Number of times this NGram is added.
     */
    addNGram(s: Array<Symbol>, index: number, height: number, count?: number): void;
    /**
     * Gets unigram probability of given symbol.
     *
     * @param w1 unigram.
     * @return unigram probability of given symbol.
     */
    getUniGramProbability(w1: Symbol): number;
    /**
     * Gets bigram probability of given symbols w1 and w2
     *
     * @param w1 first gram of bigram.
     * @param w2 second gram of bigram.
     * @return probability of given bigram
     */
    getBiGramProbability(w1: Symbol, w2: Symbol): number;
    /**
     * Gets trigram probability of given symbols w1, w2 and w3.
     *
     * @param w1 first gram of trigram
     * @param w2 second gram of trigram
     * @param w3 third gram of trigram
     * @return probability of given trigram.
     */
    getTriGramProbability(w1: Symbol, w2: Symbol, w3: Symbol): number;
    /**
     * Counts words recursively given height and wordCounter.
     *
     * @param wordCounter word counter keeping symbols and their counts.
     * @param height      height for NGram. if height = 1, If level = 1, N-Gram is treated as UniGram, if level = 2,
     *                    N-Gram is treated as Bigram, etc.
     */
    countWords(wordCounter: CounterHashMap<Symbol>, height: number): void;
    /**
     * Replace words not in given dictionary.
     * Deletes unknown words from children nodes and adds them to {@link NGramNode#unknown} unknown node as children recursively.
     *
     * @param dictionary dictionary of known words.
     */
    replaceUnknownWords(dictionary: Set<Symbol>): void;
    /**
     * Gets count of symbol given array of symbols and index of symbol in this array.
     *
     * @param s     array of symbols
     * @param index index of symbol whose count is returned
     * @return count of the symbol.
     */
    getCountForSymbols(s: Array<Symbol>, index: number): number;
    /**
     * Generates next string for given list of symbol and index
     *
     * @param s     list of symbol
     * @param index index index of generated string
     * @return generated string.
     */
    generateNextString(s: Array<Symbol>, index: number): Symbol;
    /**
     * Prunes the NGramNode according to the given threshold. Removes the child(ren) whose probability is less than the
     * threshold.
     * @param threshold Threshold for pruning the NGram tree.
     * @param N N in N-Gram.
     */
    prune(threshold: number, N: number): void;
}
