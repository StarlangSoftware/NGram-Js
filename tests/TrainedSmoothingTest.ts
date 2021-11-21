import * as assert from "assert";
import {NGram} from "../dist/NGram";
import {MultipleFile} from "../dist/MultipleFile";
import {AdditiveSmoothing} from "../dist/AdditiveSmoothing";
import {InterpolatedSmoothing} from "../dist/InterpolatedSmoothing";

function nearlyEqual(value1: number, value2: number, difference: number) {
    assert.ok(Math.abs(value1 - value2) <= difference)
}

describe('TrainedSmoothingTest', function() {
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
    let validationCorpus = new MultipleFile("validation.txt").readCorpus();
    let testCorpus = new MultipleFile("test.txt").readCorpus();
    describe('AdditiveSmoothingTest', function() {
        let additiveSmoothing = new AdditiveSmoothing<String>();
        complexUniGram.calculateNGramProbabilitiesTrained(validationCorpus, additiveSmoothing);
        let delta1 = additiveSmoothing.getDelta();
        complexBiGram.calculateNGramProbabilitiesTrained(validationCorpus, additiveSmoothing);
        let delta2 = additiveSmoothing.getDelta();
        complexTriGram.calculateNGramProbabilitiesTrained(validationCorpus, additiveSmoothing);
        let delta3 = additiveSmoothing.getDelta();
        it('testPerplexityComplex', function() {
            nearlyEqual(4043.947022, complexUniGram.getPerplexity(testCorpus), 0.0001);
            nearlyEqual(9220.218871, complexBiGram.getPerplexity(testCorpus), 0.0001);
            nearlyEqual(30695.701941, complexTriGram.getPerplexity(testCorpus), 0.0001);
        });
        it('testCalculateNGramProbabilitiesComplex', function() {
            nearlyEqual((20000 + delta1) / (376019.0 + delta1 * (complexUniGram.vocabularySize() + 1)), complexUniGram.getProbability("<s>"), 0.0);
            nearlyEqual((50 + delta1) / (376019.0 + delta1 * (complexUniGram.vocabularySize() + 1)), complexUniGram.getProbability("atatürk"), 0.0);
            nearlyEqual((11 + delta2) / (20000.0 + delta2 * (complexBiGram.vocabularySize() + 1)), complexBiGram.getProbability("<s>", "mustafa"), 0.0);
            nearlyEqual((3 + delta2) / (138.0 + delta2 * (complexBiGram.vocabularySize() + 1)), complexBiGram.getProbability("mustafa", "kemal"), 0.0);
            nearlyEqual((1 + delta3) / (11.0 + delta3 * (complexTriGram.vocabularySize() + 1)), complexTriGram.getProbability("<s>", "mustafa", "kemal"), 0.0);
            nearlyEqual((1 + delta3) / (3.0 + delta3 * (complexTriGram.vocabularySize() + 1)), complexTriGram.getProbability("mustafa", "kemal", "atatürk"), 0.0);
        });
    });
    describe('InterpolatedSmoothingTest', function() {
        let interpolatedSmoothing = new InterpolatedSmoothing<string>();
        complexBiGram.calculateNGramProbabilitiesTrained(validationCorpus, interpolatedSmoothing);
        complexTriGram.calculateNGramProbabilitiesTrained(validationCorpus, interpolatedSmoothing);
        it('testPerplexityComplex', function() {
            nearlyEqual(917.214864, complexBiGram.getPerplexity(testCorpus), 0.0001);
            nearlyEqual(3000.451177, complexTriGram.getPerplexity(testCorpus), 0.0001);
        });
        it('testCalculateNGramProbabilitiesComplex', function() {
            nearlyEqual(0.000418, complexBiGram.getProbability("<s>", "mustafa"), 0.0001);
            nearlyEqual(0.005555, complexBiGram.getProbability("mustafa", "kemal"), 0.0001);
            nearlyEqual(0.014406, complexTriGram.getProbability("<s>", "mustafa", "kemal"), 0.0001);
            nearlyEqual(0.058765, complexTriGram.getProbability("mustafa", "kemal", "atatürk"), 0.0001);
        });
    });
});
