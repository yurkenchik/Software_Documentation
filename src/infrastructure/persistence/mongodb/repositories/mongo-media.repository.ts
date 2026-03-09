import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import type { IMediaRepository } from '@domain/content/repositories/media.repository';
import type { MediaDomainEntity } from '@domain/content/entities/media-domain.entity';
import { MediaMongoDocument } from '@infrastructure/persistence/mongodb/schemas/media-mongo.schema';
import { MediaMongoAdapter } from '@infrastructure/persistence/mongodb/adapters/media-mongo.adapter';

@Injectable()
export class MongoMediaRepository implements IMediaRepository {
    constructor(
        @InjectModel(MediaMongoDocument.name)
        private readonly model: Model<MediaMongoDocument>,
    ) {}

    async save(media: MediaDomainEntity): Promise<void> {
        const item = MediaMongoAdapter.adaptDomainToMongo(media);
        await this.model.updateOne({ _id: media.id }, item, { upsert: true });
    }

    async findById(id: string): Promise<MediaDomainEntity | null> {
        const document = await this.model.findById(id).lean().exec();
        if (!document) {
            return null;
        }
        return MediaMongoAdapter.adaptMongoToDomainEntity(document as MediaMongoDocument);
    }
}
