import {
    IsEmail,
    IsISO8601,
    IsOptional,
    IsString,
    Matches,
    MaxLength,
    MinLength,
    ValidateIf,
} from 'class-validator';
import { SiteEntityPayload } from '@domain/site/site-entity.props';

const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

/** Partial update on PATCH: every field is truly optional. */
export class UpdateSiteRequestDto {
    @IsOptional()
    @IsString()
    @MinLength(1)
    @MaxLength(255)
    name?: string;

    @IsOptional()
    @IsString()
    @MinLength(1)
    @MaxLength(128)
    @Matches(SLUG_RE, {
        message:
            'Slug must be lowercase letters, digits, and hyphens only (no leading/trailing hyphen).',
    })
    slug?: string;

    @IsOptional()
    @IsString()
    @MaxLength(100)
    industry?: string;

    @IsOptional()
    @IsString()
    @MaxLength(32)
    defaultLanguage?: string;

    @IsOptional()
    @ValidateIf((_, v) => typeof v === 'string' && v.trim() !== '')
    @IsEmail()
    @MaxLength(255)
    contactEmail?: string;

    @IsOptional()
    @IsString()
    @MaxLength(64)
    phone?: string;

    @IsOptional()
    @IsString()
    @MaxLength(255)
    legalEntityName?: string;

    @IsOptional()
    @IsString()
    @MaxLength(253)
    primaryCustomDomain?: string;

    @IsOptional()
    @IsISO8601()
    publishedAt?: string;

    toPartialPayload(): Partial<SiteEntityPayload> {
        const payload: Partial<SiteEntityPayload> = {};

        if (this.name !== undefined) payload.name = this.name;
        if (this.slug !== undefined) payload.slug = this.slug;
        if (this.industry !== undefined) payload.industry = this.industry;
        if (this.defaultLanguage !== undefined) payload.defaultLanguage = this.defaultLanguage;
        if (this.contactEmail !== undefined) payload.contactEmail = this.contactEmail;
        if (this.phone !== undefined) payload.phone = this.phone;
        if (this.legalEntityName !== undefined) payload.legalEntityName = this.legalEntityName;
        if (this.primaryCustomDomain !== undefined) payload.primaryCustomDomain = this.primaryCustomDomain;
        if (this.publishedAt !== undefined) {
            payload.publishedAt = String(this.publishedAt).trim() === '' ? null : new Date(this.publishedAt);
        }

        return payload;
    }
}
