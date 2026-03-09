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
        process.stdout.write(`Streamed ${result.totalRows} rows to configured output.\n`);
    } finally {
        await app.close();
    }
}

run().catch((err) => {
    console.error(err);
    process.exitCode = 1;
});
