import { AuditedDomainEntity } from '../../../shared/entities/audited-domain.entity';

export abstract class ContentDomainEntity extends AuditedDomainEntity {
    public readonly siteId: string;
    private _status: string;

    protected constructor(
        id: string,
        siteId: string,
        createdAt: Date,
        updatedAt: Date,
        status: string,
    ) {
        super(id, createdAt, updatedAt);
        this.siteId = siteId;
        this._status = status;
    }

    getStatus(): string {
        return this._status;
    }

    protected setStatus(status: string, updatedAt: Date): void {
        this._status = status;
        this.touch(updatedAt);
    }
}

