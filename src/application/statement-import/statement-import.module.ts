import { Module } from '@nestjs/common';
import { FILE_STORAGE_PORT } from '@domain/statement-import/statement-import.tokens';
import { LocalFileStorageAdapter } from '@infrastructure/files/local-file-storage.adapter';
import { MongodbModule } from '@infrastructure/persistence/mongodb/mongodb.module';
import { ImportStatementsFromCsvUseCase } from '@application/statement-import/use-cases/import-statements-from-csv.use-case';
import { SiteRowHandler } from '@application/statement-import/strategies/site-row.handler';
import { PostRowHandler } from '@application/statement-import/strategies/post-row.handler';
import { CommentRowHandler } from '@application/statement-import/strategies/comment-row.handler';
import { MediaRowHandler } from '@application/statement-import/strategies/media-row.handler';
import { ImportController } from '@presentation/controllers/import.controller';

@Module({
    controllers: [ImportController],
    imports: [MongodbModule],
    providers: [
        { provide: FILE_STORAGE_PORT, useClass: LocalFileStorageAdapter },
        ImportStatementsFromCsvUseCase,
        SiteRowHandler,
        PostRowHandler,
        CommentRowHandler,
        MediaRowHandler,
    ],
    exports: [ImportStatementsFromCsvUseCase],
})
export class StatementImportModule {}
