(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "fs"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.MultipleFile = void 0;
    const fs = require("fs");
    class MultipleFile {
        constructor(...args) {
            this.fileIndex = 0;
            this.fileNameList = args;
            let data = fs.readFileSync(args[this.fileIndex], 'utf8');
            this.lines = data.split("\n");
            this.lineIndex = 0;
        }
        readLine() {
            if (this.lineIndex == this.lines.length) {
                this.fileIndex++;
                let data = fs.readFileSync(this.fileNameList[this.fileIndex], 'utf8');
                this.lines = data.split("\n");
                this.lineIndex = 0;
            }
            this.lineIndex++;
            return this.lines[this.lineIndex - 1];
        }
        hasNextLine() {
            return this.fileIndex != this.fileNameList.length - 1 || this.lineIndex != this.lines.length - 1;
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