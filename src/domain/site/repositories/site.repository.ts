import type { SiteDomainEntity } from '@domain/site/entities/site-domain.entity';

export interface ISiteRepository {
    save(site: SiteDomainEntity): Promise<void>;
    findById(id: string): Promise<SiteDomainEntity | null>;
}
