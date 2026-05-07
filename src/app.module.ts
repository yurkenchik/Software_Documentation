import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { StatementImportModule } from '@application/statement-import/statement-import.module';
import { SiteModule } from '@domain/site/site.module';

@Module({
    imports: [
        ConfigModule.forRoot({ isGlobal: true }),
        MongooseModule.forRootAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (config: ConfigService) => ({
                uri: config.getOrThrow<string>('MONGODB_URI'),
            }),
        }),
        StatementImportModule,
        SiteModule,
    ],
    controllers: [],
    providers: [],
})
export class AppModule {}
