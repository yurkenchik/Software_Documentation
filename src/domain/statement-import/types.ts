export interface IRowHandler {
    supports(rowType: string): boolean;
    handle(row: Array<string>): Promise<void>;
}

