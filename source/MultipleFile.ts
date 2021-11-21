import * as fs from "fs";

export class MultipleFile {

    private fileIndex: number
    private lineIndex: number
    private fileNameList: Array<string>
    private lines: Array<string>

    constructor(... args: Array<any>) {
        this.fileIndex = 0
        this.fileNameList = args
        let data = fs.readFileSync(args[this.fileIndex], 'utf8')
        this.lines = data.split("\n")
        this.lineIndex = 0
    }

    readLine(): string{
        if (this.lineIndex == this.lines.length){
            this.fileIndex++
            let data = fs.readFileSync(this.fileNameList[this.fileIndex], 'utf8')
            this.lines = data.split("\n")
            this.lineIndex = 0
        }
        this.lineIndex++
        return this.lines[this.lineIndex - 1]
    }

    hasNextLine(): boolean {
        return this.fileIndex != this.fileNameList.length - 1 || this.lineIndex != this.lines.length - 1
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