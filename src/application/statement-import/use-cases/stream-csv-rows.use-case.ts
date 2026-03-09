import { Inject, Injectable } from '@nestjs/common';
import {
    FILE_STORAGE_PORT,
    ROW_OUTPUT_STRATEGY,
} from '@domain/statement-import/statement-import.tokens';
import type { IFileStoragePort } from '@domain/statement-import/ports/file-storage.port';
import type { IRowOutputStrategy } from '@domain/statement-import/ports/row-output-strategy.port';
import type { StreamCsvRequestDto } from '@application/statement-import/dto/stream-csv-request.dto';
import type { StreamCsvResultDto } from '@application/statement-import/dto/stream-csv-result.dto';

const DEFAULT_SKIP_EMPTY = true;
const DEFAULT_CONTINUE_ON_ERROR = true;

@Injectable()
export class StreamCsvRowsUseCase {
    constructor(
        @Inject(FILE_STORAGE_PORT)
        private readonly fileStorage: IFileStoragePort,
        @Inject(ROW_OUTPUT_STRATEGY)
        private readonly outputStrategy: IRowOutputStrategy,
    ) {}

    async execute(
        streamCsvRequestDto: string | StreamCsvRequestDto
    ): Promise<StreamCsvResultDto> {
        const requestOptions = this.normalizeRequest(streamCsvRequestDto);
        const startedAt = Date.now();

        const rows = await this.fileStorage.readCsvRows(requestOptions.filePath);

        const skipEmpty = requestOptions.skipEmptyRows ?? DEFAULT_SKIP_EMPTY;
        const typeFilter = requestOptions.rowTypeFilter?.length
            ? new Set(requestOptions.rowTypeFilter.map(type => type.trim().toLowerCase()))
            : null;
        const continueOnError = requestOptions.continueOnError ?? DEFAULT_CONTINUE_ON_ERROR;

        const errors: Array<{ rowIndex: number; message: string }> = [];
        const countsByRowType: Record<string, number> = {};

        let writtenRows = 0;
        let skippedRows = 0;

        for (let rowIndex = 0; rowIndex < rows.length; rowIndex++) {
            const row = rows[rowIndex];
            const rowType = (row[0] ?? '').trim().toLowerCase();

            if (skipEmpty && this.isEmptyRow(row)) {
                skippedRows++;
                continue;
            }

            if (typeFilter !== null && rowType !== '' && !typeFilter.has(rowType)) {
                skippedRows++;
                continue;
            }

            if (rowType !== '') {
                countsByRowType[rowType] = (countsByRowType[rowType] ?? 0) + 1;
            }

            try {
                await this.outputStrategy.write(row);
                writtenRows++;
            } catch (error: unknown) {
                const message = error instanceof Error ? error.message : String(error);
                errors.push({ rowIndex: rowIndex + 1, message });
                if (!continueOnError) {
                    throw error;
                }
            }
        }

        if (typeof this.outputStrategy.flush === 'function') {
            await this.outputStrategy.flush();
        }

        const durationMs = Date.now() - startedAt;

        return {
            filePath: requestOptions.filePath,
            totalRows: rows.length,
            writtenRows,
            skippedRows,
            errors,
            durationMs,
            countsByRowType,
        };
    }

    private normalizeRequest(
        request: string | StreamCsvRequestDto,
    ): Required<Pick<StreamCsvRequestDto, 'filePath' | 'skipEmptyRows' | 'continueOnError'>> &
        Pick<StreamCsvRequestDto, 'rowTypeFilter'> {
        if (typeof request === 'string') {
            return {
                filePath: request,
                skipEmptyRows: DEFAULT_SKIP_EMPTY,
                continueOnError: DEFAULT_CONTINUE_ON_ERROR,
                rowTypeFilter: undefined,
            };
        }

        return {
            filePath: request.filePath,
            skipEmptyRows: request.skipEmptyRows ?? DEFAULT_SKIP_EMPTY,
            continueOnError: request.continueOnError ?? DEFAULT_CONTINUE_ON_ERROR,
            rowTypeFilter: request.rowTypeFilter,
        };
    }

    private isEmptyRow(row: Array<string>): boolean {
        if (!row.length) {
            return true;
        }
        return row.every((cell) => (cell ?? '').trim() === '');
    }
}
