import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
    FILE_STORAGE_PORT,
    ROW_OUTPUT_STRATEGY,
} from '@domain/statement-import/statement-import.tokens';
import { LocalFileStorageAdapter } from '@infrastructure/files/local-file-storage.adapter';
import { ConsoleRowOutputStrategy } from '@infrastructure/output/console-row-output.strategy';
import { KafkaRowOutputStrategy } from '@infrastructure/output/kafka-row-output.strategy';
import { RedisRowOutputStrategy } from '@infrastructure/output/redis-row-output.strategy';
import { KafkaModule } from '@infrastructure/persistence/kafka/kafka.module';
import { RedisModule } from '@infrastructure/persistence/redis/redis.module';
import { MongodbModule } from '@infrastructure/persistence/mongodb/mongodb.module';
import { ImportStatementsFromCsvUseCase } from '@application/statement-import/use-cases/import-statements-from-csv.use-case';
import { StreamCsvRowsUseCase } from '@application/statement-import/use-cases/stream-csv-rows.use-case';
import { SiteRowHandler } from '@application/statement-import/strategies/site-row.handler';
import { PostRowHandler } from '@application/statement-import/strategies/post-row.handler';
import { CommentRowHandler } from '@application/statement-import/strategies/comment-row.handler';
import { MediaRowHandler } from '@application/statement-import/strategies/media-row.handler';
import { ImportController } from '@presentation/http/import.controller';

@Module({
    controllers: [ImportController],
    imports: [KafkaModule, RedisModule, MongodbModule],
    providers: [
        { provide: FILE_STORAGE_PORT, useClass: LocalFileStorageAdapter },
        ConsoleRowOutputStrategy,
        KafkaRowOutputStrategy,
        RedisRowOutputStrategy,
        {
            provide: ROW_OUTPUT_STRATEGY,
            useFactory: (
                config: ConfigService,
                consoleStrategy: ConsoleRowOutputStrategy,
                kafkaStrategy: KafkaRowOutputStrategy,
                redisStrategy: RedisRowOutputStrategy,
            ) => {
                const strategy = config.get<string>('ROW_OUTPUT_STRATEGY') ?? 'console';
                if (strategy === 'kafka') return kafkaStrategy;
                if (strategy === 'redis') return redisStrategy;
                return consoleStrategy;
            },
            inject: [ConfigService, ConsoleRowOutputStrategy, KafkaRowOutputStrategy, RedisRowOutputStrategy],
        },
        ImportStatementsFromCsvUseCase,
        StreamCsvRowsUseCase,
        SiteRowHandler,
        PostRowHandler,
        CommentRowHandler,
        MediaRowHandler,
    ],
    exports: [ImportStatementsFromCsvUseCase, StreamCsvRowsUseCase],
})
export class StatementImportModule {}
