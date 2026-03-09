import { BaseDomainEntity } from './base-domain.entity';

export abstract class AuditedDomainEntity extends BaseDomainEntity {
    public readonly createdAt: Date;
    private _updatedAt: Date;

    protected constructor(id: string, createdAt: Date, updatedAt: Date) {
        super(id);
        this.createdAt = createdAt;
        this._updatedAt = updatedAt;
    }

    getUpdatedAt(): Date {
        return this._updatedAt;
    }

    protected touch(updatedAt: Date): void {
        this._updatedAt = updatedAt;
    }
}

