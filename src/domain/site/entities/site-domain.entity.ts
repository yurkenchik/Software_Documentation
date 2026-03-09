import { AuditedDomainEntity } from '../../../shared/entities/audited-domain.entity';

export class SiteDomainEntity extends AuditedDomainEntity {
    public readonly name: string;
    public readonly slug: string;

    constructor(
        id: string,
        name: string,
        slug: string,
        createdAt: Date,
        updatedAt: Date,
    ) {
        super(id, createdAt, updatedAt);
        this.name = name;
        this.slug = slug;
    }
}
