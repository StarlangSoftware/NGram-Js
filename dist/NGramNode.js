(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "console"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.NGramNode = void 0;
    const Console = require("console");
    class NGramNode {
        /**
         * Constructor of {@link NGramNode}
         *
         * @param symbol symbol to be kept in this node.
         * @param multipleFile Multiple file structure to read the nGram.
         */
        constructor(symbol, multipleFile = undefined) {
            this.children = undefined;
            this.unknown = undefined;
            if (multipleFile == undefined) {
                this.symbol = symbol;
                this.count = 0;
            }
            else {
                if (!symbol) {
                    this.symbol = multipleFile.readLine().trim();
                }
                let line = multipleFile.readLine().trim();
                let items = line.split(" ");
                if (items.length != 4) {
                    Console.log("Error in line -> " + line);
                }
                this.count = Number(items[0]);
                this.probability = Number(items[1]);
                this.probabilityOfUnseen = Number(items[2]);
                let numberOfChildren = Number(items[3]);
                if (numberOfChildren > 0) {
                    this.children = new Map();
                    for (let i = 0; i < numberOfChildren; i++) {
                        let childNode = new NGramNode(false, multipleFile);
                        this.children.set(childNode.symbol, childNode);
                    }
                }
            }
        }
        merge(toBeMerged) {
            if (this.children != undefined) {
                for (let symbol of this.children.keys()) {
                    if (toBeMerged.children.has(symbol)) {
                        this.children.get(symbol).merge(toBeMerged.children.get(symbol));
                    }
                }
                for (let symbol of toBeMerged.children.keys()) {
                    if (!this.children.has(symbol)) {
                        this.children.set(symbol, toBeMerged.children.get(symbol));
                    }
                }
            }
            this.count += toBeMerged.getCount();
        }
        /**
         * Gets count of this node.
         *
         * @return count of this node.
         */
        getCount() {
            return this.count;
        }
        /**
         * Gets the size of children of this node.
         *
         * @return size of children of {@link NGramNode} this node.
         */
        size() {
            return this.children.size;
        }
        /**
         * Finds maximum occurrence. If height is 0, returns the count of this node.
         * Otherwise, traverses this nodes' children recursively and returns maximum occurrence.
         *
         * @param height height for NGram.
         * @return maximum occurrence.
         */
        maximumOccurrence(height) {
            let max = 0;
            if (height == 0) {
                return this.count;
            }
            else {
                for (let child of this.children.values()) {
                    let current = child.maximumOccurrence(height - 1);
                    if (current > max) {
                        max = current;
                    }
                }
                return max;
            }
        }
        /**
         * @return sum of counts of children nodes.
         */
        childSum() {
            let sum = 0;
            for (let child of this.children.values()) {
                sum += child.count;
            }
            if (this.unknown != undefined) {
                sum += this.unknown.count;
            }
            return sum;
        }
        /**
         * Traverses nodes and updates counts of counts for each node.
         *
         * @param countsOfCounts counts of counts of NGrams.
         * @param height         height for NGram. if height = 1, If level = 1, N-Gram is treated as UniGram, if level = 2,
         *                       N-Gram is treated as Bigram, etc.
         */
        updateCountsOfCounts(countsOfCounts, height) {
            if (height == 0) {
                countsOfCounts[this.count]++;
            }
            else {
                for (let child of this.children.values()) {
                    child.updateCountsOfCounts(countsOfCounts, height - 1);
                }
            }
        }
        /**
         * Sets probabilities by traversing nodes and adding pseudocount for each NGram.
         *
         * @param pseudoCount    pseudocount added to each NGram.
         * @param height         height for NGram. if height = 1, If level = 1, N-Gram is treated as UniGram, if level = 2,
         *                       N-Gram is treated as Bigram, etc.
         * @param vocabularySize size of vocabulary
         */
        setProbabilityWithPseudoCount(pseudoCount, height, vocabularySize) {
            if (height == 1) {
                let sum = this.childSum() + pseudoCount * vocabularySize;
                for (let child of this.children.values()) {
                    child.probability = (child.count + pseudoCount) / sum;
                }
                if (this.unknown != undefined) {
                    this.unknown.probability = (this.unknown.count + pseudoCount) / sum;
                }
                this.probabilityOfUnseen = pseudoCount / sum;
            }
            else {
                for (let child of this.children.values()) {
                    child.setProbabilityWithPseudoCount(pseudoCount, height - 1, vocabularySize);
                }
            }
        }
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
        setAdjustedProbability(N, height, vocabularySize, pZero) {
            if (height == 1) {
                let sum = 0;
                for (let child of this.children.values()) {
                    let r = child.count;
                    if (r <= 5) {
                        let newR = ((r + 1) * N[r + 1]) / N[r];
                        sum += newR;
                    }
                    else {
                        sum += r;
                    }
                }
                for (let child of this.children.values()) {
                    let r = child.count;
                    if (r <= 5) {
                        let newR = ((r + 1) * N[r + 1]) / N[r];
                        child.probability = (1 - pZero) * (newR / sum);
                    }
                    else {
                        child.probability = (1 - pZero) * (r / sum);
                    }
                }
                this.probabilityOfUnseen = pZero / (vocabularySize - this.children.size);
            }
            else {
                for (let child of this.children.values()) {
                    child.setAdjustedProbability(N, height - 1, vocabularySize, pZero);
                }
            }
        }
        /**
         * Adds count times NGram given as array of symbols to the node as a child.
         *
         * @param s      array of symbols
         * @param index  start index of NGram
         * @param height height for NGram. if height = 1, If level = 1, N-Gram is treated as UniGram, if level = 2,
         *               N-Gram is treated as Bigram, etc.
         * @param count  Number of times this NGram is added.
         */
        addNGram(s, index, height, count = undefined) {
            if (count == undefined) {
                this.addNGram(s, index, height, 1);
            }
            else {
                if (height == 0) {
                    return;
                }
                let symbol = s[index];
                let child;
                if (this.children != undefined && this.children.has(symbol)) {
                    //System.out.println("contains " + symbol.toString());
                    child = this.children.get(symbol);
                }
                else {
                    child = new NGramNode(symbol);
                    if (this.children == undefined) {
                        this.children = new Map();
                    }
                    this.children.set(symbol, child);
                }
                child.count += count;
                child.addNGram(s, index + 1, height - 1, count);
            }
        }
        /**
         * Gets unigram probability of given symbol.
         *
         * @param w1 unigram.
         * @return unigram probability of given symbol.
         */
        getUniGramProbability(w1) {
            if (this.children.has(w1)) {
                return this.children.get(w1).probability;
            }
            else {
                if (this.unknown != undefined) {
                    return this.unknown.probability;
                }
                return this.probabilityOfUnseen;
            }
        }
        /**
         * Gets bigram probability of given symbols w1 and w2
         *
         * @param w1 first gram of bigram.
         * @param w2 second gram of bigram.
         * @return probability of given bigram
         */
        getBiGramProbability(w1, w2) {
            if (this.children.has(w1)) {
                let child = this.children.get(w1);
                return child.getUniGramProbability(w2);
            }
            else {
                if (this.unknown != undefined) {
                    return this.unknown.getUniGramProbability(w2);
                }
                throw "UnseenCase";
            }
        }
        /**
         * Gets trigram probability of given symbols w1, w2 and w3.
         *
         * @param w1 first gram of trigram
         * @param w2 second gram of trigram
         * @param w3 third gram of trigram
         * @return probability of given trigram.
         */
        getTriGramProbability(w1, w2, w3) {
            if (this.children.has(w1)) {
                let child = this.children.get(w1);
                return child.getBiGramProbability(w2, w3);
            }
            else {
                if (this.unknown != undefined) {
                    return this.unknown.getBiGramProbability(w2, w3);
                }
                throw "UnseenCase";
            }
        }
        /**
         * Counts words recursively given height and wordCounter.
         *
         * @param wordCounter word counter keeping symbols and their counts.
         * @param height      height for NGram. if height = 1, If level = 1, N-Gram is treated as UniGram, if level = 2,
         *                    N-Gram is treated as Bigram, etc.
         */
        countWords(wordCounter, height) {
            if (height == 0) {
                wordCounter.putNTimes(this.symbol, this.count);
            }
            else {
                for (let child of this.children.values()) {
                    child.countWords(wordCounter, height - 1);
                }
            }
        }
        /**
         * Replace words not in given dictionary.
         * Deletes unknown words from children nodes and adds them to {@link NGramNode#unknown} unknown node as children recursively.
         *
         * @param dictionary dictionary of known words.
         */
        replaceUnknownWords(dictionary) {
            if (this.children != undefined) {
                let childList = new Array();
                for (let symbol of this.children.keys()) {
                    if (!dictionary.has(symbol)) {
                        childList.push(this.children.get(symbol));
                    }
                }
                if (childList.length > 0) {
                    let unknown = new NGramNode(undefined);
                    unknown.children = new Map();
                    let sum = 0;
                    for (let child of childList) {
                        if (child.children != null) {
                            for (let symbol of child.children.keys()) {
                                unknown.children.set(symbol, child.children.get(symbol));
                            }
                        }
                        sum += child.count;
                        this.children.delete(child.symbol);
                    }
                    unknown.count = sum;
                    unknown.replaceUnknownWords(dictionary);
                }
                for (let child of this.children.values()) {
                    child.replaceUnknownWords(dictionary);
                }
            }
        }
        /**
         * Gets count of symbol given array of symbols and index of symbol in this array.
         *
         * @param s     array of symbols
         * @param index index of symbol whose count is returned
         * @return count of the symbol.
         */
        getCountForSymbols(s, index) {
            if (index < s.length) {
                if (this.children.has(s[index])) {
                    return this.children.get(s[index]).getCountForSymbols(s, index + 1);
                }
                else {
                    return 0;
                }
            }
            else {
                return this.getCount();
            }
        }
        /**
         * Generates next string for given list of symbol and index
         *
         * @param s     list of symbol
         * @param index index index of generated string
         * @return generated string.
         */
        generateNextString(s, index) {
            let sum = 0.0;
            if (index == s.length) {
                let prob = Math.random();
                for (let node of this.children.values()) {
                    if (prob < node.probability + sum) {
                        return node.symbol;
                    }
                    else {
                        sum += node.probability;
                    }
                }
            }
            else {
                return this.children.get(s[index]).generateNextString(s, index + 1);
            }
            return undefined;
        }
        prune(threshold, N) {
            if (N == 0) {
                let maxElement = undefined;
                let maxNode = undefined;
                let toBeDeleted = new Array();
                for (let symbol of this.children.keys()) {
                    if (this.children.get(symbol).count / this.count < threshold) {
                        toBeDeleted.push(symbol);
                    }
                    if (maxElement == null || this.children.get(symbol).count > this.children.get(maxElement).count) {
                        maxElement = symbol;
                        maxNode = this.children.get(symbol);
                    }
                }
                for (let symbol of toBeDeleted) {
                    this.children.delete(symbol);
                }
                if (this.children.size == 0) {
                    this.children.set(maxElement, maxNode);
                }
            }
            else {
                for (let node of this.children.values()) {
                    node.prune(threshold, N - 1);
                }
            }
        }
    }
    exports.NGramNode = NGramNode;
});
//# sourceMappingURL=NGramNode.js.map