import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ _id: true, timestamps: false, id: true })
export class CommentMongoDocument {
    @Prop({ required: true, type: String })
    _id: string;

    @Prop({ required: true })
    postId: string;

    @Prop({ required: true })
    authorName: string;

    @Prop({ default: '' })
    body: string;

    @Prop({ required: true })
    createdAt: Date;

    @Prop({ required: true })
    updatedAt: Date;

    @Prop({ default: 'pending' })
    status: string;
}

export const CommentMongoSchema = SchemaFactory.createForClass(CommentMongoDocument);
