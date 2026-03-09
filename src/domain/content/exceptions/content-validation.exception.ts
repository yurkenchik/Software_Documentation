import { DomainException } from '@core/exceptions/domain.exception';
import { ExceptionCodes } from '@core/exceptions/exception-codes';

export class ContentValidationException extends DomainException {
    readonly code = ExceptionCodes.Domain.CONTENT.VALIDATION_FAILED;

    constructor(message: string, context?: Record<string, unknown>) {
        super(message, context);
    }
}

