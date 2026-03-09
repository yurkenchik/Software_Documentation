import { Inject, Injectable } from '@nestjs/common';
import { COMMENT_REPOSITORY } from '@domain/content/content.tokens';
import type { ICommentRepository } from '@domain/content/repositories/comment.repository';
import { CommentDomainEntity } from '@domain/content/entities/comment-domain.entity';
import { CommentStatus } from '@domain/content/enums/comment-status.enum';
import { IRowHandler } from '@domain/statement-import/types';

const ROW_TYPE = 'comment';

@Injectable()
export class CommentRowHandler implements IRowHandler {
    constructor(
        @Inject(COMMENT_REPOSITORY)
        private readonly commentRepository: ICommentRepository,
    ) {}

    supports(rowType: string): boolean {
        return rowType === ROW_TYPE;
    }

    async handle(row: Array<string>): Promise<void> {
        const [id, postId, authorName, body, createdAt, updatedAt, status] = row.slice(1);

        const createdAtDate = new Date(createdAt);
        const updatedAtDate = new Date(updatedAt);

        const comment = new CommentDomainEntity(
            id,
            postId,
            authorName,
            body ?? '',
            createdAtDate,
            updatedAtDate,
            (status as CommentStatus) ?? CommentStatus.Pending,
        );

        await this.commentRepository.save(comment);
    }
}
