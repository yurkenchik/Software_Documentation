import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import type { ICommentRepository } from '@domain/content/repositories/comment.repository';
import type { CommentDomainEntity } from '@domain/content/entities/comment-domain.entity';
import { CommentMongoDocument } from '@infrastructure/persistence/mongodb/schemas/comment-mongo.schema';
import { CommentMongoAdapter } from '@infrastructure/persistence/mongodb/adapters/comment-mongo.adapter';

@Injectable()
export class MongoCommentRepository implements ICommentRepository {
    constructor(
        @InjectModel(CommentMongoDocument.name)
        private readonly model: Model<CommentMongoDocument>,
    ) {}

    async save(comment: CommentDomainEntity): Promise<void> {
        const item = CommentMongoAdapter.adaptDomainToMongoDocument(comment);
        await this.model.updateOne({ _id: comment.id }, item, { upsert: true });
    }

    async findById(id: string): Promise<CommentDomainEntity | null> {
        const document = await this.model.findById(id).lean().exec();
        if (!document) {
            return null;
        }
        return CommentMongoAdapter.adaptMongoToDomainEntity(document as CommentMongoDocument);
    }
}
