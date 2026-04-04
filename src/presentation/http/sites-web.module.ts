import { Module } from '@nestjs/common';
import { SiteModule } from '@domain/site/site.module';
import { SitesWebController } from '@presentation/http/sites-web.controller';

@Module({
    imports: [SiteModule],
    controllers: [SitesWebController],
})
export class SitesWebModule {}
