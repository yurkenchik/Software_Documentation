import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ _id: true, timestamps: false, id: true })
export class SiteMongoDocument {
    @Prop({ required: true, type: String })
    _id: string;

    @Prop({ required: true })
    name: string;

    @Prop({ required: true })
    slug: string;

    @Prop({ type: String, default: '' })
    industry: string;

    @Prop({ type: String, default: '' })
    defaultLanguage: string;

    @Prop({ type: String, default: '' })
    contactEmail: string;

    @Prop({ type: String, default: '' })
    phone: string;

    @Prop({ type: String, default: '' })
    legalEntityName: string;

    @Prop({ type: String, default: '' })
    primaryCustomDomain: string;

    @Prop({ type: Date, default: null })
    publishedAt: Date | null;

    @Prop({ required: true })
    createdAt: Date;

    @Prop({ required: true })
    updatedAt: Date;
}

export const SiteMongoSchema = SchemaFactory.createForClass(SiteMongoDocument);
