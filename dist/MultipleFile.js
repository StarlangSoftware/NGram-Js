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
        /**
         * Constructor for {@link MultipleFile} class. Initializes the buffer reader with the first input file
         * from the fileNameList. MultipleFile supports simple multipart file system, where a text file is divided
         * into multiple files.
         * @param args A list of files given as dynamic parameters.
         */
        constructor(...args) {
            this.fileIndex = 0;
            this.fileNameList = args;
            this.contents = new FileContents_1.FileContents(args[this.fileIndex]);
        }
        /**
         * Reads a single line from the current file. If the end of file is reached for the current file,
         * next file is opened and a single line from that file is read. If all files are read, the method
         * returns null.
         * @return Read line from the current file.
         */
        readLine() {
            if (!this.contents.hasNextLine()) {
                this.fileIndex++;
                this.contents = new FileContents_1.FileContents(this.fileNameList[this.fileIndex]);
            }
            return this.contents.readLine();
        }
        /**
         * Checks if the current file has more lines to be read.
         * @returns True if the current file has more lines to be read, false otherwise.
         */
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