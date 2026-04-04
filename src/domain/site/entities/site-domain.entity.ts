import { AuditedDomainEntity } from '../../../shared/entities/audited-domain.entity';
import { SiteValidationException } from '@domain/site/exceptions/site-validation.exception';
import { EMPTY_SITE_PAYLOAD, type SiteEntityPayload } from '@domain/site/site-entity.props';

const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const MAX_NAME = 255;
const MAX_SLUG = 128;
const MAX_INDUSTRY = 100;
const MAX_LANG = 32;
const MAX_EMAIL = 255;
const MAX_PHONE = 64;
const MAX_LEGAL = 255;
const MAX_DOMAIN = 253;
const OPTIONAL_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export type SiteEntityProps = SiteEntityPayload & {
    readonly id: string;
    readonly createdAt: Date;
    readonly updatedAt: Date;
};

export class SiteDomainEntity extends AuditedDomainEntity implements SiteEntityPayload {
    public readonly name: string;
    public readonly slug: string;
    public readonly industry: string;
    public readonly defaultLanguage: string;
    public readonly contactEmail: string;
    public readonly phone: string;
    public readonly legalEntityName: string;
    public readonly primaryCustomDomain: string;
    public readonly publishedAt: Date | null;

    private constructor(props: SiteEntityProps) {
        super(props.id, props.createdAt, props.updatedAt);
        this.name = props.name;
        this.slug = props.slug;
        this.industry = props.industry;
        this.defaultLanguage = props.defaultLanguage;
        this.contactEmail = props.contactEmail;
        this.phone = props.phone;
        this.legalEntityName = props.legalEntityName;
        this.primaryCustomDomain = props.primaryCustomDomain;
        this.publishedAt = props.publishedAt;
    }

    static create(
        props: {
            id: string;
            now: Date;
        } & Omit<SiteEntityPayload, 'publishedAt'> & { publishedAt?: Date | null },
    ): SiteDomainEntity {
        const { id, now, publishedAt, ...raw } = props;
        const payload = SiteDomainEntity.normalizePayload({
            ...EMPTY_SITE_PAYLOAD,
            ...raw,
            publishedAt: publishedAt ?? null,
        });
        return new SiteDomainEntity({
            ...payload,
            id,
            createdAt: now,
            updatedAt: now,
        });
    }

    /** Persistence or CSV import: merge fields without the strict rules used on create. */
    static rehydrate(
        props: Partial<SiteEntityProps> &
            Pick<SiteEntityProps, 'id' | 'name' | 'slug' | 'createdAt' | 'updatedAt'>,
    ): SiteDomainEntity {
        const base: SiteEntityProps = {
            ...EMPTY_SITE_PAYLOAD,
            name: props.name,
            slug: props.slug,
            id: props.id,
            createdAt: props.createdAt,
            updatedAt: props.updatedAt,
            industry: props.industry ?? EMPTY_SITE_PAYLOAD.industry,
            defaultLanguage: props.defaultLanguage ?? EMPTY_SITE_PAYLOAD.defaultLanguage,
            contactEmail: props.contactEmail ?? EMPTY_SITE_PAYLOAD.contactEmail,
            phone: props.phone ?? EMPTY_SITE_PAYLOAD.phone,
            legalEntityName: props.legalEntityName ?? EMPTY_SITE_PAYLOAD.legalEntityName,
            primaryCustomDomain: props.primaryCustomDomain ?? EMPTY_SITE_PAYLOAD.primaryCustomDomain,
            publishedAt: props.publishedAt ?? null,
        };
        return new SiteDomainEntity(base);
    }

    withUpdatedFields(
        fields: Partial<Omit<SiteEntityPayload, 'publishedAt'>> & {
            publishedAt?: Date | null;
        },
        updatedAt: Date,
    ): SiteDomainEntity {
        const merged: SiteEntityProps = {
            id: this.id,
            createdAt: this.createdAt,
            updatedAt,
            name: fields.name ?? this.name,
            slug: fields.slug ?? this.slug,
            industry: fields.industry ?? this.industry,
            defaultLanguage: fields.defaultLanguage ?? this.defaultLanguage,
            contactEmail: fields.contactEmail ?? this.contactEmail,
            phone: fields.phone ?? this.phone,
            legalEntityName: fields.legalEntityName ?? this.legalEntityName,
            primaryCustomDomain: fields.primaryCustomDomain ?? this.primaryCustomDomain,
            publishedAt: fields.publishedAt !== undefined ? fields.publishedAt : this.publishedAt,
        };
        const { id, createdAt, updatedAt: nextUpdated, ...payloadIn } = merged;
        const payload = SiteDomainEntity.normalizePayload(payloadIn);
        return new SiteDomainEntity({ ...payload, id, createdAt, updatedAt: nextUpdated });
    }

    private static normalizePayload(input: SiteEntityPayload): SiteEntityPayload {
        const name = input.name.trim();
        const slug = input.slug.trim().toLowerCase();
        if (name.length === 0) {
            throw new SiteValidationException('Site name must not be empty.', { field: 'name' });
        }
        if (name.length > MAX_NAME) {
            throw new SiteValidationException(`Site name must be at most ${MAX_NAME} characters.`, {
                field: 'name',
            });
        }
        if (slug.length === 0) {
            throw new SiteValidationException('Site slug must not be empty.', { field: 'slug' });
        }
        if (slug.length > MAX_SLUG) {
            throw new SiteValidationException(`Site slug must be at most ${MAX_SLUG} characters.`, {
                field: 'slug',
            });
        }
        if (!SLUG_PATTERN.test(slug)) {
            throw new SiteValidationException(
                'Site slug must contain only lowercase letters, digits, and single hyphens between segments.',
                { field: 'slug', value: slug },
            );
        }

        const trim = (s: string, max: number, field: string) => {
            const v = s.trim();
            if (v.length > max) {
                throw new SiteValidationException(`${field} must be at most ${max} characters.`, {
                    field,
                });
            }
            return v;
        };

        const contactEmail = trim(input.contactEmail, MAX_EMAIL, 'contactEmail');
        if (contactEmail.length > 0 && !OPTIONAL_EMAIL.test(contactEmail)) {
            throw new SiteValidationException('contactEmail must be a valid email or empty.', {
                field: 'contactEmail',
            });
        }

        const publishedAt =
            input.publishedAt instanceof Date && !Number.isNaN(input.publishedAt.getTime())
                ? input.publishedAt
                : null;

        return {
            name,
            slug,
            industry: trim(input.industry, MAX_INDUSTRY, 'industry'),
            defaultLanguage: trim(input.defaultLanguage, MAX_LANG, 'defaultLanguage'),
            contactEmail,
            phone: trim(input.phone, MAX_PHONE, 'phone'),
            legalEntityName: trim(input.legalEntityName, MAX_LEGAL, 'legalEntityName'),
            primaryCustomDomain: trim(input.primaryCustomDomain, MAX_DOMAIN, 'primaryCustomDomain'),
            publishedAt,
        };
    }
}
