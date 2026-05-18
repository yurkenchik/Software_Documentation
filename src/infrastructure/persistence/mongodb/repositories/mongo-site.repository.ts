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

    async findAll(): Promise<Array<SiteDomainEntity>> {
        const documents = await this.model.find().lean().exec();
        return documents.map((doc) => SiteMongoAdapter.adaptMongoToDomainEntity(doc as SiteMongoDocument));
    }

    async findById(id: string): Promise<SiteDomainEntity | null> {
        const document = await this.model.findById(id).lean().exec();
        if (!document) {
            return null;
        }
        return SiteMongoAdapter.adaptMongoToDomainEntity(document as SiteMongoDocument);
    }

    async findByName(name: string): Promise<SiteDomainEntity | null> {
        const trimmed = name.trim();
        const document = await this.model.findOne({ name: trimmed }).lean().exec();
        if (!document) {
            return null;
        }
        return SiteMongoAdapter.adaptMongoToDomainEntity(document as SiteMongoDocument);
    }

    async findBySlug(slug: string): Promise<SiteDomainEntity | null> {
        const normalized = slug.trim().toLowerCase();
        const document = await this.model.findOne({ slug: normalized }).lean().exec();
        if (!document) {
            return null;
        }
        return SiteMongoAdapter.adaptMongoToDomainEntity(document as SiteMongoDocument);
    }

    async existsAnotherWithName(name: string, excludeId: string): Promise<boolean> {
        const count = await this.model.countDocuments({
            name: name.trim(),
            _id: { $ne: excludeId },
        });
        return count > 0;
    }

    async existsAnotherWithSlug(slug: string, excludeId: string): Promise<boolean> {
        const count = await this.model.countDocuments({
            slug: slug.trim().toLowerCase(),
            _id: { $ne: excludeId },
        });
        return count > 0;
    }

    async save(site: SiteDomainEntity): Promise<void> {
        const item = SiteMongoAdapter.adaptDomainToMongo(site);
        await this.model.updateOne({ _id: site.id }, item, { upsert: true });
    }

    async deleteById(id: string): Promise<void> {
        await this.model.deleteOne({ _id: id }).exec();
    }
}
