import { CommentDomainEntity } from '@domain/content/entities/comment-domain.entity';
import { CommentStatus } from '@domain/content/enums/comment-status.enum';
import { CommentMongoDocument } from '@infrastructure/persistence/mongodb/schemas/comment-mongo.schema';

export class CommentMongoAdapter {
    static adaptMongoToDomainEntity(document: CommentMongoDocument): CommentDomainEntity {
        return new CommentDomainEntity(
            document._id.toString(),
            document.postId,
            document.authorName,
            document.body,
            document.createdAt,
            document.updatedAt,
            document.status as CommentStatus,
        );
    }

    static adaptDomainToMongoDocument(domain: CommentDomainEntity): Partial<CommentMongoDocument> {
        return {
            _id: domain.id,
            postId: domain.postId,
            authorName: domain.authorName,
            body: domain.body,
            createdAt: domain.createdAt,
            updatedAt: domain.getUpdatedAt(),
            status: domain.getStatus() as string,
        };
    }
}

