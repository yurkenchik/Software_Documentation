export type SiteEntityPayload = {
    name: string;
    slug: string;
    industry: string;
    defaultLanguage: string;
    contactEmail: string;
    phone: string;
    legalEntityName: string;
    primaryCustomDomain: string;
    publishedAt: Date | null;
};

export const EMPTY_SITE_PAYLOAD: SiteEntityPayload = {
    name: '',
    slug: '',
    industry: '',
    defaultLanguage: '',
    contactEmail: '',
    phone: '',
    legalEntityName: '',
    primaryCustomDomain: '',
    publishedAt: null,
};
