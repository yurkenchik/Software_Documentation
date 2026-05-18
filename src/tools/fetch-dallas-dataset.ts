/**
 * Fetches CoD Expenses Budget vs Actual dataset (variant 10) from Dallas Open Data
 * and writes it as CSV to data/dallas-expenses.csv.
 *
 * Usage: yarn fetch:dataset [--limit=<n>]
 * Default limit: 10000 rows (set DATASET_LIMIT env var or --limit flag to override)
 */

import { createWriteStream } from 'node:fs';
import { mkdir } from 'node:fs/promises';
import { join } from 'node:path';
import { get as httpsGet } from 'node:https';
import { IncomingMessage } from 'node:http';

const DATASET_ID = 'nr4f-efb3';
const BASE_URL = 'data.dallasopendata.com';
const OUTPUT_DIR = join(process.cwd(), 'data');
const OUTPUT_FILE = join(OUTPUT_DIR, 'dallas-expenses.csv');

function parseLimit(): number {
    const flagArg = process.argv.find((a) => a.startsWith('--limit='));
    if (flagArg) {
        return parseInt(flagArg.split('=')[1], 10);
    }
    const envLimit = process.env.DATASET_LIMIT;
    if (envLimit) {
        return parseInt(envLimit, 10);
    }
    return 10_000;
}

function fetchCsv(limit: number): Promise<IncomingMessage> {
    const path = `/resource/${DATASET_ID}.csv?$limit=${limit}`;
    return new Promise((resolve, reject) => {
        const req = httpsGet({ hostname: BASE_URL, path, headers: { Accept: 'text/csv' } }, (res) => {
            if (res.statusCode !== 200) {
                reject(new Error(`HTTP ${res.statusCode ?? 'unknown'} from ${BASE_URL}${path}`));
                return;
            }
            resolve(res);
        });
        req.on('error', reject);
    });
}

async function run(): Promise<void> {
    const limit = parseLimit();
    process.stdout.write(`Fetching up to ${limit} rows from Dallas Open Data (${DATASET_ID})...\n`);

    await mkdir(OUTPUT_DIR, { recursive: true });

    const response = await fetchCsv(limit);
    const out = createWriteStream(OUTPUT_FILE);

    await new Promise<void>((resolve, reject) => {
        response.pipe(out);
        out.on('finish', resolve);
        out.on('error', reject);
        response.on('error', reject);
    });

    process.stdout.write(`Dataset saved to ${OUTPUT_FILE}\n`);
}

run().catch((err: unknown) => {
    process.stderr.write(`Error: ${err instanceof Error ? err.message : String(err)}\n`);
    process.exitCode = 1;
});
