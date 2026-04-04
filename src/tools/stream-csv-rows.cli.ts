import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { StreamCsvRowsUseCase } from '../application/statement-import/use-cases/stream-csv-rows.use-case';
import { join } from 'node:path';

async function run(): Promise<void> {
    const filePath = process.argv[2] ?? join(process.cwd(), 'data', 'import.csv');
    const app = await NestFactory.createApplicationContext(AppModule, {
        logger: ['error', 'warn'],
    });

    try {
        const streamCsvRowsUseCase = app.get(StreamCsvRowsUseCase);
        const result = await streamCsvRowsUseCase.execute(filePath);
        process.stdout.write(
            `Streamed ${result.writtenRows}/${result.totalRows} rows (skipped ${result.skippedRows}) in ${result.durationMs}ms.\n`,
        );

        if (result.errors.length > 0) {
            process.stderr.write(`Errors: ${result.errors.length}\n`);
            for (const e of result.errors.slice(0, 5)) {
                process.stderr.write(`  Row ${e.rowIndex}: ${e.message}\n`);
            }

            if (result.errors.length > 5) {
                process.stderr.write(`  ... and ${result.errors.length - 5} more\n`);
            }
        }
    } finally {
        await app.close();
    }
}

run().catch((err) => {
    console.error(err);
    process.exitCode = 1;
});
