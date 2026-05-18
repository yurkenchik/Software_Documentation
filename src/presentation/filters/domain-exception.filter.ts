import {
    ExceptionFilter,
    Catch,
    ArgumentsHost,
    HttpStatus,
} from '@nestjs/common';
import type { Request, Response } from 'express';
import { DomainException } from '@core/exceptions/domain.exception';
import { ExceptionCodes } from '@core/exceptions/exception-codes';

function getHttpStatusForCode(code: string): number {
    if (code === ExceptionCodes.Domain.STATEMENT_IMPORT.FILE_NOT_FOUND) {
        return HttpStatus.NOT_FOUND;
    }

    if (
        code === ExceptionCodes.Infrastructure.FILE.READ_FAILED ||
        code === ExceptionCodes.Infrastructure.MONGODB.OPERATION_FAILED
    ) {
        return HttpStatus.INTERNAL_SERVER_ERROR;
    }

    if (code === ExceptionCodes.Domain.SITE.NOT_FOUND) {
        return HttpStatus.NOT_FOUND;
    }

    if (code === ExceptionCodes.Domain.SITE.CONFLICT) {
        return HttpStatus.CONFLICT;
    }

    if (code === ExceptionCodes.Domain.SITE.VALIDATION_FAILED) {
        return HttpStatus.BAD_REQUEST;
    }

    if (code === ExceptionCodes.Domain.POST.NOT_FOUND) {
        return HttpStatus.NOT_FOUND;
    }

    if (code === ExceptionCodes.Domain.POST.CONFLICT) {
        return HttpStatus.CONFLICT;
    }

    if (code === ExceptionCodes.Domain.CONTENT.VALIDATION_FAILED) {
        return HttpStatus.BAD_REQUEST;
    }

    return HttpStatus.BAD_REQUEST;
}

@Catch(DomainException)
export class DomainExceptionFilter implements ExceptionFilter {
    catch(exception: DomainException, host: ArgumentsHost) {
        const context = host.switchToHttp();
        const response = context.getResponse<Response>();
        const request = context.getRequest<Request>();
        const status = getHttpStatusForCode(exception.code);

        response.status(status).json({
            statusCode: status,
            code: exception.code,
            message: exception.message,
            ...(exception.context &&
                Object.keys(exception.context).length > 0 && { context: exception.context }),
            timestamp: new Date().toISOString(),
            path: request.url,
        });
    }
}
