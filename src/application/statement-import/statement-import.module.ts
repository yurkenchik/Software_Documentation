import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
    FILE_STORAGE_PORT,
    ROW_OUTPUT_STRATEGY,
} from '@domain/statement-import/statement-import.tokens';
import { LocalFileStorageAdapter } from '@infrastructure/files/local-file-storage.adapter';
import { ConsoleRowOutputStrategy } from '@infrastructure/output/console-row-output.strategy';
import { KafkaRowOutputStrategy } from '@infrastructure/output/kafka-row-output.strategy';
import { KafkaModule } from '@infrastructure/persistence/kafka/kafka.module';
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
    imports: [KafkaModule, MongodbModule],
    providers: [
        { provide: FILE_STORAGE_PORT, useClass: LocalFileStorageAdapter },
        ConsoleRowOutputStrategy,
        KafkaRowOutputStrategy,
        {
            provide: ROW_OUTPUT_STRATEGY,
            useFactory: (
                config: ConfigService,
                consoleStrategy: ConsoleRowOutputStrategy,
                kafkaStrategy: KafkaRowOutputStrategy,
            ) => {
                const strategy = config.get<string>('ROW_OUTPUT_STRATEGY') ?? 'console';
                return strategy === 'kafka' ? kafkaStrategy : consoleStrategy;
            },
            inject: [ConfigService, ConsoleRowOutputStrategy, KafkaRowOutputStrategy],
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
