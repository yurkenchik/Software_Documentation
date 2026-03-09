import { Injectable, Logger } from '@nestjs/common';
import type { IRowOutputStrategy } from '@domain/statement-import/ports/row-output-strategy.port';

@Injectable()
export class ConsoleRowOutputStrategy implements IRowOutputStrategy {
    private readonly logger: Logger;

    constructor() {
        this.logger = new Logger(ConsoleRowOutputStrategy.name);
    }

    async write(row: Array<string>): Promise<void> {
        this.logger.log(row.join(','));
        return Promise.resolve();
    }
}
