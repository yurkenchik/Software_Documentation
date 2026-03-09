import type { MediaDomainEntity } from '@domain/content/entities/media-domain.entity';

export interface IMediaRepository {
    save(media: MediaDomainEntity): Promise<void>;
    findById(id: string): Promise<MediaDomainEntity | null>;
}
