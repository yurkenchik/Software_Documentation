import type { StatementImportStatusType } from '@domain/statement-import/entities/statement-import-domain.entity';

export class ImportResultDto {
    readonly totalRows: number;
    readonly importedRows: number;
    readonly errors: Array<{ row: number; message: string }>;
    readonly importRun: ImportRunDto;
}

export class ImportRunDto {
    readonly id: string;
    readonly filePath: string;
    readonly status: StatementImportStatusType;
    readonly startedAt: string;
    readonly completedAt: string | null;
}