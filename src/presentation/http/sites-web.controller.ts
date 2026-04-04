import { Controller, Get, Render } from '@nestjs/common';
import { SiteService } from '@application/site/site.service';

/**
 * MVC-style HTML for ЛР3: data via {@link SiteService} (business layer), HTML via HBS.
 * JSON API remains under /api/sites ({@link SiteController}).
 */
@Controller()
export class SitesWebController {
    constructor(private readonly siteService: SiteService) {}

    @Get('sites')
    @Render('sites/index')
    async sitesList(): Promise<{ sites: Awaited<ReturnType<SiteService['listSites']>> }> {
        const sites = await this.siteService.listSites();
        return { sites };
    }
}
