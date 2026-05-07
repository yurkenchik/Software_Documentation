import { CreatePostWithMediaUseCase } from '../application/content/use-cases/create-post-with-media.use-case';
import type { ISiteRepository } from '../domain/site/repositories/site.repository';
import type { IPostRepository } from '../domain/content/repositories/post.repository';
import type { IMediaRepository } from '../domain/content/repositories/media.repository';
import { SiteDomainEntity } from '../domain/site/entities/site-domain.entity';
import { SiteNotFoundException } from '../domain/site/exceptions/site-not-found.exception';
import { PostConflictException } from '../domain/content/exceptions/post-conflict.exception';
import { ContentValidationException } from '../domain/content/exceptions/content-validation.exception';
import type { CreatePostWithMediaRequestDto } from '../application/content/dto/request/create-post-with-media-request.dto';

describe('CreatePostWithMediaUseCase', () => {
    const siteId = 'site-1';

    function createSite(): SiteDomainEntity {
        const now = new Date();
        return SiteDomainEntity.rehydrate({
            id: siteId,
            name: 'My Site',
            slug: 'my-site',
            createdAt: now,
            updatedAt: now,
        });
    }

    function createDto(overrides: Partial<CreatePostWithMediaRequestDto> = {}): CreatePostWithMediaRequestDto {
        return {
            siteId,
            title: 'Unique title',
            body: 'Body',
            media: [
                {
                    url: 'https://example.com/image.png',
                    mimeType: 'image/png',
                },
            ],
            ...overrides,
        } as CreatePostWithMediaRequestDto;
    }

    it('creates post and media in happy path', async () => {
        const siteRepository: jest.Mocked<ISiteRepository> = {
            findAll: jest.fn(),
            save: jest.fn(),
            findById: jest.fn().mockResolvedValue(createSite()),
            findByName: jest.fn(),
            findBySlug: jest.fn(),
            existsAnotherWithName: jest.fn(),
            existsAnotherWithSlug: jest.fn(),
            deleteById: jest.fn(),
        };
        const postRepository: jest.Mocked<IPostRepository> = {
            save: jest.fn(),
            findById: jest.fn(),
            findBySiteAndTitle: jest.fn().mockResolvedValue(null),
        };
        const mediaRepository: jest.Mocked<IMediaRepository> = {
            save: jest.fn(),
            findById: jest.fn(),
        };

        const useCase = new CreatePostWithMediaUseCase(siteRepository, postRepository, mediaRepository);
        const dto = createDto();

        const result = await useCase.execute(dto);

        expect(siteRepository.findById).toHaveBeenCalledWith(siteId);
        expect(postRepository.findBySiteAndTitle).toHaveBeenCalledWith(siteId, dto.title);
        expect(postRepository.save).toHaveBeenCalledTimes(1);
        expect(mediaRepository.save).toHaveBeenCalledTimes(dto.media.length);

        expect(result.siteId).toBe(siteId);
        expect(result.title).toBe(dto.title);
        expect(result.media).toHaveLength(dto.media.length);
    });

    it('throws ContentValidationException when media list is empty', async () => {
        const siteRepository = { findById: jest.fn() } as unknown as ISiteRepository;
        const postRepository = { findBySiteAndTitle: jest.fn() } as unknown as IPostRepository;
        const mediaRepository = { save: jest.fn() } as unknown as IMediaRepository;

        const useCase = new CreatePostWithMediaUseCase(siteRepository, postRepository, mediaRepository);
        const dto = createDto({ media: [] });

        await expect(useCase.execute(dto)).rejects.toBeInstanceOf(ContentValidationException);
    });

    it('throws SiteNotFoundException when site does not exist', async () => {
        const siteRepository: jest.Mocked<ISiteRepository> = {
            findAll: jest.fn(),
            save: jest.fn(),
            findById: jest.fn().mockResolvedValue(null),
            findByName: jest.fn(),
            findBySlug: jest.fn(),
            existsAnotherWithName: jest.fn(),
            existsAnotherWithSlug: jest.fn(),
            deleteById: jest.fn(),
        };
        const postRepository = { findBySiteAndTitle: jest.fn() } as unknown as IPostRepository;
        const mediaRepository = { save: jest.fn() } as unknown as IMediaRepository;

        const useCase = new CreatePostWithMediaUseCase(siteRepository, postRepository, mediaRepository);
        const dto = createDto();

        await expect(useCase.execute(dto)).rejects.toBeInstanceOf(SiteNotFoundException);
    });

    it('throws PostConflictException when title already exists for site', async () => {
        const siteRepository: jest.Mocked<ISiteRepository> = {
            findAll: jest.fn(),
            save: jest.fn(),
            findById: jest.fn().mockResolvedValue(createSite()),
            findByName: jest.fn(),
            findBySlug: jest.fn(),
            existsAnotherWithName: jest.fn(),
            existsAnotherWithSlug: jest.fn(),
            deleteById: jest.fn(),
        };
        const postRepository: jest.Mocked<IPostRepository> = {
            save: jest.fn(),
            findById: jest.fn(),
            findBySiteAndTitle: jest.fn().mockResolvedValue({ id: 'existing-post-id' } as any),
        };
        const mediaRepository = { save: jest.fn() } as unknown as IMediaRepository;

        const useCase = new CreatePostWithMediaUseCase(siteRepository, postRepository, mediaRepository);
        const dto = createDto();

        await expect(useCase.execute(dto)).rejects.toBeInstanceOf(PostConflictException);
    });
});

