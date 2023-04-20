import {FileContents} from "nlptoolkit-util/dist/FileContents";

export class MultipleFile {

    private fileIndex: number
    private readonly fileNameList: Array<string>
    private contents: FileContents

    constructor(... args: Array<any>) {
        this.fileIndex = 0
        this.fileNameList = args
        this.contents = new FileContents(args[this.fileIndex])
    }

    readLine(): string{
        if (!this.contents.hasNextLine()){
            this.fileIndex++
            this.contents = new FileContents(this.fileNameList[this.fileIndex])
        }
        return this.contents.readLine()
    }

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