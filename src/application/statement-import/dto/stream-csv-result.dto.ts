export interface StreamCsvRowErrorDto {
    readonly rowIndex: number;
    readonly message: string;
}

export interface StreamCsvResultDto {
    readonly filePath: string;
    readonly totalRows: number;
    readonly writtenRows: number;
    readonly skippedRows: number;
    readonly errors: ReadonlyArray<StreamCsvRowErrorDto>;
    readonly durationMs: number;
    readonly countsByRowType: Readonly<Record<string, number>>;
}
