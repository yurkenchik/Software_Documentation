import { Body, Controller, Post, HttpCode, HttpStatus } from '@nestjs/common';
import { ImportStatementsFromCsvUseCase } from '@application/statement-import/use-cases/import-statements-from-csv.use-case';
import { StreamCsvRowsUseCase } from '@application/statement-import/use-cases/stream-csv-rows.use-case';
import type { ImportRequestDto } from '@application/statement-import/dto/import-request.dto';
import type { ImportResultDto } from '@application/statement-import/dto/import-result.dto';
import type { StreamCsvRequestDto } from '@application/statement-import/dto/stream-csv-request.dto';
import type { StreamCsvResultDto } from '@application/statement-import/dto/stream-csv-result.dto';

@Controller('import')
export class ImportController {
    constructor(
        private readonly importStatementsFromCsvUseCase: ImportStatementsFromCsvUseCase,
        private readonly streamCsvRowsUseCase: StreamCsvRowsUseCase,
    ) {}

    @Post('csv')
    @HttpCode(HttpStatus.OK)
    async importFromCsv(@Body() importRequestDto: ImportRequestDto): Promise<ImportResultDto> {
        return this.importStatementsFromCsvUseCase.execute(importRequestDto);
    }

    @Post('csv/stream')
    @HttpCode(HttpStatus.OK)
    async streamCsv(@Body() body: StreamCsvRequestDto): Promise<StreamCsvResultDto> {
        return this.streamCsvRowsUseCase.execute(body);
    }
}
