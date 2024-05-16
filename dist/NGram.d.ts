import { NGramNode } from "./NGramNode";
import { MultipleFile } from "./MultipleFile";
import { TrainedSmoothing } from "./TrainedSmoothing";
import { SimpleSmoothing } from "./SimpleSmoothing";
export declare class NGram<Symbol> {
    rootNode: NGramNode<Symbol>;
    private N;
    private lambda1;
    private lambda2;
    private interpolated;
    private vocabulary;
    private probabilityOfUnseen;
    /**
     * Constructor of {@link NGram} class which takes a {@link Array} corpus and {@link number} size of ngram as input.
     * It adds all sentences of corpus as ngrams.
     *
     * @param args List of the files where NGram is saved.
     */
    constructor(...args: Array<any>);
    /**
     * Reads the header from the input file.
     * @param multipleFile Input file
     */
    readHeader(multipleFile: MultipleFile): void;
    /**
     * Merges current NGram with the given NGram. If N of the two NGram's are not same, it does not
     * merge. Merges first the vocabulary, then the NGram trees.
     * @param toBeMerged NGram to be merged with.
     */
    merge(toBeMerged: NGram<Symbol>): void;
    /**
     *
     * @return size of ngram.
     */
    getN(): number;
    /**
     * Set size of ngram.
     * @param N size of ngram
     */
    setN(N: number): void;
    /**
     * Adds {@link Symbol[]} given array of symbols to {@link Set} the vocabulary and to {@link NGramNode} the rootNode
     *
     * @param symbols {@link Symbol[]} ngram added.
     */
    addNGram(symbols: Array<Symbol>): void;
    /**
     * Adds given sentence count times to {@link Set} the vocabulary and create and add ngrams of the sentence to
     * {@link NGramNode} the rootNode
     *
     * @param symbols {@link Symbol[]} sentence whose ngrams are added.
     * @param count Number of times the sentence will be added.
     */
    addNGramSentence(symbols: Array<Symbol>, count?: number): void;
    /**
     * @return vocabulary size.
     */
    vocabularySize(): number;
    /**
     * Sets lambdas, interpolation ratios, for trigram, bigram and unigram probabilities.
     * ie. lambda1 * trigramProbability + lambda2 * bigramProbability  + (1 - lambda1 - lambda2) * unigramProbability
     *
     * @param lambda1 interpolation ratio for trigram probabilities
     * @param lambda2 interpolation ratio for bigram probabilities
     */
    setLambda(lambda1: number, lambda2?: number): void;
    /**
     * Calculates NGram probabilities using {@link Array} given corpus and {@link TrainedSmoothing} smoothing method.
     *
     * @param corpus corpus for calculating NGram probabilities.
     * @param trainedSmoothing instance of smoothing method for calculating ngram probabilities.
     */
    calculateNGramProbabilitiesTrained(corpus: Array<Array<Symbol>>, trainedSmoothing: TrainedSmoothing<Symbol>): void;
    /**
     * Calculates NGram probabilities using {@link SimpleSmoothing} simple smoothing.
     *
     * @param simpleSmoothing {@link SimpleSmoothing}
     */
    calculateNGramProbabilitiesSimple(simpleSmoothing: SimpleSmoothing<Symbol>): void;
    calculateNGramProbabilitiesSimpleWithLevel(simpleSmoothing: SimpleSmoothing<Symbol>, level: number): void;
    /**
     * Replaces words not in {@link Set} given dictionary.
     *
     * @param dictionary dictionary of known words.
     */
    replaceUnknownWords(dictionary: Set<Symbol>): void;
    /**
     * Constructs a dictionary of nonrare words with given N-Gram level and probability threshold.
     *
     * @param level Level for counting words. Counts for different levels of the N-Gram can be set. If level = 1, N-Gram is treated as UniGram, if level = 2,
     *              N-Gram is treated as Bigram, etc.
     * @param probability probability threshold for nonrare words.
     * @return {@link HashSet} nonrare words.
     */
    constructDictionaryWithNonRareWords(level: number, probability: number): Set<Symbol>;
    /**
     * Calculates unigram perplexity of given corpus. First sums negative log likelihoods of all unigrams in corpus.
     * Then returns exp of average negative log likelihood.
     *
     * @param corpus corpus whose unigram perplexity is calculated.
     *
     * @return unigram perplexity of corpus.
     */
    private getUniGramPerplexity;
    /**
     * Calculates bigram perplexity of given corpus. First sums negative log likelihoods of all bigrams in corpus.
     * Then returns exp of average negative log likelihood.
     *
     * @param corpus corpus whose bigram perplexity is calculated.
     *
     * @return bigram perplexity of given corpus.
     */
    private getBiGramPerplexity;
    /**
     * Calculates trigram perplexity of given corpus. First sums negative log likelihoods of all trigrams in corpus.
     * Then returns exp of average negative log likelihood.
     *
     * @param corpus corpus whose trigram perplexity is calculated.
     * @return trigram perplexity of given corpus.
     */
    private getTriGramPerplexity;
    /**
     * Calculates the perplexity of given corpus depending on N-Gram model (unigram, bigram, trigram, etc.)
     *
     * @param corpus corpus whose perplexity is calculated.
     * @return perplexity of given corpus
     */
    getPerplexity(corpus: Array<Array<Symbol>>): number;
    /**
     * Gets probability of sequence of symbols depending on N in N-Gram. If N is 1, returns unigram probability.
     * If N is 2, if interpolated is true, then returns interpolated bigram and unigram probability, otherwise returns only bigram probability.
     * If N is 3, if interpolated is true, then returns interpolated trigram, bigram and unigram probability, otherwise returns only trigram probability.
     * @param symbols sequence of symbol.
     * @return probability of given sequence.
     */
    getProbability(...symbols: Array<Symbol>): number;
    /**
     * Gets unigram probability of given symbol.
     * @param w1 a unigram symbol.
     * @return probability of given unigram.
     */
    private getUniGramProbability;
    /**
     * Gets bigram probability of given symbols.
     * @param w1 first gram of bigram
     * @param w2 second gram of bigram
     * @return probability of bigram formed by w1 and w2.
     */
    private getBiGramProbability;
    /**
     * Gets trigram probability of given symbols.
     * @param w1 first gram of trigram
     * @param w2 second gram of trigram
     * @param w3 third gram of trigram
     * @return probability of trigram formed by w1, w2, w3.
     */
    private getTriGramProbability;
    /**
     * Gets count of given sequence of symbol.
     * @param symbols sequence of symbol.
     * @return count of symbols.
     */
    getCount(symbols: Array<Symbol>): number;
    /**
     * Sets probabilities by adding pseudocounts given height and pseudocount.
     * @param pseudoCount pseudocount added to all N-Grams.
     * @param height  height for N-Gram. If height= 1, N-Gram is treated as UniGram, if height = 2,
     *                N-Gram is treated as Bigram, etc.
     */
    setProbabilityWithPseudoCount(pseudoCount: number, height: number): void;
    /**
     * Find maximum occurrence in given height.
     * @param height height for occurrences. If height = 1, N-Gram is treated as UniGram, if height = 2,
     *               N-Gram is treated as Bigram, etc.
     * @return maximum occurrence in given height.
     */
    private maximumOccurrence;
    /**
     * Update counts of counts of N-Grams with given counts of counts and given height.
     * @param countsOfCounts updated counts of counts.
     * @param height  height for NGram. If height = 1, N-Gram is treated as UniGram, if height = 2,
     *                N-Gram is treated as Bigram, etc.
     */
    private updateCountsOfCounts;
    /**
     * Calculates counts of counts of NGrams.
     * @param height  height for NGram. If height = 1, N-Gram is treated as UniGram, if height = 2,
     *                N-Gram is treated as Bigram, etc.
     * @return counts of counts of NGrams.
     */
    calculateCountsOfCounts(height: number): Array<number>;
    /**
     * Sets probability with given counts of counts and pZero.
     * @param countsOfCounts counts of counts of NGrams.
     * @param height  height for NGram. If height = 1, N-Gram is treated as UniGram, if height = 2,
     *                N-Gram is treated as Bigram, etc.
     * @param pZero probability of zero.
     */
    setAdjustedProbability(countsOfCounts: Array<number>, height: number, pZero: number): void;
    /**
     * Prunes NGram according to the given threshold. All nodes having a probability less than the threshold will be
     * pruned.
     * @param threshold Probability threshold used for pruning.
     */
    prune(threshold: number): void;
}
