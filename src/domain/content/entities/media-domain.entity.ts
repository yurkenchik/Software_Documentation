import { ContentDomainEntity } from '@domain/content/entities/content-domain.entity';

export class MediaDomainEntity extends ContentDomainEntity {
    public readonly url: string;
    public readonly mimeType: string;

    constructor(
        id: string,
        siteId: string,
        url: string,
        mimeType: string,
        createdAt: Date,
        updatedAt: Date,
        status: string,
    ) {
        super(id, siteId, createdAt, updatedAt, status);
        this.url = url;
        this.mimeType = mimeType;
    }
}
