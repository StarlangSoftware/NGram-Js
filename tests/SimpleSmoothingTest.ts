import * as assert from "assert";
import {NGram} from "../dist/NGram";
import {MultipleFile} from "../dist/MultipleFile";
import {NoSmoothing} from "../dist/NoSmoothing";
import {LaplaceSmoothing} from "../dist/LaplaceSmoothing";
import {GoodTuringSmoothing} from "../dist/GoodTuringSmoothing";

function nearlyEqual(value1: number, value2: number, difference: number) {
    assert.ok(Math.abs(value1 - value2) <= difference)
}

describe('SimpleSmoothingTest', function() {
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
    describe('NoSmoothingTest', function() {
        let simpleSmoothing = new NoSmoothing<string>();
        simpleUniGram.calculateNGramProbabilitiesSimple(simpleSmoothing);
        simpleBiGram.calculateNGramProbabilitiesSimple(simpleSmoothing);
        simpleTriGram.calculateNGramProbabilitiesSimple(simpleSmoothing);
        complexUniGram.calculateNGramProbabilitiesSimple(simpleSmoothing);
        complexBiGram.calculateNGramProbabilitiesSimple(simpleSmoothing);
        complexTriGram.calculateNGramProbabilitiesSimple(simpleSmoothing);
        it('testPerplexitySimple', function() {
            nearlyEqual(12.318362, simpleUniGram.getPerplexity(simpleCorpus), 0.0001);
            nearlyEqual(1.573148, simpleBiGram.getPerplexity(simpleCorpus), 0.0001);
            nearlyEqual(1.248330, simpleTriGram.getPerplexity(simpleCorpus), 0.0001);
        });
        it('testPerplexityComplex', function() {
            nearlyEqual(3220.299369, complexUniGram.getPerplexity(trainCorpus), 0.0001);
            nearlyEqual(32.362912, complexBiGram.getPerplexity(trainCorpus), 0.0001);
            nearlyEqual(2.025259, complexTriGram.getPerplexity(trainCorpus), 0.0001);
        });
        it('testCalculateNGramProbabilitiesSimple', function() {
            nearlyEqual(5 / 35.0, simpleUniGram.getProbability("<s>"), 0.0);
            nearlyEqual(0.0, simpleUniGram.getProbability("mahmut"), 0.0);
            nearlyEqual(1.0 / 35.0, simpleUniGram.getProbability("kitabı"), 0.0);
            nearlyEqual(4 / 5.0, simpleBiGram.getProbability("<s>", "ali"), 0.0);
            nearlyEqual(0 / 2.0, simpleBiGram.getProbability("ayşe", "ali"), 0.0);
            nearlyEqual(0.0, simpleBiGram.getProbability("mahmut", "ali"), 0.0);
            nearlyEqual(2 / 4.0, simpleBiGram.getProbability("at", "mehmet"), 0.0);
            nearlyEqual(1 / 4.0, simpleTriGram.getProbability("<s>", "ali", "top"), 0.0);
            nearlyEqual(0 / 1.0, simpleTriGram.getProbability("ayşe", "kitabı", "at"), 0.0);
            nearlyEqual(0.0, simpleTriGram.getProbability("ayşe", "topu", "at"), 0.0);
            nearlyEqual(0.0, simpleTriGram.getProbability("mahmut", "evde", "kal"), 0.0);
            nearlyEqual(2 / 3.0, simpleTriGram.getProbability("ali", "topu", "at"), 0.0);
        });
        it('testCalculateNGramProbabilitiesComplex', function() {
            nearlyEqual(20000 / 376019.0, complexUniGram.getProbability("<s>"), 0.0);
            nearlyEqual(50 / 376019.0, complexUniGram.getProbability("atatürk"), 0.0);
            nearlyEqual(11 / 20000.0, complexBiGram.getProbability("<s>", "mustafa"), 0.0);
            nearlyEqual(3 / 138.0, complexBiGram.getProbability("mustafa", "kemal"), 0.0);
            nearlyEqual(1 / 11.0, complexTriGram.getProbability("<s>", "mustafa", "kemal"), 0.0);
            nearlyEqual(1 / 3.0, complexTriGram.getProbability("mustafa", "kemal", "atatürk"), 0.0);
        });
    });
    describe('LaplaceSmoothingTest', function() {
        let simpleSmoothing = new LaplaceSmoothing<string>();
        simpleUniGram.calculateNGramProbabilitiesSimple(simpleSmoothing);
        simpleBiGram.calculateNGramProbabilitiesSimple(simpleSmoothing);
        simpleTriGram.calculateNGramProbabilitiesSimple(simpleSmoothing);
        complexUniGram.calculateNGramProbabilitiesSimple(simpleSmoothing);
        complexBiGram.calculateNGramProbabilitiesSimple(simpleSmoothing);
        complexTriGram.calculateNGramProbabilitiesSimple(simpleSmoothing);
        let testCorpus = new MultipleFile("test.txt").readCorpus();
        it('testPerplexitySimple', function() {
            nearlyEqual(12.809502, simpleUniGram.getPerplexity(simpleCorpus), 0.0001);
            nearlyEqual(6.914532, simpleBiGram.getPerplexity(simpleCorpus), 0.0001);
            nearlyEqual(7.694528, simpleTriGram.getPerplexity(simpleCorpus), 0.0001);
        });
        it('testPerplexityComplex', function() {
            nearlyEqual(4085.763010, complexUniGram.getPerplexity(testCorpus), 0.0001);
            nearlyEqual(24763.660225, complexBiGram.getPerplexity(testCorpus), 0.0001);
            nearlyEqual(49579.187475, complexTriGram.getPerplexity(testCorpus), 0.0001);
        });
        it('testCalculateNGramProbabilitiesSimple', function() {
            nearlyEqual((5 + 1) / (35 + simpleUniGram.vocabularySize() + 1), simpleUniGram.getProbability("<s>"), 0.0);
            nearlyEqual((0 + 1) / (35 + simpleUniGram.vocabularySize() + 1), simpleUniGram.getProbability("mahmut"), 0.0);
            nearlyEqual((1 + 1) / (35 + simpleUniGram.vocabularySize() + 1), simpleUniGram.getProbability("kitabı"), 0.0);
            nearlyEqual((4 + 1) / (5 + simpleBiGram.vocabularySize() + 1), simpleBiGram.getProbability("<s>", "ali"), 0.0);
            nearlyEqual((0 + 1) / (2 + simpleBiGram.vocabularySize() + 1), simpleBiGram.getProbability("ayşe", "ali"), 0.0);
            nearlyEqual(1 / (simpleBiGram.vocabularySize() + 1), simpleBiGram.getProbability("mahmut", "ali"), 0.0);
            nearlyEqual((2 + 1) / (4 + simpleBiGram.vocabularySize() + 1), simpleBiGram.getProbability("at", "mehmet"), 0.0);
            nearlyEqual((1 + 1) / (4.0 + simpleTriGram.vocabularySize() + 1), simpleTriGram.getProbability("<s>", "ali", "top"), 0.0);
            nearlyEqual((0 + 1) / (1.0 + simpleTriGram.vocabularySize() + 1), simpleTriGram.getProbability("ayşe", "kitabı", "at"), 0.0);
            nearlyEqual(1 / (simpleTriGram.vocabularySize() + 1), simpleTriGram.getProbability("ayşe", "topu", "at"), 0.0);
            nearlyEqual(1 / (simpleTriGram.vocabularySize() + 1), simpleTriGram.getProbability("mahmut", "evde", "kal"), 0.0);
            nearlyEqual((2 + 1) / (3.0 + simpleTriGram.vocabularySize() + 1), simpleTriGram.getProbability("ali", "topu", "at"), 0.0);
        });
        it('testCalculateNGramProbabilitiesComplex', function() {
            nearlyEqual((20000 + 1) / (376019.0 + complexUniGram.vocabularySize() + 1), complexUniGram.getProbability("<s>"), 0.0);
            nearlyEqual((50 + 1) / (376019.0 + complexUniGram.vocabularySize() + 1), complexUniGram.getProbability("atatürk"), 0.0);
            nearlyEqual((11 + 1) / (20000.0 + complexBiGram.vocabularySize() + 1), complexBiGram.getProbability("<s>", "mustafa"), 0.0);
            nearlyEqual((3 + 1) / (138.0 + complexBiGram.vocabularySize() + 1), complexBiGram.getProbability("mustafa", "kemal"), 0.0);
            nearlyEqual((1 + 1) / (11.0 + complexTriGram.vocabularySize() + 1), complexTriGram.getProbability("<s>", "mustafa", "kemal"), 0.0);
            nearlyEqual((1 + 1) / (3.0 + complexTriGram.vocabularySize() + 1), complexTriGram.getProbability("mustafa", "kemal", "atatürk"), 0.0);
        });
    });
    describe('GoodTuringSmoothingTest', function() {
        let simpleSmoothing = new GoodTuringSmoothing<string>();
        simpleUniGram.calculateNGramProbabilitiesSimple(simpleSmoothing);
        simpleBiGram.calculateNGramProbabilitiesSimple(simpleSmoothing);
        simpleTriGram.calculateNGramProbabilitiesSimple(simpleSmoothing);
        complexUniGram.calculateNGramProbabilitiesSimple(simpleSmoothing);
        complexBiGram.calculateNGramProbabilitiesSimple(simpleSmoothing);
        complexTriGram.calculateNGramProbabilitiesSimple(simpleSmoothing);
        let testCorpus = new MultipleFile("test.txt").readCorpus();
        it('testPerplexitySimple', function() {
            nearlyEqual(14.500734, simpleUniGram.getPerplexity(simpleCorpus), 0.0001);
            nearlyEqual(2.762526, simpleBiGram.getPerplexity(simpleCorpus), 0.0001);
            nearlyEqual(3.685001, simpleTriGram.getPerplexity(simpleCorpus), 0.0001);
        });
        it('testPerplexityComplex', function() {
            nearlyEqual(1290.97916, complexUniGram.getPerplexity(testCorpus), 0.0001);
            nearlyEqual(8331.518540, complexBiGram.getPerplexity(testCorpus), 0.0001);
            nearlyEqual(39184.430078, complexTriGram.getPerplexity(testCorpus), 0.0001);
        });
        it('testCalculateNGramProbabilitiesSimple', function() {
            nearlyEqual(0.116607, simpleUniGram.getProbability("<s>"), 0.0001);
            nearlyEqual(0.149464, simpleUniGram.getProbability("mahmut"), 0.0001);
            nearlyEqual(0.026599, simpleUniGram.getProbability("kitabı"), 0.0001);
            nearlyEqual(0.492147, simpleBiGram.getProbability("<s>", "ali"), 0.0001);
            nearlyEqual(0.030523, simpleBiGram.getProbability("ayşe", "ali"), 0.0001);
            nearlyEqual(0.0625, simpleBiGram.getProbability("mahmut", "ali"), 0.0001);
            nearlyEqual(0.323281, simpleBiGram.getProbability("at", "mehmet"), 0.0001);
            nearlyEqual(0.049190, simpleTriGram.getProbability("<s>", "ali", "top"), 0.0001);
            nearlyEqual(0.043874, simpleTriGram.getProbability("ayşe", "kitabı", "at"), 0.0001);
            nearlyEqual(0.0625, simpleTriGram.getProbability("ayşe", "topu", "at"), 0.0001);
            nearlyEqual(0.0625, simpleTriGram.getProbability("mahmut", "evde", "kal"), 0.0001);
            nearlyEqual(0.261463, simpleTriGram.getProbability("ali", "topu", "at"), 0.0001);
        });
        it('testCalculateNGramProbabilitiesComplex', function() {
            nearlyEqual(0.050745, complexUniGram.getProbability("<s>"), 0.0001);
            nearlyEqual(0.000126, complexUniGram.getProbability("atatürk"), 0.0001);
            nearlyEqual(0.000497, complexBiGram.getProbability("<s>", "mustafa"), 0.0001);
            nearlyEqual(0.014000, complexBiGram.getProbability("mustafa", "kemal"), 0.0001);
            nearlyEqual(0.061028, complexTriGram.getProbability("<s>", "mustafa", "kemal"), 0.0001);
            nearlyEqual(0.283532, complexTriGram.getProbability("mustafa", "kemal", "atatürk"), 0.0001);
        });
    });
});
