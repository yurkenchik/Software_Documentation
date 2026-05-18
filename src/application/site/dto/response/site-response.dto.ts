import { SiteDomainEntity } from '@domain/site/entities/site-domain.entity';

export class SiteResponseDto {
    id!: string;
    name!: string;
    slug!: string;
    industry!: string;
    defaultLanguage!: string;
    contactEmail!: string;
    phone!: string;
    legalEntityName!: string;
    primaryCustomDomain!: string;
    publishedAt!: string | null;
    createdAt!: string;
    updatedAt!: string;

    static fromEntity(site: SiteDomainEntity): SiteResponseDto {
        return {
            id: site.id,
            name: site.name,
            slug: site.slug,
            industry: site.industry,
            defaultLanguage: site.defaultLanguage,
            contactEmail: site.contactEmail,
            phone: site.phone,
            legalEntityName: site.legalEntityName,
            primaryCustomDomain: site.primaryCustomDomain,
            publishedAt: site.publishedAt ? site.publishedAt.toISOString() : null,
            createdAt: site.createdAt.toISOString(),
            updatedAt: site.getUpdatedAt().toISOString(),
        };
    }
}
