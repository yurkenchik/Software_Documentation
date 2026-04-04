import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SITE_REPOSITORY } from '@domain/site/site.tokens';
import {
    POST_REPOSITORY,
    COMMENT_REPOSITORY,
    MEDIA_REPOSITORY,
} from '@domain/content/content.tokens';
import { SiteMongoDocument, SiteMongoSchema } from '@infrastructure/persistence/mongodb/schemas/site-mongo.schema';
import {
    PostMongoDocument,
    PostMongoSchema,
} from '@infrastructure/persistence/mongodb/schemas/post-mongo.schema';
import {
    CommentMongoDocument,
    CommentMongoSchema,
} from '@infrastructure/persistence/mongodb/schemas/comment-mongo.schema';
import { MediaMongoDocument, MediaMongoSchema } from '@infrastructure/persistence/mongodb/schemas/media-mongo.schema';
import { MongoSiteRepository } from '@infrastructure/persistence/mongodb/repositories/mongo-site.repository';
import { MongoPostRepository } from '@infrastructure/persistence/mongodb/repositories/mongo-post.repository';
import { MongoCommentRepository } from '@infrastructure/persistence/mongodb/repositories/mongo-comment.repository';
import { MongoMediaRepository } from '@infrastructure/persistence/mongodb/repositories/mongo-media.repository';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: SiteMongoDocument.name, schema: SiteMongoSchema },
            { name: PostMongoDocument.name, schema: PostMongoSchema },
            { name: CommentMongoDocument.name, schema: CommentMongoSchema },
            { name: MediaMongoDocument.name, schema: MediaMongoSchema },
        ]),
    ],
    providers: [
        { provide: SITE_REPOSITORY, useClass: MongoSiteRepository },
        { provide: POST_REPOSITORY, useClass: MongoPostRepository },
        { provide: COMMENT_REPOSITORY, useClass: MongoCommentRepository },
        { provide: MEDIA_REPOSITORY, useClass: MongoMediaRepository },
    ],
    exports: [SITE_REPOSITORY, POST_REPOSITORY, COMMENT_REPOSITORY, MEDIA_REPOSITORY],
})
export class MongodbModule {}
