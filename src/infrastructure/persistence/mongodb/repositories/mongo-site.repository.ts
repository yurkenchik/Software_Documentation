import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import type { ISiteRepository } from '@domain/site/repositories/site.repository';
import type { SiteDomainEntity } from '@domain/site/entities/site-domain.entity';
import { SiteMongoDocument } from '@infrastructure/persistence/mongodb/schemas/site-mongo.schema';
import { SiteMongoAdapter } from '@infrastructure/persistence/mongodb/adapters/site-mongo.adapter';

@Injectable()
export class MongoSiteRepository implements ISiteRepository {
    constructor(
        @InjectModel(SiteMongoDocument.name)
        private readonly model: Model<SiteMongoDocument>,
    ) {}

    async save(site: SiteDomainEntity): Promise<void> {
        const item = SiteMongoAdapter.adaptDomainToMongo(site);
        await this.model.updateOne({ _id: site.id }, item, { upsert: true });
    }

    async findById(id: string): Promise<SiteDomainEntity | null> {
        const document = await this.model.findById(id).lean().exec();
        if (!document) {
            return null;
        }
        return SiteMongoAdapter.adaptMongoToDomainEntity(document as SiteMongoDocument);
    }
}
