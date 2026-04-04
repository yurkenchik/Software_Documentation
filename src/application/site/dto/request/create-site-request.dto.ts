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

const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export class CreateSiteRequestDto {
    @IsString()
    @MinLength(1)
    @MaxLength(255)
    name!: string;

    @IsString()
    @MinLength(1)
    @MaxLength(128)
    @Matches(SLUG_RE, {
        message:
            'Slug must be lowercase letters, digits, and hyphens only (no leading/trailing hyphen).',
    })
    slug!: string;

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
}
