import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ _id: true, timestamps: false, id: true })
export class MediaMongoDocument {
    @Prop({ required: true, type: String })
    _id: string;

    @Prop({ required: true })
    siteId: string;

    @Prop({ required: true })
    url: string;

    @Prop({ default: 'application/octet-stream' })
    mimeType: string;

    @Prop({ required: true })
    createdAt: Date;

    @Prop({ required: true })
    updatedAt: Date;

    @Prop({ default: 'active' })
    status: string;
}

export const MediaMongoSchema = SchemaFactory.createForClass(MediaMongoDocument);
