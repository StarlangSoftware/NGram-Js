import * as assert from "assert";
import {NGram} from "../dist/NGram";
import {MultipleFile} from "../dist/MultipleFile";

describe('NGramTest', function() {
    describe('NGramTest', function() {
        let text1 = ["<s>", "ali", "topu", "at", "mehmet", "ayşeye", "gitti", "</s>"]
        let text2 = ["<s>", "ali", "top", "at", "ayşe", "eve", "gitti", "</s>"]
        let text3 = ["<s>", "ayşe", "kitabı", "ver", "</s>"]
        let text4 = ["<s>", "ali", "topu", "mehmete", "at", "</s>"]
        let text5 = ["<s>", "ali", "topu", "at", "mehmet", "ayşeyle", "gitti", "</s>"]
        let simpleCorpus = [text1, text2, text3, text4, text5]
        let simpleUniGram = new NGram<string>(simpleCorpus, 1);
        let simpleBiGram = new NGram<string>(simpleCorpus, 2);
        let simpleTriGram = new NGram<string>(simpleCorpus, 3);
        let trainCorpus = new MultipleFile("train.txt").readCorpus();
        let complexUniGram = new NGram<string>(trainCorpus, 1);
        let complexBiGram = new NGram<string>(trainCorpus, 2);
        let complexTriGram = new NGram<string>(trainCorpus, 3);
        it('testGetCountSimple', function() {
            assert.strictEqual(5, simpleUniGram.getCount(["<s>"]));
            assert.strictEqual(0, simpleUniGram.getCount(["mahmut"]));
            assert.strictEqual(1, simpleUniGram.getCount(["kitabı"]));
            assert.strictEqual(4, simpleBiGram.getCount(["<s>", "ali"]));
            assert.strictEqual(0, simpleBiGram.getCount(["ayşe", "ali"]));
            assert.strictEqual(0, simpleBiGram.getCount(["mahmut", "ali"]));
            assert.strictEqual(2, simpleBiGram.getCount(["at", "mehmet"]));
            assert.strictEqual(1, simpleTriGram.getCount(["<s>", "ali", "top"]));
            assert.strictEqual(0, simpleTriGram.getCount(["ayşe", "kitabı", "at"]));
            assert.strictEqual(0, simpleTriGram.getCount(["ayşe", "topu", "at"]));
            assert.strictEqual(0, simpleTriGram.getCount(["mahmut", "evde", "kal"]));
            assert.strictEqual(2, simpleTriGram.getCount(["ali", "topu", "at"]));
        });
        it('testGetCountComplex', function() {
            assert.strictEqual(20000, complexUniGram.getCount(["<s>"]))
            assert.strictEqual(50, complexUniGram.getCount(["atatürk"]))
            assert.strictEqual(11, complexBiGram.getCount(["<s>", "mustafa"]))
            assert.strictEqual(3, complexBiGram.getCount(["mustafa", "kemal"]))
            assert.strictEqual(1, complexTriGram.getCount(["<s>", "mustafa", "kemal"]))
            assert.strictEqual(1, complexTriGram.getCount(["mustafa", "kemal", "atatürk"]))
        });
        it('testVocabularySizeSimple', function() {
            assert.strictEqual(15, simpleUniGram.vocabularySize());
        });
        it('testVocabularySizeComplex', function() {
            assert.strictEqual(57625, complexUniGram.vocabularySize());
            complexUniGram = new NGram<string>(new MultipleFile("test.txt").readCorpus(), 1);
            assert.strictEqual(55485, complexUniGram.vocabularySize());
            complexUniGram = new NGram<string>(new MultipleFile("validation.txt").readCorpus(), 1);
            assert.strictEqual(35663, complexUniGram.vocabularySize());
        });
        it('testPrune', function() {
            simpleBiGram.prune(0.0);
            assert.strictEqual(4, simpleBiGram.getCount(["<s>", "ali"]));
            assert.strictEqual(1, simpleBiGram.getCount(["<s>", "ayşe"]));
            assert.strictEqual(3, simpleBiGram.getCount(["ali", "topu"]));
            assert.strictEqual(1, simpleBiGram.getCount(["ali", "top"]));
            assert.strictEqual(2, simpleBiGram.getCount(["topu", "at"]));
            assert.strictEqual(1, simpleBiGram.getCount(["topu", "mehmete"]));
            simpleBiGram.prune(0.6);
            assert.strictEqual(4, simpleBiGram.getCount(["<s>", "ali"]));
            assert.strictEqual(0, simpleBiGram.getCount(["<s>", "ayşe"]));
            assert.strictEqual(3, simpleBiGram.getCount(["ali", "topu"]));
            assert.strictEqual(0, simpleBiGram.getCount(["ali", "top"]));
            assert.strictEqual(2, simpleBiGram.getCount(["topu", "at"]));
            assert.strictEqual(0, simpleBiGram.getCount(["topu", "mehmete"]));
            simpleBiGram.prune(0.7);
            assert.strictEqual(4, simpleBiGram.getCount(["<s>", "ali"]));
            assert.strictEqual(3, simpleBiGram.getCount(["ali", "topu"]));
            assert.strictEqual(2, simpleBiGram.getCount(["topu", "at"]));
            simpleBiGram.prune(0.8);
            assert.strictEqual(4, simpleBiGram.getCount(["<s>", "ali"]));
            assert.strictEqual(3, simpleBiGram.getCount(["ali", "topu"]));
            simpleBiGram.prune(0.9);
            assert.strictEqual(4, simpleBiGram.getCount(["<s>", "ali"]));
        });
        it('testMerge', function() {
            simpleUniGram = new NGram<string>("simple1a.txt");
            simpleUniGram.merge(new NGram<string>("simple1b.txt"));
            assert.strictEqual(18, simpleUniGram.vocabularySize());
            simpleBiGram = new NGram<string>("simple2a.txt");
            simpleBiGram.merge(new NGram<string>("simple2b.txt"));
            simpleBiGram.merge(new NGram<string>("simple2c.txt"));
            simpleBiGram.merge(new NGram<string>("simple2d.txt"));
            assert.strictEqual(21, simpleBiGram.vocabularySize());
            simpleTriGram = new NGram<string>("simple3a.txt");
            simpleTriGram.merge(new NGram<string>("simple3b.txt"));
            simpleTriGram.merge(new NGram<string>("simple3c.txt"));
            assert.strictEqual(20, simpleTriGram.vocabularySize());
        });
        it('testLoadMultiPart', function() {
            simpleUniGram = new NGram<string>("simple1part1.txt", "simple1part2.txt");
            simpleBiGram = new NGram<string>("simple2part1.txt", "simple2part2.txt", "simple2part3.txt");
            simpleTriGram = new NGram<string>("simple3part1.txt", "simple3part2.txt", "simple3part3.txt", "simple3part4.txt");
            assert.strictEqual(5, simpleUniGram.getCount(["<s>"]));
            assert.strictEqual(0, simpleUniGram.getCount(["mahmut"]));
            assert.strictEqual(1, simpleUniGram.getCount(["kitabı"]));
            assert.strictEqual(4, simpleBiGram.getCount(["<s>", "ali"]));
            assert.strictEqual(0, simpleBiGram.getCount(["ayşe", "ali"]));
            assert.strictEqual(0, simpleBiGram.getCount(["mahmut", "ali"]));
            assert.strictEqual(2, simpleBiGram.getCount(["at", "mehmet"]));
            assert.strictEqual(1, simpleTriGram.getCount(["<s>", "ali", "top"]));
            assert.strictEqual(0, simpleTriGram.getCount(["ayşe", "kitabı", "at"]));
            assert.strictEqual(0, simpleTriGram.getCount(["ayşe", "topu", "at"]));
            assert.strictEqual(0, simpleTriGram.getCount(["mahmut", "evde", "kal"]));
            assert.strictEqual(2, simpleTriGram.getCount(["ali", "topu", "at"]));
            assert.strictEqual(15, simpleUniGram.vocabularySize());
        });
    });
});
