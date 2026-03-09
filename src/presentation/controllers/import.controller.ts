import { Body, Controller, Post, HttpCode, HttpStatus } from '@nestjs/common';
import { ImportStatementsFromCsvUseCase } from '@application/statement-import/use-cases/import-statements-from-csv.use-case';
import type { ImportRequestDto } from '@application/statement-import/dto/import-request.dto';
import type { ImportResultDto } from '@application/statement-import/dto/import-result.dto';

@Controller('import')
export class ImportController {
    constructor(
        private readonly importStatementsFromCsvUseCase: ImportStatementsFromCsvUseCase,
    ) {}

    @Post('csv')
    @HttpCode(HttpStatus.OK)
    async importFromCsv(@Body() importRequestDto: ImportRequestDto): Promise<ImportResultDto> {
        return this.importStatementsFromCsvUseCase.execute(importRequestDto);
    }
}
