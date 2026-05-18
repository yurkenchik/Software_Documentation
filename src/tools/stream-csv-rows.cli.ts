import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { StreamCsvRowsUseCase } from '../application/statement-import/use-cases/stream-csv-rows.use-case';
import { join } from 'node:path';
import { existsSync, mkdirSync, createWriteStream } from 'node:fs';
import { get as httpsGet } from 'node:https';

const DATASET_URL = 'https://www.dallasopendata.com/resource/nr4f-efb3.csv?$limit=10000';
const DEFAULT_DATA_FILE = join(process.cwd(), 'data', 'dallas-expenses.csv');
const STATIC_ATTACHMENT = join(
    process.cwd(),
    'documents', 'diagrams', 'static-attachments',
    'City_of_Dallas_(COD)_Expenses_Budget_vs_Actual_20260518.csv',
);

function copyStaticAttachment(destPath: string): boolean {
    if (!existsSync(STATIC_ATTACHMENT)) return false;
    mkdirSync(join(process.cwd(), 'data'), { recursive: true });
    const { copyFileSync } = require('node:fs') as typeof import('node:fs');
    copyFileSync(STATIC_ATTACHMENT, destPath);
    process.stdout.write(`Dataset copied from static attachment to ${destPath}\n`);
    return true;
}

async function fetchToFile(destPath: string): Promise<void> {
    mkdirSync(join(process.cwd(), 'data'), { recursive: true });
    process.stdout.write(`Fetching dataset from Dallas Open Data...\n`);
    return new Promise((resolve, reject) => {
        httpsGet(DATASET_URL, (res) => {
            if (res.statusCode !== 200) {
                reject(new Error(`HTTP ${res.statusCode} when fetching dataset`));
                return;
            }
            const out = createWriteStream(destPath);
            res.pipe(out);
            out.on('finish', () => {
                process.stdout.write(`Dataset saved to ${destPath}\n`);
                resolve();
            });
            out.on('error', reject);
            res.on('error', reject);
        }).on('error', reject);
    });
}

async function ensureDataFile(filePath: string): Promise<void> {
    if (existsSync(filePath)) return;
    if (copyStaticAttachment(filePath)) return;
    await fetchToFile(filePath);
}

async function run(): Promise<void> {
    const filePath = process.argv[2] ?? DEFAULT_DATA_FILE;
    await ensureDataFile(filePath);
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
