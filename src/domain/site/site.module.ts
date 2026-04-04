import { Module } from '@nestjs/common';
import { MongodbModule } from '@infrastructure/persistence/mongodb/mongodb.module';
import { SiteService } from '@application/site/site.service';
import { SiteController } from '@presentation/controllers/site.controller';

@Module({
    imports: [MongodbModule],
    providers: [SiteService],
    controllers: [SiteController],
    exports: [SiteService],
})
export class SiteModule {}
