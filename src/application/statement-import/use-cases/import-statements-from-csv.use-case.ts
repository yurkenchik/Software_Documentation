import { Inject, Injectable } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { FILE_STORAGE_PORT } from '@domain/statement-import/statement-import.tokens';
import type { IFileStoragePort } from '@domain/statement-import/ports/file-storage.port';
import { StatementImportDomainEntity } from '@domain/statement-import/entities/statement-import-domain.entity';
import type { ImportRequestDto } from '@application/statement-import/dto/import-request.dto';
import type { ImportResultDto } from '@application/statement-import/dto/import-result.dto';
import { SiteRowHandler } from '@application/statement-import/strategies/site-row.handler';
import { PostRowHandler } from '@application/statement-import/strategies/post-row.handler';
import { CommentRowHandler } from '@application/statement-import/strategies/comment-row.handler';
import { MediaRowHandler } from '@application/statement-import/strategies/media-row.handler';
import { IRowHandler } from '@domain/statement-import/types';

@Injectable()
export class ImportStatementsFromCsvUseCase {
    private readonly handlers: Array<IRowHandler>;

    constructor(
        @Inject(FILE_STORAGE_PORT)
        private readonly fileStorage: IFileStoragePort,
        private readonly siteRowHandler: SiteRowHandler,
        private readonly postRowHandler: PostRowHandler,
        private readonly commentRowHandler: CommentRowHandler,
        private readonly mediaRowHandler: MediaRowHandler,
    ) {
        this.handlers = [
            this.siteRowHandler,
            this.postRowHandler,
            this.commentRowHandler,
            this.mediaRowHandler,
        ];
    }

    async execute(request: ImportRequestDto): Promise<ImportResultDto> {
        const startedAt = new Date();
        const rows = await this.fileStorage.readCsvRows(request.filePath);
        const totalRows = rows.length;
        const errors: Array<{ row: number; message: string }> = [];
        let importedRows = 0;

        for (let rowIndex = 0; rowIndex < rows.length; rowIndex++) {
            const row = rows[rowIndex];
            const rowType = row[0]?.trim().toLowerCase();
            if (!rowType) {
                errors.push({ row: rowIndex + 1, message: 'Empty row type' });
                continue;
            }

            const handler = this.handlers.find(handler => handler.supports(rowType));
            if (!handler) {
                errors.push({ row: rowIndex + 1, message: `Unsupported row type: ${rowType}` });
                continue;
            }

            try {
                await handler.handle(row);
                importedRows++;
            } catch (error) {
                errors.push({
                    row: rowIndex + 1,
                    message: error instanceof Error ? error.message : String(error),
                });
            }
        }

        const completedAt = new Date();
        const id = randomUUID();

        let importEntity: StatementImportDomainEntity;
        if (errors.length > 0 && importedRows === 0) {
            importEntity = StatementImportDomainEntity.createFailed({
                id,
                filePath: request.filePath,
                startedAt,
                completedAt,
                totalRows,
                importedCount: importedRows,
                errors,
            });
        } else {
            importEntity = StatementImportDomainEntity.createCompleted({
                id,
                filePath: request.filePath,
                startedAt,
                completedAt,
                totalRows,
                importedCount: importedRows,
                errors,
            });
        }

        return {
            totalRows,
            importedRows,
            errors,
            importRun: {
                id: importEntity.id,
                filePath: importEntity.filePath,
                status: importEntity.status,
                startedAt: importEntity.startedAt.toISOString(),
                completedAt: importEntity.completedAt?.toISOString() ?? null,
            },
        };
    }
}
