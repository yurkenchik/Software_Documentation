export interface IRowOutputStrategy {
    write(row: Array<string>): Promise<void>;
    flush?(): Promise<void>;
}
