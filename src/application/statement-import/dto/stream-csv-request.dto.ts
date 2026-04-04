export interface StreamCsvRequestDto {
    readonly filePath: string;
    readonly skipEmptyRows?: boolean;
    readonly rowTypeFilter?: ReadonlyArray<string>;
    readonly continueOnError?: boolean;
}
