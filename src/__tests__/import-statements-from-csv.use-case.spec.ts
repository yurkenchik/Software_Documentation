import { ImportStatementsFromCsvUseCase } from '../application/statement-import/use-cases/import-statements-from-csv.use-case';
import type { IFileStoragePort } from '../domain/statement-import/ports/file-storage.port';
import type { IRowHandler } from '../domain/statement-import/types';

describe('ImportStatementsFromCsvUseCase', () => {
    function createHandler(rowType: string): { mock: IRowHandler; handleSpy: jest.Mock } {
        const handleSpy = jest.fn<Promise<void>, Array<Array<string>>>();
        const mock: IRowHandler = {
            supports: (type: string) => type === rowType,
            handle: async (row: Array<string>) => handleSpy(row),
        };
        return { mock, handleSpy };
    }

    function createUseCaseWithHandlers(handlers: Array<IRowHandler>, rows: Array<Array<string>>) {
        const fileStorage: IFileStoragePort = {
            readCsvRows: jest.fn().mockResolvedValue(rows),
        };

        const [site, post, comment, media] = handlers as unknown as [
            IRowHandler,
            IRowHandler,
            IRowHandler,
            IRowHandler,
        ];

        const useCase = new ImportStatementsFromCsvUseCase(
            fileStorage,
            site as any,
            post as any,
            comment as any,
            media as any,
        );

        return { useCase, fileStorage };
    }

    it('imports all supported rows and calls corresponding handlers', async () => {
        const { mock: siteHandler, handleSpy: siteHandle } = createHandler('site');
        const { mock: postHandler, handleSpy: postHandle } = createHandler('post');
        const { mock: commentHandler, handleSpy: commentHandle } = createHandler('comment');
        const { mock: mediaHandler, handleSpy: mediaHandle } = createHandler('media');

        const rows: Array<Array<string>> = [
            ['site', 'site-1', 'My Site', 'my-site', '2025-01-01T00:00:00.000Z', '2025-01-01T00:00:00.000Z'],
            ['post', 'post-1', 'site-1', 'Title', 'Body', '2025-01-02T00:00:00.000Z', '2025-01-02T00:00:00.000Z', 'draft'],
            ['comment', 'comment-1', 'post-1', 'Author', 'Nice post', '2025-01-03T00:00:00.000Z', '2025-01-03T00:00:00.000Z', 'pending'],
            ['media', 'media-1', 'site-1', 'https://example.com/image.png', 'image/png', '2025-01-04T00:00:00.000Z', '2025-01-04T00:00:00.000Z', 'active'],
        ];

        const { useCase, fileStorage } = createUseCaseWithHandlers(
            [siteHandler, postHandler, commentHandler, mediaHandler],
            rows,
        );

        const result = await useCase.execute({ filePath: 'dummy.csv' });

        expect(fileStorage.readCsvRows).toHaveBeenCalledWith('dummy.csv');
        expect(siteHandle).toHaveBeenCalledTimes(1);
        expect(postHandle).toHaveBeenCalledTimes(1);
        expect(commentHandle).toHaveBeenCalledTimes(1);
        expect(mediaHandle).toHaveBeenCalledTimes(1);

        expect(result.totalRows).toBe(rows.length);
        expect(result.importedRows).toBe(rows.length);
        expect(result.errors).toHaveLength(0);
        expect(result.importRun.id).toBeDefined();
        expect(result.importRun.filePath).toBe('dummy.csv');
    });

    it('collects errors for empty and unsupported row types', async () => {
        const { mock: siteHandler } = createHandler('site');
        const { mock: postHandler } = createHandler('post');
        const { mock: commentHandler } = createHandler('comment');
        const { mock: mediaHandler } = createHandler('media');

        const rows: Array<Array<string>> = [
            ['', 'bad-row'],
            ['unknown', 'value'],
            ['site', 'site-1', 'Name', 'slug', '2025-01-01T00:00:00.000Z', '2025-01-01T00:00:00.000Z'],
        ];

        const { useCase } = createUseCaseWithHandlers(
            [siteHandler, postHandler, commentHandler, mediaHandler],
            rows,
        );

        const result = await useCase.execute({ filePath: 'dummy.csv' });

        expect(result.totalRows).toBe(rows.length);
        expect(result.importedRows).toBe(1);
        expect(result.errors).toHaveLength(2);
        expect(result.errors[0].row).toBe(1);
        expect(result.errors[1].row).toBe(2);
    });
});

