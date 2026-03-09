import { ContentDomainEntity } from '@domain/content/entities/content-domain.entity';

export const POST_STATUS_DRAFT = 'draft';
export const POST_STATUS_PUBLISHED = 'published';

export class PostDomainEntity extends ContentDomainEntity {
    public readonly title: string;
    public readonly body: string;

    constructor(
        id: string,
        siteId: string,
        title: string,
        body: string,
        createdAt: Date,
        updatedAt: Date,
        status: string = POST_STATUS_DRAFT,
    ) {
        super(id, siteId, createdAt, updatedAt, status);
        this.title = title;
        this.body = body;
    }

    publish(updatedAt: Date): void {
        if (this.getStatus() === POST_STATUS_PUBLISHED) {
            return;
        }
        this.setStatus(POST_STATUS_PUBLISHED, updatedAt);
    }
}
