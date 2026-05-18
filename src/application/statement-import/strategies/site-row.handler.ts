import { Inject, Injectable } from '@nestjs/common';
import { SITE_REPOSITORY } from '@domain/site/site.tokens';
import type { ISiteRepository } from '@domain/site/repositories/site.repository';
import { SiteDomainEntity } from '@domain/site/entities/site-domain.entity';
import { IRowHandler } from '@domain/statement-import/types';

const ROW_TYPE = 'site';

@Injectable()
export class SiteRowHandler implements IRowHandler {
    constructor(
        @Inject(SITE_REPOSITORY)
        private readonly siteRepository: ISiteRepository,
    ) {}

    supports(rowType: string): boolean {
        return rowType === ROW_TYPE;
    }

    async handle(row: Array<string>): Promise<void> {
        const [id, name, slug, createdAt, updatedAt] = row.slice(1);

        const createdAtDate = new Date(createdAt);
        const updatedAtDate = new Date(updatedAt);

        const site = SiteDomainEntity.rehydrate({
            id,
            name,
            slug,
            createdAt: createdAtDate,
            updatedAt: updatedAtDate,
        });
        await this.siteRepository.save(site);
    }
}
