/**
 * Central constants for exception codes. Use in domain and presentation.
 */
export const ExceptionCodes = {
    Domain: {
        STATEMENT_IMPORT: {
            FILE_NOT_FOUND: 'Domain.STATEMENT_IMPORT.FILE_NOT_FOUND',
            INVALID_ROW: 'Domain.STATEMENT_IMPORT.INVALID_ROW',
            UNSUPPORTED_ROW_TYPE: 'Domain.STATEMENT_IMPORT.UNSUPPORTED_ROW_TYPE',
        },
        SITE: {
            NOT_FOUND: 'Domain.SITE.NOT_FOUND',
        },
        POST: {
            NOT_FOUND: 'Domain.POST.NOT_FOUND',
            CONFLICT: 'Domain.POST.CONFLICT',
        },
        CONTENT: {
            VALIDATION_FAILED: 'Domain.CONTENT.VALIDATION_FAILED',
        },
    },
    Infrastructure: {
        MONGODB: {
            OPERATION_FAILED: 'Infrastructure.MONGODB.OPERATION_FAILED',
        },
        FILE: {
            READ_FAILED: 'Infrastructure.FILE.READ_FAILED',
        },
    },
} as const;
