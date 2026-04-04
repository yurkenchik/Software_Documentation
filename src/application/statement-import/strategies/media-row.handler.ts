import { Inject, Injectable } from '@nestjs/common';
import { MEDIA_REPOSITORY } from '@domain/content/content.tokens';
import type { IMediaRepository } from '@domain/content/repositories/media.repository';
import { MediaDomainEntity } from '@domain/content/entities/media-domain.entity';
import { IRowHandler } from '@domain/statement-import/types';

const ROW_TYPE = 'media';

@Injectable()
export class MediaRowHandler implements IRowHandler {
    constructor(
        @Inject(MEDIA_REPOSITORY)
        private readonly mediaRepository: IMediaRepository,
    ) {}

    supports(rowType: string): boolean {
        return rowType === ROW_TYPE;
    }

    async handle(row: Array<string>): Promise<void> {
        const [id, siteId, url, mimeType, createdAt, updatedAt, status] = row.slice(1);

        const createdAtDate = new Date(createdAt);
        const updatedAtDate = new Date(updatedAt);

        const media = new MediaDomainEntity(
            id,
            siteId,
            url,
            mimeType ?? 'application/octet-stream',
            createdAtDate,
            updatedAtDate,
            status ?? 'active',
        );

        await this.mediaRepository.save(media);
    }
}
