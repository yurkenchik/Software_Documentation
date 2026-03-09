import { DomainException } from '@core/exceptions/domain.exception';
import { ExceptionCodes } from '@core/exceptions/exception-codes';

export class PostConflictException extends DomainException {
    readonly code = ExceptionCodes.Domain.POST.CONFLICT;

    constructor(siteId: string, title: string) {
        super(`Post with title "${title}" already exists for site "${siteId}".`, {
            siteId,
            title,
        });
    }
}

