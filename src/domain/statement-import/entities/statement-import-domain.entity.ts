import { BaseDomainEntity } from '../../../shared/entities/base-domain.entity';

export const StatementImportStatus = {
    Pending: 'pending',
    Running: 'running',
    Completed: 'completed',
    Failed: 'failed',
} as const;

export type StatementImportStatusType =
    (typeof StatementImportStatus)[keyof typeof StatementImportStatus];

export interface StatementImportErrorItem {
    row: number;
    message: string;
}

/**
 * Domain entity for a single file (CSV) statement import run.
 * Tracks file path, timing, status, and result counts.
 */
export class StatementImportDomainEntity extends BaseDomainEntity {
    public readonly filePath: string;
    public readonly startedAt: Date;
    public readonly completedAt: Date | null;
    public readonly status: StatementImportStatusType;
    public readonly totalRows: number;
    public readonly importedCount: number;
    public readonly errors: ReadonlyArray<StatementImportErrorItem>;

    constructor(properties: {
        id: string;
        filePath: string;
        startedAt: Date;
        completedAt: Date | null;
        status: StatementImportStatusType;
        totalRows: number;
        importedCount: number;
        errors: ReadonlyArray<StatementImportErrorItem>;
    }) {
        super(properties.id);
        this.filePath = properties.filePath;
        this.startedAt = properties.startedAt;
        this.completedAt = properties.completedAt;
        this.status = properties.status;
        this.totalRows = properties.totalRows;
        this.importedCount = properties.importedCount;
        this.errors = properties.errors;
    }

    static create(properties: {
        id: string;
        filePath: string;
        startedAt: Date;
        totalRows: number;
    }): StatementImportDomainEntity {
        return new StatementImportDomainEntity({
            ...properties,
            completedAt: null,
            status: StatementImportStatus.Running,
            importedCount: 0,
            errors: [],
        });
    }

    static createCompleted(properties: {
        id: string;
        filePath: string;
        startedAt: Date;
        completedAt: Date;
        totalRows: number;
        importedCount: number;
        errors: ReadonlyArray<StatementImportErrorItem>;
    }): StatementImportDomainEntity {
        return new StatementImportDomainEntity({
            ...properties,
            status: StatementImportStatus.Completed,
        });
    }

    static createFailed(properties: {
        id: string;
        filePath: string;
        startedAt: Date;
        completedAt: Date;
        totalRows: number;
        importedCount: number;
        errors: ReadonlyArray<StatementImportErrorItem>;
    }): StatementImportDomainEntity {
        return new StatementImportDomainEntity({
            ...properties,
            status: StatementImportStatus.Failed,
        });
    }
}
