import { Module } from '@nestjs/common';
import { MongodbModule } from '@infrastructure/persistence/mongodb/mongodb.module';
import { SiteService } from '@application/site/site.service';
import { SiteController, SiteHtmlController } from '@presentation/http/site.controller';

@Module({
    imports: [MongodbModule],
    providers: [SiteService],
    controllers: [SiteController, SiteHtmlController],
    exports: [SiteService],
})
export class SiteModule {}
