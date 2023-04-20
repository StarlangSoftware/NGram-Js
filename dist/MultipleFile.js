(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "nlptoolkit-util/dist/FileContents"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.MultipleFile = void 0;
    const FileContents_1 = require("nlptoolkit-util/dist/FileContents");
    class MultipleFile {
        constructor(...args) {
            this.fileIndex = 0;
            this.fileNameList = args;
            this.contents = new FileContents_1.FileContents(args[this.fileIndex]);
        }
        readLine() {
            if (!this.contents.hasNextLine()) {
                this.fileIndex++;
                this.contents = new FileContents_1.FileContents(this.fileNameList[this.fileIndex]);
            }
            return this.contents.readLine();
        }
        hasNextLine() {
            return this.fileIndex != this.fileNameList.length - 1 || this.contents.hasNextLine();
        }
        readCorpus() {
            let corpus = new Array();
            while (this.hasNextLine()) {
                let words = this.readLine().split(" ");
                corpus.push(words);
            }
            return corpus;
        }
    }
    exports.MultipleFile = MultipleFile;
});
//# sourceMappingURL=MultipleFile.js.map