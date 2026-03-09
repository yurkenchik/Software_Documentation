import { Inject, Injectable } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { SITE_REPOSITORY } from '@domain/site/site.tokens';
import { POST_REPOSITORY, MEDIA_REPOSITORY } from '@domain/content/content.tokens';
import type { ISiteRepository } from '@domain/site/repositories/site.repository';
import type { IPostRepository } from '@domain/content/repositories/post.repository';
import type { IMediaRepository } from '@domain/content/repositories/media.repository';
import { SiteNotFoundException } from '@domain/site/exceptions/site-not-found.exception';
import { PostConflictException } from '@domain/content/exceptions/post-conflict.exception';
import { ContentValidationException } from '@domain/content/exceptions/content-validation.exception';
import { PostDomainEntity } from '@domain/content/entities/post-domain.entity';
import { MediaDomainEntity } from '@domain/content/entities/media-domain.entity';
import type { CreatePostWithMediaRequestDto } from '@application/content/dto/request/create-post-with-media-request.dto';

interface CreatedMediaDto {
    id: string;
    url: string;
    mimeType: string;
}

interface CreatePostWithMediaResponseDto {
    siteId: string;
    title: string;
    body: string;
    media: Array<CreatedMediaDto>;
}

@Injectable()
export class CreatePostWithMediaUseCase {
    constructor(
        @Inject(SITE_REPOSITORY)
        private readonly siteRepository: ISiteRepository,
        @Inject(POST_REPOSITORY)
        private readonly postRepository: IPostRepository,
        @Inject(MEDIA_REPOSITORY)
        private readonly mediaRepository: IMediaRepository,
    ) {}

    async execute(request: CreatePostWithMediaRequestDto): Promise<CreatePostWithMediaResponseDto> {
        if (!request.media || request.media.length === 0) {
            throw new ContentValidationException('Post must contain at least one media item.', {
                siteId: request.siteId,
                title: request.title,
            });
        }

        const site = await this.siteRepository.findById(request.siteId);
        if (!site) {
            throw new SiteNotFoundException(request.siteId);
        }

        const existingPost = await this.postRepository.findBySiteAndTitle(
            request.siteId,
            request.title,
        );
        if (existingPost) {
            throw new PostConflictException(request.siteId, request.title);
        }

        const now = new Date();
        const postId = randomUUID();
        const post = new PostDomainEntity(
            postId,
            request.siteId,
            request.title,
            request.body,
            now,
            now,
        );

        await this.postRepository.save(post);

        const mediaResults: Array<CreatedMediaDto> = [];

        for (const item of request.media) {
            const mediaId = randomUUID();
            const media = new MediaDomainEntity(
                mediaId,
                request.siteId,
                item.url,
                item.mimeType,
                now,
                now,
                'active',
            );

            await this.mediaRepository.save(media);
            mediaResults.push({
                id: mediaId,
                url: item.url,
                mimeType: item.mimeType,
            });
        }

        return {
            siteId: request.siteId,
            title: request.title,
            body: request.body,
            media: mediaResults,
        };
    }
}

