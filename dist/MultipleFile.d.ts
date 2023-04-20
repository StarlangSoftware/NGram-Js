export declare class MultipleFile {
    private fileIndex;
    private readonly fileNameList;
    private contents;
    constructor(...args: Array<any>);
    readLine(): string;
    hasNextLine(): boolean;
    readCorpus(): Array<Array<string>>;
}
