import { mkdir, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

const OUTPUT_DIR = join(process.cwd(), 'data');
const OUTPUT_FILE = join(OUTPUT_DIR, 'import.csv');

function iso(offsetDays: number): string {
    const date = new Date('2025-01-01T00:00:00.000Z');
    date.setDate(date.getDate() + offsetDays);
    return date.toISOString();
}

async function generate(): Promise<void> {
    await mkdir(OUTPUT_DIR, { recursive: true });

    const lines: Array<string> = [];

    const siteCount = 20;
    const postsPerSite = 20;
    const commentsPerPost = 2;
    const mediaPerSite = 2;

    for (let i = 1; i <= siteCount; i++) {
        const siteId = `site-${i}`;
        const createdAt = iso(i);
        const updatedAt = iso(i + 1);
        lines.push(
            [
                'site',
                siteId,
                `Site ${i}`,
                `site-${i}`,
                createdAt,
                updatedAt,
            ].join(','),
        );

        for (let p = 1; p <= postsPerSite; p++) {
            const postId = `post-${i}-${p}`;
            const created = iso(i + p);
            const updated = iso(i + p + 1);
            lines.push(
                [
                    'post',
                    postId,
                    siteId,
                    `Post ${p} of site ${i}`,
                    `Body of post ${p} for site ${i}`,
                    created,
                    updated,
                    'draft',
                ].join(','),
            );

            for (let c = 1; c <= commentsPerPost; c++) {
                const commentId = `comment-${i}-${p}-${c}`;
                const createdComment = iso(i + p + c);
                const updatedComment = iso(i + p + c + 1);
                lines.push(
                    [
                        'comment',
                        commentId,
                        postId,
                        `Author ${c}`,
                        `Comment ${c} on post ${p} of site ${i}`,
                        createdComment,
                        updatedComment,
                        'pending',
                    ].join(','),
                );
            }
        }

        for (let m = 1; m <= mediaPerSite; m++) {
            const mediaId = `media-${i}-${m}`;
            const createdMedia = iso(i + m);
            const updatedMedia = iso(i + m + 1);
            lines.push(
                [
                    'media',
                    mediaId,
                    siteId,
                    `https://example.com/site-${i}/image-${m}.png`,
                    'image/png',
                    createdMedia,
                    updatedMedia,
                    'active',
                ].join(','),
            );
        }
    }

    await writeFile(OUTPUT_FILE, lines.join('\n'), 'utf-8');
     
    console.log(`CSV generated at ${OUTPUT_FILE} with ${lines.length} rows`);
}

generate().catch((error) => {
     
    console.error('Failed to generate CSV', error);
    process.exitCode = 1;
});

