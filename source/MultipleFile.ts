import {FileContents} from "nlptoolkit-util/dist/FileContents";

export class MultipleFile {

    private fileIndex: number
    private readonly fileNameList: Array<string>
    private contents: FileContents

    /**
     * Constructor for {@link MultipleFile} class. Initializes the buffer reader with the first input file
     * from the fileNameList. MultipleFile supports simple multipart file system, where a text file is divided
     * into multiple files.
     * @param args A list of files given as dynamic parameters.
     */
    constructor(... args: Array<any>) {
        this.fileIndex = 0
        this.fileNameList = args
        this.contents = new FileContents(args[this.fileIndex])
    }

    /**
     * Reads a single line from the current file. If the end of file is reached for the current file,
     * next file is opened and a single line from that file is read. If all files are read, the method
     * returns null.
     * @return Read line from the current file.
     */
    readLine(): string{
        if (!this.contents.hasNextLine()){
            this.fileIndex++
            this.contents = new FileContents(this.fileNameList[this.fileIndex])
        }
        return this.contents.readLine()
    }

    /**
     * Checks if the current file has more lines to be read.
     * @returns True if the current file has more lines to be read, false otherwise.
     */
    hasNextLine(): boolean {
        return this.fileIndex != this.fileNameList.length - 1 || this.contents.hasNextLine()
    }

    readCorpus(): Array<Array<string>>{
        let corpus = new Array<Array<string>>()
        while (this.hasNextLine()){
            let words = this.readLine().split(" ");
            corpus.push(words);
        }
        return corpus;
    }
}