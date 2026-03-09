import { Injectable } from '@nestjs/common';
import { readFile } from 'node:fs/promises';
import { parse } from 'csv-parse/sync';
import type { IFileStoragePort } from '@domain/statement-import/ports/file-storage.port';

@Injectable()
export class LocalFileStorageAdapter implements IFileStoragePort {
    async readCsvRows(filePath: string): Promise<Array<Array<string>>> {
        const content = await readFile(filePath, 'utf-8');
        // csv-parse typings are not strict; treat the parsed rows as string tuples.
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        const rows = parse(content, { skip_empty_lines: true, relax_column_count: true });
         
        return rows as Array<Array<string>>;
    }
}
