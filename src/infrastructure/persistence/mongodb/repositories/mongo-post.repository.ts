import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import type { IPostRepository } from '@domain/content/repositories/post.repository';
import type { PostDomainEntity } from '@domain/content/entities/post-domain.entity';
import { PostMongoDocument } from '@infrastructure/persistence/mongodb/schemas/post-mongo.schema';
import { PostMongoAdapter } from '@infrastructure/persistence/mongodb/adapters/post-mongo.adapter';

@Injectable()
export class MongoPostRepository implements IPostRepository {
    constructor(
        @InjectModel(PostMongoDocument.name)
        private readonly model: Model<PostMongoDocument>,
    ) {}

    async save(post: PostDomainEntity): Promise<void> {
        const item = PostMongoAdapter.adaptDomainToMongoDocument(post);
        await this.model.updateOne({ _id: post.id }, item, { upsert: true });
    }

    async findById(id: string): Promise<PostDomainEntity | null> {
        const document = await this.model.findById(id).lean().exec();
        if (!document) {
            return null;
        }
        return PostMongoAdapter.adaptMongoToDomainEntity(document as PostMongoDocument);
    }

    async findBySiteAndTitle(siteId: string, title: string): Promise<PostDomainEntity | null> {
        const document = await this.model.findOne({ siteId, title }).lean().exec();
        if (!document) {
            return null;
        }
        return PostMongoAdapter.adaptMongoToDomainEntity(document as PostMongoDocument);
    }
}

