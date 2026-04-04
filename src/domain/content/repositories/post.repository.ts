import { PostDomainEntity } from '@domain/content/entities/post-domain.entity';

export interface IPostRepository {
    save(post: PostDomainEntity): Promise<void>;
    findById(id: string): Promise<PostDomainEntity | null>;
    findBySiteAndTitle(siteId: string, title: string): Promise<PostDomainEntity | null>;
}