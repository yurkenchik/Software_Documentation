import type { CommentDomainEntity } from '@domain/content/entities/comment-domain.entity';

export interface ICommentRepository {
    save(comment: CommentDomainEntity): Promise<void>;
    findById(id: string): Promise<CommentDomainEntity | null>;
}
