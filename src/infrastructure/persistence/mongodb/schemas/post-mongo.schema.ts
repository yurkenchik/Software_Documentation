import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ _id: true, timestamps: false, id: true })
export class PostMongoDocument {
    @Prop({ required: true, type: String })
    _id: string;

    @Prop({ required: true })
    siteId: string;

    @Prop({ required: true })
    title: string;

    @Prop({ default: '' })
    body: string;

    @Prop({ required: true })
    createdAt: Date;

    @Prop({ required: true })
    updatedAt: Date;

    @Prop({ default: 'draft' })
    status: string;
}

export const PostMongoSchema = SchemaFactory.createForClass(PostMongoDocument);
