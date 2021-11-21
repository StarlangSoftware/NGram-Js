export declare class MultipleFile {
    private fileIndex;
    private lineIndex;
    private fileNameList;
    private lines;
    constructor(...args: Array<any>);
    readLine(): string;
    hasNextLine(): boolean;
    readCorpus(): Array<Array<string>>;
}
