import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { IRowOutputStrategy } from '@domain/statement-import/ports/row-output-strategy.port';
import { RedisClientFactory } from '@infrastructure/persistence/redis/factories/redis-client.factory';

@Injectable()
export class RedisRowOutputStrategy implements IRowOutputStrategy, OnModuleDestroy {
    private readonly listKey: string;

    constructor(
        private readonly configService: ConfigService,
        private readonly redisClientFactory: RedisClientFactory,
    ) {
        this.listKey = this.configService.get<string>('REDIS_LIST_KEY') ?? 'csv-rows';
    }

    async write(row: Array<string>): Promise<void> {
        const client = this.redisClientFactory.getClient();
        await client.rpush(this.listKey, JSON.stringify(row));
    }

    async flush(): Promise<void> {}

    async onModuleDestroy(): Promise<void> {}
}
