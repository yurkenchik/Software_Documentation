import { PostDomainEntity } from '@domain/content/entities/post-domain.entity';
import { PostMongoDocument } from '@infrastructure/persistence/mongodb/schemas/post-mongo.schema';

export class PostMongoAdapter {
    static adaptMongoToDomainEntity(document: PostMongoDocument): PostDomainEntity {
        return new PostDomainEntity(
            document._id.toString(),
            document.siteId,
            document.title,
            document.body,
            document.createdAt,
            document.updatedAt,
            document.status,
        );
    }

    static adaptDomainToMongoDocument(domain: PostDomainEntity): Partial<PostMongoDocument> {
        return {
            _id: domain.id,
            siteId: domain.siteId,
            title: domain.title,
            body: domain.body,
            createdAt: domain.createdAt,
            updatedAt: domain.getUpdatedAt(),
            status: domain.getStatus(),
        };
    }
}

