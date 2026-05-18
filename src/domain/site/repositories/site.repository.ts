import type { SiteDomainEntity } from '@domain/site/entities/site-domain.entity';

export interface ISiteRepository {
    findAll(): Promise<Array<SiteDomainEntity>>;
    findById(id: string): Promise<SiteDomainEntity | null>;
    findByName(name: string): Promise<SiteDomainEntity | null>;
    findBySlug(slug: string): Promise<SiteDomainEntity | null>;
    existsAnotherWithName(name: string, excludeId: string): Promise<boolean>;
    existsAnotherWithSlug(slug: string, excludeId: string): Promise<boolean>;
    save(site: SiteDomainEntity): Promise<void>;
    deleteById(id: string): Promise<void>;
}
