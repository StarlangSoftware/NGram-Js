(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "./SimpleSmoothing", "nlptoolkit-math/dist/Matrix", "nlptoolkit-math/dist/Vector"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.GoodTuringSmoothing = void 0;
    const SimpleSmoothing_1 = require("./SimpleSmoothing");
    const Matrix_1 = require("nlptoolkit-math/dist/Matrix");
    const Vector_1 = require("nlptoolkit-math/dist/Vector");
    class GoodTuringSmoothing extends SimpleSmoothing_1.SimpleSmoothing {
        /**
         * Given counts of counts, this function will calculate the estimated counts of counts c$^*$ with
         * Good-Turing smoothing. First, the algorithm filters the non-zero counts from counts of counts array and constructs
         * c and r arrays. Then it constructs Z_n array with Z_n = (2C_n / (r_{n+1} - r_{n-1})). The algorithm then uses
         * simple linear regression on Z_n values to estimate w_1 and w_0, where log(N[i]) = w_1log(i) + w_0
         * @param countsOfCounts Counts of counts. countsOfCounts[1] is the number of words occurred once in the corpus.
         *                       countsOfCounts[i] is the number of words occurred i times in the corpus.
         * @return Estimated counts of counts array. N[1] is the estimated count for out of vocabulary words.
         */
        linearRegressionOnCountsOfCounts(countsOfCounts) {
            let N = new Array();
            let r = new Array();
            let c = new Array();
            for (let i = 1; i < countsOfCounts.length; i++) {
                if (countsOfCounts[i] != 0) {
                    r.push(i);
                    c.push(countsOfCounts[i]);
                }
            }
            let A = new Matrix_1.Matrix(2, 2);
            let y = new Vector_1.Vector(2, 0);
            for (let i = 0; i < r.length; i++) {
                let xt = Math.log(r[i]);
                let rt;
                if (i == 0) {
                    rt = Math.log(c[i]);
                }
                else {
                    if (i == r.length - 1) {
                        rt = Math.log(c[i] / (r[i] - r[i - 1]));
                    }
                    else {
                        rt = Math.log((2.0 * c[i]) / (r[i + 1] - r[i - 1]));
                    }
                }
                A.addValue(0, 0, 1.0);
                A.addValue(0, 1, xt);
                A.addValue(1, 0, xt);
                A.addValue(1, 1, xt * xt);
                y.addValue(0, rt);
                y.addValue(1, rt * xt);
            }
            A.inverse();
            let w = A.multiplyWithVectorFromRight(y);
            let w0 = w.getValue(0);
            let w1 = w.getValue(1);
            for (let i = 1; i < countsOfCounts.length; i++) {
                N[i] = Math.exp(Math.log(i) * w1 + w0);
            }
            return N;
        }
        /**
         * Wrapper function to set the N-gram probabilities with Good-Turing smoothing. N[1] / \sum_{i=1}^infty N_i is
         * the out of vocabulary probability.
         * @param nGram N-Gram for which the probabilities will be set.
         * @param level Level for which N-Gram probabilities will be set. Probabilities for different levels of the
         *              N-gram can be set with this function. If level = 1, N-Gram is treated as UniGram, if level = 2,
         *              N-Gram is treated as Bigram, etc.
         */
        setProbabilitiesWithLevel(nGram, level) {
            let countsOfCounts = nGram.calculateCountsOfCounts(level);
            let N = this.linearRegressionOnCountsOfCounts(countsOfCounts);
            let sum = 0;
            for (let r = 1; r < countsOfCounts.length; r++) {
                sum += countsOfCounts[r] * r;
            }
            nGram.setAdjustedProbability(N, level, N[1] / sum);
        }
    }
    exports.GoodTuringSmoothing = GoodTuringSmoothing;
});
//# sourceMappingURL=GoodTuringSmoothing.js.map