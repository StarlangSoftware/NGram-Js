import {NGramNode} from "./NGramNode";
import {MultipleFile} from "./MultipleFile";
import {CounterHashMap} from "nlptoolkit-datastructure/dist/CounterHashMap";
import * as Console from "console";
import {TrainedSmoothing} from "./TrainedSmoothing";
import {SimpleSmoothing} from "./SimpleSmoothing";

export class NGram<Symbol> {

    rootNode: NGramNode<Symbol>
    private N: number
    private lambda1: number
    private lambda2: number
    private interpolated: boolean = false
    private vocabulary: Set<Symbol>
    private probabilityOfUnseen: Array<number>

    /**
     * Constructor of {@link NGram} class which takes a {@link Array} corpus and {@link number} size of ngram as input.
     * It adds all sentences of corpus as ngrams.
     *
     * @param args List of the files where NGram is saved.
     */
    constructor(...args: Array<any>) {
        if (!isNaN(args[1])){
            this.N = Number(args[1])
            this.vocabulary = new Set<Symbol>()
            this.probabilityOfUnseen = new Array<number>()
            this.rootNode = new NGramNode<Symbol>(undefined)
            for (let i = 0; i < args[0].length; i++){
                this.addNGramSentence(args[0][i])
            }
        } else {
            let multipleFile = new MultipleFile(...args)
            this.readHeader(multipleFile)
            this.rootNode = new NGramNode<Symbol>(true, multipleFile);
        }
    }

    readHeader(multipleFile: MultipleFile){
        let line = multipleFile.readLine();
        let items = line.split(" ");
        this.N = Number(items[0]);
        this.lambda1 = Number(items[1]);
        this.lambda2 = Number(items[2]);
        this.probabilityOfUnseen = new Array<number>()
        line = multipleFile.readLine();
        items = line.split(" ");
        for (let i = 0; i < this.N; i++){
            this.probabilityOfUnseen.push(Number(items[i]));
        }
        this.vocabulary = new Set<Symbol>();
        let vocabularySize = Number(multipleFile.readLine());
        for (let i = 0; i < vocabularySize; i++){
            this.vocabulary.add(<Symbol><unknown>multipleFile.readLine());
        }
    }

    merge(toBeMerged: NGram<Symbol>){
        if (this.N != toBeMerged.getN()){
            return;
        }
        for (let item of toBeMerged.vocabulary.keys()){
            this.vocabulary.add(item);
        }
        this.rootNode.merge(toBeMerged.rootNode);
    }

    /**
     *
     * @return size of ngram.
     */
    getN(): number{
        return this.N
    }

    /**
     * Set size of ngram.
     * @param N size of ngram
     */
    setN(N: number){
        this.N = N
    }

    /**
     * Adds {@link Symbol[]} given array of symbols to {@link Set} the vocabulary and to {@link NGramNode} the rootNode
     *
     * @param symbols {@link Symbol[]} ngram added.
     */
    addNGram(symbols: Array<Symbol>){
        for (let item of symbols){
            this.vocabulary.add(item);
        }
        this.rootNode.addNGram(symbols, 0, this.N);
    }

    /**
     * Adds given sentence count times to {@link Set} the vocabulary and create and add ngrams of the sentence to
     * {@link NGramNode} the rootNode
     *
     * @param symbols {@link Symbol[]} sentence whose ngrams are added.
     * @param count Number of times the sentence will be added.
     */
    addNGramSentence(symbols: Array<Symbol>, count: number = 1){
        for (let item of symbols){
            this.vocabulary.add(item);
        }
        for (let j = 0; j < symbols.length - this.N + 1; j++){
            this.rootNode.addNGram(symbols, j, this.N, count);
        }
    }

    /**
     * @return vocabulary size.
     */
    vocabularySize(): number{
        return this.vocabulary.size
    }

    /**
     * Sets lambdas, interpolation ratios, for trigram, bigram and unigram probabilities.
     * ie. lambda1 * trigramProbability + lambda2 * bigramProbability  + (1 - lambda1 - lambda2) * unigramProbability
     *
     * @param lambda1 interpolation ratio for trigram probabilities
     * @param lambda2 interpolation ratio for bigram probabilities
     */
    setLambda(lambda1: number, lambda2?: number){
        if (this.N == 2){
            this.interpolated = true
            this.lambda1 = lambda1
        } else {
            if (this.N == 3){
                this.interpolated = true
                this.lambda1 = lambda1
                this.lambda2 = lambda2
            }
        }
    }

    /**
     * Calculates NGram probabilities using {@link Array} given corpus and {@link TrainedSmoothing} smoothing method.
     *
     * @param corpus corpus for calculating NGram probabilities.
     * @param trainedSmoothing instance of smoothing method for calculating ngram probabilities.
     */
    calculateNGramProbabilitiesTrained(corpus: Array<Array<Symbol>>, trainedSmoothing: TrainedSmoothing<Symbol>){
        trainedSmoothing.train(corpus, this)
    }

    /**
     * Calculates NGram probabilities using {@link SimpleSmoothing} simple smoothing.
     *
     * @param simpleSmoothing {@link SimpleSmoothing}
     */
    calculateNGramProbabilitiesSimple(simpleSmoothing: SimpleSmoothing<Symbol>){
        simpleSmoothing.setProbabilities(this)
    }

    calculateNGramProbabilitiesSimpleWithLevel(simpleSmoothing: SimpleSmoothing<Symbol>, level: number){
        simpleSmoothing.setProbabilitiesWithLevel(this, level)
    }

    /**
     * Replaces words not in {@link Set} given dictionary.
     *
     * @param dictionary dictionary of known words.
     */
    replaceUnknownWords(dictionary: Set<Symbol>){
        this.rootNode.replaceUnknownWords(dictionary)
    }

    /**
     * Constructs a dictionary of nonrare words with given N-Gram level and probability threshold.
     *
     * @param level Level for counting words. Counts for different levels of the N-Gram can be set. If level = 1, N-Gram is treated as UniGram, if level = 2,
     *              N-Gram is treated as Bigram, etc.
     * @param probability probability threshold for nonrare words.
     * @return {@link HashSet} nonrare words.
     */
    constructDictionaryWithNonRareWords(level: number, probability: number): Set<Symbol>{
        let result = new Set<Symbol>();
        let wordCounter = new CounterHashMap<Symbol>();
        this.rootNode.countWords(wordCounter, level);
        let sum = wordCounter.sumOfCounts();
        for (let symbol of wordCounter.keys()){
            if (wordCounter.get(symbol) / sum > probability){
                result.add(symbol);
            }
        }
        return result;
    }

    /**
     * Calculates unigram perplexity of given corpus. First sums negative log likelihoods of all unigrams in corpus.
     * Then returns exp of average negative log likelihood.
     *
     * @param corpus corpus whose unigram perplexity is calculated.
     *
     * @return unigram perplexity of corpus.
     */
    private getUniGramPerplexity(corpus: Array<Array<Symbol>>): number{
        let sum = 0;
        let count = 0;
        for (let symbols of corpus) {
            for (let symbol of symbols) {
                let p = this.getProbability(symbol);
                sum -= Math.log(p);
                count++;
            }
        }
        return Math.exp(sum / count);
    }

    /**
     * Calculates bigram perplexity of given corpus. First sums negative log likelihoods of all bigrams in corpus.
     * Then returns exp of average negative log likelihood.
     *
     * @param corpus corpus whose bigram perplexity is calculated.
     *
     * @return bigram perplexity of given corpus.
     */
    private getBiGramPerplexity(corpus: Array<Array<Symbol>>): number{
        let sum = 0;
        let count = 0;
        for (let symbols of corpus) {
            for (let j = 0; j < symbols.length - 1; j++) {
                let p = this.getProbability(symbols[j], symbols[j + 1]);
                if (p == 0) {
                    Console.log("Zero probability");
                }
                sum -= Math.log(p);
                count++;
            }
        }
        return Math.exp(sum / count);
    }

    /**
     * Calculates trigram perplexity of given corpus. First sums negative log likelihoods of all trigrams in corpus.
     * Then returns exp of average negative log likelihood.
     *
     * @param corpus corpus whose trigram perplexity is calculated.
     * @return trigram perplexity of given corpus.
     */
    private getTriGramPerplexity(corpus: Array<Array<Symbol>>): number{
        let sum = 0;
        let count = 0;
        for (let symbols of corpus) {
            for (let j = 0; j < symbols.length - 2; j++) {
                let p = this.getProbability(symbols[j], symbols[j + 1], symbols[j + 2]);
                sum -= Math.log(p);
                count++;
            }
        }
        return Math.exp(sum / count);
    }

    /**
     * Calculates the perplexity of given corpus depending on N-Gram model (unigram, bigram, trigram, etc.)
     *
     * @param corpus corpus whose perplexity is calculated.
     * @return perplexity of given corpus
     */
    getPerplexity(corpus: Array<Array<Symbol>>): number{
        switch (this.N){
            case 1:
                return this.getUniGramPerplexity(corpus);
            case 2:
                return this.getBiGramPerplexity(corpus);
            case 3:
                return this.getTriGramPerplexity(corpus);
            default:
                return 0;
        }
    }

    /**
     * Gets probability of sequence of symbols depending on N in N-Gram. If N is 1, returns unigram probability.
     * If N is 2, if interpolated is true, then returns interpolated bigram and unigram probability, otherwise returns only bigram probability.
     * If N is 3, if interpolated is true, then returns interpolated trigram, bigram and unigram probability, otherwise returns only trigram probability.
     * @param symbols sequence of symbol.
     * @return probability of given sequence.
     */
    getProbability(... symbols: Array<Symbol>): number{
        switch (this.N){
            case 1:
                return this.getUniGramProbability(symbols[0]);
            case 2:
                if (symbols.length == 1){
                    return this.getUniGramProbability(symbols[0]);
                }
                if (this.interpolated){
                    return this.lambda1 * this.getBiGramProbability(symbols[0], symbols[1])
                        + (1 - this.lambda1) * this.getUniGramProbability(symbols[1]);
                } else {
                    return this.getBiGramProbability(symbols[0], symbols[1]);
                }
            case 3:
                if (symbols.length == 1){
                    return this.getUniGramProbability(symbols[0]);
                } else {
                    if (symbols.length == 2){
                        return this.getBiGramProbability(symbols[0], symbols[1]);
                    }
                }
                if (this.interpolated){
                    return this.lambda1 * this.getTriGramProbability(symbols[0], symbols[1], symbols[2])
                        + this.lambda2 * this.getBiGramProbability(symbols[1], symbols[2])
                        + (1 - this.lambda1 - this.lambda2) * this.getUniGramProbability(symbols[2]);
                } else {
                    return this.getTriGramProbability(symbols[0], symbols[1], symbols[2]);
                }
        }
        return 0.0;
    }

    /**
     * Gets unigram probability of given symbol.
     * @param w1 a unigram symbol.
     * @return probability of given unigram.
     */
    private getUniGramProbability(w1: Symbol): number{
        return this.rootNode.getUniGramProbability(w1);
    }

    /**
     * Gets bigram probability of given symbols.
     * @param w1 first gram of bigram
     * @param w2 second gram of bigram
     * @return probability of bigram formed by w1 and w2.
     */
    private getBiGramProbability(w1: Symbol, w2: Symbol): number{
        try {
            return this.rootNode.getBiGramProbability(w1, w2);
        } catch {
            return this.probabilityOfUnseen[1];
        }
    }

    /**
     * Gets trigram probability of given symbols.
     * @param w1 first gram of trigram
     * @param w2 second gram of trigram
     * @param w3 third gram of trigram
     * @return probability of trigram formed by w1, w2, w3.
     */
    private getTriGramProbability(w1: Symbol, w2: Symbol, w3: Symbol){
        try {
            return this.rootNode.getTriGramProbability(w1, w2, w3);
        } catch  {
            return this.probabilityOfUnseen[2];
        }
    }

    /**
     * Gets count of given sequence of symbol.
     * @param symbols sequence of symbol.
     * @return count of symbols.
     */
    getCount(symbols: Array<Symbol>): number{
        return this.rootNode.getCountForSymbols(symbols, 0)
    }

    /**
     * Sets probabilities by adding pseudocounts given height and pseudocount.
     * @param pseudoCount pseudocount added to all N-Grams.
     * @param height  height for N-Gram. If height= 1, N-Gram is treated as UniGram, if height = 2,
     *                N-Gram is treated as Bigram, etc.
     */
    setProbabilityWithPseudoCount(pseudoCount: number, height: number){
        let vocabularySize
        if (pseudoCount != 0){
            vocabularySize = this.vocabularySize() + 1;
        } else {
            vocabularySize = this.vocabularySize();
        }
        this.rootNode.setProbabilityWithPseudoCount(pseudoCount, height, vocabularySize);
        if (pseudoCount != 0){
            this.probabilityOfUnseen[height - 1] = 1.0 / vocabularySize;
        } else {
            this.probabilityOfUnseen[height - 1] = 0.0;
        }
    }

    /**
     * Find maximum occurrence in given height.
     * @param height height for occurrences. If height = 1, N-Gram is treated as UniGram, if height = 2,
     *               N-Gram is treated as Bigram, etc.
     * @return maximum occurrence in given height.
     */
    private maximumOccurrence(height: number): number{
        return this.rootNode.maximumOccurrence(height);
    }

    /**
     * Update counts of counts of N-Grams with given counts of counts and given height.
     * @param countsOfCounts updated counts of counts.
     * @param height  height for NGram. If height = 1, N-Gram is treated as UniGram, if height = 2,
     *                N-Gram is treated as Bigram, etc.
     */
    private updateCountsOfCounts(countsOfCounts: Array<number>, height: number){
        this.rootNode.updateCountsOfCounts(countsOfCounts, height);
    }

    /**
     * Calculates counts of counts of NGrams.
     * @param height  height for NGram. If height = 1, N-Gram is treated as UniGram, if height = 2,
     *                N-Gram is treated as Bigram, etc.
     * @return counts of counts of NGrams.
     */
    calculateCountsOfCounts(height: number): Array<number>{
        let maxCount = this.maximumOccurrence(height);
        let countsOfCounts = new Array<number>()
        for (let i = 0; i < maxCount + 2; i++){
            countsOfCounts.push(0)
        }
        this.updateCountsOfCounts(countsOfCounts, height);
        return countsOfCounts;
    }

    /**
     * Sets probability with given counts of counts and pZero.
     * @param countsOfCounts counts of counts of NGrams.
     * @param height  height for NGram. If height = 1, N-Gram is treated as UniGram, if height = 2,
     *                N-Gram is treated as Bigram, etc.
     * @param pZero probability of zero.
     */
    setAdjustedProbability(countsOfCounts: Array<number>, height: number, pZero: number){
        this.rootNode.setAdjustedProbability(countsOfCounts, height, this.vocabularySize() + 1, pZero);
        this.probabilityOfUnseen[height - 1] = 1.0 / (this.vocabularySize() + 1);
    }

    prune(threshold: number){
        if (threshold > 0.0 && threshold <= 1.0){
            this.rootNode.prune(threshold, this.N - 1);
        }
    }
}