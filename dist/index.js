var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "./AdditiveSmoothing", "./GoodTuringSmoothing", "./InterpolatedSmoothing", "./LaplaceSmoothing", "./MultipleFile", "./NGram", "./NGramNode", "./NoSmoothing", "./NoSmoothingWithDictionary", "./NoSmoothingWithNonRareWords", "./SimpleSmoothing", "./TrainedSmoothing"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    __exportStar(require("./AdditiveSmoothing"), exports);
    __exportStar(require("./GoodTuringSmoothing"), exports);
    __exportStar(require("./InterpolatedSmoothing"), exports);
    __exportStar(require("./LaplaceSmoothing"), exports);
    __exportStar(require("./MultipleFile"), exports);
    __exportStar(require("./NGram"), exports);
    __exportStar(require("./NGramNode"), exports);
    __exportStar(require("./NoSmoothing"), exports);
    __exportStar(require("./NoSmoothingWithDictionary"), exports);
    __exportStar(require("./NoSmoothingWithNonRareWords"), exports);
    __exportStar(require("./SimpleSmoothing"), exports);
    __exportStar(require("./TrainedSmoothing"), exports);
});
//# sourceMappingURL=index.js.map