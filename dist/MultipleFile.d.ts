export declare class MultipleFile {
    private fileIndex;
    private readonly fileNameList;
    private contents;
    /**
     * Constructor for {@link MultipleFile} class. Initializes the buffer reader with the first input file
     * from the fileNameList. MultipleFile supports simple multipart file system, where a text file is divided
     * into multiple files.
     * @param args A list of files given as dynamic parameters.
     */
    constructor(...args: Array<any>);
    /**
     * Reads a single line from the current file. If the end of file is reached for the current file,
     * next file is opened and a single line from that file is read. If all files are read, the method
     * returns null.
     * @return Read line from the current file.
     */
    readLine(): string;
    /**
     * Checks if the current file has more lines to be read.
     * @returns True if the current file has more lines to be read, false otherwise.
     */
    hasNextLine(): boolean;
    readCorpus(): Array<Array<string>>;
}
