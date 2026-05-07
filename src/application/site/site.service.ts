import { Inject, Injectable } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { SITE_REPOSITORY } from '@domain/site/site.tokens';
import type { ISiteRepository } from '@domain/site/repositories/site.repository';
import { SiteDomainEntity } from '@domain/site/entities/site-domain.entity';
import { SiteConflictException } from '@domain/site/exceptions/site-conflict.exception';
import { SiteNotFoundException } from '@domain/site/exceptions/site-not-found.exception';
import type { SiteEntityPayload } from '@domain/site/site-entity.props';
import { CreateSiteRequestDto } from '@application/site/dto/request/create-site-request.dto';
import { UpdateSiteRequestDto } from '@application/site/dto/request/update-site-request.dto';
import { SiteResponseDto } from '@application/site/dto/response/site-response.dto';

@Injectable()
export class SiteService {
    constructor(
        @Inject(SITE_REPOSITORY)
        private readonly siteRepository: ISiteRepository,
    ) {}

    async listSites(): Promise<Array<SiteResponseDto>> {
        const sites = await this.siteRepository.findAll();
        return sites.map(site => SiteResponseDto.fromEntity(site));
    }

    async getSiteById(id: string): Promise<SiteResponseDto> {
        const site = await this.siteRepository.findById(id);
        if (!site) {
            throw new SiteNotFoundException(id);
        }
        return SiteResponseDto.fromEntity(site);
    }

    async createSite(dto: CreateSiteRequestDto): Promise<SiteResponseDto> {
        const nameNormalized = dto.name.trim();
        const existingByName = await this.siteRepository.findByName(nameNormalized);
        if (existingByName) {
            throw new SiteConflictException(`Site with name "${existingByName.name}" already exists.`, {
                name: existingByName.name,
            });
        }

        const slugNormalized = dto.slug.trim().toLowerCase();
        const existingBySlug = await this.siteRepository.findBySlug(slugNormalized);
        if (existingBySlug) {
            throw new SiteConflictException(`Site with slug "${existingBySlug.slug}" already exists.`, {
                slug: existingBySlug.slug,
            });
        }

        const now = new Date();
        const site = SiteDomainEntity.create({
            id: randomUUID(),
            now,
            ...this.requestToPayload(dto),
        });

        await this.siteRepository.save(site);
        return SiteResponseDto.fromEntity(site);
    }

    async updateSite(id: string, dto: UpdateSiteRequestDto): Promise<SiteResponseDto> {
        const site = await this.siteRepository.findById(id);
        if (!site) {
            throw new SiteNotFoundException(id);
        }

        const newName = dto.name?.trim();
        if (newName !== undefined && newName !== site.name) {
            const nameTaken = await this.siteRepository.existsAnotherWithName(newName, id);
            if (nameTaken) {
                throw new SiteConflictException(`Site with name "${newName}" already exists.`, {
                    name: newName,
                });
            }
        }

        const newSlug = dto.slug?.trim().toLowerCase();
        if (newSlug !== undefined && newSlug !== site.slug) {
            const slugTaken = await this.siteRepository.existsAnotherWithSlug(newSlug, id);
            if (slugTaken) {
                throw new SiteConflictException(`Site with slug "${newSlug}" already exists.`, {
                    slug: newSlug,
                });
            }
        }

        const updated = site.withUpdatedFields(dto.toPartialPayload(), new Date());
        await this.siteRepository.save(updated);
        return SiteResponseDto.fromEntity(updated);
    }

    async deleteSite(id: string): Promise<void> {
        const site = await this.siteRepository.findById(id);
        if (!site) {
            throw new SiteNotFoundException(id);
        }
        await this.siteRepository.deleteById(id);
    }

    private requestToPayload(dto: CreateSiteRequestDto): SiteEntityPayload {
        const hasPublished =
            dto.publishedAt !== undefined &&
            dto.publishedAt !== null &&
            String(dto.publishedAt).trim() !== '';
        return {
            name: dto.name,
            slug: dto.slug,
            industry: dto.industry ?? '',
            defaultLanguage: dto.defaultLanguage ?? '',
            contactEmail: dto.contactEmail ?? '',
            phone: dto.phone ?? '',
            legalEntityName: dto.legalEntityName ?? '',
            primaryCustomDomain: dto.primaryCustomDomain ?? '',
            publishedAt: hasPublished ? new Date(dto.publishedAt as string) : null,
        };
    }

}
