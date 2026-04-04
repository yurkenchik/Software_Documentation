import { SiteDomainEntity } from '@domain/site/entities/site-domain.entity';
import { EMPTY_SITE_PAYLOAD } from '@domain/site/site-entity.props';
import { SiteMongoDocument } from '@infrastructure/persistence/mongodb/schemas/site-mongo.schema';

export class SiteMongoAdapter {
    static adaptMongoToDomainEntity(document: SiteMongoDocument): SiteDomainEntity {
        return SiteDomainEntity.rehydrate({
            id: document._id.toString(),
            name: document.name,
            slug: document.slug,
            createdAt: document.createdAt,
            updatedAt: document.updatedAt,
            industry: document.industry ?? EMPTY_SITE_PAYLOAD.industry,
            defaultLanguage: document.defaultLanguage ?? EMPTY_SITE_PAYLOAD.defaultLanguage,
            contactEmail: document.contactEmail ?? EMPTY_SITE_PAYLOAD.contactEmail,
            phone: document.phone ?? EMPTY_SITE_PAYLOAD.phone,
            legalEntityName: document.legalEntityName ?? EMPTY_SITE_PAYLOAD.legalEntityName,
            primaryCustomDomain: document.primaryCustomDomain ?? EMPTY_SITE_PAYLOAD.primaryCustomDomain,
            publishedAt: document.publishedAt ?? null,
        });
    }

    static adaptDomainToMongo(domain: SiteDomainEntity): Partial<SiteMongoDocument> {
        return {
            _id: domain.id,
            name: domain.name,
            slug: domain.slug,
            industry: domain.industry,
            defaultLanguage: domain.defaultLanguage,
            contactEmail: domain.contactEmail,
            phone: domain.phone,
            legalEntityName: domain.legalEntityName,
            primaryCustomDomain: domain.primaryCustomDomain,
            publishedAt: domain.publishedAt,
            createdAt: domain.createdAt,
            updatedAt: domain.getUpdatedAt(),
        };
    }
}
