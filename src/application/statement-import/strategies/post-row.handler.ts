import { Inject, Injectable } from '@nestjs/common';
import { POST_REPOSITORY } from '@domain/content/content.tokens';
import type { IPostRepository } from '@domain/content/repositories/post.repository';
import { PostDomainEntity, POST_STATUS_DRAFT } from '@domain/content/entities/post-domain.entity';
import { IRowHandler } from '@domain/statement-import/types';

const ROW_TYPE = 'post';

@Injectable()
export class PostRowHandler implements IRowHandler {
    constructor(
        @Inject(POST_REPOSITORY)
        private readonly postRepository: IPostRepository,
    ) {}

    supports(rowType: string): boolean {
        return rowType === ROW_TYPE;
    }

    async handle(row: Array<string>): Promise<void> {
        const [id, siteId, title, body, createdAt, updatedAt, status] = row.slice(1);

        const createdAtDate = new Date(createdAt);
        const updatedAtDate = new Date(updatedAt);

        const post = new PostDomainEntity(
            id,
            siteId,
            title,
            body ?? '',
            createdAtDate,
            updatedAtDate,
            status ?? POST_STATUS_DRAFT,
        );

        await this.postRepository.save(post);
    }
}
