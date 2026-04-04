/**
 * Port for file access (statement-import domain). Infrastructure implements (e.g. LocalFileStorageAdapter).
 */
export interface IFileStoragePort {
    readCsvRows(filePath: string): Promise<Array<Array<string>>>;
}
