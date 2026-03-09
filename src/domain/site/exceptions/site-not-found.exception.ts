import { DomainException } from '@core/exceptions/domain.exception';
import { ExceptionCodes } from '@core/exceptions/exception-codes';

export class SiteNotFoundException extends DomainException {
    readonly code = ExceptionCodes.Domain.SITE.NOT_FOUND;

    constructor(siteId: string) {
        super(`Site with id "${siteId}" was not found.`, { siteId });
    }
}

