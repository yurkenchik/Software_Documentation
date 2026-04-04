import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ _id: true, timestamps: false, id: true })
export class SiteMongoDocument {
    @Prop({ required: true, type: String })
    _id: string;

    @Prop({ required: true })
    name: string;

    @Prop({ required: true })
    slug: string;

    @Prop({ required: true })
    createdAt: Date;

    @Prop({ required: true })
    updatedAt: Date;
}

export const SiteMongoSchema = SchemaFactory.createForClass(SiteMongoDocument);
