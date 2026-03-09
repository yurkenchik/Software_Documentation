import { MediaDomainEntity } from '@domain/content/entities/media-domain.entity';
import { MediaMongoDocument } from '@infrastructure/persistence/mongodb/schemas/media-mongo.schema';

export class MediaMongoAdapter {
    static adaptMongoToDomainEntity(document: MediaMongoDocument): MediaDomainEntity {
        return new MediaDomainEntity(
            document._id.toString(),
            document.siteId,
            document.url,
            document.mimeType,
            document.createdAt,
            document.updatedAt,
            document.status,
        );
    }

    static adaptDomainToMongo(domain: MediaDomainEntity): Partial<MediaMongoDocument> {
        return {
            _id: domain.id,
            siteId: domain.siteId,
            url: domain.url,
            mimeType: domain.mimeType,
            createdAt: domain.createdAt,
            updatedAt: domain.getUpdatedAt(),
            status: domain.getStatus(),
        };
    }
}

