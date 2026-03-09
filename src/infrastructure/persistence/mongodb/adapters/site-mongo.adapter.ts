import { SiteDomainEntity } from '@domain/site/entities/site-domain.entity';
import { SiteMongoDocument } from '@infrastructure/persistence/mongodb/schemas/site-mongo.schema';

export class SiteMongoAdapter {
    static adaptMongoToDomainEntity(document: SiteMongoDocument): SiteDomainEntity {
        return new SiteDomainEntity(
            document._id.toString(),
            document.name,
            document.slug,
            document.createdAt,
            document.updatedAt,
        );
    }

    static adaptDomainToMongo(domain: SiteDomainEntity): Partial<SiteMongoDocument> {
        return {
            _id: domain.id,
            name: domain.name,
            slug: domain.slug,
            createdAt: domain.createdAt,
            updatedAt: domain.getUpdatedAt(),
        };
    }
}

